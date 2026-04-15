import { fetchTripData } from '../utils/data.js'
import { loadChecklistState, saveChecklistState, clearChecklistState } from '../utils/storage.js'
import { loadCustomItems, addCustomItem, toggleCustomItem, deleteCustomItem, clearCustomItems } from '../utils/storage.js'
import { getChecklistIdeas, updateIdea } from '../utils/ideas.js'

export async function renderChecklist() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  const { categories } = data.checklist
  const state = loadChecklistState()

  content.innerHTML = `
    <div class="page-header">
      <h1>✅ Checklist di Viaggio</h1>
      <p>Spunta gli elementi man mano che prepari il bagaglio. Aggiungi anche voci personalizzate.</p>
    </div>

    <div class="checklist-controls">
      <div class="checklist-progress-global">
        <div class="global-progress-bar">
          <div class="global-progress-fill" id="global-fill" style="width:0%"></div>
        </div>
        <span class="global-progress-text" id="global-text">0 / 0</span>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-outline" id="check-all">✅ Seleziona tutto</button>
        <button class="btn btn-outline" id="uncheck-all">⬜ Deseleziona tutto</button>
        <button class="btn btn-outline" id="reset-btn">🔄 Reset</button>
      </div>
    </div>

    <!-- Categorie statiche da trip.json -->
    <div class="checklist-categories" id="checklist-categories">
      ${categories.map(cat => renderCategory(cat, state)).join('')}
    </div>

    <!-- Idee collegate alla checklist -->
    <div id="checklist-ideas-section">
      ${_renderIdeasSection()}
    </div>

    <!-- Sezione voci personalizzate (CRUD) -->
    <div id="custom-items-section">
      ${_renderCustomSection()}
    </div>
  `

  updateGlobalProgress(categories, state)
  bindEvents(categories, state)
  _bindIdeasSectionEvents()
  _bindCustomSectionEvents()

  // Sync live: aggiorna sezione idee e custom quando cambiano
  const ideasHandler = () => {
    const section = document.getElementById('checklist-ideas-section')
    if (section) { section.innerHTML = _renderIdeasSection(); _bindIdeasSectionEvents() }
  }
  const customHandler = () => {
    const section = document.getElementById('custom-items-section')
    if (section) { section.innerHTML = _renderCustomSection(); _bindCustomSectionEvents() }
  }
  window.addEventListener('ideas:updated', ideasHandler)
  window.addEventListener('customitems:updated', customHandler)
  window.__currentPageCleanup = () => {
    window.removeEventListener('ideas:updated', ideasHandler)
    window.removeEventListener('customitems:updated', customHandler)
  }
}

/* ── IDEAS SECTION ────────────────────────────────────── */

function _renderIdeasSection() {
  const ideas = getChecklistIdeas()
  if (ideas.length === 0) return ''

  const checked = ideas.filter(i => i.completed).length
  const total   = ideas.length
  const pct     = total ? (checked / total * 100) : 0

  return `
    <div class="category-card" id="ideas-checklist-card">
      <div class="category-header">
        <span class="category-icon">💡</span>
        <span class="category-name">Idee / Da fare</span>
        <span class="category-count" id="ideas-cl-count">${checked}/${total}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="ideas-cl-prog" style="width:${pct}%"></div>
        </div>
        <span class="category-chevron" id="ideas-cl-chev">▼</span>
      </div>
      <div class="category-items" id="ideas-cl-items">
        ${ideas.map(idea => `
          <label class="checklist-item ${idea.completed ? 'checked' : ''}" data-idea-id="${idea.id}">
            <input type="checkbox" data-idea-id="${idea.id}" ${idea.completed ? 'checked' : ''} />
            <span class="checklist-item-text">${_esc(idea.text)}</span>
            ${idea.location_name
              ? `<span class="priority-badge" style="background:#eff6ff;color:var(--color-primary)">📍 ${_esc(idea.location_name)}</span>`
              : ''}
          </label>
        `).join('')}
        <div style="padding:0.5rem 1.25rem;">
          <a href="#ideas" class="btn btn-outline" style="font-size:0.78rem;padding:0.3rem 0.75rem;">
            + Aggiungi idea dalla sezione Idee
          </a>
        </div>
      </div>
    </div>
  `
}

