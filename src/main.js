import './styles.css'
import { initNav } from './components/Nav.js'
import { renderDashboard } from './pages/dashboard.js'
import { renderItinerary } from './pages/itinerary.js'
import { renderHotels }    from './pages/hotels.js'
import { renderChecklist } from './pages/checklist.js'
import { renderMap }       from './components/Map.js'
import { renderIdeas }     from './pages/ideas.js'
import { renderNatura }    from './pages/natura.js'
import { renderLogistics } from './pages/logistics.js'
import { renderAttivita }  from './pages/attivita.js'
import { renderPasseggiate } from './pages/passeggiate.js'

const routes = {
  '#dashboard': renderDashboard,
  '#itinerary': renderItinerary,
  '#attivita':  renderAttivita,
  '#passeggiate': renderPasseggiate,
  '#hotels':    renderHotels,
  '#checklist': renderChecklist,
  '#map':       renderMap,
  '#ideas':     renderIdeas,
  '#natura':    renderNatura,
  '#logistics': renderLogistics,
}

async function router() {
  // Cleanup listener della pagina precedente (evita memory leak)
  if (typeof window.__currentPageCleanup === 'function') {
    window.__currentPageCleanup()
    window.__currentPageCleanup = null
  }

  // Le rotte possono portare un parametro dopo la barra (#itinerary/2026-08-08):
  // serve ad aprire una pagina su un elemento preciso invece che dall'inizio.
  const [hash, param] = (window.location.hash || '#dashboard').split('/')
  const render = routes[hash] ?? routes['#dashboard']

  const content = document.getElementById('page-content')
  content.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `

  try {
    await render(param)
  } catch (err) {
    console.error('[router]', err)
    content.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${err.message || 'Errore sconosciuto'}</p>
      </div>
    `
  }
}

initNav()
window.addEventListener('hashchange', router)
router()
