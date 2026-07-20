import { fetchTripData } from '../utils/data.js'
import { formatDateIT, formatDayOfWeek } from '../utils/data.js'
import { getIdeasForDay, addIdea, deleteIdea } from '../utils/ideas.js'
import { getUserBookingsForDay, bookingMapsUrl } from '../utils/bookings.js'
import { isSesto } from '../utils/suggestions.js'
import { getAttachmentMeta, openAttachment } from '../utils/attachments.js'
import {
  getDayProgram,
  isDayModified,
  editBaseActivity,
  hideBaseActivity,
  addActivity,
  editAddedActivity,
  removeAddedActivity,
  resetDay,
} from '../utils/program.js'

// Stato di sessione: quali giorni sono in modalità modifica + mappa date→day.
const _editModeDates = new Set()
let _daysByDate = {}

// `targetDate` arriva dalla rotta (#itinerary/2026-08-08): e' il giorno su cui
// aprirsi, quando ci si arriva da un link a una tappa precisa invece che dal
// menu. Senza parametro la pagina si comporta come sempre.
export async function renderItinerary(targetDate) {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  const { days, hotels, meta } = data
  const ferries = data.ferries || []
  const hotelMap = Object.fromEntries(hotels.map(h => [h.id, h]))
  _daysByDate = Object.fromEntries(days.map(d => [d.date, d]))

  content.innerHTML = `
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${meta.title} · ${meta.duration_days} giorni · ${formatDateIT(meta.start_date)} → ${formatDateIT(meta.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${days.map(day => renderDay(day, hotelMap, ferries)).join('')}
    </div>
  `

  // Toggle singolo giorno
  document.querySelectorAll('.timeline-card-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling
      const chevron = header.querySelector('.timeline-toggle')
      body?.classList.toggle('hidden')
      chevron?.classList.toggle('open')
    })
  })

  document.getElementById('expand-all')?.addEventListener('click', () => {
    document.querySelectorAll('.timeline-card-body').forEach(b => b.classList.remove('hidden'))
    document.querySelectorAll('.timeline-toggle').forEach(c => c.classList.add('open'))
  })

  document.getElementById('collapse-all')?.addEventListener('click', () => {
    document.querySelectorAll('.timeline-card-body').forEach(b => b.classList.add('hidden'))
    document.querySelectorAll('.timeline-toggle').forEach(c => c.classList.remove('open'))
  })

  // Arrivo da un link a una tappa precisa: apri quel giorno e portacisi.
  if (targetDate) _openDay(targetDate)

  // Quick-add idea per giorno
  _bindDayIdeaEvents(days)

  // Modifica programma del giorno
  _bindProgramEvents()

  // Sync in tempo reale: quando le idee cambiano, aggiorna le sezioni idee
  const handler = () => {
    document.querySelectorAll('.day-ideas-section').forEach(section => {
      const date = section.dataset.date
      if (date) section.innerHTML = _renderDayIdeas(date)
    })
  }

  // Sync prenotazioni: ridisegna le attività dei giorni interessati.
  const bookingsHandler = () => {
    document.querySelectorAll('.activities[data-date]').forEach(list => {
      _rerenderDayActivities(list.dataset.date)
    })
  }

  window.addEventListener('ideas:updated', handler)
  window.addEventListener('bookings:updated', bookingsHandler)
  window.__currentPageCleanup = () => {
    window.removeEventListener('ideas:updated', handler)
    window.removeEventListener('bookings:updated', bookingsHandler)
  }
}

