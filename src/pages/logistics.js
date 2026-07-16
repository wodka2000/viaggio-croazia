import { fetchTripData } from '../utils/data.js'
import { formatDateIT, timeToMinutes } from '../utils/data.js'
import {
  loadBookings,
  addBooking,
  deleteBooking,
  bookingMapsUrl,
} from '../utils/bookings.js'
import {
  getAttachmentMeta,
  setAttachment,
  getAttachmentUrl,
  removeAttachment,
  attachmentIcon,
} from '../utils/attachments.js'

const PRIORITY_LABELS = {
  high:   { label: 'Da non dimenticare', cls: 'logi-prio-high' },
  medium: { label: 'Importante',         cls: 'logi-prio-medium' },
  low:    { label: 'Promemoria',         cls: 'logi-prio-low' },
}

export async function renderLogistics() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  const notes = data.logistics || []
  const staticBookings = data.bookings || []
  const days = data.days || []

  content.innerHTML = `
    <div class="page-header">
      <h1>📋 Note Logistiche</h1>
      <p>Avvisi e promemoria pratici per organizzare gli spostamenti e le giornate chiave.</p>
    </div>

    ${renderBookings(days, staticBookings)}

    ${renderFerries(data.ferries)}

    ${notes.length === 0
      ? `<p style="color:var(--color-text-muted);">Nessuna nota logistica.</p>`
      : `<div class="logi-list">${notes.map(renderNote).join('')}</div>`
    }
  `

  _bindBookingEvents(staticBookings)
}

/* ── PRENOTAZIONI ─────────────────────────────────────────── */

function renderBookings(days, staticBookings) {
  const dayOptions = days.map(d =>
    `<option value="${d.date}">${formatDateIT(d.date)} · ${_esc(d.location || d.title || '')}</option>`
  ).join('')

  return `
    <div class="booking-section">
      <div class="section-title">🍽️ Prenotazioni</div>
      <p style="font-size:0.82rem;color:var(--color-text-muted);margin:-0.25rem 0 0.75rem;">
        Ristoranti, esperienze e tavoli prenotati. Ogni prenotazione ha il link diretto a Google Maps.
        Aggiungine una nuova e resta salvata su questo dispositivo.
      </p>

      <div id="bookings-list">${_renderBookingsList(staticBookings)}</div>

      <button class="btn btn-outline" id="booking-add-toggle" style="margin-top:0.75rem;">
        ➕ Aggiungi prenotazione
      </button>

      <form class="booking-form hidden" id="booking-form">
        <input type="text" class="booking-place idea-input" placeholder="Nome del locale / attività *" />
        <div class="booking-form-row">
          <select class="booking-date idea-input">
            <option value="">— Giorno —</option>
            ${dayOptions}
          </select>
          <input type="text" class="booking-time idea-input" placeholder="Orario (es. 19:00)" />
        </div>
        <input type="text" class="booking-loc idea-input" placeholder="Indirizzo, città o link Google Maps" />
        <input type="text" class="booking-note idea-input" placeholder="Nota (opzionale — es. tavolo per 5)" />
        <label class="booking-file-label">
          📎 Allega conferma <span>(.eml, .pdf o foto — opzionale)</span>
          <input type="file" class="booking-file" accept=".eml,message/rfc822,application/pdf,image/*" />
        </label>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit" class="btn btn-primary" style="font-size:0.85rem;">Salva prenotazione</button>
          <button type="button" class="btn btn-outline" id="booking-cancel" style="font-size:0.85rem;">Annulla</button>
        </div>
      </form>
    </div>
  `
}

// Unisce prenotazioni confermate (trip.json) + prenotazioni utente (localStorage),
// ordinate per data e orario.
function _renderBookingsList(staticBookings) {
  const all = [
    ...staticBookings.map(b => ({ ...b, _fixed: true })),
    ...loadBookings().map(b => ({ ...b, _fixed: false })),
  ].sort((a, b) => _sortKey(a).localeCompare(_sortKey(b)))

  if (all.length === 0) {
    return `<p class="booking-empty">Nessuna prenotazione ancora. Aggiungi la prima qui sotto.</p>`
  }

  return `<div class="booking-list">${all.map(_renderBookingCard).join('')}</div>`
}

