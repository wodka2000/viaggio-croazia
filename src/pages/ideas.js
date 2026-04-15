import { fetchTripData } from '../utils/data.js'
import { formatDate } from '../utils/data.js'
import {
  loadIdeas, addIdea, updateIdea, deleteIdea,
} from '../utils/ideas.js'

let _editingId    = null
let _currentFilter = 'all'
let _tripDays     = []

const COLORS = [
  { value: '#f59e0b', label: 'Giallo' },
  { value: '#ef4444', label: 'Rosso' },
  { value: '#8b5cf6', label: 'Viola' },
  { value: '#10b981', label: 'Verde' },
  { value: '#f97316', label: 'Arancio' },
]

export async function renderIdeas() {
  const content = document.getElementById('page-content')

  let tripData
  try {
    tripData = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  _tripDays = tripData.days
  _editingId = null
  _currentFilter = 'all'

  content.innerHTML = `
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Annota idee, luoghi e cose da fare. Ogni idea si sincronizza con Itinerario, Checklist e Mappa.</p>
    </div>

    <div class="idea-form-card" id="idea-form-container">
      ${_buildFormHTML(null)}
    </div>

    <div id="ideas-filters-wrap">
      ${_buildFiltersHTML()}
    </div>

    <div id="ideas-list">
      ${_buildListHTML()}
    </div>
  `

  _bindFormEvents()
  _bindListEvents()

  // Live sync: se un'altra pagina modifica le idee (es. eliminazione dal giorno)
  const handler = () => {
    _refreshList()
    _refreshFilters()
  }
  window.addEventListener('ideas:updated', handler)

  // Cleanup quando si naviga via
  window.__currentPageCleanup = () => window.removeEventListener('ideas:updated', handler)
}

/* ── FORM ─────────────────────────────────────────────────── */

function _buildFormHTML(idea) {
  const isEdit = !!idea
  const dayOptions = _tripDays.map(d =>
    `<option value="${d.date}" ${idea?.day_date === d.date ? 'selected' : ''}>
      Gg. ${d.day} · ${d.date.slice(5).replace('-','/')} — ${d.location}
    </option>`
  ).join('')

  return `
    <h2 class="idea-form-title">${isEdit ? '✏️ Modifica idea' : '💡 Nuova idea'}</h2>

    <div class="idea-field">
      <input type="text" id="idea-text" class="idea-input"
        placeholder="Descrivi l'idea…"
        value="${_esc(idea?.text ?? '')}" />
    </div>

    <div class="idea-field">
      <textarea id="idea-note" class="idea-textarea" rows="2"
        placeholder="Note aggiuntive (opzionale)…">${_esc(idea?.note ?? '')}</textarea>
    </div>

    <div class="idea-form-row">
      <div class="idea-field idea-field--half">
        <label class="idea-label">📅 Giorno</label>
        <select id="idea-day" class="idea-select">
          <option value="">Nessun giorno</option>
          ${dayOptions}
        </select>
      </div>
      <div class="idea-field idea-field--half">
        <label class="idea-label">📍 Luogo (testo)</label>
        <input type="text" id="idea-location" class="idea-input"
          placeholder="es. Caletta Lucice"
          value="${_esc(idea?.location_name ?? '')}" />
      </div>
    </div>

    <div class="idea-coords-row" id="idea-coords-section">
      <span class="idea-coords-label">Coordinate</span>
      <input type="number" id="idea-lat" class="idea-input idea-input--coord"
        placeholder="Lat" step="0.0001"
        value="${idea?.coordinates?.lat ?? ''}" />
      <input type="number" id="idea-lng" class="idea-input idea-input--coord"
        placeholder="Lng" step="0.0001"
        value="${idea?.coordinates?.lng ?? ''}" />
      <span id="idea-coords-hint" class="idea-coords-hint">Seleziona un giorno per auto-riempire</span>
    </div>

    <div class="idea-checkboxes">
      <label class="idea-check-label">
        <input type="checkbox" id="idea-add-checklist" ${idea?.add_to_checklist ? 'checked' : ''} />
        📋 Aggiungi alla checklist
      </label>
      <label class="idea-check-label">
        <input type="checkbox" id="idea-add-map" ${idea?.add_to_map ? 'checked' : ''} />
        🗺️ Mostra sulla mappa
      </label>
    </div>

    <div class="idea-color-row ${idea?.add_to_map ? '' : 'hidden'}" id="idea-color-row">
      <span class="idea-label">Colore marker:</span>
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

    <div class="idea-form-actions">
      <button class="btn btn-primary" id="idea-save-btn">
        ${isEdit ? '💾 Aggiorna' : '💾 Salva idea'}
      </button>
      <button class="btn btn-outline ${isEdit ? '' : 'hidden'}" id="idea-cancel-btn">
        ✕ Annulla
      </button>
    </div>
  `
}

function _bindFormEvents() {
  const container = document.getElementById('idea-form-container')
  if (!container) return

  // Day select → auto-fill coordinates
  container.addEventListener('change', e => {
    if (e.target.id === 'idea-day') {
      const date = e.target.value
      const day = _tripDays.find(d => d.date === date)
      if (day?.coordinates) {
        document.getElementById('idea-lat').value = day.coordinates.lat
        document.getElementById('idea-lng').value = day.coordinates.lng
        document.getElementById('idea-coords-hint').textContent =
          `Auto-riempito da "${day.location}"`
      } else {
        document.getElementById('idea-coords-hint').textContent = 'Seleziona un giorno per auto-riempire'
      }
    }
    // Map checkbox → mostra/nascondi color picker
    if (e.target.id === 'idea-add-map') {
      document.getElementById('idea-color-row')?.classList.toggle('hidden', !e.target.checked)
    }
  })

  // Save / Update
  document.getElementById('idea-save-btn')?.addEventListener('click', _handleSave)

  // Cancel edit
  document.getElementById('idea-cancel-btn')?.addEventListener('click', () => {
    _editingId = null
    document.getElementById('idea-form-container').innerHTML = _buildFormHTML(null)
    _bindFormEvents()
  })
}

function _handleSave() {
  const text = document.getElementById('idea-text')?.value.trim()
  if (!text) {
    document.getElementById('idea-text')?.focus()
    return
  }

  const latRaw = parseFloat(document.getElementById('idea-lat')?.value)
  const lngRaw = parseFloat(document.getElementById('idea-lng')?.value)
  const coords = (!isNaN(latRaw) && !isNaN(lngRaw))
    ? { lat: latRaw, lng: lngRaw }
    : null

  const addMap = document.getElementById('idea-add-map')?.checked
  const markerColor = document.querySelector('input[name="idea-color"]:checked')?.value ?? '#f59e0b'

  const partial = {
    text,
    note: document.getElementById('idea-note')?.value.trim() ?? '',
    day_date: document.getElementById('idea-day')?.value || null,
    location_name: document.getElementById('idea-location')?.value.trim() || null,
    coordinates: coords,
    add_to_checklist: document.getElementById('idea-add-checklist')?.checked ?? false,
    add_to_map: addMap && coords !== null,
    marker_color: markerColor,
  }

  if (_editingId) {
    updateIdea(_editingId, partial)
    _editingId = null
  } else {
    addIdea(partial)
  }

  // Reset form
  document.getElementById('idea-form-container').innerHTML = _buildFormHTML(null)
  _bindFormEvents()

  _refreshList()
  _refreshFilters()
}

/* ── FILTERS ──────────────────────────────────────────────── */

function _buildFiltersHTML() {
  const ideas = loadIdeas()
  const clCount  = ideas.filter(i => i.add_to_checklist).length
  const mapCount = ideas.filter(i => i.add_to_map).length

  return `
    <div class="ideas-filters">
      <button class="idea-filter-btn ${_currentFilter === 'all'       ? 'active' : ''}" data-f="all">Tutte (${ideas.length})</button>
      <button class="idea-filter-btn ${_currentFilter === 'day'       ? 'active' : ''}" data-f="day">Per giorno</button>
      <button class="idea-filter-btn ${_currentFilter === 'checklist' ? 'active' : ''}" data-f="checklist">📋 Checklist (${clCount})</button>
      <button class="idea-filter-btn ${_currentFilter === 'map'       ? 'active' : ''}" data-f="map">🗺️ Mappa (${mapCount})</button>
    </div>
  `
}

function _refreshFilters() {
  const wrap = document.getElementById('ideas-filters-wrap')
  if (!wrap) return
  wrap.innerHTML = _buildFiltersHTML()
  wrap.querySelectorAll('.idea-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentFilter = btn.dataset.f
      _refreshFilters()
      _refreshList()
    })
  })
}

