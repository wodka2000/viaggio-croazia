// Controllo a tavolino delle destinazioni "naviga" per ogni giorno del viaggio.
// Serve a vedere con i dati veri cosa comparirebbe in dashboard, senza browser.
//
//   node tools/verifica-navigazione.mjs

import { readFileSync } from 'node:fs'

// Il modulo delle idee usa localStorage: fuori dal browser non esiste.
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const { navTargetsForDay } = await import(
  new URL('../src/utils/navigation.js', import.meta.url).href
)

const data = JSON.parse(readFileSync(new URL('../public/data/trip.json', import.meta.url), 'utf8'))

let senzaMete = 0

for (const day of data.days) {
  const mete = navTargetsForDay(day, data)
  if (!mete.length) senzaMete++

  const testa = `Gg.${String(day.day).padStart(2)} ${day.date}  ${day.location}`
  console.log(`\n${testa}`)
  console.log(`   ${day.title}`)

  if (!mete.length) {
    console.log('   (nessuna destinazione)')
    continue
  }
  for (const m of mete) console.log(`   ${m.icon} ${m.label}`)
}

console.log(`\n─────────────────────────────`)
console.log(`Giorni totali:        ${data.days.length}`)
console.log(`Giorni senza mete:    ${senzaMete}`)
