import { fetchTripData } from '../utils/data.js'
import { formatDateIT } from '../utils/data.js'

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

  content.innerHTML = `
    <div class="page-header">
      <h1>📋 Note Logistiche</h1>
      <p>Avvisi e promemoria pratici per organizzare gli spostamenti e le giornate chiave.</p>
    </div>

    ${renderFerries(data.ferries)}

    ${notes.length === 0
      ? `<p style="color:var(--color-text-muted);">Nessuna nota logistica.</p>`
      : `<div class="logi-list">${notes.map(renderNote).join('')}</div>`
    }
  `
}

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
