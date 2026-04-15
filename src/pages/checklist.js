import { fetchTripData } from '../utils/data.js'
import { loadChecklistState, saveChecklistState, clearChecklistState } from '../utils/storage.js'

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
      <p>Spunta gli elementi man mano che prepari il bagaglio. I progressi vengono salvati automaticamente.</p>
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

    <div class="checklist-categories" id="checklist-categories">
      ${categories.map(cat => renderCategory(cat, state)).join('')}
    </div>
  `

  updateGlobalProgress(categories, state)
  bindEvents(categories, state)
}

function renderCategory(cat, state) {
  const total = cat.items.length
  const checked = cat.items.filter(i => state[i.id]).length

  return `
    <div class="category-card" data-cat="${cat.id}">
      <div class="category-header">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
        <span class="category-count" id="count-${cat.id}">${checked}/${total}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${cat.id}" style="width:${total ? (checked / total * 100) : 0}%"></div>
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
  // Toggle singola checkbox
  document.getElementById('checklist-categories')?.addEventListener('change', e => {
    const cb = e.target
    if (cb.type !== 'checkbox') return
    const id = cb.dataset.id
    state[id] = cb.checked

    const label = cb.closest('.checklist-item')
    label?.classList.toggle('checked', cb.checked)

    saveChecklistState(state)
    updateCategoryProgress(categories, state, id)
    updateGlobalProgress(categories, state)
  })

  // Click sul header categoria → toggle visibilità
  document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return
      const catId = header.closest('.category-card')?.dataset.cat
      const items = document.getElementById(`items-${catId}`)
      const chev = document.getElementById(`chev-${catId}`)
      items?.classList.toggle('hidden')
      chev?.classList.toggle('open')
    })
  })

  // Seleziona tutto
  document.getElementById('check-all')?.addEventListener('click', () => {
    categories.forEach(cat => {
      cat.items.forEach(item => { state[item.id] = true })
    })
    saveChecklistState(state)
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })

  // Deseleziona tutto
  document.getElementById('uncheck-all')?.addEventListener('click', () => {
    categories.forEach(cat => {
      cat.items.forEach(item => { state[item.id] = false })
    })
    saveChecklistState(state)
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })

  // Reset
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (!confirm('Vuoi resettare l\'intera checklist?')) return
    clearChecklistState()
    categories.forEach(cat => {
      cat.items.forEach(item => { state[item.id] = false })
    })
    rerenderAllItems(categories, state)
    updateGlobalProgress(categories, state)
  })
}

function getCategoryForItem(categories, itemId) {
  return categories.find(cat => cat.items.some(i => i.id === itemId))
}

function updateCategoryProgress(categories, state, changedItemId) {
  const cat = getCategoryForItem(categories, changedItemId)
  if (!cat) return

  const total = cat.items.length
  const checked = cat.items.filter(i => state[i.id]).length
  const pct = total ? (checked / total * 100) : 0

  const countEl = document.getElementById(`count-${cat.id}`)
  const progEl = document.getElementById(`prog-${cat.id}`)
  if (countEl) countEl.textContent = `${checked}/${total}`
  if (progEl) progEl.style.width = `${pct}%`
}

function updateGlobalProgress(categories, state) {
  const total = categories.reduce((s, c) => s + c.items.length, 0)
  const checked = categories.reduce((s, c) => s + c.items.filter(i => state[i.id]).length, 0)
  const pct = total ? (checked / total * 100) : 0

  const fill = document.getElementById('global-fill')
  const text = document.getElementById('global-text')
  if (fill) fill.style.width = `${pct}%`
  if (text) text.textContent = `${checked} / ${total}`
}

function rerenderAllItems(categories, state) {
  categories.forEach(cat => {
    const total = cat.items.length
    const checked = cat.items.filter(i => state[i.id]).length
    const pct = total ? (checked / total * 100) : 0

    // Aggiorna contatore e barra categoria
    const countEl = document.getElementById(`count-${cat.id}`)
    const progEl = document.getElementById(`prog-${cat.id}`)
    if (countEl) countEl.textContent = `${checked}/${total}`
    if (progEl) progEl.style.width = `${pct}%`

    // Aggiorna checkbox e label
    cat.items.forEach(item => {
      const label = document.querySelector(`.checklist-item[data-id="${item.id}"]`)
      const cb = label?.querySelector('input[type="checkbox"]')
      if (!label || !cb) return
      const isChecked = state[item.id] || false
      cb.checked = isChecked
      label.classList.toggle('checked', isChecked)
    })
  })
}
