import { navUrl, navUrlCoords } from './data.js'
import { diningForLocation, ideasForDay } from './suggestions.js'

/* Destinazioni navigabili di una tappa.
 *
 * L'app serve anche da navigatore: per ogni giorno raccoglie i posti dove si
 * deve davvero andare e ne fa dei link "portami li". La partenza e sempre la
 * posizione attuale, quindi non va calcolata: la mette Google Maps.
 *
 * Non tutte le voci di un giorno sono una destinazione. "Mare e calette" o
 * "Colazione con calma" non lo sono; il porto dove parte il traghetto, l'hotel
 * dove si fa il check-in e il ristorante prenotato si.
 */

// "Supetar (Brac)" -> "Supetar": la parentesi serve a noi per capire dov'e,
// a Maps confonde la ricerca.
function portName(nome) {
  return String(nome ?? '').replace(/\s*\(.*?\)\s*/g, '').trim()
}

// Destinazioni del giorno, ordinate per urgenza pratica: prima cio che ha un
// orario (il traghetto), poi dove si dorme, poi il resto.
export function navTargetsForDay(day, data) {
  if (!day) return []

  const out = []
  const visti = new Set()

  const aggiungi = (icon, label, url) => {
    if (!label || !url) return
    const chiave = label.toLowerCase()
    if (visti.has(chiave)) return
    visti.add(chiave)
    out.push({ icon, label, url })
  }

  // 1. Porto di partenza del traghetto di oggi. E l'unico appuntamento con un
  //    orario rigido: se lo perdi salta il resto, quindi viene per primo.
  const traghetto = (data.ferries || []).find(f => f.day === day.day)
  if (traghetto) {
    const porto = portName(traghetto.from)
    if (porto) aggiungi('⛴️', `Porto di ${porto}`, navUrl(`Porto di ${porto}`))
  }

  // 2. Struttura dove si dorme. Le coordinate battono l'indirizzo: gli hotel
  //    fuori paese hanno indirizzi che Maps interpreta male.
  const hotel = (data.hotels || []).find(h => h.id === day.hotel_ref)
  if (hotel) {
    const url = hotel.coordinates
      ? navUrlCoords(hotel.coordinates.lat, hotel.coordinates.lng)
      : navUrl([hotel.name, hotel.address].filter(Boolean).join(' '))
    aggiungi('🏨', hotel.name, url)
  }

  // 3. Idee salvate per questo giorno, ma solo quelle che hanno un posto:
  //    un'idea senza luogo non e navigabile.
  ideasForDay(day.date).forEach(i => {
    if (i.coordinates?.lat != null) {
      aggiungi('💡', i.text, navUrlCoords(i.coordinates.lat, i.coordinates.lng))
    } else if (i.location_name) {
      aggiungi('💡', i.text, navUrl(i.location_name))
    }
  })

  // 4. Ristoranti, ma solo quelli davvero in programma quel giorno: nominati
  //    nel titolo o in un'attivita. I ristoranti della zona restano nei
  //    suggerimenti, dove ha senso sfogliarli; qui servono le mete decise,
  //    altrimenti una tappa di mare finisce con otto pulsanti tutti uguali.
  ristorantiInProgramma(data.dining, day).forEach(d => {
    aggiungi('🍽️', d.name, navUrl(`${d.name} ${d.town}`))
  })

  return out
}

// Testo del giorno in cui cercare i nomi: titolo piu attivita.
function testoDelGiorno(day) {
  return [day.title, ...(day.activities || []).map(a => a.text)]
    .filter(Boolean).join(' ').toLowerCase()
}

// Un ristorante e "in programma" se sta nella zona della tappa E il suo nome
// compare nel giorno. Servono entrambe le condizioni: col solo nome, un locale
// di Rovigno che si chiama "Monte" si prendeva tutte le giornate di Sesto,
// dove "Monte" compare di continuo (Passo Monte Croce, Monte Elmo).
//
// I nomi nei dati sono spesso composti ("Trattoria al Cacciatore – La Subida")
// mentre nel programma si usa la forma breve ("La Subida"), quindi si confronta
// anche pezzo per pezzo. Sotto i 4 caratteri non si cerca: frammenti come "al"
// o "da" combacerebbero con qualsiasi cosa.
function ristorantiInProgramma(dining, day) {
  if (!dining?.length) return []
  const testo = testoDelGiorno(day)
  if (!testo) return []

  return diningForLocation(dining, day.location).filter(d => {
    const nome = String(d.name ?? '').toLowerCase().trim()
    if (!nome) return false
    if (testo.includes(nome)) return true

    return nome.split(/[–—\-\/]/)
      .map(p => p.trim())
      .filter(p => p.length >= 4)
      .some(p => testo.includes(p))
  })
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Blocco di link "naviga" per una tappa. Stringa vuota se non c'e niente da
// navigare: un titolo su una lista vuota sembrerebbe un errore.
export function navTargetsHtml(day, data, titolo = '🚗 Naviga') {
  const mete = navTargetsForDay(day, data)
  if (!mete.length) return ''

  return `
    <div class="route-nav">
      <div class="route-nav-title">${titolo} <span>(partenza: la tua posizione)</span></div>
      <div class="route-nav-list">
        ${mete.map(m => `
          <a class="route-nav-btn" target="_blank" rel="noopener" href="${esc(m.url)}">
            <span>${m.icon}</span>
            <span>${esc(m.label)}</span>
          </a>`).join('')}
      </div>
    </div>
  `
}
