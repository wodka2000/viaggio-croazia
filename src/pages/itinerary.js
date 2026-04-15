import { fetchTripData } from '../utils/data.js'
import { formatDate, formatDayOfWeek } from '../utils/data.js'

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
  const hotelMap = Object.fromEntries(hotels.map(h => [h.id, h]))
  // Rende `data` disponibile alla funzione renderDay tramite closure
  window.__itineraryData = data

  content.innerHTML = `
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${meta.title} · ${meta.duration_days} giorni · ${formatDate(meta.start_date)} → ${formatDate(meta.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${days.map(day => renderDay(day, hotelMap)).join('')}
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

  // Espandi tutto
  document.getElementById('expand-all')?.addEventListener('click', () => {
    document.querySelectorAll('.timeline-card-body').forEach(b => b.classList.remove('hidden'))
    document.querySelectorAll('.timeline-toggle').forEach(c => c.classList.add('open'))
  })

  // Comprimi tutto
  document.getElementById('collapse-all')?.addEventListener('click', () => {
    document.querySelectorAll('.timeline-card-body').forEach(b => b.classList.add('hidden'))
    document.querySelectorAll('.timeline-toggle').forEach(c => c.classList.remove('open'))
  })
}

function renderDay(day, hotelMap) {
  const hotel = day.hotel_ref ? hotelMap[day.hotel_ref] : null
  const today = new Date().toISOString().slice(0, 10)
  const isToday = day.date === today
  const isPast = day.date < today

  return `
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num" style="${isPast ? 'background:var(--color-text-muted)' : isToday ? 'background:var(--color-accent)' : ''}">
          ${day.day}
        </div>
        <div class="timeline-date-label">
          ${formatDayOfWeek(day.date)}<br>${day.date.slice(5).replace('-', '/')}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card ${isToday ? 'card--today' : ''}">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${day.title}${isToday ? ' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>' : ''}</h3>
              <span class="timeline-location-badge">📍 ${day.location}</span>
            </div>
            <span class="timeline-toggle">▼</span>
          </div>
          <div class="timeline-card-body hidden">
            ${day.description ? `<p class="timeline-description">${day.description}</p>` : ''}

            <div class="activities">
              ${day.activities.map(a => `
                <div class="activity-item with-dot">
                  <span class="activity-time">${a.time}</span>
                  <span>${a.text}</span>
                </div>
              `).join('')}
            </div>

            ${hotel ? `
              <div class="hotel-ref-badge">
                🏨 ${hotel.name} · Check-in ${hotel.checkin} / Check-out ${hotel.checkout}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `
}
