(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();function x(){const t=document.getElementById("nav-toggle"),e=document.getElementById("nav-links");t==null||t.addEventListener("click",()=>{e==null||e.classList.toggle("open")}),e==null||e.querySelectorAll(".nav-link").forEach(s=>{s.addEventListener("click",()=>{e.classList.remove("open")})});function i(){const s=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(a=>{a.classList.toggle("active",a.getAttribute("href")===s)})}window.addEventListener("hashchange",i),i()}let y=null;async function g(){if(y)return y;const i=await fetch("/viaggio-croazia/data/trip.json");if(!i.ok)throw new Error(`Impossibile caricare trip.json (${i.status})`);return y=await i.json(),y}function m(t){return t?new Date(t+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}):""}function S(t){return t?new Date(t+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function k(t){const e=new Date;e.setHours(0,0,0,0);const i=new Date(t+"T00:00:00");return Math.round((i-e)/(1e3*60*60*24))}function _(t){return"★".repeat(t)+"☆".repeat(5-t)}function C(t){return t.reduce((e,i)=>e+i.nights*i.price_per_night,0)}async function T(){const t=document.getElementById("page-content");let e;try{e=await g()}catch(r){t.innerHTML=A(r.message);return}const{meta:i,days:s,hotels:a}=e,n=k(i.start_date),c=k(i.end_date),l=new Date().toISOString().slice(0,10),o=s.find(r=>r.date===l),d=s.find(r=>r.date>l),v=o||d,u=[],E=new Set;for(const r of s)E.has(r.location)||(E.add(r.location),u.push({location:r.location,day:r.day,date:r.date}));const I=a.reduce((r,h)=>r+h.nights,0);a.reduce((r,h)=>r+h.nights*h.price_per_night,0),t.innerHTML=`
    <div class="dashboard-hero">
      <h1>${i.emoji} ${i.title}</h1>
      <p class="subtitle">${i.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${m(i.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${m(i.end_date)}</span>
        <span class="date-badge">👥 ${i.travelers} viaggiatori</span>
      </div>
    </div>

    ${B(n,c)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${i.duration_days}</div>
        <div class="stat-label">Giorni totali</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📍</div>
        <div class="stat-value">${u.length}</div>
        <div class="stat-label">Destinazioni</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${a.length}</div>
        <div class="stat-label">Alloggi</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${I}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${u.map(r=>`
            <div class="route-stop">
              <span class="stop-day">Gg. ${r.day}</span>
              <span>📍 ${r.location}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${o?"Programma di oggi":d?"Prossima tappa":"Ultima tappa"}</div>
        ${v?`
          <div style="margin-bottom:0.75rem;">
            <strong>${v.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${v.location} · ${m(v.date)}
            </div>
          </div>
          <div class="activity-list">
            ${v.activities.slice(0,5).map(r=>`
              <div class="activity-item">
                <span class="activity-time">${r.time}</span>
                <span>${r.text}</span>
              </div>
            `).join("")}
            ${v.activities.length>5?`<div style="font-size:0.8rem;color:var(--color-text-muted);">+${v.activities.length-5} altre attività → <a href="#itinerary" style="color:var(--color-primary);">Vedi itinerario</a></div>`:""}
          </div>
        `:'<p style="color:var(--color-text-muted);font-size:0.9rem;">Nessuna tappa disponibile.</p>'}
      </div>
    </div>

    <div style="margin-top:1.25rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
      <a href="#itinerary" class="btn btn-primary">📅 Vai all'itinerario</a>
      <a href="#hotels" class="btn btn-outline">🏨 Controlla gli hotel</a>
      <a href="#checklist" class="btn btn-outline">✅ Apri la checklist</a>
      <a href="#map" class="btn btn-outline">🗺️ Visualizza la mappa</a>
    </div>
  `}function B(t,e){return t>0?`
      <div class="countdown-card">
        <div class="countdown-icon">✈️</div>
        <div>
          <div class="countdown-days">${t} giorni</div>
          <div class="countdown-text">alla partenza — il viaggio si avvicina!</div>
        </div>
      </div>
    `:t<=0&&e>=0?`
      <div class="countdown-card departed">
        <div class="countdown-icon">🌊</div>
        <div>
          <div class="countdown-days">Sei in Croazia!</div>
          <div class="countdown-text">Buon viaggio — ${e===0?"è l'ultimo giorno!":`ancora ${e} giorni`}</div>
        </div>
      </div>
    `:`
    <div class="countdown-card" style="background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border-color:#cbd5e1;">
      <div class="countdown-icon">🏠</div>
      <div>
        <div class="countdown-days" style="color:#475569;">Viaggio concluso</div>
        <div class="countdown-text" style="color:#64748b;">Speriamo sia stato meraviglioso!</div>
      </div>
    </div>
  `}function A(t){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${t}</p>
    </div>
  `}async function H(){var c,l;const t=document.getElementById("page-content");let e;try{e=await g()}catch(o){t.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${o.message}</p></div>`;return}const{days:i,hotels:s,meta:a}=e,n=Object.fromEntries(s.map(o=>[o.id,o]));window.__itineraryData=e,t.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${a.title} · ${a.duration_days} giorni · ${m(a.start_date)} → ${m(a.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${i.map(o=>M(o,n)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(o=>{o.addEventListener("click",()=>{const d=o.nextElementSibling,v=o.querySelector(".timeline-toggle");d==null||d.classList.toggle("hidden"),v==null||v.classList.toggle("open")})}),(c=document.getElementById("expand-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(o=>o.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(o=>o.classList.add("open"))}),(l=document.getElementById("collapse-all"))==null||l.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(o=>o.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(o=>o.classList.remove("open"))})}function M(t,e){const i=t.hotel_ref?e[t.hotel_ref]:null,s=new Date().toISOString().slice(0,10),a=t.date===s;return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num" style="${t.date<s?"background:var(--color-text-muted)":a?"background:var(--color-accent)":""}">
          ${t.day}
        </div>
        <div class="timeline-date-label">
          ${S(t.date)}<br>${t.date.slice(5).replace("-","/")}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card ${a?"card--today":""}">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${t.title}${a?' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>':""}</h3>
              <span class="timeline-location-badge">📍 ${t.location}</span>
            </div>
            <span class="timeline-toggle">▼</span>
          </div>
          <div class="timeline-card-body hidden">
            ${t.description?`<p class="timeline-description">${t.description}</p>`:""}

            <div class="activities">
              ${t.activities.map(c=>`
                <div class="activity-item with-dot">
                  <span class="activity-time">${c.time}</span>
                  <span>${c.text}</span>
                </div>
              `).join("")}
            </div>

            ${i?`
              <div class="hotel-ref-badge">
                🏨 ${i.name} · Check-in ${i.checkin} / Check-out ${i.checkout}
              </div>
            `:""}
          </div>
        </div>
      </div>
    </div>
  `}async function z(){const t=document.getElementById("page-content");let e;try{e=await g()}catch(n){t.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${n.message}</p></div>`;return}const{hotels:i}=e,s=i.reduce((n,c)=>n+c.nights,0),a=C(i);t.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${i.length} strutture · ${s} notti totali</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${i.length}</div>
        <div class="summary-label">Strutture</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${s}</div>
        <div class="summary-label">Notti totali</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${(a/1e3).toFixed(1)}k</div>
        <div class="summary-label">Costo stimato alloggi</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${Math.round(a/s)}</div>
        <div class="summary-label">Media per notte</div>
      </div>
    </div>

    <div class="hotels-grid">
      ${i.map(n=>P(n)).join("")}
    </div>
  `}function P(t){const e=t.nights,i=e*t.price_per_night;return`
    <div class="hotel-card">
      <div class="hotel-card-header">
        <div class="hotel-name">${t.name}</div>
        <div class="hotel-location">📍 ${t.location} · ${t.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${m(t.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${m(t.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${t.rating} stelle">
            ${_(t.rating)}
          </div>
          <div class="hotel-price">
            <strong>€${t.price_per_night}</strong>/notte
            · ${e} nott${e===1?"e":"i"}
            · <strong style="color:var(--color-text);">€${i}</strong>
          </div>
        </div>

        <div class="hotel-amenities">
          ${t.amenities.map(s=>`<span class="amenity-tag">${s}</span>`).join("")}
        </div>

        ${t.notes?`<div class="hotel-notes">${t.notes}</div>`:""}

        ${t.booking_ref?`
          <div style="margin-top:0.75rem; font-size:0.82rem; color:var(--color-text-muted);">
            Ref. prenotazione: <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:4px;">${t.booking_ref}</code>
          </div>
        `:""}

        ${t.phone?`
          <div style="margin-top:0.5rem; font-size:0.82rem; color:var(--color-text-muted);">
            📞 <a href="tel:${t.phone}" style="color:var(--color-primary);">${t.phone}</a>
          </div>
        `:""}
      </div>
    </div>
  `}const b="viaggio_croazia_checklist_v1";function D(){try{const t=localStorage.getItem(b);return t?JSON.parse(t):{}}catch{return{}}}function f(t){try{localStorage.setItem(b,JSON.stringify(t))}catch(e){console.warn("[storage] Impossibile salvare checklist:",e)}}function O(){try{localStorage.removeItem(b)}catch{}}async function j(){const t=document.getElementById("page-content");let e;try{e=await g()}catch(a){t.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${a.message}</p></div>`;return}const{categories:i}=e.checklist,s=D();t.innerHTML=`
    <div class="page-header">
      <h1>✅ Checklist di Viaggio</h1>
      <p>Spunta gli elementi man mano che prepari il bagaglio. I progressi vengono salvati automaticamente.</p>
    </div>

    <div class="checklist-controls">
      <div class="checklist-progress-global">
        <div class="global-progress-bar">
          <div class="global-progress-fill" id="global-fill" style="width:0%"></div>
        </div>
        <span class="global-progress-text" id="global-text">0 / 0</span>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-outline" id="check-all">✅ Seleziona tutto</button>
        <button class="btn btn-outline" id="uncheck-all">⬜ Deseleziona tutto</button>
        <button class="btn btn-outline" id="reset-btn">🔄 Reset</button>
      </div>
    </div>

    <div class="checklist-categories" id="checklist-categories">
      ${i.map(a=>N(a,s)).join("")}
    </div>
  `,p(i,s),G(i,s)}function N(t,e){const i=t.items.length,s=t.items.filter(a=>e[a.id]).length;return`
    <div class="category-card" data-cat="${t.id}">
      <div class="category-header">
        <span class="category-icon">${t.icon}</span>
        <span class="category-name">${t.name}</span>
        <span class="category-count" id="count-${t.id}">${s}/${i}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${t.id}" style="width:${i?s/i*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${t.id}">▼</span>
      </div>
      <div class="category-items" id="items-${t.id}">
        ${t.items.map(a=>q(a,e[a.id]||!1)).join("")}
      </div>
    </div>
  `}function q(t,e){return`
    <label class="checklist-item ${e?"checked":""}" data-id="${t.id}">
      <input type="checkbox" ${e?"checked":""} data-id="${t.id}" />
      <span class="checklist-item-text">${t.text}</span>
      ${t.priority!=="low"?`<span class="priority-badge priority-${t.priority}">${t.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function G(t,e){var i,s,a,n;(i=document.getElementById("checklist-categories"))==null||i.addEventListener("change",c=>{const l=c.target;if(l.type!=="checkbox")return;const o=l.dataset.id;e[o]=l.checked;const d=l.closest(".checklist-item");d==null||d.classList.toggle("checked",l.checked),f(e),K(t,e,o),p(t,e)}),document.querySelectorAll(".category-header").forEach(c=>{c.addEventListener("click",l=>{var u;if(l.target.tagName==="INPUT")return;const o=(u=c.closest(".category-card"))==null?void 0:u.dataset.cat,d=document.getElementById(`items-${o}`),v=document.getElementById(`chev-${o}`);d==null||d.classList.toggle("hidden"),v==null||v.classList.toggle("open")})}),(s=document.getElementById("check-all"))==null||s.addEventListener("click",()=>{t.forEach(c=>{c.items.forEach(l=>{e[l.id]=!0})}),f(e),$(t,e),p(t,e)}),(a=document.getElementById("uncheck-all"))==null||a.addEventListener("click",()=>{t.forEach(c=>{c.items.forEach(l=>{e[l.id]=!1})}),f(e),$(t,e),p(t,e)}),(n=document.getElementById("reset-btn"))==null||n.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(O(),t.forEach(c=>{c.items.forEach(l=>{e[l.id]=!1})}),$(t,e),p(t,e))})}function V(t,e){return t.find(i=>i.items.some(s=>s.id===e))}function K(t,e,i){const s=V(t,i);if(!s)return;const a=s.items.length,n=s.items.filter(d=>e[d.id]).length,c=a?n/a*100:0,l=document.getElementById(`count-${s.id}`),o=document.getElementById(`prog-${s.id}`);l&&(l.textContent=`${n}/${a}`),o&&(o.style.width=`${c}%`)}function p(t,e){const i=t.reduce((l,o)=>l+o.items.length,0),s=t.reduce((l,o)=>l+o.items.filter(d=>e[d.id]).length,0),a=i?s/i*100:0,n=document.getElementById("global-fill"),c=document.getElementById("global-text");n&&(n.style.width=`${a}%`),c&&(c.textContent=`${s} / ${i}`)}function $(t,e){t.forEach(i=>{const s=i.items.length,a=i.items.filter(o=>e[o.id]).length,n=s?a/s*100:0,c=document.getElementById(`count-${i.id}`),l=document.getElementById(`prog-${i.id}`);c&&(c.textContent=`${a}/${s}`),l&&(l.style.width=`${n}%`),i.items.forEach(o=>{const d=document.querySelector(`.checklist-item[data-id="${o.id}"]`),v=d==null?void 0:d.querySelector('input[type="checkbox"]');if(!d||!v)return;const u=e[o.id]||!1;v.checked=u,d.classList.toggle("checked",u)})})}async function U(){const t=document.getElementById("page-content");t.innerHTML=`
    <div class="page-header">
      <h1>🗺️ Mappa del Viaggio</h1>
      <p>Percorso completo e posizione degli alloggi</p>
    </div>
    <div class="map-container" id="map-outer">
      <div class="map-controls" id="map-controls">
        <button class="map-btn active" data-layer="all">Tutto</button>
        <button class="map-btn" data-layer="route">Solo Tappe</button>
        <button class="map-btn" data-layer="hotels">Solo Hotel</button>
      </div>
      <div id="google-map"></div>
      <div class="map-legend" id="map-legend"></div>
    </div>
  `;const e=await g();{F(t,e);return}}function F(t,e){const i=document.getElementById("map-outer");i.innerHTML=`
    <div class="map-no-key">
      <div class="map-no-key-icon">🗺️</div>
      <h3>API Key Google Maps non configurata</h3>
      <p>
        Per visualizzare la mappa interattiva crea il file
        <code>.env.local</code> nella radice del progetto con:<br><br>
        <code>VITE_GOOGLE_MAPS_API_KEY=LA_TUA_API_KEY</code><br><br>
        Poi riavvia il server di sviluppo con <code>npm run dev</code>.
        Consulta <code>src/config.template.js</code> per le istruzioni dettagliate.
      </p>
      <div style="margin-top:1rem;">
        <strong>Tappe del viaggio:</strong>
        <ul style="margin-top:0.5rem; text-align:left; color:var(--color-text-muted); font-size:0.88rem; line-height:2;">
          ${[...new Set(e.days.map(s=>s.location))].map(s=>`<li>📍 ${s}</li>`).join("")}
        </ul>
      </div>
    </div>
  `}const w={"#dashboard":T,"#itinerary":H,"#hotels":z,"#checklist":j,"#map":U};async function L(){const t=window.location.hash||"#dashboard",e=w[t]??w["#dashboard"],i=document.getElementById("page-content");i.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await e()}catch(s){console.error("[router] Errore nel rendering della pagina:",s),i.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${s.message||"Errore sconosciuto"}</p>
      </div>
    `}}x();window.addEventListener("hashchange",L);L();
