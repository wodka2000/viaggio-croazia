// ─────────────────────────────────────────────────────────────
// ALLEGATI PRENOTAZIONI — file (.eml, .pdf, foto) associati a una
// prenotazione, così da avere tutto a portata di mano offline.
//
// Il BLOB del file vive in IndexedDB (gestisce bene i binari grandi);
// i METADATI (nome, tipo, dimensione) vivono in localStorage così che
// il rendering sia sincrono. Chiave comune: l'id della prenotazione —
// funziona sia per le prenotazioni utente sia per quelle confermate
// (in trip.json), che così possono comunque avere un allegato locale.
// ─────────────────────────────────────────────────────────────

const META_KEY = 'viaggio_croazia_attachments_v1'
const DB_NAME  = 'viaggio_croazia_files'
const STORE    = 'attachments'

/* ── METADATI (localStorage) ──────────────────────────────── */

export function loadAttachmentMeta() {
  try {
    const raw = localStorage.getItem(META_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getAttachmentMeta(bookingId) {
  return loadAttachmentMeta()[bookingId] || null
}

function _saveMeta(meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta))
    window.dispatchEvent(new CustomEvent('attachments:updated', { detail: { meta } }))
  } catch (e) {
    console.warn('[attachments] localStorage non disponibile:', e)
  }
}

/* ── BLOB (IndexedDB) ─────────────────────────────────────── */

function _openDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB non disponibile'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function _putBlob(id, blob) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => { db.close(); reject(tx.error) }
  }))
}

function _getBlob(id) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => { db.close(); resolve(req.result || null) }
    req.onerror = () => { db.close(); reject(req.error) }
  }))
}

function _deleteBlob(id) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => { db.close(); reject(tx.error) }
  }))
}

/* ── API pubblica ─────────────────────────────────────────── */

// Associa un File a una prenotazione. Ritorna i metadati salvati.
export async function setAttachment(bookingId, file) {
  await _putBlob(bookingId, file)
  const meta = loadAttachmentMeta()
  meta[bookingId] = {
    name: file.name || 'allegato',
    type: file.type || '',
    size: file.size || 0,
    added_at: new Date().toISOString(),
  }
  _saveMeta(meta)

  // _saveMeta non rilancia (per non far fallire le rimozioni), quindi qui
  // controlliamo che i metadati siano davvero atterrati: senza di loro l'UI
  // non saprebbe mai che il file c'è, e l'utente riproverebbe all'infinito
  // senza capire perché. Meglio un errore esplicito.
  if (!getAttachmentMeta(bookingId)) {
    throw new Error('Metadati non salvati: spazio del browser esaurito o localStorage non disponibile.')
  }
  return meta[bookingId]
}

// Recupera il file come Object URL (da revocare dopo l'uso). null se assente.
export async function getAttachmentUrl(bookingId) {
  const blob = await _getBlob(bookingId)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function removeAttachment(bookingId) {
  try { await _deleteBlob(bookingId) } catch { /* il blob potrebbe non esserci */ }
  const meta = loadAttachmentMeta()
  delete meta[bookingId]
  _saveMeta(meta)
}

// Apre un allegato in una nuova scheda (o lo scarica se il browser non può
// visualizzarlo, es. .eml).
//
// La scheda va aperta SUBITO, in modo sincrono: leggere il blob da IndexedDB
// richiede un await, e dopo l'await il gesto dell'utente è scaduto — Safari su
// iOS bloccherebbe la finestra e il tocco non farebbe nulla. Quindi apriamo
// prima una scheda vuota e le assegniamo l'URL a lettura finita.
export async function openAttachment(id) {
  const meta = getAttachmentMeta(id)
  const canView = /^(image\/|application\/pdf)/.test(meta?.type || '')
  const win = canView ? window.open('', '_blank') : null
  if (win) win.opener = null

  try {
    const url = await getAttachmentUrl(id)
    if (!url) {
      win?.close()
      alert('File non trovato su questo dispositivo.')
      return
    }
    if (win) win.location = url
    else _download(url, meta?.name)   // popup bloccato o file non visualizzabile
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (err) {
    console.error('[attachments]', err)
    win?.close()
    alert('Impossibile aprire il file.')
  }
}

function _download(url, name) {
  const a = document.createElement('a')
  a.href = url
  a.download = name || 'allegato'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// Etichetta breve del tipo di file, per l'icona.
export function attachmentIcon(meta) {
  if (!meta) return '📎'
  const t = (meta.type || '').toLowerCase()
  const n = (meta.name || '').toLowerCase()
  if (t.startsWith('image/') || /\.(png|jpe?g|gif|webp|heic)$/.test(n)) return '🖼️'
  if (t === 'application/pdf' || n.endsWith('.pdf')) return '📄'
  if (t === 'message/rfc822' || n.endsWith('.eml')) return '✉️'
  return '📎'
}
