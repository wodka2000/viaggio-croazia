// Carica trip.json dal path corretto per dev e GitHub Pages.
// import.meta.env.BASE_URL è '/' in dev e '/viaggio-croazia/' in produzione.

let _cache = null

export async function fetchTripData() {
  if (_cache) return _cache

  const base = import.meta.env.BASE_URL
  const url = `${base}data/trip.json`

  const res = await fetch(url)
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

export function totalHotelCost(hotels) {
  return hotels.reduce((sum, h) => sum + h.nights * h.price_per_night, 0)
}
