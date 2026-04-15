const KEY = 'viaggio_croazia_ideas_v1'

export const CATEGORIE = [
  { value: 'alloggio',   label: '🏨 Alloggio' },
  { value: 'ristorante', label: '🍽️ Ristorante' },
  { value: 'esperienza', label: '🎯 Esperienza' },
  { value: 'spiaggia',   label: '🏖️ Spiaggia' },
  { value: 'escursione', label: '🥾 Escursione' },
  { value: 'cantina',    label: '🍷 Cantina / Cibo' },
  { value: 'shopping',   label: '🛍️ Shopping' },
  { value: 'varia',      label: '💡 Varia' },
]

export const STATI = [
  { value: 'idea',          label: 'Idea',          color: '#6366f1' },
  { value: 'da-verificare', label: 'Da verificare', color: '#f59e0b' },
  { value: 'prenotare',     label: 'Prenotare',     color: '#ef4444' },
  { value: 'approvata',     label: 'Approvata',     color: '#10b981' },
  { value: 'scartata',      label: 'Scartata',      color: '#94a3b8' },
]

export const PRIORITA = [
  { value: 'alta',  label: '🔴 Alta' },
  { value: 'media', label: '🟡 Media' },
  { value: 'bassa', label: '🟢 Bassa' },
]

export const COLORS = [
  { value: '#f59e0b', label: 'Giallo' },
  { value: '#ef4444', label: 'Rosso' },
  { value: '#8b5cf6', label: 'Viola' },
  { value: '#10b981', label: 'Verde' },
  { value: '#f97316', label: 'Arancio' },
]

function genId() {
  return 'idea_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5)
}

function _normalize(idea) {
  return {
    categoria: 'varia',
    link: '',
    priorita: 'media',
    stato: 'idea',
    note: idea.note ?? '',
    location_name: idea.location_name ?? null,
    ...idea,
  }
}

export function loadIdeas() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw).map(_normalize) : []
  } catch {
    return []
  }
}

function _save(ideas) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ideas))
    window.dispatchEvent(new CustomEvent('ideas:updated', { detail: { ideas } }))
  } catch (e) {
    console.warn('[ideas] localStorage non disponibile:', e)
  }
}

export function addIdea(partial) {
  const ideas = loadIdeas()
  const idea = _normalize({
    id: genId(),
    text: '',
    note: '',
    categoria: 'varia',
    link: '',
    priorita: 'media',
    stato: 'idea',
    created_at: new Date().toISOString(),
    day_date: null,
    location_name: null,
    coordinates: null,
    add_to_checklist: false,
    add_to_map: false,
    marker_color: '#f59e0b',
    completed: false,
    ...partial,
  })
  ideas.unshift(idea)
  _save(ideas)
  return idea
}

export function updateIdea(id, changes) {
  const ideas = loadIdeas()
  const idx = ideas.findIndex(i => i.id === id)
  if (idx === -1) return null
  ideas[idx] = { ...ideas[idx], ...changes }
  _save(ideas)
  return ideas[idx]
}

export function deleteIdea(id) {
  _save(loadIdeas().filter(i => i.id !== id))
}

export function getIdeasForDay(date) {
  return loadIdeas().filter(i => i.day_date === date)
}

export function getChecklistIdeas() {
  return loadIdeas().filter(i => i.add_to_checklist)
}

export function getMapIdeas() {
  return loadIdeas().filter(i => i.add_to_map && i.coordinates?.lat != null)
}

export function exportIdeasJSON() {
  return JSON.stringify(loadIdeas(), null, 2)
}

export function importIdeasJSON(jsonStr) {
  const incoming = JSON.parse(jsonStr)
  if (!Array.isArray(incoming)) throw new Error('JSON non valido: deve essere un array')
  const existing = loadIdeas()
  const existingIds = new Set(existing.map(i => i.id))
  let added = 0
  const merged = [...existing]
  incoming.forEach(idea => {
    if (!existingIds.has(idea.id)) { merged.push(_normalize(idea)); added++ }
  })
  _save(merged)
  return added
}
