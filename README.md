# Viaggio Croazia e Sesto 2026

Pianificatore di viaggio statico — deployabile su GitHub Pages.

**Itinerario**: 13 giorni · 8 – 20 agosto 2026  
**Viaggiatori**: 2 adulti + 3 bambini (8, 6, 2 anni)  
**Destinazioni**: Ancona → Brač → Zara → Rovigno → Trieste → Sesto

---

## Funzionalità

| Sezione | Descrizione |
|---------|-------------|
| 🏠 Dashboard | Countdown alla partenza, statistiche, prossima tappa |
| 📅 Itinerario | Timeline giorno per giorno con attività espandibili |
| 🍽️ Prenotazioni | Gestite in **Note logistiche**: aggiungi una prenotazione (locale, esperienza) con link diretto a Google Maps e allega la conferma (`.eml`, `.pdf` o foto, salvata su dispositivo via IndexedDB). Nel giorno della prenotazione il link a Maps compare tra le attività dell'itinerario. La prenotazione confermata è in `trip.json`, le tue restano in localStorage |
| 🏨 Hotel | Schede alloggi con date, prezzi, servizi |
| ✅ Checklist | Lista di imballaggio per categoria, persistente via localStorage |
| 🗺️ Mappa | Google Maps interattiva con route e marker hotel |

---

## Avvio locale

```
npm install
npm run dev
```

L'app è disponibile su `http://localhost:5173`.

---

## Configurare la API Key Google Maps

### Per sviluppo locale

1. Copia `.env.example` come `.env.local`:
   ```
   cp .env.example .env.local
   ```

2. Modifica `.env.local` e inserisci la tua chiave:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...tuaChiaveQui
   ```

3. Riavvia `npm run dev`.

### Ottenere la chiave

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Crea o seleziona un progetto
3. Abilita **Maps JavaScript API**
4. Crea credenziali → API key
5. Imposta la restrizione per referrer HTTP:
   - `https://TUOUSERNAME.github.io/*`
   - `http://localhost:5173/*`

---

## Deploy su GitHub Pages

### 1. Crea il repository su GitHub

```
git remote add origin https://github.com/TUOUSERNAME/Viaggio_Croazia.git
git branch -m master main
git push -u origin main
```

### 2. Configura i secrets GitHub

Vai su **GitHub → Repository → Settings → Secrets and variables → Actions** e crea:

| Nome secret | Valore |
|-------------|--------|
| `GOOGLE_MAPS_API_KEY` | La tua API key Google Maps |
| `VITE_BASE_PATH` | `/Viaggio_Croazia/` (solo se il repo ha un nome diverso) |

### 3. Abilita GitHub Pages

Vai su **Settings → Pages**:
- Source: `Deploy from a branch`
- Branch: `gh-pages` / `/ (root)`

### 4. Push su `main` per avviare il deploy

Il workflow `.github/workflows/deploy.yml` esegue automaticamente `npm run build` e pubblica su GitHub Pages.

L'app sarà disponibile su:
```
https://TUOUSERNAME.github.io/Viaggio_Croazia/
```

---

## Struttura del progetto

```
Viaggio_Croazia/
├── index.html                   # Entry point Vite
├── package.json
├── vite.config.js               # Base path GitHub Pages
├── .env.example                 # Template variabili d'ambiente
├── .gitignore
├── README.md
│
├── public/
│   └── data/
│       └── trip.json            # Dati del viaggio (itinerario, hotel, checklist)
│
├── src/
│   ├── main.js                  # Router hash-based
│   ├── styles.css               # Stili globali (tema Adriatico)
│   ├── config.template.js       # Documentazione configurazione API key
│   │
│   ├── components/
│   │   ├── Nav.js               # Navbar con menu mobile
│   │   └── Map.js               # Google Maps + marker + route
│   │
│   ├── pages/
│   │   ├── dashboard.js         # Dashboard con countdown e stats
│   │   ├── itinerary.js         # Timeline giorno per giorno
│   │   ├── hotels.js            # Schede hotel
│   │   └── checklist.js         # Checklist con localStorage
│   │
│   └── utils/
│       ├── data.js              # fetchTripData + helper date
│       └── storage.js           # localStorage per checklist
│
└── .github/
    └── workflows/
        └── deploy.yml           # CI/CD GitHub Pages
```

---

## Modificare i dati del viaggio

Tutto il contenuto si trova in `public/data/trip.json`.

- **Aggiungere una tappa**: aggiungi un oggetto nell'array `days`
- **Modificare un hotel**: modifica l'oggetto corrispondente in `hotels`
- **Aggiungere elementi alla checklist**: aggiungi oggetti in `checklist.categories[*].items`

Il formato `id` degli item checklist deve essere univoco (es. `"doc_11"`, `"ele_9"`).

---

## Note tecniche

- **Routing**: hash-based (`#dashboard`, `#itinerary`, ecc.) — compatibile con static hosting senza configurazione server
- **Dati**: caricati da `public/data/trip.json` via `fetch()` usando `import.meta.env.BASE_URL`
- **Checklist**: stato persistito in `localStorage` con chiave `viaggio_croazia_checklist_v1`
- **Google Maps**: caricamento dinamico dello script — se la API key non è configurata, viene mostrato un placeholder con istruzioni
