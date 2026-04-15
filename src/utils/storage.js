const STORAGE_KEY = 'viaggio_croazia_checklist_v1'

/**
 * Restituisce un oggetto { [itemId]: boolean } con lo stato salvato.
 * Se non c'è nulla, restituisce {}.
 */
export function loadChecklistState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Salva lo stato della checklist (oggetto { [itemId]: boolean }).
 */
export function saveChecklistState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    // localStorage potrebbe non essere disponibile (es. private mode su alcuni browser)
    console.warn('[storage] Impossibile salvare checklist:', e)
  }
}

/**
 * Azzera completamente lo stato (reset checklist).
 */
export function clearChecklistState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // silenzioso
  }
}
