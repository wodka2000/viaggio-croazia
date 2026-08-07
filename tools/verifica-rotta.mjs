// Che cosa mostra la dashboard, giorno per giorno:
//  - quali giorni finiscono nella "Rotta del viaggio" (tappe uniche)
//  - che cosa comparirebbe come tappa corrente se oggi fosse quel giorno
//
//   node tools/verifica-rotta.mjs

import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../public/data/trip.json', import.meta.url), 'utf8'))
const { days } = data

// Stessa logica della dashboard: prima comparsa di ogni localita
const inRotta = new Set()
const visti = new Set()
for (const d of days) {
  if (!visti.has(d.location)) { visti.add(d.location); inRotta.add(d.date) }
}

console.log('Gg  data        in rotta  tappa corrente se oggi fosse quel giorno')
console.log('─'.repeat(78))

for (const d of days) {
  // La dashboard cerca il giorno di oggi, altrimenti il primo successivo
  const oggi = days.find(x => x.date === d.date)
  const corrente = oggi || days.find(x => x.date > d.date)
  const flag = inRotta.has(d.date) ? '   SI   ' : '   --   '
  console.log(
    `${String(d.day).padStart(2)}  ${d.date}  ${flag}  ${corrente ? `Gg.${corrente.day} — ${corrente.title}` : 'nessuna'}`
  )
}

console.log('─'.repeat(78))
console.log(`Giorni totali:        ${days.length}`)
console.log(`Voci nella rotta:     ${inRotta.size}`)
console.log(`Giorni NON in rotta:  ${days.length - inRotta.size}`)
