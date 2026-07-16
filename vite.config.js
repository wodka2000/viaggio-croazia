import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Imposta il base path uguale al nome del repository GitHub.
// Esempio: se il repo si chiama "Viaggio_Croazia", il base è '/Viaggio_Croazia/'.
// Cambia VITE_BASE_PATH nel file .env se il repo ha un nome diverso.
const base = process.env.VITE_BASE_PATH || '/viaggio-croazia/'

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  plugins: [
    VitePWA({
      // L'app serve in viaggio, dove la rete manca: senza service worker il
      // browser deve scaricare index.html e il bundle a ogni apertura, quindi
      // offline non parte proprio. Qui li mettiamo in cache all'installazione.
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      workbox: {
        // Il guscio dell'app + i dati del viaggio. trip.json fa parte del build
        // (viene da public/), quindi a ogni deploy cambia il service worker e i
        // dati nuovi arrivano da soli: si conserva l'intento di freschezza che
        // c'era dietro il vecchio fetch con cache:'no-cache'.
        globPatterns: ['**/*.{js,css,html,json,kml,svg,ico,png,webmanifest}'],
        // La guida allegata puo essere decine di MB: sta in IndexedDB, non qui,
        // ma alziamo comunque il limite per non far fallire il precache.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,

        runtimeCaching: [
          {
            // Google Maps: rete quando c'e, altrimenti si arrangia la pagina
            // (vedi Map.js, che mostra un avviso offline). Cache breve: le
            // condizioni d'uso di Google non permettono di conservare le mappe.
            urlPattern: /^https:\/\/maps\.googleapis\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },

      manifest: {
        name: 'Estate 2026 — Croazia e Dolomiti',
        short_name: 'Estate 2026',
        description: 'Itinerario, attività, hotel, mappa e biglietti del viaggio.',
        lang: 'it',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
