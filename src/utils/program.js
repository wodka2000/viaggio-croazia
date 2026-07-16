// ─────────────────────────────────────────────────────────────
// PROGRAMMA DEL GIORNO — modifiche utente alle attività dell'itinerario.
//
// Le attività "base" arrivano da trip.json (condivise, versionate). Le
// modifiche fatte dal sito vivono qui, in localStorage, come strato che
// si sovrappone alla base: così gli aggiornamenti a trip.json continuano
// ad arrivare per le attività non toccate, e ogni utente/dispositivo può
// personalizzare il proprio programma.
//
// Struttura salvata (per data):
//   { [date]: { edits: { [index]: {time,text} }, hidden: { [index]: true },
//               added: [ {id, time, text, maps} ] } }
// dove `index` è la posizione dell'attività nell'array base di quel giorno.
// ─────────────────────────────────────────────────────────────

import { timeToMinutes } from './data.js'

const KEY = 'viaggio_croazia_program_v1'

function genId() {
  return 'act_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5)
}

function _loadAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function _saveAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('program:updated', { detail: { data } }))
  } catch (e) {
    console.warn('[program] localStorage non disponibile:', e)
  }
}

function _entry(data, date) {
  if (!data[date]) data[date] = { edits: {}, hidden: {}, added: [] }
  const e = data[date]
  e.edits  = e.edits  || {}
  e.hidden = e.hidden || {}
  e.added  = e.added  || []
  return e
}

// Programma effettivo del giorno: base (con modifiche/nascondimenti) + aggiunte,
// ordinato per orario. Ogni voce: { key, base, index?|id?, time, text, maps }.
export function getDayProgram(date, baseActivities = []) {
  const e = _loadAll()[date] || {}
  const edits = e.edits || {}, hidden = e.hidden || {}, added = e.added || []

  const items = []
  baseActivities.forEach((a, i) => {
    if (hidden[i]) return
    const ov = edits[i] || {}
    items.push({
      key: 'base:' + i, base: true, index: i,
      time: ov.time ?? a.time ?? '',
      text: ov.text ?? a.text ?? '',
      maps: a.maps ?? null,
    })
  })
  added.forEach(a => {
    items.push({ key: 'add:' + a.id, base: false, id: a.id, time: a.time || '', text: a.text || '', maps: a.maps || null })
  })

  items.sort((x, y) => timeToMinutes(x.time) - timeToMinutes(y.time))
  return items
}

export function isDayModified(date) {
  const e = _loadAll()[date]
  if (!e) return false
  return !!((e.added && e.added.length) ||
            (e.hidden && Object.keys(e.hidden).length) ||
            (e.edits && Object.keys(e.edits).length))
}

/* ── MUTAZIONI ────────────────────────────────────────────── */

// Modifica un'attività base (override di time/text).
export function editBaseActivity(date, index, patch) {
  const data = _loadAll()
  const e = _entry(data, date)
  e.edits[index] = { ...(e.edits[index] || {}), ...patch }
  _saveAll(data)
}

// Nasconde (elimina dalla vista) un'attività base.
export function hideBaseActivity(date, index) {
  const data = _loadAll()
  const e = _entry(data, date)
  e.hidden[index] = true
  delete e.edits[index]
  _saveAll(data)
}

export function addActivity(date, { time = '', text = '', maps = '' } = {}) {
  const data = _loadAll()
  const e = _entry(data, date)
  const act = { id: genId(), time: time.trim(), text: text.trim(), maps: (maps || '').trim() }
  e.added.push(act)
  _saveAll(data)
  return act
}

export function editAddedActivity(date, id, patch) {
  const data = _loadAll()
  const e = _entry(data, date)
  const idx = e.added.findIndex(a => a.id === id)
  if (idx === -1) return
  e.added[idx] = { ...e.added[idx], ...patch }
  _saveAll(data)
}

export function removeAddedActivity(date, id) {
  const data = _loadAll()
  const e = _entry(data, date)
  e.added = e.added.filter(a => a.id !== id)
  _saveAll(data)
}

// Ripristina il programma del giorno alla versione di trip.json.
export function resetDay(date) {
  const data = _loadAll()
  if (data[date]) { delete data[date]; _saveAll(data) }
}
