/* ── CHECKLIST STATE (static items from trip.json) ─────── */
const STORAGE_KEY        = 'viaggio_croazia_checklist_v1'
const CUSTOM_ITEMS_KEY   = 'viaggio_croazia_custom_items_v1'

export function loadChecklistState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveChecklistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('[storage] Impossibile salvare checklist:', e)
  }
}

export function clearChecklistState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* silenzioso */ }
}

/* ── CUSTOM CHECKLIST ITEMS (CRUD) ──────────────────────── */

function _genId() {
  return 'ci_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 5)
}

/**
 * Custom item: { id, text, category, checked, created_at }
 */
export function loadCustomItems() {
  try {
    const raw = localStorage.getItem(CUSTOM_ITEMS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function _saveCustomItems(items) {
  try {
    localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(items))
    window.dispatchEvent(new CustomEvent('customitems:updated'))
  } catch (e) {
    console.warn('[storage] Impossibile salvare custom items:', e)
  }
}

export function addCustomItem(text, category = 'Varie') {
  const items = loadCustomItems()
  const item = { id: _genId(), text: text.trim(), category, checked: false, created_at: new Date().toISOString() }
  items.unshift(item)
  _saveCustomItems(items)
  return item
}

export function toggleCustomItem(id, checked) {
  _saveCustomItems(loadCustomItems().map(i => i.id === id ? { ...i, checked } : i))
}

export function deleteCustomItem(id) {
  _saveCustomItems(loadCustomItems().filter(i => i.id !== id))
}

export function clearCustomItems() {
  _saveCustomItems([])
}
