import { fetchTripData } from '../utils/data.js'
import { formatDate, starsHtml, totalHotelCost } from '../utils/data.js'

export async function renderHotels() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  const { hotels } = data
  const totalNights = hotels.reduce((s, h) => s + h.nights, 0)
  const totalCost = totalHotelCost(hotels)

  content.innerHTML = `
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${hotels.length} strutture · ${totalNights} notti totali</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${hotels.length}</div>
        <div class="summary-label">Strutture</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${totalNights}</div>
        <div class="summary-label">Notti totali</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${(totalCost / 1000).toFixed(1)}k</div>
        <div class="summary-label">Costo stimato alloggi</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${Math.round(totalCost / totalNights)}</div>
        <div class="summary-label">Media per notte</div>
      </div>
    </div>

    <div class="hotels-grid">
      ${hotels.map(h => renderHotelCard(h)).join('')}
    </div>
  `
}

function renderHotelCard(h) {
  const nights = h.nights
  const total = nights * h.price_per_night

  return `
    <div class="hotel-card">
      <div class="hotel-card-header">
        <div class="hotel-name">${h.name}</div>
        <div class="hotel-location">📍 ${h.location} · ${h.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${formatDate(h.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${formatDate(h.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${h.rating} stelle">
            ${starsHtml(h.rating)}
          </div>
          <div class="hotel-price">
            <strong>€${h.price_per_night}</strong>/notte
            · ${nights} nott${nights === 1 ? 'e' : 'i'}
            · <strong style="color:var(--color-text);">€${total}</strong>
          </div>
        </div>

        <div class="hotel-amenities">
          ${h.amenities.map(a => `<span class="amenity-tag">${a}</span>`).join('')}
        </div>

        ${h.notes ? `<div class="hotel-notes">${h.notes}</div>` : ''}

        ${h.booking_ref ? `
          <div style="margin-top:0.75rem; font-size:0.82rem; color:var(--color-text-muted);">
            Ref. prenotazione: <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:4px;">${h.booking_ref}</code>
          </div>
        ` : ''}

        ${h.phone ? `
          <div style="margin-top:0.5rem; font-size:0.82rem; color:var(--color-text-muted);">
            📞 <a href="tel:${h.phone}" style="color:var(--color-primary);">${h.phone}</a>
          </div>
        ` : ''}
      </div>
    </div>
  `
}