/* ── LIST ─────────────────────────────────────────────────── */

function _buildListHTML() {
  const ideas = loadIdeas()
  if (ideas.length === 0) {
    return `<div class="ideas-empty">Nessuna idea salvata. Aggiungine una qui sopra.</div>`
  }

  let filtered = ideas
  if (_currentFilter === 'checklist') filtered = ideas.filter(i => i.add_to_checklist)
  if (_currentFilter === 'map')       filtered = ideas.filter(i => i.add_to_map)

  if (_currentFilter === 'day') {
    // Raggruppa per giorno, poi "senza giorno"
    const byDay = {}
    const noDayList = []
    filtered.forEach(idea => {
      if (idea.day_date) {
        if (!byDay[idea.day_date]) byDay[idea.day_date] = []
        byDay[idea.day_date].push(idea)
      } else {
        noDayList.push(idea)
      }
    })

    const dayKeys = Object.keys(byDay).sort()
    let html = ''
    dayKeys.forEach(date => {
      const day = _tripDays.find(d => d.date === date)
      html += `
        <div class="ideas-day-group">
          <div class="ideas-day-header">
            📅 ${day ? `Gg. ${day.day} — ${day.location} · ${formatDate(date)}` : formatDate(date)}
          </div>
          ${byDay[date].map(_buildIdeaCardHTML).join('')}
        </div>
      `
    })
    if (noDayList.length > 0) {
      html += `
        <div class="ideas-day-group">
          <div class="ideas-day-header">📌 Senza giorno specifico</div>
          ${noDayList.map(_buildIdeaCardHTML).join('')}
        </div>
      `
    }
    return html || `<div class="ideas-empty">Nessuna idea per questo filtro.</div>`
  }

  if (filtered.length === 0) {
    return `<div class="ideas-empty">Nessuna idea per questo filtro.</div>`
  }
  return filtered.map(_buildIdeaCardHTML).join('')
}

