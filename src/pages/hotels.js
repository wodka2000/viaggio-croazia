import { fetchTripData } from '../utils/data.js'
import { formatDateIT, starsHtml, hotelTotal, formatEuro, navUrl } from '../utils/data.js'

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

  // Raggruppa per location_group, mantenendo l'ordine di primo inserimento
  const groups = {}
  const groupOrder = []
  for (const h of hotels) {
    const g = h.location_group || h.location
    if (!groups[g]) { groups[g] = []; groupOrder.push(g) }
    groups[g].push(h)
  }

  // Statistiche solo sulle prenotazioni confermate
  const confirmed = hotels.filter(h => h.status === 'confermata')
  const totalNights = confirmed.reduce((s, h) => s + h.nights, 0)
  const totalCost = confirmed.reduce((s, h) => s + hotelTotal(h), 0)

  content.innerHTML = `
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${confirmed.length} strutture confermate · ${totalNights} notti · ${formatEuro(totalCost)}</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${confirmed.length}</div>
        <div class="summary-label">Strutture confermate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${totalNights}</div>
        <div class="summary-label">Notti prenotate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value" style="font-size:1.15rem;">${formatEuro(totalCost)}</div>
        <div class="summary-label">Costo prenotazioni</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${hotels.filter(h => h.status === 'da_confermare').length}</div>
        <div class="summary-label">Da confermare</div>
      </div>
    </div>

    ${groupOrder.map(g => `
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${g}</span>
          <span class="hotels-group-nights">${groups[g][0]?.nights ? groups[g][0].nights + ' nott' + (groups[g][0].nights === 1 ? 'e' : 'i') : ''} · ${groups[g][0]?.checkin ? formatDateIT(groups[g][0].checkin) + ' → ' + formatDateIT(groups[g][0].checkout) : ''}</span>
        </div>
        <div class="hotels-grid">
          ${groups[g].map(h => renderHotelCard(h)).join('')}
        </div>
      </div>
    `).join('')}
  `
}

function renderHotelCard(h) {
  const nights = h.nights
  const total = hotelTotal(h)
  const isConfirmed = h.status === 'confermata' || (h.booking_ref && h.booking_ref.length > 0)

  const statusBadge = isConfirmed
    ? `<span class="hotel-status-badge badge-prenotato">✅ Confermata</span>`
    : h.status === 'da_confermare'
    ? `<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>`
    : `<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>`

  const recommendedBadge = h.recommended
    ? `<span class="hotel-recommended-badge">⭐ Consigliato</span>`
    : `<span class="hotel-alt-badge">Alternativa</span>`

  return `
    <div class="hotel-card ${h.recommended ? 'hotel-card--recommended' : ''}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${h.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${recommendedBadge}
            ${statusBadge}
          </div>
        </div>
        <div class="hotel-location">📍 ${h.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${formatDateIT(h.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${formatDateIT(h.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${h.rating} stelle">
            ${h.rating > 0 ? starsHtml(h.rating) : '<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
          </div>
          <div class="hotel-price">
            ${total > 0
              ? `<strong>${formatEuro(h.price_per_night)}</strong>/notte · ${nights} nott${nights === 1 ? 'e' : 'i'} · <strong style="color:var(--color-text);">${formatEuro(total)}</strong>`
              : `<span style="color:var(--color-text-muted);">Prezzo da definire</span>`
            }
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
          <div style="margin-top:0.5rem; font-size:0.82rem;">
            📞 <a href="tel:${h.phone}" style="color:var(--color-primary);">${h.phone}</a>
          </div>
        ` : ''}

        <div class="hotel-links">
          <a href="${navUrl(h.name + ', ' + h.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🚗 Naviga
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' ' + h.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🗺️ Vedi su Maps
          </a>
          <a href="https://www.google.com/search?q=${encodeURIComponent(h.name + ' ' + h.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🔍 Cerca online
          </a>
        </div>
      </div>
    </div>
  `
}
