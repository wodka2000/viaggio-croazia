const KEY = 'viaggio_croazia_ideas_v1'

function genId() {
  return 'idea_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5)
}

export function loadIdeas() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
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
  const idea = {
    id: genId(),
    text: '',
    note: '',
    created_at: new Date().toISOString(),
    day_date: null,          // YYYY-MM-DD
    location_name: null,
    coordinates: null,       // { lat, lng }
    add_to_checklist: false,
    add_to_map: false,
    marker_color: '#f59e0b',
    completed: false,
    ...partial,
  }
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
