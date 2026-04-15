import { fetchTripData } from '../utils/data.js'
import { formatDate, formatDateIT } from '../utils/data.js'
import {
  loadIdeas, addIdea, updateIdea, deleteIdea,
  exportIdeasJSON, importIdeasJSON,
  CATEGORIE, STATI, PRIORITA, COLORS,
} from '../utils/ideas.js'

let _editingId     = null
let _currentFilter = 'tutte'
let _tripDays      = []
let _showAdvanced  = false

/* ── INIT ─────────────────────────────────────────────── */

export async function renderIdeas() {
  const content = document.getElementById('page-content')

  let tripData
  try {
    tripData = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  _tripDays  = tripData.days
  _editingId = null
  _currentFilter = 'tutte'

  content.innerHTML = `
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Cattura idee al volo — si sincronizzano con Checklist, Mappa e Itinerario.</p>
    </div>

    <!-- FORM RAPIDO -->
    <div class="ideas-form-wrap" id="ideas-form-wrap">
      ${_buildFormHTML(null)}
    </div>

    <!-- TOOLBAR: filtri + export/import -->
    <div class="ideas-toolbar" id="ideas-toolbar">
      <div class="ideas-filters-row" id="ideas-filters-row">
        ${_buildFiltersHTML()}
      </div>
      <div class="ideas-io-btns">
        <button class="btn btn-outline ideas-io-btn" id="export-btn" title="Esporta JSON">⬆️ Esporta</button>
        <label class="btn btn-outline ideas-io-btn" title="Importa JSON">
          ⬇️ Importa
          <input type="file" id="import-file" accept=".json" style="display:none" />
        </label>
      </div>
    </div>

    <!-- LISTA -->
    <div id="ideas-list">
      ${_buildListHTML()}
    </div>
  `

  _bindFormEvents()
  _bindListEvents()
  _bindFilterEvents()
  _bindIOEvents()

  const handler = () => {
    _refreshList()
    _refreshFilters()
  }
  window.addEventListener('ideas:updated', handler)
  window.__currentPageCleanup = () => window.removeEventListener('ideas:updated', handler)
}

/* ── FORM ─────────────────────────────────────────────── */

function _buildFormHTML(idea) {
  const isEdit = !!idea
  const dayOptions = _tripDays.map(d =>
    `<option value="${d.date}" ${idea?.day_date === d.date ? 'selected' : ''}>
      Gg. ${d.day} — ${d.location} · ${formatDateIT(d.date)}
    </option>`
  ).join('')

  const statoOpts = STATI.map(s =>
    `<option value="${s.value}" ${(idea?.stato ?? 'idea') === s.value ? 'selected' : ''}>${s.label}</option>`
  ).join('')

  const catOpts = CATEGORIE.map(c =>
    `<option value="${c.value}" ${(idea?.categoria ?? 'varia') === c.value ? 'selected' : ''}>${c.label}</option>`
  ).join('')

  const priOpts = PRIORITA.map(p =>
    `<option value="${p.value}" ${(idea?.priorita ?? 'media') === p.value ? 'selected' : ''}>${p.label}</option>`
  ).join('')

  return `
    <form id="idea-form" class="ideas-form">
      <div class="ideas-form-title">${isEdit ? '✏️ Modifica idea' : '💡 Nuova idea'}</div>

      <!-- TITOLO — unico campo obbligatorio, grande e prominente -->
      <input type="text" id="idea-text" class="ideas-input ideas-input--title"
        placeholder="Cosa vuoi ricordare…"
        value="${_esc(idea?.text ?? '')}"
        autocomplete="off" />

      <!-- ROW: categoria / stato / priorità -->
      <div class="ideas-row3">
        <div class="ideas-field-mini">
          <label class="ideas-label">Categoria</label>
          <select id="idea-categoria" class="ideas-select">${catOpts}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Stato</label>
          <select id="idea-stato" class="ideas-select">${statoOpts}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Priorità</label>
          <select id="idea-priorita" class="ideas-select">${priOpts}</select>
        </div>
      </div>

      <!-- Toggle dettagli aggiuntivi -->
      <button type="button" class="ideas-toggle-advanced" id="ideas-toggle-advanced">
        ${_showAdvanced ? '▲ Meno dettagli' : '▼ Più dettagli'}
      </button>

      <div id="ideas-advanced" class="${_showAdvanced ? '' : 'hidden'}">
        <!-- Nota -->
        <textarea id="idea-note" class="ideas-input ideas-textarea"
          rows="2" placeholder="Nota aggiuntiva…">${_esc(idea?.note ?? '')}</textarea>

        <!-- Luogo + Link -->
        <div class="ideas-row2">
          <input type="text" id="idea-location" class="ideas-input"
            placeholder="📍 Luogo"
            value="${_esc(idea?.location_name ?? '')}" />
          <input type="url" id="idea-link" class="ideas-input"
            placeholder="🔗 Link (opz.)"
            value="${_esc(idea?.link ?? '')}" />
        </div>

        <!-- Giorno -->
        <select id="idea-day" class="ideas-select">
          <option value="">📅 Nessun giorno specifico</option>
          ${dayOptions}
        </select>

        <!-- Coordinate (auto-fill da giorno) -->
        <div class="ideas-coords-row">
          <span class="ideas-coords-label">Coord.</span>
          <input type="number" id="idea-lat" class="ideas-input ideas-input--coord"
            placeholder="Lat" step="0.0001" value="${idea?.coordinates?.lat ?? ''}" />
          <input type="number" id="idea-lng" class="ideas-input ideas-input--coord"
            placeholder="Lng" step="0.0001" value="${idea?.coordinates?.lng ?? ''}" />
          <span id="idea-coords-hint" class="ideas-coords-hint" style="font-size:0.72rem;color:var(--color-text-muted);">
            Seleziona giorno per auto-fill
          </span>
        </div>

        <!-- Checklist + Mappa -->
        <div class="ideas-checks">
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-checklist" ${idea?.add_to_checklist ? 'checked' : ''} />
            📋 Checklist
          </label>
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-map" ${idea?.add_to_map ? 'checked' : ''} />
            🗺️ Mappa
          </label>
        </div>

        <!-- Color picker (visibile solo se Mappa) -->
        <div class="idea-color-row ${idea?.add_to_map ? '' : 'hidden'}" id="idea-color-row">
          <span class="ideas-label">Colore marker:</span>
          <div class="idea-color-picker">
            ${COLORS.map(c => `
              <label class="color-option" title="${c.label}">
                <input type="radio" name="idea-color" value="${c.value}"
                  ${(idea?.marker_color ?? '#f59e0b') === c.value ? 'checked' : ''} />
                <span class="color-dot" style="background:${c.value}"></span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Azioni form -->
      <div class="ideas-form-actions">
        <button type="submit" class="btn btn-primary ideas-save-btn" id="idea-save-btn">
          ${isEdit ? '💾 Aggiorna' : '💾 Salva'}
        </button>
        <button type="button" class="btn btn-outline ${isEdit ? '' : 'hidden'}" id="idea-cancel-btn">
          ✕ Annulla
        </button>
      </div>
    </form>
  `
}

function _bindFormEvents() {
  const wrap = document.getElementById('ideas-form-wrap')
  if (!wrap) return

  // Toggle avanzato
  document.getElementById('ideas-toggle-advanced')?.addEventListener('click', () => {
    _showAdvanced = !_showAdvanced
    const adv = document.getElementById('ideas-advanced')
    const btn = document.getElementById('ideas-toggle-advanced')
    adv?.classList.toggle('hidden', !_showAdvanced)
    if (btn) btn.textContent = _showAdvanced ? '▲ Meno dettagli' : '▼ Più dettagli'
  })

  // Giorno → auto-fill coordinate
  wrap.addEventListener('change', e => {
    if (e.target.id === 'idea-day') {
      const day = _tripDays.find(d => d.date === e.target.value)
      if (day?.coordinates) {
        document.getElementById('idea-lat').value = day.coordinates.lat
        document.getElementById('idea-lng').value = day.coordinates.lng
        document.getElementById('idea-coords-hint').textContent = `Auto-riempito da "${day.location}"`
      }
    }
    if (e.target.id === 'idea-add-map') {
      document.getElementById('idea-color-row')?.classList.toggle('hidden', !e.target.checked)
    }
  })

  // Submit
  document.getElementById('idea-form')?.addEventListener('submit', e => {
    e.preventDefault()
    _handleSave()
  })

  // Cancel edit
  document.getElementById('idea-cancel-btn')?.addEventListener('click', () => {
    _editingId = null
    document.getElementById('ideas-form-wrap').innerHTML = _buildFormHTML(null)
    _bindFormEvents()
  })
}

function _handleSave() {
  const text = document.getElementById('idea-text')?.value.trim()
  if (!text) { document.getElementById('idea-text')?.focus(); return }

  const latRaw = parseFloat(document.getElementById('idea-lat')?.value)
  const lngRaw = parseFloat(document.getElementById('idea-lng')?.value)
  const coords = (!isNaN(latRaw) && !isNaN(lngRaw)) ? { lat: latRaw, lng: lngRaw } : null

  const addMap = document.getElementById('idea-add-map')?.checked

  const partial = {
    text,
    note:             document.getElementById('idea-note')?.value.trim() ?? '',
    categoria:        document.getElementById('idea-categoria')?.value ?? 'varia',
    stato:            document.getElementById('idea-stato')?.value ?? 'idea',
    priorita:         document.getElementById('idea-priorita')?.value ?? 'media',
    day_date:         document.getElementById('idea-day')?.value || null,
    location_name:    document.getElementById('idea-location')?.value.trim() || null,
    link:             document.getElementById('idea-link')?.value.trim() || '',
    coordinates:      coords,
    add_to_checklist: document.getElementById('idea-add-checklist')?.checked ?? false,
    add_to_map:       addMap && coords !== null,
    marker_color:     document.querySelector('input[name="idea-color"]:checked')?.value ?? '#f59e0b',
  }

  if (_editingId) {
    updateIdea(_editingId, partial)
    _editingId = null
  } else {
    addIdea(partial)
  }

  _showAdvanced = false
  document.getElementById('ideas-form-wrap').innerHTML = _buildFormHTML(null)
  _bindFormEvents()
  _refreshList()
  _refreshFilters()
}

/* ── FILTRI ───────────────────────────────────────────── */

function _buildFiltersHTML() {
  const ideas = loadIdeas()

  const filters = [
    { key: 'tutte',         label: `Tutte (${ideas.length})` },
    { key: 'idea',          label: `Idea (${ideas.filter(i=>i.stato==='idea').length})` },
    { key: 'da-verificare', label: `Da verificare (${ideas.filter(i=>i.stato==='da-verificare').length})` },
    { key: 'prenotare',     label: `Prenotare (${ideas.filter(i=>i.stato==='prenotare').length})` },
    { key: 'approvata',     label: `Approvate (${ideas.filter(i=>i.stato==='approvata').length})` },
    { key: 'scartata',      label: `Scartate (${ideas.filter(i=>i.stato==='scartata').length})` },
  ]

  return filters.map(f => `
    <button class="idea-filter-btn ${_currentFilter === f.key ? 'active' : ''}" data-f="${f.key}">
      ${f.label}
    </button>
  `).join('')
}

function _bindFilterEvents() {
  document.getElementById('ideas-filters-row')?.querySelectorAll('.idea-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentFilter = btn.dataset.f
      _refreshFilters()
      _refreshList()
    })
  })
}

function _refreshFilters() {
  const row = document.getElementById('ideas-filters-row')
  if (!row) return
  row.innerHTML = _buildFiltersHTML()
  _bindFilterEvents()
}

/* ── LISTA ────────────────────────────────────────────── */

function _buildListHTML() {
  let ideas = loadIdeas()

  if (_currentFilter !== 'tutte') {
    ideas = ideas.filter(i => i.stato === _currentFilter)
  }

  if (ideas.length === 0) {
    return `<div class="ideas-empty">${
      _currentFilter === 'tutte'
        ? 'Nessuna idea salvata. Aggiungine una qui sopra.'
        : 'Nessuna idea per questo filtro.'
    }</div>`
  }

  return ideas.map(_buildIdeaCardHTML).join('')
}

function _buildIdeaCardHTML(idea) {
  const stato   = STATI.find(s => s.value === idea.stato)
  const cat     = CATEGORIE.find(c => c.value === idea.categoria)
  const pri     = PRIORITA.find(p => p.value === idea.priorita)
  const day     = idea.day_date ? _tripDays.find(d => d.date === idea.day_date) : null

  return `
    <div class="idea-card ${idea.stato === 'scartata' ? 'idea-card--scartata' : ''}" data-id="${idea.id}">
      <div class="idea-card-main">
        <div class="idea-card-header-row">
          <span class="idea-card-text">${_esc(idea.text)}</span>
          <div class="idea-card-badges-inline">
            ${stato  ? `<span class="idea-stato-badge" style="background:${stato.color}20;color:${stato.color};border-color:${stato.color}40;">${stato.label}</span>` : ''}
            ${cat    ? `<span class="idea-cat-badge">${cat.label}</span>` : ''}
            ${pri    ? `<span class="idea-pri-dot" title="${pri.label}" style="background:${_priColor(idea.priorita)}"></span>` : ''}
          </div>
        </div>

        ${idea.note ? `<div class="idea-card-note">${_esc(idea.note)}</div>` : ''}

        <div class="idea-card-meta">
          ${day  ? `<span class="idea-meta-chip">📅 Gg. ${day.day} — ${day.location}</span>` : ''}
          ${idea.location_name ? `<span class="idea-meta-chip">📍 ${_esc(idea.location_name)}</span>` : ''}
          ${idea.add_to_checklist ? `<span class="idea-meta-chip">📋 Checklist</span>` : ''}
          ${idea.add_to_map ? `<span class="idea-meta-chip" style="border-left:3px solid ${idea.marker_color}">🗺️ Mappa</span>` : ''}
          ${idea.link ? `<a href="${_esc(idea.link)}" target="_blank" rel="noopener" class="idea-meta-chip idea-meta-link">🔗 Link</a>` : ''}
        </div>
      </div>

      <div class="idea-card-actions">
        <!-- Stato rapido -->
        <select class="idea-stato-select" data-action="stato" data-id="${idea.id}" title="Cambia stato">
          ${STATI.map(s => `<option value="${s.value}" ${idea.stato === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
        </select>

        <div class="idea-card-btns">
          <!-- Aggiungi alla checklist -->
          <button class="idea-action-btn ${idea.add_to_checklist ? 'idea-action-btn--active' : ''}"
            data-action="checklist" data-id="${idea.id}"
            title="${idea.add_to_checklist ? 'Rimuovi dalla checklist' : 'Aggiungi alla checklist'}">
            📋
          </button>

          <!-- Aggiungi all'itinerario (collega a giorno) -->
          <button class="idea-action-btn ${idea.day_date ? 'idea-action-btn--active' : ''}"
            data-action="day-link" data-id="${idea.id}"
            title="${idea.day_date ? 'Giorno: ' + idea.day_date : 'Collega a giorno'}">
            📅
          </button>

          <!-- Modifica -->
          <button class="idea-action-btn" data-action="edit" data-id="${idea.id}" title="Modifica">✏️</button>

          <!-- Elimina -->
          <button class="idea-action-btn idea-action-btn--del" data-action="delete" data-id="${idea.id}" title="Elimina">🗑️</button>
        </div>
      </div>
    </div>
  `
}

/* ── DAY-LINK MODAL ───────────────────────────────────── */

function _openDayLinkModal(id) {
  const idea = loadIdeas().find(i => i.id === id)
  if (!idea) return

  // Rimuovi modal precedente
  document.getElementById('day-link-modal')?.remove()

  const opts = _tripDays.map(d =>
    `<option value="${d.date}" ${idea.day_date === d.date ? 'selected' : ''}>
      Gg. ${d.day} — ${d.location} · ${formatDateIT(d.date)}
    </option>`
  ).join('')

  const modal = document.createElement('div')
  modal.id = 'day-link-modal'
  modal.className = 'day-link-modal-overlay'
  modal.innerHTML = `
    <div class="day-link-modal">
      <div class="day-link-modal-title">📅 Collega all'itinerario</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">
        L'idea apparirà nella scheda del giorno selezionato.
      </p>
      <select id="day-link-select" class="ideas-select">
        <option value="">Nessun giorno</option>
        ${opts}
      </select>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button class="btn btn-primary" id="day-link-confirm">✓ Conferma</button>
        <button class="btn btn-outline" id="day-link-cancel">Annulla</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  document.getElementById('day-link-confirm')?.addEventListener('click', () => {
    const date = document.getElementById('day-link-select')?.value || null
    updateIdea(id, { day_date: date })
    modal.remove()
    _refreshList()
  })
  document.getElementById('day-link-cancel')?.addEventListener('click', () => modal.remove())
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove() })
}

/* ── LIST EVENTS ──────────────────────────────────────── */

function _bindListEvents() {
  const list = document.getElementById('ideas-list')
  if (!list) return

  // Select stato inline
  list.addEventListener('change', e => {
    if (e.target.dataset.action === 'stato') {
      updateIdea(e.target.dataset.id, { stato: e.target.value })
      _refreshList()
      _refreshFilters()
    }
  })

  // Pulsanti azione
  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const id     = btn.dataset.id
    const action = btn.dataset.action

    if (action === 'delete') {
      if (!confirm('Eliminare questa idea?')) return
      deleteIdea(id)
      _refreshList()
      _refreshFilters()
    }

    if (action === 'edit') {
      _editingId = id
      const idea = loadIdeas().find(i => i.id === id)
      if (!idea) return
      _showAdvanced = true
      document.getElementById('ideas-form-wrap').innerHTML = _buildFormHTML(idea)
      _bindFormEvents()
      document.getElementById('ideas-form-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (action === 'checklist') {
      const idea = loadIdeas().find(i => i.id === id)
      if (!idea) return
      updateIdea(id, { add_to_checklist: !idea.add_to_checklist })
      _refreshList()
    }

    if (action === 'day-link') {
      _openDayLinkModal(id)
    }
  })
}

function _refreshList() {
  const list = document.getElementById('ideas-list')
  if (!list) return
  list.innerHTML = _buildListHTML()
  _bindListEvents()
}

/* ── EXPORT / IMPORT ──────────────────────────────────── */

function _bindIOEvents() {
  document.getElementById('export-btn')?.addEventListener('click', () => {
    const json = exportIdeasJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `idee_viaggio_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  })

  document.getElementById('import-file')?.addEventListener('change', async e => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text  = await file.text()
      const added = importIdeasJSON(text)
      alert(`Importazione completata: ${added} nuove idee aggiunte.`)
      _refreshList()
      _refreshFilters()
    } catch (err) {
      alert('Errore importazione: ' + err.message)
    }
    e.target.value = ''
  })
}

/* ── HELPERS ──────────────────────────────────────────── */

function _priColor(p) {
  return p === 'alta' ? '#ef4444' : p === 'media' ? '#f59e0b' : '#22c55e'
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
