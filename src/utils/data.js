// Carica trip.json dal path corretto per dev e GitHub Pages.
// import.meta.env.BASE_URL è '/' in dev e '/viaggio-croazia/' in produzione.

let _cache = null

export async function fetchTripData() {
  if (_cache) return _cache

  const base = import.meta.env.BASE_URL
  const url = `${base}data/trip.json`

  // 'no-cache' forza il browser a rivalidare col server (304 se invariato,
  // file fresco se aggiornato) → gli aggiornamenti ai dati compaiono senza
  // dover svuotare manualmente la cache.
  const res = await fetch(url, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Impossibile caricare trip.json (${res.status})`)

  _cache = await res.json()
  return _cache
}

export function formatDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateShort(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

// Restituisce gg/mm (es. 2026-08-19 → 19/08)
export function formatDateIT(isoDate) {
  if (!isoDate) return ''
  const [, mm, dd] = isoDate.split('-')
  return `${dd}/${mm}`
}

export function formatDayOfWeek(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase()
}

export function daysUntil(isoDate) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(isoDate + 'T00:00:00')
  return Math.round((target - now) / (1000 * 60 * 60 * 24))
}

export function starsHtml(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

// Totale di un singolo hotel: preferisce price_total, fallback su nights * price_per_night.
export function hotelTotal(h) {
  if (h.price_total != null && h.price_total > 0) return h.price_total
  return (h.nights || 0) * (h.price_per_night || 0)
}

export function totalHotelCost(hotels) {
  return hotels.reduce((sum, h) => sum + hotelTotal(h), 0)
}

// Link Google Maps "naviga verso destinazione" — la partenza è la posizione attuale dell'utente.
// query può essere un testo (nome + indirizzo) o "lat,lng".
export function navUrl(query) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=driving`
}

export function navUrlCoords(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
}

// Converte un orario "libero" in minuti dalla mezzanotte, per ordinare le
// attività. Accetta 19:30, 19.30, 19,30, 19h30, 1930, 19 e parole chiave
// (mattina, pranzo, pomeriggio, sera, notte…). Non riconosciuto → in fondo.
const _TIME_WORDS = {
  mattina: 8 * 60, mattino: 8 * 60, colazione: 8 * 60, pranzo: 13 * 60,
  pomeriggio: 15 * 60, aperitivo: 18 * 60, sera: 20 * 60, serata: 20 * 60,
  cena: 20 * 60, notte: 23 * 60,
}
export function timeToMinutes(time) {
  const t = String(time ?? '').trim().toLowerCase()
  if (!t) return 9998
  const m = t.match(/(\d{1,2})\s*[:.,h]\s*(\d{2})/) ||
            t.match(/^(\d{1,2})(\d{2})$/) ||
            t.match(/^(\d{1,2})$/)
  if (m) {
    const h = Number(m[1])
    const min = m[2] != null ? Number(m[2]) : 0
    if (h <= 23 && min <= 59) return h * 60 + min
  }
  for (const w in _TIME_WORDS) if (t.includes(w)) return _TIME_WORDS[w]
  return 9998
}

// Link Google Maps "cerca/mostra il posto" — apre la scheda del luogo su Maps.
// query può essere un testo (nome + indirizzo/città) o "lat,lng".
export function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Normalizza ciò che l'utente inserisce in un link Maps valido:
// - se è già un URL (http…), lo usa così com'è (link Maps incollato)
// - altrimenti costruisce un link di ricerca dal testo (nome + indirizzo)
export function toMapsUrl(input) {
  const val = String(input ?? '').trim()
  if (!val) return ''
  if (/^https?:\/\//i.test(val)) return val
  return mapsSearchUrl(val)
}

// Formattazione valuta italiana deterministica (non dipendente dal locale del browser).
// Es. 4456.37 → "€ 4.456,37"
export function formatEuro(n) {
  const value = Number(n) || 0
  const [int, dec] = value.toFixed(2).split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `€ ${grouped},${dec}`
}
