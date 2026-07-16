// ─────────────────────────────────────────────────────────────
// PRENOTAZIONI — sistema per aggiungere prenotazioni (ristoranti,
// esperienze, ecc.) direttamente dal sito, con link a Google Maps.
//
// Le prenotazioni "statiche" (già confermate) vivono in trip.json
// nell'array `bookings`. Le prenotazioni aggiunte dall'utente dal
// sito vivono qui, in localStorage, e vengono unite a quelle statiche
// nel rendering dell'itinerario.
// ─────────────────────────────────────────────────────────────

import { toMapsUrl, timeToMinutes } from './data.js'

const KEY = 'viaggio_croazia_bookings_v1'

function genId() {
  return 'book_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5)
}

function _normalize(b) {
  return {
    id: b.id || genId(),
    date: b.date ?? null,          // 'YYYY-MM-DD' — a quale giorno appartiene
    time: (b.time ?? '').trim(),   // es. '19:00'
    place: (b.place ?? '').trim(), // nome del locale/attività
    address: (b.address ?? '').trim(), // indirizzo o città (per il link Maps)
    maps_url: (b.maps_url ?? '').trim(), // link Maps esplicito (opzionale)
    note: (b.note ?? '').trim(),
    created_at: b.created_at || new Date().toISOString(),
  }
}

// Link Maps effettivo di una prenotazione: preferisce maps_url esplicito,
// poi "nome + indirizzo", infine solo il nome.
export function bookingMapsUrl(b) {
  if (b.maps_url) return toMapsUrl(b.maps_url)
  const query = [b.place, b.address].filter(Boolean).join(', ')
  return query ? toMapsUrl(query) : ''
}

export function loadBookings() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw).map(_normalize) : []
  } catch {
    return []
  }
}

function _save(bookings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(bookings))
    window.dispatchEvent(new CustomEvent('bookings:updated', { detail: { bookings } }))
  } catch (e) {
    console.warn('[bookings] localStorage non disponibile:', e)
  }
}

export function addBooking(partial) {
  const bookings = loadBookings()
  const booking = _normalize(partial)
  bookings.unshift(booking)
  _save(bookings)
  return booking
}

export function updateBooking(id, changes) {
  const bookings = loadBookings()
  const idx = bookings.findIndex(b => b.id === id)
  if (idx === -1) return null
  bookings[idx] = _normalize({ ...bookings[idx], ...changes })
  _save(bookings)
  return bookings[idx]
}

export function deleteBooking(id) {
  _save(loadBookings().filter(b => b.id !== id))
}

// Prenotazioni utente per un dato giorno (ordinate per orario).
export function getUserBookingsForDay(date) {
  return loadBookings()
    .filter(b => b.date === date)
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
}

export function exportBookingsJSON() {
  return JSON.stringify(loadBookings(), null, 2)
}
