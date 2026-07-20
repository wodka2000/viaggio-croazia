import { fetchTripData } from '../utils/data.js'
import { formatDateIT } from '../utils/data.js'
import { loadIdeas, addIdea, deleteIdea } from '../utils/ideas.js'
import { openDayPicker as openDayPickerModal } from '../utils/dayPicker.js'
import { esc } from '../utils/suggestions.js'

let _hikes    = []
let _sestoDays = []
let _filter   = 'tutte'

const mapsUrl = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

export async function renderPasseggiate() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  _hikes     = data.hikes || []
  _sestoDays = data.days.filter(d => d.location.toLowerCase().includes('sesto'))
  _filter    = 'tutte'

  content.innerHTML = `
    <div class="page-header">
      <h1>🥾 Passeggiate, Rifugi &amp; Gite</h1>
      <p>Dolomiti di Sesto — base al Passo Monte Croce (Kreuzbergpass). Passeggiate, rifugi e gite in zona (anche in auto). Scegli le mete e aggiungile a un giorno: compariranno nelle <a href="#attivita">attività suggerite</a> di quella data.</p>
    </div>

    <div class="hike-filters" id="hike-filters">
      ${filtersHtml()}
    </div>

    <div class="hike-grid" id="hike-grid">
      ${listHtml()}
    </div>
  `

  bindFilters()
  bindGrid()

  const handler = () => refreshGrid()
  window.addEventListener('ideas:updated', handler)
  window.__currentPageCleanup = () => window.removeEventListener('ideas:updated', handler)
}

/* ── FILTRI ────────────────────────────────────────── */

function filtersHtml() {
  const f = [
    { key: 'tutte',   label: `Tutte (${_hikes.length})` },
    { key: 'family',  label: `👶 Adatte ai bimbi (${_hikes.filter(h => h.family).length})` },
    { key: 'facili',  label: `🟢 Facili (${_hikes.filter(h => /facile/i.test(h.difficulty)).length})` },
    { key: 'auto',    label: `🚗 In auto (${_hikes.filter(h => h.car).length})` },
    { key: 'rifugi',  label: `🏔️ Rifugi (${_hikes.filter(h => /rifugio/i.test(h.type)).length})` },
  ]
  return f.map(x => `
    <button class="hike-filter-btn ${_filter === x.key ? 'active' : ''}" data-f="${x.key}">${x.label}</button>
  `).join('')
}

function filteredHikes() {
  switch (_filter) {
    case 'family': return _hikes.filter(h => h.family)
    case 'facili': return _hikes.filter(h => /facile/i.test(h.difficulty))
    case 'auto':   return _hikes.filter(h => h.car)
    case 'rifugi': return _hikes.filter(h => /rifugio/i.test(h.type))
    default:       return _hikes
  }
}

function bindFilters() {
  document.getElementById('hike-filters')?.querySelectorAll('.hike-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _filter = btn.dataset.f
      document.getElementById('hike-filters').innerHTML = filtersHtml()
      bindFilters()
      refreshGrid()
    })
  })
}

/* ── LISTA ─────────────────────────────────────────── */

// Giorni a cui una passeggiata è già stata assegnata (idee con hike_id)
function assignedDays(hikeId) {
  return loadIdeas()
    .filter(i => i.hike_id === hikeId && i.day_date)
    .map(i => ({ id: i.id, day: _sestoDays.find(d => d.date === i.day_date) }))
    .filter(x => x.day)
}

function diffClass(difficulty) {
  if (/impegnativ/i.test(difficulty)) return 'diff-hard'
  if (/media/i.test(difficulty))      return 'diff-med'
  return 'diff-easy'
}

function listHtml() {
  const hikes = filteredHikes()
  if (!hikes.length) return `<div class="ideas-empty">Nessuna meta per questo filtro.</div>`

  return hikes.map(h => {
    const assigned = assignedDays(h.id)
    return `
      <div class="hike-card" data-id="${h.id}">
        <div class="hike-card-top">
          <h3 class="hike-name">${esc(h.name)}</h3>
          <div class="hike-badges">
            <span class="hike-type">${esc(h.type)}</span>
            <span class="hike-diff ${diffClass(h.difficulty)}">${esc(h.difficulty)}</span>
            ${h.car ? `<span class="hike-family" title="Raggiungibile in auto">🚗</span>` : ''}
            ${h.family ? `<span class="hike-family" title="Adatta ai bambini">👶</span>` : ''}
          </div>
        </div>
        <div class="hike-meta">
          <span>⏱️ ${esc(h.duration)}</span>
          <span>📍 ${esc(h.start)}</span>
        </div>
        <p class="hike-desc">${esc(h.description)}</p>

        ${assigned.length ? `
          <div class="hike-assigned">
            ${assigned.map(a => `
              <span class="hike-assigned-chip" data-idea="${a.id}" title="Rimuovi dal giorno">
                ✓ Gg. ${a.day.day} · ${formatDateIT(a.day.date)} <span class="hike-assigned-x">✕</span>
              </span>`).join('')}
          </div>` : ''}

        <div class="hike-actions">
          <button class="btn btn-primary hike-add-btn" data-action="add" data-id="${h.id}">📌 Aggiungi a un giorno</button>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${mapsUrl(h.name)}">🗺️ Maps</a>
        </div>
      </div>
    `
  }).join('')
}

function refreshGrid() {
  const grid = document.getElementById('hike-grid')
  if (!grid) return
  grid.innerHTML = listHtml()
}

// Delega legata UNA sola volta sul container che persiste tra i refresh
function bindGrid() {
  const grid = document.getElementById('hike-grid')
  if (!grid) return
  grid.addEventListener('click', e => {
    const chip = e.target.closest('.hike-assigned-chip')
    if (chip) { deleteIdea(chip.dataset.idea); return }

    const btn = e.target.closest('[data-action="add"]')
    if (btn) openDayPicker(btn.dataset.id)
  })
}

/* ── DAY PICKER ────────────────────────────────────── */

// La finestra di scelta del giorno e condivisa (utils/dayPicker.js): qui resta
// solo cio che e proprio delle passeggiate, cioe' che idea costruirci sopra.
function openDayPicker(hikeId) {
  const hike = _hikes.find(h => h.id === hikeId)
  if (!hike) return

  openDayPickerModal({
    nome: hike.name,
    giorni: _sestoDays,
    giaScelti: assignedDays(hikeId).map(a => a.day.date),
    onConferma: date => {
      addIdea({
        text:          hike.name,
        note:          `${hike.type} · ${hike.difficulty} · ${hike.duration} — ${hike.description}`,
        categoria:     'escursione',
        stato:         'idea',
        day_date:      date,
        location_name: hike.start,
        link:          mapsUrl(hike.name),
        coordinates:   hike.coordinates || null,
        add_to_map:    !!hike.coordinates,
        marker_color:  '#10b981',
        hike_id:       hike.id,
      })
      // refreshGrid avviene via evento ideas:updated
    },
  })
}
