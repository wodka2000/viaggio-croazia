import { formatDateIT } from './data.js'

/* Selettore del giorno a cui agganciare qualcosa.
 *
 * Stessa finestra per passeggiate, natura/cultura e qualsiasi altra cosa si
 * voglia mettere in programma: sceglie la data e passa il resto a chi ha
 * chiamato, che sa quale idea costruirci sopra.
 */

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const ID_MODALE = 'day-picker-modal'
const SENZA_GIORNO = '__nessuno__'

/**
 * @param {object}   opts
 * @param {string}   opts.nome            cosa si sta aggiungendo (mostrato all'utente)
 * @param {object[]} opts.giorni          giorni selezionabili: { day, date, location }
 * @param {string[]} [opts.giaScelti]     date a cui e' gia' agganciato: disabilitate
 * @param {boolean}  [opts.consentiNessuno] offre "senza giorno", per chi vuole
 *                                        solo tenerselo tra le idee
 * @param {(date: string|null) => void} opts.onConferma
 */
export function openDayPicker({ nome, giorni = [], giaScelti = [], consentiNessuno = false, onConferma }) {
  document.getElementById(ID_MODALE)?.remove()

  const gia = new Set(giaScelti)
  const disponibili = giorni.filter(g => !gia.has(g.date))

  // Tutti i giorni gia' presi: aprire un elenco di sole voci disabilitate
  // sarebbe un vicolo cieco, meglio dirlo e basta.
  if (!disponibili.length && !consentiNessuno) {
    mostraAvviso(nome)
    return
  }

  const opzioni = [
    consentiNessuno
      ? `<option value="${SENZA_GIORNO}">Senza giorno — tienila solo tra le Idee</option>`
      : '',
    ...giorni.map(g => {
      const preso = gia.has(g.date)
      const luogo = g.location ? ` · ${esc(g.location)}` : ''
      return `<option value="${g.date}" ${preso ? 'disabled' : ''}>
        Gg. ${g.day} — ${formatDateIT(g.date)}${luogo}${preso ? ' (già aggiunta)' : ''}
      </option>`
    }),
  ].join('')

  const modal = document.createElement('div')
  modal.id = ID_MODALE
  modal.className = 'day-link-modal-overlay'
  modal.innerHTML = `
    <div class="day-link-modal">
      <div class="day-link-modal-title">📌 Aggiungi al giorno</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">
        “${esc(nome)}” comparirà nelle attività suggerite del giorno scelto.
      </p>
      <select id="day-picker-select" class="ideas-select">${opzioni}</select>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button class="btn btn-primary" id="day-picker-confirm">✓ Aggiungi</button>
        <button class="btn btn-outline" id="day-picker-cancel">Annulla</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)

  const chiudi = () => modal.remove()
  document.getElementById('day-picker-cancel')?.addEventListener('click', chiudi)
  modal.addEventListener('click', e => { if (e.target === modal) chiudi() })

  document.getElementById('day-picker-confirm')?.addEventListener('click', () => {
    const scelta = document.getElementById('day-picker-select')?.value
    if (!scelta) return
    chiudi()
    onConferma?.(scelta === SENZA_GIORNO ? null : scelta)
  })
}

function mostraAvviso(nome) {
  const modal = document.createElement('div')
  modal.id = ID_MODALE
  modal.className = 'day-link-modal-overlay'
  modal.innerHTML = `
    <div class="day-link-modal">
      <div class="day-link-modal-title">Già in programma</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin:0.5rem 0 1rem;">
        “${esc(nome)}” è già stata aggiunta a tutti i giorni disponibili.
      </p>
      <button class="btn btn-outline" id="day-picker-cancel">Chiudi</button>
    </div>
  `
  document.body.appendChild(modal)
  const chiudi = () => modal.remove()
  document.getElementById('day-picker-cancel')?.addEventListener('click', chiudi)
  modal.addEventListener('click', e => { if (e.target === modal) chiudi() })
}
