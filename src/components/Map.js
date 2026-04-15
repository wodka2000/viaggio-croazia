import { fetchTripData } from '../utils/data.js'
import { getMapIdeas } from '../utils/ideas.js'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

let mapInstance    = null
let markersHotels  = []
let markersRoute   = []
let markersIdeas   = []
let routePolyline  = null
let _tripData      = null

export async function renderMap() {
  const content = document.getElementById('page-content')

  content.innerHTML = `
    <div class="page-header">
      <h1>🗺️ Mappa del Viaggio</h1>
      <p>Percorso completo, alloggi e idee geo-localizzate</p>
    </div>
    <div class="map-container" id="map-outer">
      <div class="map-controls" id="map-controls">
        <button class="map-btn active" data-layer="all">Tutto</button>
        <button class="map-btn" data-layer="route">Solo Tappe</button>
        <button class="map-btn" data-layer="hotels">Solo Hotel</button>
        <button class="map-btn" data-layer="ideas">💡 Idee</button>
      </div>
      <div id="google-map"></div>
      <div class="map-legend" id="map-legend"></div>
    </div>
  `

  _tripData = await fetchTripData()

  if (!API_KEY) {
    renderNoKeyFallback(content, _tripData)
    return
  }

  await loadGoogleMapsScript(API_KEY)
  initMap(_tripData)
  initLayerControls()
  renderLegend()

  // Sync live: quando le idee cambiano, aggiorna i marker
  const handler = () => {
    if (!mapInstance) return
    // Rimuovi vecchi marker idee
    markersIdeas.forEach(m => m.setMap(null))
    markersIdeas = []
    addIdeaMarkers()
    renderLegend()
    // Aggiorna pulsante idee nel controllo
    const ideaBtn = document.querySelector('.map-btn[data-layer="ideas"]')
    if (ideaBtn) {
      const n = getMapIdeas().length
      ideaBtn.textContent = `💡 Idee${n > 0 ? ` (${n})` : ''}`
    }
  }
  window.addEventListener('ideas:updated', handler)
  window.__currentPageCleanup = () => window.removeEventListener('ideas:updated', handler)
}

/* ── NO API KEY ───────────────────────────────────────────── */

function renderNoKeyFallback(content, data) {
  document.getElementById('map-outer').innerHTML = `
    <div class="map-no-key">
      <div class="map-no-key-icon">🗺️</div>
      <h3>API Key Google Maps non configurata</h3>
      <p>
        Crea il file <code>.env.local</code> con:<br><br>
        <code>VITE_GOOGLE_MAPS_API_KEY=LA_TUA_API_KEY</code><br><br>
        Poi riavvia con <code>npm run dev</code>.
        Vedi <code>src/config.template.js</code> per le istruzioni.
      </p>
      <div style="margin-top:1rem;text-align:left;">
        <strong>Tappe del viaggio:</strong>
        <ul style="margin-top:0.5rem;color:var(--color-text-muted);font-size:0.88rem;line-height:2;">
          ${[...new Set(data.days.map(d => d.location))].map(l => `<li>📍 ${l}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}

/* ── GOOGLE MAPS INIT ─────────────────────────────────────── */

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }
    const cb = '__gmapsReady_' + Date.now()
    window[cb] = () => { delete window[cb]; resolve() }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${cb}&loading=async`
    script.async = true
    script.onerror = () => reject(new Error('Impossibile caricare Google Maps'))
    document.head.appendChild(script)
  })
}

function initMap(data) {
  const mapEl = document.getElementById('google-map')
  if (!mapEl) return

  mapInstance = new google.maps.Map(mapEl, {
    center: { lat: 44.0, lng: 15.5 },
    zoom: 7,
    mapTypeId: 'roadmap',
    styles: [
      { featureType: 'water',     elementType: 'geometry', stylers: [{ color: '#a2daf5' }] },
      { featureType: 'landscape', stylers: [{ color: '#f5f5f0' }] },
    ],
  })

  addRouteMarkers(data)
  addHotelMarkers(data)
  drawRoutePolyline(data)
  addIdeaMarkers()
  fitBounds(data)
}

/* ── MARKERS ──────────────────────────────────────────────── */

function addRouteMarkers(data) {
  markersRoute = []
  // Raggruppa i giorni per coordinate esatte (stessa posizione = stesso punto)
  const groups = new Map()
  data.days.filter(d => d.coordinates).forEach(day => {
    const key = `${day.coordinates.lat},${day.coordinates.lng}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(day)
  })

  groups.forEach(days => {
    const first = days[0]
    const last  = days[days.length - 1]
    const heading = days.length > 1
      ? `Giorni ${first.day}–${last.day} — ${first.location}`
      : `Giorno ${first.day} — ${first.location}`

    const marker = new google.maps.Marker({
      position: first.coordinates,
      map: mapInstance,
      title: first.location,
      label: { text: String(first.day), color: '#fff', fontWeight: 'bold', fontSize: '11px' },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 16,
        fillColor: '#1e40af',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 10,
    })

    const dayRows = days.map(d =>
      `<div style="margin-top:5px;font-size:12px;border-top:1px solid #e2e8f0;padding-top:4px;">
        <span style="color:#1e40af;font-weight:700;">Gg. ${d.day}</span>
        <span style="color:#64748b;"> · ${d.date}</span><br>
        <span>${d.title}</span>
      </div>`
    ).join('')

    const iw = new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#1e40af;">${heading}</strong>
          ${dayRows}
        </div>`,
    })
    marker.addListener('click', () => iw.open(mapInstance, marker))
    markersRoute.push(marker)
  })
}

function addHotelMarkers(data) {
  markersHotels = []
  data.hotels.filter(h => h.recommended).forEach(hotel => {
    const marker = new google.maps.Marker({
      position: hotel.coordinates,
      map: mapInstance,
      title: hotel.name,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 7,
        fillColor: '#059669',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 1.5,
      },
      zIndex: 5,
    })
    const iw = new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#065f46;">🏨 ${hotel.name}</strong>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${hotel.address}</div>
          <div style="margin-top:6px;font-size:12px;">
            ${hotel.checkin} → ${hotel.checkout} · ${hotel.nights} notti
          </div>
          ${hotel.notes ? `<div style="margin-top:6px;font-size:11px;color:#64748b;font-style:italic;">${hotel.notes}</div>` : ''}
        </div>`,
    })
    marker.addListener('click', () => iw.open(mapInstance, marker))
    markersHotels.push(marker)
  })
}