function _bindIdeasSectionEvents() {
  document.querySelector('#ideas-checklist-card .category-header')?.addEventListener('click', e => {
    if (e.target.tagName === 'INPUT') return
    document.getElementById('ideas-cl-items')?.classList.toggle('hidden')
    document.getElementById('ideas-cl-chev')?.classList.toggle('open')
  })

  document.getElementById('ideas-cl-items')?.addEventListener('change', e => {
    const cb = e.target
    if (cb.type !== 'checkbox') return
    const id = cb.dataset.ideaId
    if (!id) return
    updateIdea(id, { completed: cb.checked })
  })
}

/* ── CUSTOM ITEMS SECTION (CRUD) ──────────────────────── */

function _renderCustomSection() {
  const items = loadCustomItems()
  const done  = items.filter(i => i.checked).length

  return `
    <div class="category-card custom-items-card" id="custom-items-card">
      <div class="category-header" id="custom-items-header">
        <span class="category-icon">✏️</span>
        <span class="category-name">Voci Personalizzate</span>
        <span class="category-count">${done}/${items.length}</span>
        <div class="category-progress">
          <div class="category-progress-fill"
            style="width:${items.length ? (done/items.length*100) : 0}%"></div>
        </div>
        <span class="category-chevron" id="custom-chev">▼</span>
      </div>

      <div class="category-items" id="custom-items-list">
        ${items.length === 0
          ? `<div class="custom-items-empty">Nessuna voce personalizzata. Aggiungine una qui sotto.</div>`
          : items.map(item => `
              <div class="checklist-item custom-item" data-cid="${item.id}">
                <input type="checkbox" class="custom-item-cb" data-cid="${item.id}" ${item.checked ? 'checked' : ''} />
                <span class="checklist-item-text ${item.checked ? 'line-through' : ''}">${_esc(item.text)}</span>
                ${item.category !== 'Varie'
                  ? `<span class="priority-badge" style="background:#f1f5f9;color:#64748b;">${_esc(item.category)}</span>`
                  : ''}
                <button class="custom-item-del" data-cid="${item.id}" title="Elimina">×</button>
              </div>
            `).join('')}

        <!-- Form aggiunta voce -->
        <div class="custom-add-form" id="custom-add-form">
          <input type="text" id="custom-item-text" class="custom-add-input"
            placeholder="Aggiungi voce…" autocomplete="off" />
          <select id="custom-item-cat" class="custom-add-select">
            <option value="Varie">Varie</option>
            <option value="Documenti">Documenti</option>
            <option value="Bambini">Bambini</option>
            <option value="Mare">Mare</option>
            <option value="Abbigliamento">Abbigliamento</option>
            <option value="Farmaci">Farmaci</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Da prenotare">Da prenotare</option>
          </select>
          <button class="btn btn-primary custom-add-btn" id="custom-add-btn">+ Aggiungi</button>
        </div>

        ${items.length > 0 ? `
          <div style="padding:0.5rem 1.25rem;">
            <button class="btn btn-outline" id="clear-custom-btn"
              style="font-size:0.78rem;padding:0.3rem 0.75rem;color:var(--color-accent);">
              🗑️ Elimina tutte le voci personalizzate
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function _bindCustomSectionEvents() {
  const header = document.getElementById('custom-items-header')
  header?.addEventListener('click', e => {
    if (e.target.closest('.custom-add-form') || e.target.closest('button')) return
    document.getElementById('custom-items-list')?.classList.toggle('hidden')
    document.getElementById('custom-chev')?.classList.toggle('open')
  })

  // Checkbox toggle
  document.getElementById('custom-items-list')?.addEventListener('change', e => {
    const cb = e.target
    if (!cb.classList.contains('custom-item-cb')) return
    toggleCustomItem(cb.dataset.cid, cb.checked)
    // customitems:updated riaggiorna il pannello
  })

  // Delete single item
  document.getElementById('custom-items-list')?.addEventListener('click', e => {
    const del = e.target.closest('.custom-item-del')
    if (del) {
      deleteCustomItem(del.dataset.cid)
      return
    }
    const addBtn = e.target.closest('#custom-add-btn')
    if (addBtn) _addCustomItem()

    const clearBtn = e.target.closest('#clear-custom-btn')
    if (clearBtn) {
      if (confirm('Eliminare tutte le voci personalizzate?')) clearCustomItems()
    }
  })

  // Enter to add
  document.getElementById('custom-item-text')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); _addCustomItem() }
  })
}

