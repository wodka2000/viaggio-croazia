import { fetchTripData } from '../utils/data.js'
import { formatDateIT } from '../utils/data.js'
import { suggestionsCount, suggestionsSectionsHtml } from '../utils/suggestions.js'

export async function renderAttivita() {
  const content = document.getElementById('page-content')

  let data
  try {
    data = await fetchTripData()
  } catch (e) {
    content.innerHTML = `<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${e.message}</p></div>`
    return
  }

  const { days, dining } = data

  // Tappa "oggi" o la prossima → aperta di default
  const today   = new Date().toISOString().slice(0, 10)
  const current = days.find(d => d.date === today) || days.find(d => d.date > today) || days[days.length - 1]

  content.innerHTML = `
    <div class="page-header">
      <h1>💡 Attività suggerite</h1>
      <p>Pianifica in anticipo: programma, ristoranti della zona e le tue idee per ogni tappa. Tocca un giorno per espanderlo.</p>
    </div>
    <div class="attivita-list" id="attivita-list">
      ${days.map(d => dayCardHtml(d, dining, d === current)).join('')}
    </div>
  `

  bindAccordion()

  // Aggiorna i conteggi/idee quando cambiano le idee salvate
  const handler = () => {
    const openIds = new Set(
      [...document.querySelectorAll('.attivita-card.open')].map(el => el.dataset.date)
    )
    content.querySelector('#attivita-list').innerHTML =
      days.map(d => dayCardHtml(d, dining, openIds.has(d.date))).join('')
    bindAccordion()
  }
  window.addEventListener('ideas:updated', handler)
  window.__currentPageCleanup = () => window.removeEventListener('ideas:updated', handler)
}

function dayCardHtml(day, dining, open) {
  const count = suggestionsCount(day, dining)
  return `
    <div class="attivita-card ${open ? 'open' : ''}" data-date="${day.date}">
      <button type="button" class="attivita-head" aria-expanded="${open ? 'true' : 'false'}">
        <div class="attivita-head-main">
          <span class="attivita-day">Gg. ${day.day}</span>
          <span class="attivita-loc">📍 ${day.location}</span>
          <span class="attivita-date">${formatDateIT(day.date)}</span>
        </div>
        <div class="attivita-head-right">
          <span class="attivita-count" title="${count} suggerimenti">${count}</span>
          <span class="attivita-chevron">▾</span>
        </div>
      </button>
      <div class="attivita-body">
        ${suggestionsSectionsHtml(day, dining)}
        <a href="#ideas" class="attivita-add-idea">➕ Aggiungi un'idea per questo giorno</a>
      </div>
    </div>
  `
}

function bindAccordion() {
  document.querySelectorAll('.attivita-card .attivita-head').forEach(head => {
    head.addEventListener('click', () => {
      const card = head.closest('.attivita-card')
      const open = card.classList.toggle('open')
      head.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  })
}
