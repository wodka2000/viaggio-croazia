import { fetchTripData } from '../utils/data.js'
import { formatDateIT, formatDayOfWeek } from '../utils/data.js'
import { getIdeasForDay, addIdea, deleteIdea } from '../utils/ideas.js'
import { getUserBookingsForDay, bookingMapsUrl } from '../utils/bookings.js'

export async function renderItinerary() {
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

  // Quick-add idea per giorno
  _bindDayIdeaEvents(days)

  // Sync in tempo reale: quando le idee cambiano, aggiorna le sezioni idee
  const handler = () => {
    document.querySelectorAll('.day-ideas-section').forEach(section => {
      const date = section.dataset.date
      if (date) section.innerHTML = _renderDayIdeas(date)
    })
  }

  // Sync prenotazioni: ridisegna le righe-attività di ogni giorno.
  const bookingsHandler = () => {
    document.querySelectorAll('.activities[data-date]').forEach(list => {
      const date = list.dataset.date
      // Rimuovi le righe prenotazione esistenti e riaggiungile aggiornate.
      list.querySelectorAll('.activity-booking').forEach(el => el.remove())
      list.insertAdjacentHTML('beforeend', _renderBookingActivities(date))
    })
  }

  window.addEventListener('ideas:updated', handler)
  window.addEventListener('bookings:updated', bookingsHandler)
  window.__currentPageCleanup = () => {
    window.removeEventListener('ideas:updated', handler)
    window.removeEventListener('bookings:updated', bookingsHandler)
  }
}

/* ── DAY CARD ─────────────────────────────────────────────── */

function renderDay(day, hotelMap, ferries = []) {
  const hotel  = day.hotel_ref ? hotelMap[day.hotel_ref] : null
  const dayFerries = ferries.filter(f => f.day === day.day || f.date === day.date)
  const today  = new Date().toISOString().slice(0, 10)
  const isToday = day.date === today
  const isPast  = day.date < today
  const coordsJson = day.coordinates ? JSON.stringify(day.coordinates) : 'null'

  return `
    <div class="timeline-item">
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

            ${dayFerries.map(f => `
              <a class="day-ferry-badge" target="_blank" rel="noopener" href="${import.meta.env.BASE_URL}${f.pdf}">
                🎫 Traghetto ${f.from} → ${f.to} · 🕐 ${f.time} — <strong>apri biglietto PDF</strong>
              </a>
            `).join('')}

            <div class="activities" data-date="${day.date}">
              ${day.activities.map(a => `
                <div class="activity-item with-dot">
                  <span class="activity-time">${a.time}</span>
                  <span>
                    ${a.text}
                    ${a.maps ? `<a class="activity-maps" href="${_esc(a.maps)}" target="_blank" rel="noopener">🗺️ Maps</a>` : ''}
                  </span>
                </div>
              `).join('')}
              ${_renderBookingActivities(day.date)}
            </div>

            ${renderTips(day.tips)}

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

/* ── PRENOTAZIONI COME ATTIVITÀ ───────────────────────────── */

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

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