function addIdeaMarkers() {
  markersIdeas = []
  getMapIdeas().forEach(idea => {
    const marker = new google.maps.Marker({
      position: idea.coordinates,
      map: mapInstance,
      title: idea.text,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: idea.marker_color || '#f59e0b',
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      zIndex: 15,
    })

    const iw = new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif;max-width:220px;">
          <strong style="color:#92400e;">💡 ${idea.text}</strong>
          ${idea.note ? `<div style="font-size:12px;color:#64748b;margin-top:4px;">${idea.note}</div>` : ''}
          ${idea.location_name ? `<div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${idea.location_name}</div>` : ''}
          ${idea.add_to_checklist ? `<div style="margin-top:4px;font-size:11px;">📋 In checklist</div>` : ''}
        </div>`,
    })
    marker.addListener('click', () => iw.open(mapInstance, marker))
    markersIdeas.push(marker)
  })
}

function drawRoutePolyline(data) {
  routePolyline = new google.maps.Polyline({
    path: data.days.filter(d => d.coordinates).map(d => d.coordinates),
    geodesic: true,
    strokeColor: '#3b82f6',
    strokeOpacity: 0.7,
    strokeWeight: 3,
    icons: [{
      icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3 },
      repeat: '120px',
    }],
    map: mapInstance,
  })
}

function fitBounds(data) {
  const bounds = new google.maps.LatLngBounds()
  data.days.filter(d => d.coordinates).forEach(d => bounds.extend(d.coordinates))
  data.hotels.filter(h => h.recommended).forEach(h => bounds.extend(h.coordinates))
  mapInstance.fitBounds(bounds, 60)
}

/* ── LAYER CONTROLS ───────────────────────────────────────── */

function initLayerControls() {
  // Aggiorna badge idee nel pulsante
  const n = getMapIdeas().length
  const ideaBtn = document.querySelector('.map-btn[data-layer="ideas"]')
  if (ideaBtn && n > 0) ideaBtn.textContent = `💡 Idee (${n})`

  document.getElementById('map-controls')?.addEventListener('click', e => {
    const btn = e.target.closest('.map-btn')
    if (!btn) return
    document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const layer = btn.dataset.layer

    markersRoute.forEach(m  => m.setVisible(layer === 'all' || layer === 'route'))
    markersHotels.forEach(m => m.setVisible(layer === 'all' || layer === 'hotels'))
    markersIdeas.forEach(m  => m.setVisible(layer === 'all' || layer === 'ideas'))
    routePolyline?.setVisible(layer === 'all' || layer === 'route')
  })
}

/* ── LEGEND ───────────────────────────────────────────────── */

function renderLegend() {
  const legend = document.getElementById('map-legend')
  if (!legend) return
  const ideaCount = getMapIdeas().length
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-dot" style="background:#1e40af;"></div>
      <span>Tappa giornaliera</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#059669;"></div>
      <span>Hotel (consigliato)</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#3b82f6;width:20px;height:6px;border-radius:3px;border:none;box-shadow:none;"></div>
      <span>Percorso</span>
    </div>
    ${ideaCount > 0 ? `
    <div class="legend-item">
      <div class="legend-dot" style="background:#f59e0b;"></div>
      <span>Idee (${ideaCount})</span>
    </div>` : ''}
  `
}
