// ============================================================
// CONFIGURAZIONE GOOGLE MAPS API KEY
// ============================================================
//
// PER SVILUPPO LOCALE:
//   1. Copia il file .env.example come .env.local
//   2. Inserisci la tua API key nel file .env.local:
//      VITE_GOOGLE_MAPS_API_KEY=AIzaSy...tuaChiaveQui
//   3. Il file .env.local è nel .gitignore — non verrà committato
//
// PER GITHUB PAGES (DEPLOY):
//   1. Vai su GitHub → Settings → Secrets and variables → Actions
//   2. Crea un secret chiamato: GOOGLE_MAPS_API_KEY
//   3. Il workflow .github/workflows/deploy.yml lo usa automaticamente
//
// PER OTTENERE UNA API KEY:
//   1. Vai su https://console.cloud.google.com/
//   2. Crea o seleziona un progetto
//   3. Abilita "Maps JavaScript API"
//   4. Crea credenziali → API key
//   5. Imposta restrizione per referrer HTTP:
//      - https://tuousername.github.io/*
//      - http://localhost:5173/* (per sviluppo)
//
// ============================================================
//
// Questo file è solo documentazione. Non viene importato dal codice.
// L'app legge la chiave tramite: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//
// ============================================================
