import './styles.css'
import { initNav } from './components/Nav.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderItinerary } from './pages/itinerary.js'
import { renderHotels } from './pages/hotels.js'
import { renderChecklist } from './pages/checklist.js'
import { renderMap } from './components/Map.js'

const routes = {
  '#dashboard': renderDashboard,
  '#itinerary': renderItinerary,
  '#hotels':    renderHotels,
  '#checklist': renderChecklist,
  '#map':       renderMap,
}

async function router() {
  const hash = window.location.hash || '#dashboard'
  const render = routes[hash] ?? routes['#dashboard']

  const content = document.getElementById('page-content')
  content.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `

  try {
    await render()
  } catch (err) {
    console.error('[router] Errore nel rendering della pagina:', err)
    content.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${err.message || 'Errore sconosciuto'}</p>
      </div>
    `
  }
}

// Init
initNav()
window.addEventListener('hashchange', router)
router()
