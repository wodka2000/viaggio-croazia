import { fetchTripData } from '../utils/data.js'
import { formatDateIT, daysUntil } from '../utils/data.js'
import { loadIdeas } from '../utils/ideas.js'

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
        <div class="stat-icon">💡</div>
        <div class="stat-value">${suggestionCount}</div>
        <div class="stat-label">Attività suggerite<br><span class="stat-card-cta">tocca per aprire →</span></div>
      </button>
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
              📍 ${currentDay.location} · ${formatDateIT(currentDay.date)}
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
      <a href="#natura" class="btn btn-outline">🌿 Natura &amp; Cultura</a>
      <a href="#logistics" class="btn btn-outline">📋 Note logistiche</a>
      <a href="#ideas" class="btn btn-outline">💡 Idee rapide</a>
    </div>
  `

  // Apertura popup suggerimenti del giorno
  document.getElementById('suggestions-card')?.addEventListener('click', () => {
    if (!currentDay) return
    openSuggestionsModal(currentDay, data.dining)
  })
}

/* ── SUGGERIMENTI DEL GIORNO ──────────────────────────── */

// Ristoranti la cui area combacia con la località della tappa
function diningForLocation(dining, location) {
  if (!dining || !location) return []
  const loc = location.toLowerCase()
  return dining.filter(d => loc.includes(d.area.toLowerCase()))
}

// Idee salvate (localStorage) abbinate a questo giorno
function ideasForDay(date) {
  return loadIdeas().filter(i => i.day_date === date && i.stato !== 'scartata')
}

// Numero totale di suggerimenti mostrati nel popup per la tappa
function suggestionsCount(day, dining) {
  const acts = day.activities?.length || 0
  const rest = diningForLocation(dining, day.location).length
  const ideas = ideasForDay(day.date).length
  return acts + rest + ideas
}

function openSuggestionsModal(day, dining) {
  document.getElementById('suggestions-modal')?.remove()

  const restaurants = diningForLocation(dining, day.location)
  const ideas       = ideasForDay(day.date)
  const tipsDo      = day.tips?.do || []
  const tipsEat     = day.tips?.eat || []
  const mapsSearch  = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

  const activitiesHtml = (day.activities?.length)
    ? `<div class="sugg-section">
         <div class="sugg-section-title">🎯 Programma del giorno</div>
         <div class="sugg-activities">
           ${day.activities.map(a => `
             <div class="sugg-activity">
               <span class="sugg-activity-time">${esc(a.time)}</span>
               <span>${esc(a.text)}</span>
             </div>`).join('')}
         </div>
       </div>` : ''

  const tipsHtml = (tipsDo.length)
    ? `<div class="sugg-section">
         <div class="sugg-section-title">✨ Cose da fare in zona</div>
         <ul class="sugg-tips">${tipsDo.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
       </div>` : ''

  const restaurantsHtml = (restaurants.length || tipsEat.length)
    ? `<div class="sugg-section">
         <div class="sugg-section-title">🍽️ Dove mangiare in zona</div>
         ${tipsEat.length ? `<ul class="sugg-tips">${tipsEat.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
         <div class="sugg-dining">
           ${restaurants.map(d => `
             <a class="sugg-dining-item" target="_blank" rel="noopener" href="${mapsSearch(d.name + ' ' + d.town)}">
               <div class="sugg-dining-head">
                 <span class="sugg-dining-name">${esc(d.name)}</span>
                 ${d.type ? `<span class="sugg-dining-type">${esc(d.type)}</span>` : ''}
               </div>
               <div class="sugg-dining-town">📍 ${esc(d.town)}</div>
               <div class="sugg-dining-spec">${esc(d.specialty)}</div>
             </a>`).join('')}
         </div>
       </div>` : ''

  const ideasHtml = `
    <div class="sugg-section">
      <div class="sugg-section-title">💡 Le tue idee per questo giorno</div>
      ${ideas.length
        ? `<div class="sugg-ideas">${ideas.map(i => `
            <div class="sugg-idea">
              <span class="sugg-idea-text">${esc(i.text)}</span>
              ${i.note ? `<span class="sugg-idea-note">${esc(i.note)}</span>` : ''}
              ${i.location_name ? `<span class="sugg-idea-chip">📍 ${esc(i.location_name)}</span>` : ''}
              ${i.link ? `<a href="${esc(i.link)}" target="_blank" rel="noopener" class="sugg-idea-chip">🔗 Link</a>` : ''}
            </div>`).join('')}</div>`
        : `<p class="sugg-empty">Nessuna idea abbinata a questo giorno. Aggiungine dalla pagina <a href="#ideas">💡 Idee rapide</a> (imposta il campo “Giorno”).</p>`
      }
    </div>`

  const body = activitiesHtml + tipsHtml + restaurantsHtml + ideasHtml

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
    </div>
  `
  document.body.appendChild(modal)

  const close = () => modal.remove()
  document.getElementById('sugg-close')?.addEventListener('click', close)
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
