import { loadIdeas } from './ideas.js'

/* Suggerimenti del giorno — logica condivisa tra Dashboard (popup) e scheda Attività. */

// Ristoranti la cui area combacia con la località della tappa
export function diningForLocation(dining, location) {
  if (!dining || !location) return []
  const loc = location.toLowerCase()
  return dining.filter(d => loc.includes(d.area.toLowerCase()))
}

// Idee salvate (localStorage) abbinate a questo giorno (esclude le scartate)
export function ideasForDay(date) {
  return loadIdeas().filter(i => i.day_date === date && i.stato !== 'scartata')
}

// Vero per le tappe sulle Dolomiti di Sesto
export function isSesto(day) {
  return /sesto/i.test(day.location || '')
}

// Numero totale di suggerimenti per la tappa (attività + ristoranti + idee).
// Per Sesto i ristoranti di zona non si contano (compaiono solo in base
// all'attività scelta).
export function suggestionsCount(day, dining) {
  const acts  = day.activities?.length || 0
  const rest  = isSesto(day) ? 0 : diningForLocation(dining, day.location).length
  const ideas = ideasForDay(day.date).length
  return acts + rest + ideas
}

export function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

const mapsSearch = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

// Blocco sezioni dei suggerimenti per un giorno — markup identico in popup e scheda
export function suggestionsSectionsHtml(day, dining, hikes = []) {
  const restaurants = diningForLocation(dining, day.location)
  const ideas       = ideasForDay(day.date)
  const tipsDo      = day.tips?.do || []
  const tipsEat     = day.tips?.eat || []
  const sesto       = isSesto(day)

  const activitiesHtml = (day.activities?.length)
    ? `<div class="sugg-section">
         <div class="sugg-section-title">🎯 Programma del giorno</div>
         <div class="sugg-activities">
           ${day.activities.map(a => `
             <div class="sugg-activity">
               <span class="sugg-activity-time">${esc(a.time)}</span>
               <span>${esc(a.text)}</span>
             </div>`).join('')}
         </div>
       </div>` : ''

  const tipsHtml = (tipsDo.length)
    ? `<div class="sugg-section">
         <div class="sugg-section-title">✨ Cose da fare in zona</div>
         <ul class="sugg-tips">${tipsDo.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
       </div>` : ''

  // Dove mangiare:
  //  • Tappe in Croazia → ristoranti di zona (comportamento invariato)
  //  • Tappe a Sesto → nessun ristorante generico; i consigli compaiono solo
  //    dopo aver abbinato un'attività, in base alla meta scelta
  let restaurantsHtml = ''
  if (sesto) {
    const picks = ideas
      .map(i => hikes.find(h => h.id === i.hike_id))
      .filter(h => h && h.eat)
    if (picks.length) {
      restaurantsHtml = `<div class="sugg-section">
        <div class="sugg-section-title">🍽️ Dove mangiare — in base alle attività scelte</div>
        <div class="sugg-eat-list">
          ${picks.map(h => `
            <div class="sugg-eat">
              <span class="sugg-eat-act">${esc(h.name)}</span>
              <span class="sugg-eat-tip">${esc(h.eat)}</span>
            </div>`).join('')}
        </div>
      </div>`
    }
  } else if (restaurants.length || tipsEat.length) {
    restaurantsHtml = `<div class="sugg-section">
         <div class="sugg-section-title">🍽️ Dove mangiare in zona</div>
         ${tipsEat.length ? `<ul class="sugg-tips">${tipsEat.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
         <div class="sugg-dining">
           ${restaurants.map(d => `
             <a class="sugg-dining-item" target="_blank" rel="noopener" href="${mapsSearch(d.name + ' ' + d.town)}">
               <div class="sugg-dining-head">
                 <span class="sugg-dining-name">${esc(d.name)}</span>
                 ${d.type ? `<span class="sugg-dining-type">${esc(d.type)}</span>` : ''}
               </div>
               <div class="sugg-dining-town">📍 ${esc(d.town)}</div>
               <div class="sugg-dining-spec">${esc(d.specialty)}</div>
             </a>`).join('')}
         </div>
       </div>`
  }

  const ideasHtml = `
    <div class="sugg-section">
      <div class="sugg-section-title">💡 Le tue idee per questo giorno</div>
      ${ideas.length
        ? `<div class="sugg-ideas">${ideas.map(i => `
            <div class="sugg-idea">
              <span class="sugg-idea-text">${esc(i.text)}</span>
              ${i.note ? `<span class="sugg-idea-note">${esc(i.note)}</span>` : ''}
              ${i.location_name ? `<span class="sugg-idea-chip">📍 ${esc(i.location_name)}</span>` : ''}
              ${i.link ? `<a href="${esc(i.link)}" target="_blank" rel="noopener" class="sugg-idea-chip">🔗 Link</a>` : ''}
            </div>`).join('')}</div>`
        : `<p class="sugg-empty">Nessuna idea abbinata a questo giorno. Aggiungine dalla pagina <a href="#ideas">💡 Idee rapide</a> (imposta il campo “Giorno”).</p>`
      }
    </div>`

  return activitiesHtml + tipsHtml + restaurantsHtml + ideasHtml
}
