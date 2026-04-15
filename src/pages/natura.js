import { addIdea } from '../utils/ideas.js'

/* ── DATI STATICI ─────────────────────────────────────── */

const NATURA_DATA = [
  /* ──────── BRAČ ──────── */
  {
    id: 'zlatni-rat',
    nome: 'Zlatni Rat',
    area: 'Brač',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia',
    descrizione: 'La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete.',
    bambini: true,
    bambini_nota: 'Ottimo — acque basse, spiaggia servita, pini per l\'ombra',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3246, lng: 16.6372 },
  },
  {
    id: 'vidova-gora',
    nome: 'Vidova Gora',
    area: 'Brač',
    categoria: 'panorama',
    categoriaLabel: '⛰️ Panorama',
    descrizione: 'Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar, il canale e il mare aperto. Si raggiunge in auto su strada asfaltata.',
    bambini: true,
    bambini_nota: 'In auto facilissimo; il sentiero a piedi è impegnativo',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.3621, lng: 16.6588 },
  },

  /* ──────── AREA ZARA ──────── */
  {
    id: 'telascica',
    nome: 'Telašćica Nature Park',
    area: 'Area di Zara',
    categoria: 'parco',
    categoriaLabel: '🌿 Parco naturale',
    descrizione: 'Baia naturale nell\'isola di Dugi Otok: scogliere alte 200 m, acqua smeraldo, e il Lago Mir (salato con effetti benefici). Accesso in barca da Zadar o Biograd.',
    bambini: true,
    bambini_nota: 'Bello per tutta la famiglia — solo in barca, fare il bagno nel lago è esperienza unica',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.9044, lng: 15.1533 },
  },
  {
    id: 'vransko-lake',
    nome: 'Vransko Lake',
    area: 'Area di Zara',
    categoria: 'lago',
    categoriaLabel: '🦢 Lago / Ornitologia',
    descrizione: 'Il lago più grande della Croazia (30 km²), riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica, kayak, ambiente tranquillo.',
    bambini: true,
    bambini_nota: 'Adatto — pista ciclabile e percorsi piani ideali con i bambini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 43.8856, lng: 15.5475 },
  },
  {
    id: 'paklenica',
    nome: 'Paklenica National Park',
    area: 'Area di Zara',
    categoria: 'parco',
    categoriaLabel: '🏔️ Canyon / Trekking',
    descrizione: 'Canyon spettacolari ai piedi delle Alpi Dinare. Due gole (Velika e Mala Paklenica) con sentieri per tutti i livelli, pareti d\'arrampicata e la grotta Manita Peć.',
    bambini: false,
    bambini_nota: 'Sentieri brevi e facili esistono, ma le gole principali sono impegnative per bambini piccoli',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.3219, lng: 15.4722 },
  },
  {
    id: 'zrmanja',
    nome: 'Canyon Zrmanja',
    area: 'Area di Zara',
    categoria: 'fiume',
    categoriaLabel: '🌊 Fiume / Rafting',
    descrizione: 'Uno dei fiumi più belli della Dalmazia: acque turchesi carsiche, cascate di travertino e canyon selvaggi. Kayak e rafting disponibili da operatori locali.',
    bambini: false,
    bambini_nota: 'Rafting non adatto ai bambini piccoli; belvedere sul canyon accessibile a tutti',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 44.1867, lng: 15.8753 },
  },

  /* ──────── ISTRIA ──────── */
  {
    id: 'brijuni',
    nome: 'Brijuni National Park',
    area: 'Istria',
    categoria: 'parco',
    categoriaLabel: '🦒 Parco / Safari',
    descrizione: 'Arcipelago di 14 isole con safari park (zebre, elefanti), resti romani e spiagge meravigliose. Accesso solo in traghetto da Fažana (vicino Pola). Era la residenza di Tito.',
    bambini: true,
    bambini_nota: 'Fantastico per i bambini — safari su trenino, animali esotici, mare pulito',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.9167, lng: 13.7636 },
  },
  {
    id: 'lim-fjord',
    nome: 'Lim Fjord (Limski Kanal)',
    area: 'Istria',
    categoria: 'natura',
    categoriaLabel: '🌲 Fiordo / Paesaggio',
    descrizione: 'Canale marino di 10 km incastrato tra boschi e vigneti istriani. Famoso per le ostriche allevate in acqua. Belvedere dall\'alto accessibile in auto, gita in barca dal basso.',
    bambini: true,
    bambini_nota: 'Il belvedere è accessibile a tutti; la barca è ottima per i bambini',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1419, lng: 13.6408 },
  },

  /* ──────── SESTO / DOLOMITI ──────── */
  {
    id: 'dobbiaco',
    nome: 'Lago di Dobbiaco',
    area: 'Sesto / Alta Pusteria',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla famosa pista ciclabile. Acque verdissime, Dolomiti come sfondo.',
    bambini: true,
    bambini_nota: 'Perfetto — pista ciclabile pianeggiante, riva accessibile, area pic-nic',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 46.7358, lng: 12.2214 },
  },
  {
    id: 'braies',
    nome: 'Lago di Braies',
    area: 'Sesto / Alta Pusteria',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo ai piedi delle Dolomiti di Sesto. Barche a remi, sentiero attorno al lago (3 km). Molto frequentato in agosto — meglio la mattina presto.',
    bambini: true,
    bambini_nota: 'Adatto — sentiero pianeggiante attorno al lago, barche a noleggio',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 46.6948, lng: 12.0853 },
  },
]