// Apre la scheda di un giorno e ci porta sopra. Serve quando si arriva da un
// link a una tappa: le schede nascono chiuse, quindi senza aprirla l'utente
// atterrerebbe su un titolo e dovrebbe cliccare di nuovo.
function _openDay(date) {
  const item = document.querySelector(`.timeline-item[data-date="${date}"]`)
  if (!item) return

  item.querySelector('.timeline-card-body')?.classList.remove('hidden')
  item.querySelector('.timeline-toggle')?.classList.add('open')

  const card = item.querySelector('.timeline-card')
  card?.classList.add('timeline-card--evidenza')
  // L'evidenza dice "sei arrivato qui": passati due secondi ha esaurito il suo
  // compito e resterebbe solo rumore visivo.
  setTimeout(() => card?.classList.remove('timeline-card--evidenza'), 2000)

  item.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── DAY CARD ─────────────────────────────────────────────── */

// Il biglietto e un allegato locale (contiene nomi e documenti: non sta online).
// Qui lo si apre soltanto; si allega dalle Note logistiche, cosi il flusso di
// caricamento vive in un posto solo.
function _renderFerryBadge(f) {
  const tratta = `🎫 Traghetto ${_esc(f.from)} → ${_esc(f.to)} · 🕐 ${_esc(f.time)}`
  if (getAttachmentMeta(f.id)) {
    return `
      <button class="day-ferry-badge" data-ferry="${_esc(f.id)}">
        ${tratta} — <strong>apri biglietto</strong>
      </button>
    `
  }
  return `
    <a class="day-ferry-badge day-ferry-badge-empty" href="#logistics">
      ${tratta} — <strong>allega il biglietto nelle Note</strong>
    </a>
  `
}

function renderDay(day, hotelMap, ferries = []) {
  const hotel  = day.hotel_ref ? hotelMap[day.hotel_ref] : null
  const dayFerries = ferries.filter(f => f.day === day.day || f.date === day.date)
  const today  = new Date().toISOString().slice(0, 10)
  const isToday = day.date === today
  const isPast  = day.date < today
  const coordsJson = day.coordinates ? JSON.stringify(day.coordinates) : 'null'

  return `
    <div class="timeline-item" data-date="${day.date}">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num"
          style="${isPast ? 'background:var(--color-text-muted)' : isToday ? 'background:var(--color-accent)' : ''}">
          ${day.day}
        </div>
        <div class="timeline-date-label">
          ${formatDayOfWeek(day.date)}<br>${formatDateIT(day.date)}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${day.title}${isToday ? ' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>' : ''}</h3>
              <span class="timeline-location-badge">📍 ${day.location}</span>
            </div>
            <span class="timeline-toggle">▼</span>
          </div>
          <div class="timeline-card-body hidden">
            ${day.description ? `<p class="timeline-description">${day.description}</p>` : ''}

            ${dayFerries.map(f => _renderFerryBadge(f)).join('')}

            <div class="activities" data-date="${day.date}">
              ${_renderActivitiesInner(day, _editModeDates.has(day.date))}
            </div>

            ${isSesto(day) ? '' : renderTips(day.tips)}

            ${hotel ? `
              <div class="hotel-ref-badge">
                🏨 ${hotel.name} · Check-in ${formatDateIT(hotel.checkin)} / Check-out ${formatDateIT(hotel.checkout)}
              </div>
            ` : ''}

            <!-- SEZIONE IDEE DEL GIORNO -->
            <div class="day-ideas-wrap">
              <div class="day-ideas-section" id="day-ideas-${day.date}" data-date="${day.date}">
                ${_renderDayIdeas(day.date)}
              </div>
              <button class="day-add-idea-btn"
                data-date="${day.date}"
                data-coords='${coordsJson}'
                data-location="${day.location}">
                💡 Aggiungi idea
              </button>
              <form class="day-quick-form hidden" id="quick-form-${day.date}" data-date="${day.date}">
                <input type="text" class="quick-idea-text idea-input" placeholder="Descrivi l'idea…" />
                <div class="quick-form-checks">
                  <label class="idea-check-label">
                    <input type="checkbox" class="quick-checklist" /> 📋 Checklist
                  </label>
                  <label class="idea-check-label">
                    <input type="checkbox" class="quick-map" /> 🗺️ Mappa
                  </label>
                </div>
                <div style="display:flex;gap:0.5rem;">
                  <button type="submit" class="btn btn-primary" style="font-size:0.82rem;padding:0.35rem 0.75rem;">Salva</button>
                  <button type="button" class="btn btn-outline quick-cancel" style="font-size:0.82rem;padding:0.35rem 0.75rem;">Annulla</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

/* ── TIPS BANNER (consigli del giorno) ────────────────────── */

function renderTips(tips) {
  if (!tips) return ''
  const doList  = tips.do  || []
  const eatList = tips.eat || []
  if (!doList.length && !eatList.length) return ''

  return `
    <div class="day-tips">
      <div class="day-tips-title">✨ Consigli del giorno</div>
      <div class="day-tips-cols">
        ${doList.length ? `
          <div class="day-tips-col">
            <div class="day-tips-head">🎯 Da fare</div>
            <ul>${doList.map(t => `<li>${_esc(t)}</li>`).join('')}</ul>
          </div>` : ''}
        ${eatList.length ? `
          <div class="day-tips-col">
            <div class="day-tips-head">🍽️ Da mangiare</div>
            <ul>${eatList.map(t => `<li>${_esc(t)}</li>`).join('')}</ul>
          </div>` : ''}
      </div>
    </div>
  `
}

/* ── IDEAS SECTION ────────────────────────────────────────── */

function _renderDayIdeas(date) {
  const ideas = getIdeasForDay(date)
  if (ideas.length === 0) return ''
  return ideas.map(idea => `
    <div class="day-idea-pill ${idea.completed ? 'day-idea-pill--done' : ''}" data-id="${idea.id}">
      <span class="day-idea-text">${_esc(idea.text)}</span>
      ${idea.add_to_checklist ? '<span class="idea-tiny-badge">📋</span>' : ''}
      ${idea.add_to_map       ? '<span class="idea-tiny-badge">🗺️</span>' : ''}
      ${idea.completed        ? '<span class="idea-tiny-badge">✅</span>' : ''}
      <button class="day-idea-del" data-id="${idea.id}" title="Elimina">×</button>
    </div>
  `).join('')
}

/* ── PROGRAMMA DEL GIORNO (visualizza + modifica) ─────────── */

// Contenuto del contenitore .activities: in lettura mostra le attività
// (base + modifiche utente) e le prenotazioni; in modifica mostra i campi
// per cambiare orario/testo, eliminare e aggiungere attività.
function _renderActivitiesInner(day, editMode) {
  const items = getDayProgram(day.date, day.activities)

  if (editMode) {
    return `
      <div class="program-edit">
        ${items.map(_renderEditRow).join('')}
        <div class="program-add-row">
          <input type="text" class="prog-add-time" placeholder="Ora" />
          <input type="text" class="prog-add-text" placeholder="Nuova attività…" />
          <button type="button" class="prog-add-btn" data-date="${day.date}" title="Aggiungi">＋</button>
        </div>
        <div class="program-controls">
          <button type="button" class="btn btn-primary program-edit-done" data-date="${day.date}"
            style="font-size:0.8rem;padding:0.3rem 0.7rem;">✓ Fine</button>
          <button type="button" class="btn btn-outline program-reset" data-date="${day.date}"
            style="font-size:0.8rem;padding:0.3rem 0.7rem;">↺ Ripristina giorno</button>
        </div>
      </div>
    `
  }

  return `
    ${items.map(it => `
      <div class="activity-item with-dot">
        <span class="activity-time">${_esc(it.time)}</span>
        <span>
          ${_esc(it.text)}
          ${it.maps ? `<a class="activity-maps" href="${_esc(it.maps)}" target="_blank" rel="noopener">🗺️ Maps</a>` : ''}
        </span>
      </div>
    `).join('')}
    ${_renderBookingActivities(day.date)}
    <div class="program-controls">
      <button type="button" class="program-edit-toggle" data-date="${day.date}">✏️ Modifica programma</button>
      ${isDayModified(day.date) ? '<span class="program-modified">modificato</span>' : ''}
    </div>
  `
}

function _renderEditRow(it) {
  const ref = it.base ? `data-index="${it.index}"` : `data-id="${_esc(it.id)}"`
  return `
    <div class="program-edit-row" data-base="${it.base}" ${ref}>
      <input type="text" class="prog-time" value="${_esc(it.time)}" placeholder="Ora" />
      <input type="text" class="prog-text" value="${_esc(it.text)}" placeholder="Attività" />
      <button type="button" class="prog-del" title="Elimina">🗑️</button>
    </div>
  `
}

// Le prenotazioni aggiunte dall'utente (in Note logistiche) compaiono
// come attività del loro giorno, con il link diretto a Maps.
function _renderBookingActivities(date) {
  const bookings = getUserBookingsForDay(date)
  if (!bookings.length) return ''
  return bookings.map(b => {
    const url = bookingMapsUrl(b)
    return `
      <div class="activity-item with-dot activity-booking">
        <span class="activity-time">${b.time ? _esc(b.time) : '🍽️'}</span>
        <span>
          🍽️ ${_esc(b.place)}<span class="activity-booking-tag">prenotazione</span>
          ${url ? `<a class="activity-maps" href="${_esc(url)}" target="_blank" rel="noopener">🗺️ Maps</a>` : ''}
        </span>
      </div>
    `
  }).join('')
}

// Ridisegna il contenitore attività di un giorno nella modalità corrente.
function _rerenderDayActivities(date) {
  const container = document.querySelector(`.activities[data-date="${date}"]`)
  const day = _daysByDate[date]
  if (container && day) container.innerHTML = _renderActivitiesInner(day, _editModeDates.has(date))
}

/* ── EVENTS ───────────────────────────────────────────────── */

function _bindDayIdeaEvents(days) {
  const timeline = document.querySelector('.timeline')
  if (!timeline) return

  // Toggle quick-add form
  timeline.addEventListener('click', e => {
    const addBtn = e.target.closest('.day-add-idea-btn')
    if (addBtn) {
      const date = addBtn.dataset.date
      const form = document.getElementById(`quick-form-${date}`)
      if (!form) return
      const isHidden = form.classList.contains('hidden')
      // Chiudi tutti gli altri form aperti
      document.querySelectorAll('.day-quick-form').forEach(f => f.classList.add('hidden'))
      if (isHidden) {
        form.classList.remove('hidden')
        form.querySelector('.quick-idea-text')?.focus()
      }
    }

    // Annulla
    const cancelBtn = e.target.closest('.quick-cancel')
    if (cancelBtn) {
      cancelBtn.closest('.day-quick-form')?.classList.add('hidden')
    }

    // Elimina idea dal giorno
    const delBtn = e.target.closest('.day-idea-del')
    if (delBtn) {
      const id = delBtn.dataset.id
      if (confirm('Eliminare questa idea?')) {
        deleteIdea(id)
        // ideas:updated event aggiorna la sezione automaticamente
      }
    }

    // Apri il biglietto del traghetto (allegato locale)
    const ferryBtn = e.target.closest('[data-ferry]')
    if (ferryBtn) openAttachment(ferryBtn.dataset.ferry)
  })

  // Submit quick-add form
  timeline.addEventListener('submit', e => {
    const form = e.target.closest('.day-quick-form')
    if (!form) return
    e.preventDefault()

    const text = form.querySelector('.quick-idea-text')?.value.trim()
    if (!text) { form.querySelector('.quick-idea-text')?.focus(); return }

    const date    = form.dataset.date
    const day     = days.find(d => d.date === date)
    const addMap  = form.querySelector('.quick-map')?.checked
    const addCl   = form.querySelector('.quick-checklist')?.checked

    addIdea({
      text,
      day_date: date,
      location_name: day?.location ?? null,
      coordinates: (addMap && day?.coordinates) ? day.coordinates : null,
      add_to_checklist: !!addCl,
      add_to_map: !!(addMap && day?.coordinates),
    })

    form.querySelector('.quick-idea-text').value = ''
    form.querySelector('.quick-map').checked = false
    form.querySelector('.quick-checklist').checked = false
    form.classList.add('hidden')
    // La sezione idee si aggiorna via ideas:updated
  })
}

function _bindProgramEvents() {
  const timeline = document.querySelector('.timeline')
  if (!timeline) return

  timeline.addEventListener('click', e => {
    // Entra in modifica
    const toggle = e.target.closest('.program-edit-toggle')
    if (toggle) { _editModeDates.add(toggle.dataset.date); _rerenderDayActivities(toggle.dataset.date); return }

    // Esci dalla modifica
    const done = e.target.closest('.program-edit-done')
    if (done) { _editModeDates.delete(done.dataset.date); _rerenderDayActivities(done.dataset.date); return }

    // Ripristina il giorno come da itinerario originale
    const reset = e.target.closest('.program-reset')
    if (reset) {
      const date = reset.dataset.date
      if (confirm('Ripristinare il programma di questo giorno come nell’itinerario originale? Le modifiche fatte a questo giorno andranno perse.')) {
        resetDay(date)
        _editModeDates.delete(date)
        _rerenderDayActivities(date)
      }
      return
    }

    // Elimina un'attività
    const del = e.target.closest('.prog-del')
    if (del) {
      const row  = del.closest('.program-edit-row')
      const date = del.closest('.activities')?.dataset.date
      if (!row || !date) return
      if (row.dataset.base === 'true') hideBaseActivity(date, Number(row.dataset.index))
      else removeAddedActivity(date, row.dataset.id)
      _rerenderDayActivities(date)
      return
    }

    // Aggiungi un'attività
    const add = e.target.closest('.prog-add-btn')
    if (add) {
      const date = add.dataset.date
      const wrap = add.closest('.program-add-row')
      const time = wrap.querySelector('.prog-add-time')?.value.trim() || ''
      const text = wrap.querySelector('.prog-add-text')?.value.trim() || ''
      if (!text) { wrap.querySelector('.prog-add-text')?.focus(); return }
      addActivity(date, { time, text })
      _rerenderDayActivities(date)
      document.querySelector(`.activities[data-date="${date}"] .prog-add-text`)?.focus()
      return
    }
  })

  // Invio nel campo "nuova attività" = aggiungi
  timeline.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('prog-add-text')) {
      e.preventDefault()
      e.target.closest('.program-add-row')?.querySelector('.prog-add-btn')?.click()
    }
  })

  // Salva le modifiche a orario/testo su blur, senza ridisegnare (per non
  // perdere il focus mentre si scrive). Il riordino per orario si applica
  // all'uscita dalla modifica.
  timeline.addEventListener('change', e => {
    const input = e.target
    const isTime = input.classList?.contains('prog-time')
    const isText = input.classList?.contains('prog-text')
    if (!isTime && !isText) return
    const row  = input.closest('.program-edit-row')
    const date = input.closest('.activities')?.dataset.date
    if (!row || !date) return
    const patch = { [isTime ? 'time' : 'text']: input.value.trim() }
    if (row.dataset.base === 'true') editBaseActivity(date, Number(row.dataset.index), patch)
    else editAddedActivity(date, row.dataset.id, patch)
  })
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
