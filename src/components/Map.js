import { fetchTripData } from '../utils/data.js'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

let mapInstance = null
let markersHotels = []
let markersRoute = []
let routePolyline = null

export async function renderMap() {
  const content = document.getElementById('page-content')

  content.innerHTML = `
    <div class="page-header">
      <h1>🗺️ Mappa del Viaggio</h1>
      <p>Percorso completo e posizione degli alloggi</p>
    </div>
    <div class="map-container" id="map-outer">
      <div class="map-controls" id="map-controls">
        <button class="map-btn active" data-layer="all">Tutto</button>
        <button class="map-btn" data-layer="route">Solo Tappe</button>
        <button class="map-btn" data-layer="hotels">Solo Hotel</button>
      </div>
      <div id="google-map"></div>
      <div class="map-legend" id="map-legend"></div>
    </div>
  `

  const data = await fetchTripData()

  if (!API_KEY) {
    renderNoKeyFallback(content, data)
    return
  }

  await loadGoogleMapsScript(API_KEY)
  initMap(data)
  initLayerControls(data)
  renderLegend()
}

function renderNoKeyFallback(content, data) {
  const outer = document.getElementById('map-outer')
  outer.innerHTML = `
    <div class="map-no-key">
      <div class="map-no-key-icon">🗺️</div>
      <h3>API Key Google Maps non configurata</h3>
      <p>
        Per visualizzare la mappa interattiva crea il file
        <code>.env.local</code> nella radice del progetto con:<br><br>
        <code>VITE_GOOGLE_MAPS_API_KEY=LA_TUA_API_KEY</code><br><br>
        Poi riavvia il server di sviluppo con <code>npm run dev</code>.
        Consulta <code>src/config.template.js</code> per le istruzioni dettagliate.
      </p>
      <div style="margin-top:1rem;">
        <strong>Tappe del viaggio:</strong>
        <ul style="margin-top:0.5rem; text-align:left; color:var(--color-text-muted); font-size:0.88rem; line-height:2;">
          ${[...new Set(data.days.map(d => d.location))].map(loc => `<li>📍 ${loc}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }

    const callbackName = '__gmapsReady_' + Date.now()
    window[callbackName] = () => { delete window[callbackName]; resolve() }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}&loading=async`
    script.async = true
    script.onerror = () => reject(new Error('Impossibile caricare Google Maps'))
    document.head.appendChild(script)
  })
}

function initMap(data) {
  const mapEl = document.getElementById('google-map')
  if (!mapEl) return

  // Centro approssimativo della Croazia
  const center = { lat: 43.8, lng: 16.5 }

  mapInstance = new google.maps.Map(mapEl, {
    center,
    zoom: 7,
    mapTypeId: 'roadmap',
    styles: [
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2daf5' }] },
      { featureType: 'landscape', stylers: [{ color: '#f5f5f0' }] },
    ],
  })

  addRouteMarkers(data)
  addHotelMarkers(data)
  drawRoutePolyline(data)
  fitBounds(data)
}

function addRouteMarkers(data) {
  markersRoute = []

  const locations = data.days.filter(d => d.coordinates)
  const unique = []
  const seen = new Set()
  for (const d of locations) {
    const key = `${d.coordinates.lat},${d.coordinates.lng}`
    if (!seen.has(key)) { seen.add(key); unique.push(d) }
  }

  unique.forEach((day, i) => {
    const marker = new google.maps.Marker({
      position: day.coordinates,
      map: mapInstance,
      title: day.location,
      label: {
        text: String(day.day),
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '11px',
      },
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

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif; max-width:220px;">
          <strong style="color:#1e40af;">Giorno ${day.day} — ${day.location}</strong>
          <div style="font-size:12px; color:#64748b; margin-top:2px;">${day.date}</div>
          <div style="margin-top:6px; font-size:13px;">${day.title}</div>
        </div>
      `,
    })

    marker.addListener('click', () => infoWindow.open(mapInstance, marker))
    markersRoute.push(marker)
  })
}

function addHotelMarkers(data) {
  markersHotels = []

  data.hotels.forEach(hotel => {
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

    const nights = hotel.nights
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif; max-width:240px;">
          <strong style="color:#065f46;">🏨 ${hotel.name}</strong>
          <div style="font-size:12px; color:#64748b; margin-top:2px;">📍 ${hotel.address}</div>
          <div style="margin-top:6px; font-size:12px;">
            Check-in: <strong>${hotel.checkin}</strong><br>
            Check-out: <strong>${hotel.checkout}</strong><br>
            ${nights} nott${nights === 1 ? 'e' : 'i'} · €${hotel.price_per_night}/notte
          </div>
          ${hotel.notes ? `<div style="margin-top:6px;font-size:11px;color:#64748b;font-style:italic;">${hotel.notes}</div>` : ''}
        </div>
      `,
    })

    marker.addListener('click', () => infoWindow.open(mapInstance, marker))
    markersHotels.push(marker)
  })
}

function drawRoutePolyline(data) {
  const path = data.days
    .filter(d => d.coordinates)
    .map(d => d.coordinates)

  routePolyline = new google.maps.Polyline({
    path,
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
  data.hotels.forEach(h => bounds.extend(h.coordinates))
  mapInstance.fitBounds(bounds, 60)
}

function initLayerControls(data) {
  document.getElementById('map-controls')?.addEventListener('click', e => {
    const btn = e.target.closest('.map-btn')
    if (!btn) return

    document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const layer = btn.dataset.layer

    markersRoute.forEach(m => m.setVisible(layer !== 'hotels'))
    markersHotels.forEach(m => m.setVisible(layer !== 'route'))
    routePolyline?.setVisible(layer !== 'hotels')
  })
}

function renderLegend() {
  const legend = document.getElementById('map-legend')
  if (!legend) return
  legend.innerHTML = `
    <div class="legend-item">
      <div class="legend-dot" style="background:#1e40af;"></div>
      <span>Tappa giornaliera</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#059669;"></div>
      <span>Hotel</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#3b82f6; width:20px; height:6px; border-radius:3px; border:none; box-shadow:none;"></div>
      <span>Percorso</span>
    </div>
  `
}