function _renderBookingCard(b) {
  const url = bookingMapsUrl(b)
  const when = [b.date ? formatDateIT(b.date) : '', b.time].filter(Boolean).join(' · ')
  return `
    <div class="booking-card" data-id="${_esc(b.id)}">
      <div class="booking-card-main">
        <div class="booking-card-head">
          <span class="booking-card-place">${_esc(b.place)}</span>
          ${b._fixed ? '<span class="booking-badge">confermata</span>' : ''}
        </div>
        ${when ? `<div class="booking-card-when">📅 ${_esc(when)}</div>` : ''}
        ${b.note ? `<div class="booking-card-note">${_esc(b.note)}</div>` : ''}
        <div class="booking-card-actions">
          ${url ? `<a class="booking-card-maps" href="${_esc(url)}" target="_blank" rel="noopener">🗺️ Apri in Google Maps</a>` : ''}
          ${_renderAttachment(b.id)}
        </div>
      </div>
      ${b._fixed ? '' : `<button class="booking-card-del" data-id="${_esc(b.id)}" title="Elimina prenotazione">×</button>`}
    </div>
  `
}

// Area allegato del biglietto: mostra il file se presente, altrimenti
// un pulsante per allegarne uno. Un input file nascosto per ogni card.
function _renderAttachment(bookingId) {
  const meta = getAttachmentMeta(bookingId)
  const fileInput = `<input type="file" class="booking-attach-input" data-id="${_esc(bookingId)}"
      accept=".eml,message/rfc822,application/pdf,image/*" hidden />`

  if (meta) {
    return `
      <span class="booking-attach">
        <button class="booking-attach-open" data-id="${_esc(bookingId)}" title="Apri allegato">
          ${attachmentIcon(meta)} ${_esc(meta.name)}
        </button>
        <button class="booking-attach-del" data-id="${_esc(bookingId)}" title="Rimuovi allegato">×</button>
        ${fileInput}
      </span>
    `
  }
  return `
    <button class="booking-attach-add" data-id="${_esc(bookingId)}">📎 Allega file</button>
    ${fileInput}
  `
}

// Chiave di ordinamento: 'YYYY-MM-DD' + minuti orario (data mancante → in fondo).
function _sortKey(b) {
  const date = b.date || '9999-12-31'
  const mins = String(timeToMinutes(b.time)).padStart(5, '0')
  return `${date} ${mins}`
}

function _bindBookingEvents(staticBookings) {
  const section = document.querySelector('.booking-section')
  if (!section) return

  const form = section.querySelector('#booking-form')
  const listEl = section.querySelector('#bookings-list')

  section.querySelector('#booking-add-toggle')?.addEventListener('click', () => {
    form.classList.toggle('hidden')
    if (!form.classList.contains('hidden')) form.querySelector('.booking-place')?.focus()
  })

  section.querySelector('#booking-cancel')?.addEventListener('click', () => {
    form.classList.add('hidden')
  })

  // Azioni delegate sulla lista (elimina, allegati).
  listEl?.addEventListener('click', e => {
    // Elimina prenotazione utente (+ eventuale allegato)
    const del = e.target.closest('.booking-card-del')
    if (del) {
      if (confirm('Eliminare questa prenotazione?')) {
        removeAttachment(del.dataset.id).finally(() => deleteBooking(del.dataset.id))
      }
      return
    }

    // Allega file → apre il file picker della card
    const addAttach = e.target.closest('.booking-attach-add, .booking-attach')
    if (addAttach && e.target.closest('.booking-attach-add')) {
      addAttach.parentElement.querySelector('.booking-attach-input')?.click()
      return
    }

    // Apri allegato
    const open = e.target.closest('.booking-attach-open')
    if (open) {
      _openAttachment(open.dataset.id)
      return
    }

    // Rimuovi allegato
    const delAttach = e.target.closest('.booking-attach-del')
    if (delAttach) {
      if (confirm('Rimuovere questo allegato?')) removeAttachment(delAttach.dataset.id)
      return
    }
  })

  // File scelto dal picker di una card → salva l'allegato.
  listEl?.addEventListener('change', e => {
    const input = e.target.closest('.booking-attach-input')
    if (!input || !input.files?.length) return
    const id = input.dataset.id
    setAttachment(id, input.files[0]).catch(err => {
      console.error('[attachments]', err)
      alert('Impossibile salvare l’allegato su questo dispositivo.')
    })
    input.value = ''
  })

  form?.addEventListener('submit', e => {
    e.preventDefault()
    const place = form.querySelector('.booking-place').value.trim()
    if (!place) { form.querySelector('.booking-place').focus(); return }

    const loc = form.querySelector('.booking-loc').value.trim()
    // Un link incollato (http…) diventa il link Maps; altrimenti è un indirizzo
    // da cui costruiamo la ricerca su Maps.
    const isUrl = /^https?:\/\//i.test(loc)

    const booking = addBooking({
      place,
      date: form.querySelector('.booking-date').value || null,
      time: form.querySelector('.booking-time').value.trim(),
      address: isUrl ? '' : loc,
      maps_url: isUrl ? loc : '',
      note: form.querySelector('.booking-note').value.trim(),
    })

    // Allegato opzionale scelto nel form.
    const file = form.querySelector('.booking-file')?.files?.[0]
    if (file) {
      setAttachment(booking.id, file).catch(err => {
        console.error('[attachments]', err)
        alert('Prenotazione salvata, ma non è stato possibile allegare il file su questo dispositivo.')
      })
    }

    form.reset()
    form.classList.add('hidden')
  })

  // Ridisegna la lista quando prenotazioni o allegati cambiano.
  const handler = () => { if (listEl) listEl.innerHTML = _renderBookingsList(staticBookings) }
  window.addEventListener('bookings:updated', handler)
  window.addEventListener('attachments:updated', handler)
  window.__currentPageCleanup = () => {
    window.removeEventListener('bookings:updated', handler)
    window.removeEventListener('attachments:updated', handler)
  }
}