function _buildIdeaCardHTML(idea) {
  const day = idea.day_date ? _tripDays.find(d => d.date === idea.day_date) : null

  return `
    <div class="idea-card ${idea.completed ? 'idea-card--done' : ''}" data-id="${idea.id}">
      <div class="idea-card-content">
        <div class="idea-card-text">${_esc(idea.text)}</div>
        ${idea.note ? `<div class="idea-card-note">${_esc(idea.note)}</div>` : ''}
        <div class="idea-card-badges">
          ${day ? `<span class="idea-badge idea-badge--day">📅 Gg. ${day.day} · ${day.location}</span>` : ''}
          ${idea.location_name ? `<span class="idea-badge idea-badge--loc">📍 ${_esc(idea.location_name)}</span>` : ''}
          ${idea.add_to_checklist ? `<span class="idea-badge idea-badge--cl">📋 Checklist</span>` : ''}
          ${idea.add_to_map ? `<span class="idea-badge idea-badge--map" style="border-left:3px solid ${idea.marker_color}">🗺️ Mappa</span>` : ''}
          ${idea.completed ? `<span class="idea-badge idea-badge--done">✅ Fatto</span>` : ''}
        </div>
      </div>
      <div class="idea-card-actions">
        ${idea.add_to_checklist
          ? `<button class="idea-action" data-action="toggle" data-id="${idea.id}" title="${idea.completed ? 'Segna come da fare' : 'Segna come fatto'}">
               ${idea.completed ? '↩️' : '✅'}
             </button>`
          : ''}
        <button class="idea-action" data-action="edit" data-id="${idea.id}" title="Modifica">✏️</button>
        <button class="idea-action idea-action--del" data-action="delete" data-id="${idea.id}" title="Elimina">🗑️</button>
      </div>
    </div>
  `
}

function _refreshList() {
  const list = document.getElementById('ideas-list')
  if (!list) return
  list.innerHTML = _buildListHTML()
  _bindListEvents()
}

function _bindListEvents() {
  document.getElementById('ideas-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]')
    if (!btn) return
    const id = btn.dataset.id
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
      document.getElementById('idea-form-container').innerHTML = _buildFormHTML(idea)
      _bindFormEvents()
      document.getElementById('idea-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (action === 'toggle') {
      const idea = loadIdeas().find(i => i.id === id)
      if (!idea) return
      updateIdea(id, { completed: !idea.completed })
      _refreshList()
    }
  })

  // Filter buttons
  document.querySelectorAll('.idea-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentFilter = btn.dataset.f
      _refreshFilters()
      _refreshList()
    })
  })
}

/* ── HELPERS ──────────────────────────────────────────────── */
function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