const IMPEGNO_LABELS = {
  'sosta-breve':   { label: 'Sosta breve',   icon: '⚡', cls: 'impegno-breve' },
  'mezza-giornata':{ label: 'Mezza giornata', icon: '🕐', cls: 'impegno-mezza' },
  'giornata-piena':{ label: 'Giornata piena', icon: '📅', cls: 'impegno-piena' },
}

const NOTA_LABELS = {
  'molto-consigliato':  { label: '⭐ Molto consigliato', cls: 'nota-top' },
  'opzionale':          { label: '✔ Opzionale',          cls: 'nota-ok' },
  'solo-se-c-e-tempo':  { label: '⏱ Solo se c\'è tempo',  cls: 'nota-ifpos' },
}

/* ── RENDER ───────────────────────────────────────────── */

export async function renderNatura() {
  const content = document.getElementById('page-content')

  const aree = [...new Set(NATURA_DATA.map(n => n.area))]
  let _activeFilter = 'tutte'

  content.innerHTML = `
    <div class="page-header">
      <h1>🌿 Natura & Deviazioni</h1>
      <p>Attrazioni naturalistiche lungo il percorso — compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte (${NATURA_DATA.length})</button>
      ${aree.map(a => `
        <button class="natura-filter-btn" data-area="${a}">
          ${a} (${NATURA_DATA.filter(n => n.area === a).length})
        </button>
      `).join('')}
    </div>

    <div class="natura-grid" id="natura-grid">
      ${NATURA_DATA.map(renderCard).join('')}
    </div>
  `

  // Filtri
  document.getElementById('natura-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.natura-filter-btn')
    if (!btn) return
    _activeFilter = btn.dataset.area
    document.querySelectorAll('.natura-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    const grid = document.getElementById('natura-grid')
    if (grid) {
      const filtered = _activeFilter === 'tutte'
        ? NATURA_DATA
        : NATURA_DATA.filter(n => n.area === _activeFilter)
      grid.innerHTML = filtered.map(renderCard).join('')
      bindCardEvents()
    }
  })

  bindCardEvents()
}

function renderCard(n) {
  const imp  = IMPEGNO_LABELS[n.impegno]  || { label: n.impegno, icon: '🕐', cls: '' }
  const nota = NOTA_LABELS[n.nota_tipo]   || { label: n.nota_tipo, cls: '' }
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.nome + ' ' + n.area)}`

  return `
    <div class="natura-card ${nota.cls}" data-id="${n.id}">
      <div class="natura-card-top">
        <div>
          <div class="natura-nome">${n.nome}</div>
          <div class="natura-area">📍 ${n.area}</div>
        </div>
        <span class="natura-nota-badge ${nota.cls}">${nota.label}</span>
      </div>

      <div class="natura-badges">
        <span class="natura-badge natura-cat">${n.categoriaLabel}</span>
        <span class="natura-badge ${imp.cls}">${imp.icon} ${imp.label}</span>
        <span class="natura-badge ${n.bambini ? 'natura-kid-ok' : 'natura-kid-no'}">
          ${n.bambini ? '👶 Kids ✓' : '👶 Kids ≠'}
        </span>
      </div>

      <p class="natura-desc">${n.descrizione}</p>

      ${n.bambini_nota ? `
        <div class="natura-kids-note">
          <span style="font-size:0.9rem;">👶</span>
          <span>${n.bambini_nota}</span>
        </div>
      ` : ''}

      <div class="natura-actions">
        <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🗺️ Apri in Google Maps
        </a>
        <button class="btn btn-outline natura-add-idea-btn"
          data-nome="${_esc(n.nome)}"
          data-area="${_esc(n.area)}"
          data-lat="${n.coords.lat}"
          data-lng="${n.coords.lng}">
          💡 Aggiungi alle Idee
        </button>
      </div>
    </div>
  `
}

function bindCardEvents() {
  document.querySelectorAll('.natura-add-idea-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nome  = btn.dataset.nome
      const area  = btn.dataset.area
      const lat   = parseFloat(btn.dataset.lat)
      const lng   = parseFloat(btn.dataset.lng)
      addIdea({
        text: nome,
        location_name: area,
        categoria: 'escursione',
        stato: 'da-verificare',
        add_to_map: true,
        coordinates: { lat, lng },
        marker_color: '#10b981',
      })
      btn.textContent = '✅ Aggiunta!'
      btn.disabled = true
      setTimeout(() => { btn.textContent = '💡 Aggiungi alle Idee'; btn.disabled = false }, 2000)
    })
  })
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
