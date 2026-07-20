import { fetchTripData } from '../utils/data.js'
import { formatDateIT, daysUntil } from '../utils/data.js'
import { suggestionsCount, suggestionsSectionsHtml, bindDiningAdds } from '../utils/suggestions.js'
import { navTargetsHtml } from '../utils/navigation.js'

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
  const etichettaCorrente = todayDay ? 'Programma di oggi' : nextDay ? 'Prossima tappa' : 'Ultima tappa'

  // Destinazioni uniche nell'ordine del viaggio
  const uniqueLocations = []
  const seen = new Set()
  for (const d of days) {
    if (!seen.has(d.location)) { seen.add(d.location); uniqueLocations.push({ location: d.location, day: d.day, date: d.date }) }
  }

  // Solo le prenotazioni confermate (prima di Sesto) — esclude alternative e Sesto (da confermare)
  const confirmedHotels = hotels.filter(h => h.status === 'confermata')
  const bookedStructures = confirmedHotels.length
  const bookedNights     = confirmedHotels.reduce((s, h) => s + h.nights, 0)

  // Suggerimenti per la tappa corrente: attività del giorno + ristoranti in zona + idee abbinate
  const suggestionCount = currentDay ? suggestionsCount(currentDay, data.dining) : 0

  content.innerHTML = `
    <div class="dashboard-hero">
      <h1>${meta.emoji} ${meta.title}</h1>
      <p class="subtitle">${meta.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${formatDateIT(meta.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">🏔️ ${formatDateIT(meta.end_date)}</span>
        <span class="date-badge">👥 ${meta.travelers_detail || meta.travelers + ' viaggiatori'}</span>
      </div>
    </div>

    ${countdownHtml(departure, end)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${meta.duration_days}</div>
        <div class="stat-label">Giorni (${formatDateIT(meta.start_date)}–${formatDateIT(meta.end_date)})</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${bookedStructures}</div>
        <div class="stat-label">Strutture confermate</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${bookedNights}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
      <button type="button" class="stat-card stat-card--action" id="suggestions-card"
        title="Vedi i suggerimenti per ${currentDay ? currentDay.location : 'la tappa'}">
        <div class="stat-icon">🎯</div>
        <div class="stat-value">${suggestionCount}</div>
        <div class="stat-label">Attività suggerite<br><span class="stat-card-cta">tocca per aprire →</span></div>
      </button>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops" id="route-stops">
          ${uniqueLocations.map(loc => `
            <button type="button" class="route-stop route-stop--link ${currentDay && loc.date === currentDay.date ? 'route-stop--attiva' : ''}"
               data-date="${loc.date}"
               title="Vedi l'anteprima di ${loc.location} qui accanto">
              <span class="stop-day">Gg. ${loc.day}</span>
              <span>📍 ${loc.location}</span>
              <span class="route-stop-arrow">→</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="card card-body today-card" id="today-card">
        ${dayPreviewHtml(currentDay, data, currentDay, etichettaCorrente)}
      </div>
    </div>

    <div style="margin-top:1.25rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
      <a href="#itinerary" class="btn btn-primary">📅 Vai all'itinerario</a>
      <a href="#hotels" class="btn btn-outline">🏨 Controlla gli hotel</a>
      <a href="#checklist" class="btn btn-outline">✅ Apri la checklist</a>
      <a href="#map" class="btn btn-outline">🗺️ Visualizza la mappa</a>
      <a href="#natura" class="btn btn-outline">🌿 Natura &amp; Cultura</a>
      <a href="#logistics" class="btn btn-outline">📋 Note logistiche</a>
      <a href="#logistics" class="btn btn-outline">🎫 Biglietti traghetti</a>
      <a href="#ideas" class="btn btn-outline">💡 Idee rapide</a>
    </div>
  `

  // Anteprima di una tappa nella scheda accanto, senza lasciare la dashboard:
  // la rotta serve a dare un'occhiata, non a spostarsi.
  document.getElementById('route-stops')?.addEventListener('click', e => {
    const btn = e.target.closest('.route-stop')
    if (!btn) return
    const day = days.find(d => d.date === btn.dataset.date)
    if (!day) return

    const card = document.getElementById('today-card')
    if (card) card.innerHTML = dayPreviewHtml(day, data, currentDay, etichettaCorrente)

    document.querySelectorAll('#route-stops .route-stop')
      .forEach(b => b.classList.toggle('route-stop--attiva', b === btn))
  })

  // "Torna a oggi": ripristina la tappa corrente. Delegato sulla scheda perche'
  // il pulsante nasce e muore con l'anteprima.
  document.getElementById('today-card')?.addEventListener('click', e => {
    if (!e.target.closest('#preview-reset')) return
    const card = document.getElementById('today-card')
    if (card) card.innerHTML = dayPreviewHtml(currentDay, data, currentDay, etichettaCorrente)
    document.querySelectorAll('#route-stops .route-stop').forEach(b =>
      b.classList.toggle('route-stop--attiva', !!currentDay && b.dataset.date === currentDay.date))
  })

  // Apertura popup suggerimenti del giorno
  document.getElementById('suggestions-card')?.addEventListener('click', () => {
    if (!currentDay) return
    openSuggestionsModal(currentDay, data.dining, data.hikes)
  })
}

/* ── ANTEPRIMA DI UNA TAPPA ───────────────────────────── */

// Contenuto della scheda a destra della rotta. Stessa forma sia per la tappa
// corrente sia per quelle sfogliate dalla rotta: cambia solo l'intestazione,
// che deve dire chiaramente se si sta guardando altro rispetto a oggi.
function dayPreviewHtml(day, data, currentDay, etichettaCorrente) {
  if (!day) {
    return `<div class="section-title">${etichettaCorrente}</div>
      <p style="color:var(--color-text-muted);font-size:0.9rem;">Nessuna tappa disponibile.</p>`
  }

  const eCorrente = !!currentDay && day.date === currentDay.date
  const titolo = eCorrente
    ? etichettaCorrente
    : `Anteprima — Gg. ${day.day}`

  const attivita = day.activities || []

  return `
    <div class="section-title">
      ${titolo}
      ${eCorrente ? '' : `<button type="button" class="preview-reset" id="preview-reset"
         title="Torna alla tappa corrente">↩ ${etichettaCorrente}</button>`}
    </div>
    <div style="margin-bottom:0.75rem;">
      <strong>${esc(day.title)}</strong>
      <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
        📍 ${esc(day.location)} · ${formatDateIT(day.date)}
      </div>
    </div>
    <div class="activity-list">
      ${attivita.slice(0, 5).map(a => `
        <div class="activity-item">
          <span class="activity-time">${esc(a.time)}</span>
          <span>${esc(a.text)}</span>
        </div>
      `).join('')}
      ${attivita.length > 5
        ? `<div style="font-size:0.8rem;color:var(--color-text-muted);">+${attivita.length - 5} altre attività → <a href="#itinerary/${day.date}" style="color:var(--color-primary);">Vedi itinerario</a></div>`
        : ''}
      ${attivita.length === 0
        ? '<div style="font-size:0.85rem;color:var(--color-text-muted);">Nessuna attività in programma.</div>'
        : ''}
    </div>
    ${navTargetsHtml(day, data)}
  `
}

/* ── SUGGERIMENTI DEL GIORNO ──────────────────────────── */

function openSuggestionsModal(day, dining, hikes) {
  document.getElementById('suggestions-modal')?.remove()

  const body = suggestionsSectionsHtml(day, dining, hikes)

  const modal = document.createElement('div')
  modal.id = 'suggestions-modal'
  modal.className = 'day-link-modal-overlay'
  modal.innerHTML = `
    <div class="day-link-modal suggestions-modal">
      <button type="button" class="sugg-close" id="sugg-close" aria-label="Chiudi">✕</button>
      <div class="sugg-header">
        <div class="sugg-title">💡 Suggerimenti — Gg. ${day.day}</div>
        <div class="sugg-subtitle">📍 ${esc(day.location)} · ${formatDateIT(day.date)}</div>
      </div>
      <div class="sugg-body">${body}</div>
      <a href="#attivita" class="sugg-all-link" id="sugg-all-link">📋 Vedi i suggerimenti di tutte le tappe →</a>
    </div>
  `
  document.body.appendChild(modal)
  bindDiningAdds(modal.querySelector('.sugg-body'))

  const close = () => modal.remove()
  document.getElementById('sugg-close')?.addEventListener('click', close)
  document.getElementById('sugg-all-link')?.addEventListener('click', close)
  modal.addEventListener('click', e => { if (e.target === modal) close() })
}

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
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