function _addCustomItem() {
  const input = document.getElementById('custom-item-text')
  const cat   = document.getElementById('custom-item-cat')?.value ?? 'Varie'
  const text  = input?.value.trim()
  if (!text) { input?.focus(); return }
  addCustomItem(text, cat)
  if (input) input.value = ''
}

/* ── CATEGORIE STATICHE ───────────────────────────────── */

function renderCategory(cat, state) {
  const total   = cat.items.length
  const checked = cat.items.filter(i => state[i.id]).length

  return `
    <div class="category-card" data-cat="${cat.id}">
      <div class="category-header">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
        <span class="category-count" id="count-${cat.id}">${checked}/${total}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${cat.id}"
            style="width:${total ? (checked / total * 100) : 0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${cat.id}">▼</span>
      </div>
      <div class="category-items" id="items-${cat.id}">
        ${cat.items.map(item => renderItem(item, state[item.id] || false)).join('')}
      </div>
    </div>
  `
}

function renderItem(item, checked) {
  return `
    <label class="checklist-item ${checked ? 'checked' : ''}" data-id="${item.id}">
      <input type="checkbox" ${checked ? 'checked' : ''} data-id="${item.id}" />
      <span class="checklist-item-text">${item.text}</span>
      ${item.priority !== 'low' ? `<span class="priority-badge priority-${item.priority}">${item.priority === 'high' ? 'Alta' : 'Media'}</span>` : ''}
    </label>
  `
}

function bindEvents(categories, state) {
  document.getElementById('checklist-categories')?.addEventListener('change', e => {
    const cb = e.target
    if (cb.type !== 'checkbox') return
    const id = cb.dataset.id
    state[id] = cb.checked
    cb.closest('.checklist-item')?.classList.toggle('checked', cb.checked)
    saveChecklistState(state)
    updateCategoryProgress(categories, state, id)
    updateGlobalProgress(categories, state)
  })

  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return
      const catId = header.closest('.category-card')?.dataset.cat
      if (!catId) return
      document.getElementById(`items-${catId}`)?.classList.toggle('hidden')
      document.getElementById(`chev-${catId}`)?.classList.toggle('open')
    })
  })

  document.getElementById('check-all')?.addEventListener('click', () => {
    categories.forEach(cat => cat.items.forEach(item => { state[item.id] = true }))
    saveChecklistState(state)
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })

  document.getElementById('uncheck-all')?.addEventListener('click', () => {
    categories.forEach(cat => cat.items.forEach(item => { state[item.id] = false }))
    saveChecklistState(state)
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (!confirm('Vuoi resettare l\'intera checklist?')) return
    clearChecklistState()
    categories.forEach(cat => cat.items.forEach(item => { state[item.id] = false }))
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })
}

function updateCategoryProgress(categories, state, changedItemId) {
  const cat = categories.find(c => c.items.some(i => i.id === changedItemId))
  if (!cat) return
  const total   = cat.items.length
  const checked = cat.items.filter(i => state[i.id]).length
  const pct     = total ? (checked / total * 100) : 0
  const countEl = document.getElementById(`count-${cat.id}`)
  const progEl  = document.getElementById(`prog-${cat.id}`)
  if (countEl) countEl.textContent = `${checked}/${total}`
  if (progEl)  progEl.style.width  = `${pct}%`
}

function updateGlobalProgress(categories, state) {
  const total   = categories.reduce((s, c) => s + c.items.length, 0)
  const checked = categories.reduce((s, c) => s + c.items.filter(i => state[i.id]).length, 0)
  const pct     = total ? (checked / total * 100) : 0
  const fill = document.getElementById('global-fill')
  const text = document.getElementById('global-text')
  if (fill) fill.style.width  = `${pct}%`
  if (text) text.textContent  = `${checked} / ${total}`
}

function rerenderAllItems(categories, state) {
  categories.forEach(cat => {
    const total   = cat.items.length
    const checked = cat.items.filter(i => state[i.id]).length
    const pct     = total ? (checked / total * 100) : 0
    const countEl = document.getElementById(`count-${cat.id}`)
    const progEl  = document.getElementById(`prog-${cat.id}`)
    if (countEl) countEl.textContent = `${checked}/${total}`
    if (progEl)  progEl.style.width  = `${pct}%`
    cat.items.forEach(item => {
      const label = document.querySelector(`.checklist-item[data-id="${item.id}"]`)
      const cb    = label?.querySelector('input[type="checkbox"]')
      if (!label || !cb) return
      cb.checked = state[item.id] || false
      label.classList.toggle('checked', cb.checked)
    })
  })
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
