import { addIdea } from '../utils/ideas.js'

/* ── DATI STATICI ─────────────────────────────────────────
   Suggerimenti in linea con l'itinerario: spostamenti di
   massimo ~1 ora in auto o traghetto dalla base della tappa.
   Ogni voce ha tipo 'natura' o 'cultura'.                   */

const NATURA_DATA = [
  /* ──────── BRAČ ──────── */
  {
    id: 'zlatni-rat',
    nome: 'Zlatni Rat',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'spiaggia',
    categoriaLabel: '🏖️ Spiaggia',
    descrizione: 'La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete. A ~40 min da Postira.',
    bambini: true,
    bambini_nota: 'Ottimo — acque basse, spiaggia servita, pini per l\'ombra',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 43.2560, lng: 16.6372 },
  },
  {
    id: 'vidova-gora',
    nome: 'Vidova Gora',
    area: 'Brač',
    tipo: 'natura',
    categoria: 'panorama',
    categoriaLabel: '⛰️ Panorama',
    descrizione: 'Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar e il mare aperto. Si raggiunge in auto su strada asfaltata, ~45 min da Postira.',
    bambini: true,
    bambini_nota: 'In auto facilissimo; il sentiero a piedi è impegnativo',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 43.3621, lng: 16.6588 },
  },

  /* ──────── AREA ZARA ──────── */
  {
    id: 'zara-centro',
    nome: 'Zara — Centro Storico e Organo del Mare',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Città storica',
    descrizione: 'La penisola antica di Zara: Foro Romano, Cattedrale di Sant\'Anastasia, San Donato e i due gioielli sul lungomare — l\'Organo del Mare (Morske Orgulje) e il Saluto al Sole. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Piace ai bambini — l\'organo suona con le onde e il Saluto al Sole si illumina al tramonto',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.1170, lng: 15.2200 },
  },
  {
    id: 'nin',
    nome: 'Nin (Nona)',
    area: 'Area di Zara',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Borgo storico',
    descrizione: 'Piccola città-isola con la chiesa più piccola del mondo (Santa Croce), saline storiche e una laguna con spiagge sabbiose e fanghi curativi. A ~20 min da Petrčane.',
    bambini: true,
    bambini_nota: 'Adatto — spiaggia sabbiosa bassa (rara in Croazia) e visita del borgo breve',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 44.2431, lng: 15.1840 },
  },
  {
    id: 'vransko-lake',
    nome: 'Vransko Lake',
    area: 'Area di Zara',
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🦢 Lago / Ornitologia',
    descrizione: 'Il lago più grande della Croazia, riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica e ambiente tranquillo. A ~40 min da Petrčane.',
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
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏔️ Canyon / Trekking',
    descrizione: 'Canyon spettacolari ai piedi delle Alpi Dinare, con sentieri per tutti i livelli e la grotta Manita Peć. Ingresso di Starigrad a ~45 min da Petrčane.',
    bambini: false,
    bambini_nota: 'Sentieri brevi facili esistono, ma le gole principali sono impegnative con bambini piccoli',
    impegno: 'giornata-piena',
    nota_tipo: 'solo-se-c-e-tempo',
    coords: { lat: 44.3219, lng: 15.4722 },
  },

  /* ──────── VELEBIT / LIKA ──────── */
  {
    id: 'kuterevo',
    nome: 'Kuterevo Bear Sanctuary',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🐻 Rifugio animali',
    descrizione: 'Rifugio per orsi bruni orfani ai piedi del Velebit, gestito da volontari. Si visitano gli orsi nei recinti naturali con una guida. Esperienza educativa e a basso impatto.',
    bambini: true,
    bambini_nota: 'Ottimo per i bambini — orsi visibili da vicino in sicurezza, percorso breve',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.8266, lng: 15.1389 },
  },
  {
    id: 'gacka',
    nome: 'Valle della Gacka',
    area: 'Velebit / Lika',
    tipo: 'natura',
    categoria: 'fiume',
    categoriaLabel: '🌊 Fiume / Valle',
    descrizione: 'Uno dei fiumi carsici più limpidi d\'Europa, nella piana attorno a Otočac. Mulini storici, trote, prati verdi e paesaggi tranquilli. A ~20 min dall\'alloggio di Kuterevo.',
    bambini: true,
    bambini_nota: 'Adatto — passeggiate pianeggianti lungo il fiume e i mulini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 44.8686, lng: 15.2372 },
  },

  /* ──────── ISTRIA (base Rovigno) ──────── */
  {
    id: 'rovinj-centro',
    nome: 'Rovigno — Centro Storico e Sant\'Eufemia',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Città storica',
    descrizione: 'Il borgo veneziano arroccato sul mare: viuzze acciottolate, la Grisia degli artisti e la chiesa di Sant\'Eufemia con il campanile panoramico. Alla base della tappa.',
    bambini: true,
    bambini_nota: 'Bello a piedi — gelaterie sul porto e vista dall\'alto del campanile',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.0832, lng: 13.6310 },
  },
  {
    id: 'lim-fjord',
    nome: 'Lim Fjord (Limski Kanal)',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🌲 Fiordo / Paesaggio',
    descrizione: 'Canale marino di 10 km incastrato tra boschi e vigneti istriani, famoso per le ostriche. Belvedere accessibile in auto, gita in barca dal basso. A ~20 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Il belvedere è accessibile a tutti; la barca è ottima per i bambini',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.1419, lng: 13.6408 },
  },
  {
    id: 'brijuni',
    nome: 'Brijuni National Park',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🦒 Parco / Safari',
    descrizione: 'Arcipelago con safari park (zebre, elefanti), resti romani e spiagge. Accesso in traghetto da Fažana (~30 min da Rovigno + ~15 min di traghetto).',
    bambini: true,
    bambini_nota: 'Fantastico per i bambini — safari su trenino, animali esotici, mare pulito',
    impegno: 'giornata-piena',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.9167, lng: 13.7636 },
  },
  {
    id: 'aquarium-rovinj',
    nome: 'Acquario di Rovigno',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🐟 Acquario',
    descrizione: 'Piccolo acquario storico (1891) nel centro di Rovigno. Vasche con pesci, granchi e specie dell\'Adriatico. Sosta breve e riparata, perfetta nelle ore calde.',
    bambini: true,
    bambini_nota: 'Ottimo con i bambini — visita breve al chiuso, animali marini da vicino',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 45.0855, lng: 13.6395 },
  },
  {
    id: 'dinopark-funtana',
    nome: 'Dinopark Funtana',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🦕 Parco a tema',
    descrizione: 'Parco a tema sui dinosauri a Funtana, a ~20 min da Rovigno. Dinosauri a grandezza naturale nel bosco, mini-golf, area giochi e trenino.',
    bambini: true,
    bambini_nota: 'Pensato per i bambini — percorsi facili e dinosauri a grandezza naturale',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.1695, lng: 13.6076 },
  },
  {
    id: 'istralandia',
    nome: 'Aquapark Istralandia',
    area: 'Istria',
    tipo: 'natura',
    categoria: 'parco',
    categoriaLabel: '🏊 Parco acquatico',
    descrizione: 'Grande parco acquatico a Brtonigla (~45 min da Rovigno): scivoli per tutte le età, piscine, zona baby e aree relax.',
    bambini: true,
    bambini_nota: 'Molto adatto — zona baby dedicata e scivoli graduati per età',
    impegno: 'giornata-piena',
    nota_tipo: 'opzionale',
    coords: { lat: 45.3466, lng: 13.6160 },
  },
  {
    id: 'pula-arena',
    nome: 'Pola — Arena Romana',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Sito romano',
    descrizione: 'Uno degli anfiteatri romani meglio conservati al mondo, con i corridoi sotterranei visitabili. Centro di Pola tutto intorno. A ~50 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Piace ai bambini — si entra nell\'arena e nei sotterranei come i gladiatori',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 44.8732, lng: 13.8501 },
  },
  {
    id: 'porec',
    nome: 'Parenzo — Basilica Eufrasiana',
    area: 'Istria',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '⛪ Sito UNESCO',
    descrizione: 'Basilica Eufrasiana (VI sec.), patrimonio UNESCO con mosaici bizantini dorati, nel cuore di Parenzo. A ~40 min da Rovigno.',
    bambini: true,
    bambini_nota: 'Visita breve; il centro pedonale e il lungomare sono comodi con i bambini',
    impegno: 'mezza-giornata',
    nota_tipo: 'opzionale',
    coords: { lat: 45.2285, lng: 13.5936 },
  },

  /* ──────── TRIESTE ──────── */
  {
    id: 'trieste-centro',
    nome: 'Trieste — Piazza Unità d\'Italia',
    area: 'Trieste',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Città storica',
    descrizione: 'La piazza affacciata sul mare più grande d\'Europa, cuore della Trieste asburgica, tra caffè storici e palazzi liberty. Alla base della tappa.',
    bambini: true,
    bambini_nota: 'Spazi ampi e pedonali; gelato e passeggiata sul molo Audace',
    impegno: 'sosta-breve',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.6501, lng: 13.7677 },
  },
  {
    id: 'miramare',
    nome: 'Castello di Miramare',
    area: 'Trieste',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏰 Castello / Parco',
    descrizione: 'Il castello bianco di Massimiliano d\'Asburgo a picco sul golfo, con un grande parco affacciato sul mare. A ~15 min dal centro di Trieste.',
    bambini: true,
    bambini_nota: 'Ottimo — parco enorme per correre e vista mare; interni brevi',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.7025, lng: 13.7125 },
  },
  {
    id: 'grotta-gigante',
    nome: 'Grotta Gigante',
    area: 'Trieste',
    tipo: 'natura',
    categoria: 'natura',
    categoriaLabel: '🕳️ Grotta',
    descrizione: 'Enorme caverna del Carso triestino, tra le più grandi visitabili al mondo. Visita guidata con scalinata tra stalattiti e stalagmiti. A ~20 min da Trieste.',
    bambini: true,
    bambini_nota: 'Adatto ai più grandi — tante scale ma spettacolo assicurato; fresco d\'estate',
    impegno: 'sosta-breve',
    nota_tipo: 'opzionale',
    coords: { lat: 45.7099, lng: 13.7646 },
  },

  /* ──────── COLLIO / FRIULI ──────── */
  {
    id: 'aquileia',
    nome: 'Aquileia — Basilica e Area Romana',
    area: 'Collio / Friuli',
    tipo: 'cultura',
    categoria: 'citta',
    categoriaLabel: '🏛️ Sito UNESCO',
    descrizione: 'Antica città romana patrimonio UNESCO: basilica con il grande pavimento a mosaico paleocristiano, foro e scavi. A ~35 min da Capriva del Friuli.',
    bambini: true,
    bambini_nota: 'Adatto — mosaici enormi da percorrere su passerelle e aree archeologiche all\'aperto',
    impegno: 'mezza-giornata',
    nota_tipo: 'molto-consigliato',
    coords: { lat: 45.7696, lng: 13.3709 },
  },

  /* ──────── SESTO / DOLOMITI ──────── */
  {
    id: 'dobbiaco',
    nome: 'Lago di Dobbiaco',
    area: 'Sesto / Alta Pusteria',
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla pista ciclabile. Acque verdissime, Dolomiti come sfondo.',
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
    tipo: 'natura',
    categoria: 'lago',
    categoriaLabel: '🏔️ Lago alpino',
    descrizione: 'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo, barche a remi e sentiero attorno al lago (3 km). Molto affollato in agosto — meglio la mattina presto. A ~45 min da Sesto.',
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

const TIPO_LABELS = {
  'natura':  { label: '🌿 Natura',  cls: 'tipo-natura'  },
  'cultura': { label: '🏛️ Cultura', cls: 'tipo-cultura' },
}

/* ── RENDER ───────────────────────────────────────────── */

export async function renderNatura() {
  const content = document.getElementById('page-content')

  const aree = [...new Set(NATURA_DATA.map(n => n.area))]
  let _activeArea = 'tutte'
  let _activeTipo = 'tutti'

  content.innerHTML = `
    <div class="page-header">
      <h1>🌿 Natura & Cultura</h1>
      <p>Suggerimenti in linea con l'itinerario — a max ~1 ora in auto o traghetto dalla base della tappa, compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-tipo-filters" style="margin-bottom:0.5rem;">
      <button class="natura-filter-btn active" data-tipo="tutti">Tutti (${NATURA_DATA.length})</button>
      <button class="natura-filter-btn" data-tipo="natura">🌿 Natura (${NATURA_DATA.filter(n => n.tipo === 'natura').length})</button>
      <button class="natura-filter-btn" data-tipo="cultura">🏛️ Cultura (${NATURA_DATA.filter(n => n.tipo === 'cultura').length})</button>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte le tappe</button>
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

  function applyFilters() {
    const grid = document.getElementById('natura-grid')
    if (!grid) return
    const filtered = NATURA_DATA.filter(n =>
      (_activeArea === 'tutte' || n.area === _activeArea) &&
      (_activeTipo === 'tutti' || n.tipo === _activeTipo)
    )
    grid.innerHTML = filtered.length
      ? filtered.map(renderCard).join('')
      : `<p style="color:var(--color-text-muted);padding:1rem;">Nessun suggerimento per questa combinazione di filtri.</p>`
    bindCardEvents()
  }

  // Filtro per tipo (natura / cultura)
  document.getElementById('natura-tipo-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.natura-filter-btn')
    if (!btn) return
    _activeTipo = btn.dataset.tipo
    document.querySelectorAll('#natura-tipo-filters .natura-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    applyFilters()
  })

  // Filtro per area / tappa
  document.getElementById('natura-filters')?.addEventListener('click', e => {
    const btn = e.target.closest('.natura-filter-btn')
    if (!btn) return
    _activeArea = btn.dataset.area
    document.querySelectorAll('#natura-filters .natura-filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    applyFilters()
  })

  bindCardEvents()
}

function renderCard(n) {
  const imp  = IMPEGNO_LABELS[n.impegno]  || { label: n.impegno, icon: '🕐', cls: '' }
  const nota = NOTA_LABELS[n.nota_tipo]   || { label: n.nota_tipo, cls: '' }
  const tipo = TIPO_LABELS[n.tipo]        || null
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
        ${tipo ? `<span class="natura-badge ${tipo.cls}">${tipo.label}</span>` : ''}
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
