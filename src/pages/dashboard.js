import { fetchTripData } from '../utils/data.js'
import { formatDate, formatDateShort, daysUntil } from '../utils/data.js'

export async function renderDashboard() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = errorHtml(e.message)
    return
  }

  const { meta, days, hotels } = data
  const departure = daysUntil(meta.start_date)
  const end = daysUntil(meta.end_date)

  // Tappa "oggi" o la prossima
  const today = new Date().toISOString().slice(0, 10)
  const todayDay = days.find(d => d.date === today)
  const nextDay = days.find(d => d.date > today)
  const currentDay = todayDay || nextDay

  // Destinazioni uniche nell'ordine del viaggio
  const uniqueLocations = []
  const seen = new Set()
  for (const d of days) {
    if (!seen.has(d.location)) { seen.add(d.location); uniqueLocations.push({ location: d.location, day: d.day, date: d.date }) }
  }

  // Solo le strutture consigliate/selezionate — esclude le alternative
  const recommendedHotels = hotels.filter(h => h.recommended)
  const totalHotelNights  = recommendedHotels.reduce((s, h) => s + h.nights, 0)
  const totalCost         = recommendedHotels.filter(h => h.price_per_night > 0)
                              .reduce((s, h) => s + h.nights * h.price_per_night, 0)

  content.innerHTML = `
    <div class="dashboard-hero">
      <h1>${meta.emoji} ${meta.title}</h1>
      <p class="subtitle">${meta.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${formatDate(meta.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${formatDate(meta.end_date)}</span>
        <span class="date-badge">👥 ${meta.travelers_detail || meta.travelers + ' viaggiatori'}</span>
      </div>
    </div>

    ${countdownHtml(departure, end)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${meta.duration_days}</div>
        <div class="stat-label">Giorni totali</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📍</div>
        <div class="stat-value">${uniqueLocations.length}</div>
        <div class="stat-label">Destinazioni</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${recommendedHotels.length}</div>
        <div class="stat-label">Alloggi selezionati</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${totalHotelNights}</div>
        <div class="stat-label">Notti totali</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${uniqueLocations.map(loc => `
            <div class="route-stop">
              <span class="stop-day">Gg. ${loc.day}</span>
              <span>📍 ${loc.location}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${todayDay ? 'Programma di oggi' : nextDay ? 'Prossima tappa' : 'Ultima tappa'}</div>
        ${currentDay ? `
          <div style="margin-bottom:0.75rem;">
            <strong>${currentDay.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${currentDay.location} · ${formatDate(currentDay.date)}
            </div>
          </div>
          <div class="activity-list">
            ${currentDay.activities.slice(0, 5).map(a => `
              <div class="activity-item">
                <span class="activity-time">${a.time}</span>
                <span>${a.text}</span>
              </div>
            `).join('')}
            ${currentDay.activities.length > 5 ? `<div style="font-size:0.8rem;color:var(--color-text-muted);">+${currentDay.activities.length - 5} altre attività → <a href="#itinerary" style="color:var(--color-primary);">Vedi itinerario</a></div>` : ''}
          </div>
        ` : '<p style="color:var(--color-text-muted);font-size:0.9rem;">Nessuna tappa disponibile.</p>'}
      </div>
    </div>

    <div style="margin-top:1.25rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
      <a href="#itinerary" class="btn btn-primary">📅 Vai all'itinerario</a>
      <a href="#hotels" class="btn btn-outline">🏨 Controlla gli hotel</a>
      <a href="#checklist" class="btn btn-outline">✅ Apri la checklist</a>
      <a href="#map" class="btn btn-outline">🗺️ Visualizza la mappa</a>
      <a href="#natura" class="btn btn-outline">🌿 Natura &amp; Deviazioni</a>
      <a href="#ideas" class="btn btn-outline">💡 Idee rapide</a>
    </div>
  `
}

function countdownHtml(departure, end) {
  if (departure > 0) {
    return `
      <div class="countdown-card">
        <div class="countdown-icon">✈️</div>
        <div>
          <div class="countdown-days">${departure} giorni</div>
          <div class="countdown-text">alla partenza — il viaggio si avvicina!</div>
        </div>
      </div>
    `
  }
  if (departure <= 0 && end >= 0) {
    return `
      <div class="countdown-card departed">
        <div class="countdown-icon">🌊</div>
        <div>
          <div class="countdown-days">Sei in Croazia!</div>
          <div class="countdown-text">Buon viaggio — ${end === 0 ? 'è l\'ultimo giorno!' : `ancora ${end} giorni`}</div>
        </div>
      </div>
    `
  }
  return `
    <div class="countdown-card" style="background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border-color:#cbd5e1;">
      <div class="countdown-icon">🏠</div>
      <div>
        <div class="countdown-days" style="color:#475569;">Viaggio concluso</div>
        <div class="countdown-text" style="color:#64748b;">Speriamo sia stato meraviglioso!</div>
      </div>
    </div>
  `
}

function errorHtml(msg) {
  return `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${msg}</p>
    </div>
  `
}
