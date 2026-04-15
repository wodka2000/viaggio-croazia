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
    const hash = window.location.hash || '#dashboard'
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash)
    })
  }

  window.addEventListener('hashchange', updateActive)
  updateActive()
}
