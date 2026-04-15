import { defineConfig } from 'vite'

// Imposta il base path uguale al nome del repository GitHub.
// Esempio: se il repo si chiama "Viaggio_Croazia", il base è '/Viaggio_Croazia/'.
// Cambia VITE_BASE_PATH nel file .env se il repo ha un nome diverso.
const base = process.env.VITE_BASE_PATH || '/Viaggio_Croazia/'

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