// Apre l'allegato in una nuova scheda (o lo scarica se il browser non
// può visualizzarlo, es. .eml). L'Object URL viene revocato dopo un po'.
async function _openAttachment(bookingId) {
  try {
    const url = await getAttachmentUrl(bookingId)
    if (!url) { alert('Allegato non trovato su questo dispositivo.'); return }
    const meta = getAttachmentMeta(bookingId)
    const canView = /^(image\/|application\/pdf)/.test(meta?.type || '')
    if (canView) {
      window.open(url, '_blank', 'noopener')
    } else {
      // .eml e simili: forza il download col nome originale.
      const a = document.createElement('a')
      a.href = url
      a.download = meta?.name || 'allegato'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (err) {
    console.error('[attachments]', err)
    alert('Impossibile aprire l’allegato.')
  }
}

/* ── TRAGHETTI ────────────────────────────────────────────── */

function renderFerries(ferries) {
  if (!ferries || !ferries.length) return ''
  const base = import.meta.env.BASE_URL
  return `
    <div class="ferry-section">
      <div class="section-title">🎫 Biglietti traghetti</div>
      <p style="font-size:0.82rem;color:var(--color-text-muted);margin:-0.25rem 0 0.75rem;">
        Tocca un biglietto per aprire il PDF (salvalo offline sul telefono prima di partire).
      </p>
      <div class="ferry-list">
        ${ferries.map(f => `
          <a class="ferry-card" target="_blank" rel="noopener" href="${base}${f.pdf}">
            <div class="ferry-route">
              <span class="ferry-from">${f.from}</span>
              <span class="ferry-arrow">→</span>
              <span class="ferry-to">${f.to}</span>
            </div>
            <div class="ferry-meta">📅 ${formatDateIT(f.date)} · 🕐 ${f.time}${f.note ? ` · ${f.note}` : ''}</div>
            <span class="ferry-open">📄 Apri biglietto PDF</span>
          </a>
        `).join('')}
      </div>
    </div>
  `
}

function renderNote(n) {
  const prio = PRIORITY_LABELS[n.priority] || PRIORITY_LABELS.low
  return `
    <div class="logi-card ${prio.cls}">
      <div class="logi-card-head">
        <span class="logi-icon">${n.icon || '📌'}</span>
        <span class="logi-title">${n.title}</span>
        <span class="logi-badge">${prio.label}</span>
      </div>
      <p class="logi-text">${n.text}</p>
    </div>
  `
}

function _esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
