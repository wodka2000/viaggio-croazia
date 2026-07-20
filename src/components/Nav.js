export function initNav() {
  const toggle = document.getElementById('nav-toggle')
  const links = document.getElementById('nav-links')

  // Hamburger menu mobile
  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open')
  })

  // Chiudi menu al click su link (mobile)
  links?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open')
    })
  })

  // Aggiorna link attivo al cambio hash
  function updateActive() {
    // Solo la parte prima della barra: #itinerary/2026-08-08 e' pur sempre la
    // pagina Itinerario, e la voce di menu deve restare evidenziata.
    const hash = (window.location.hash || '#dashboard').split('/')[0]
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash)
    })
  }

  window.addEventListener('hashchange', updateActive)
  updateActive()
}
