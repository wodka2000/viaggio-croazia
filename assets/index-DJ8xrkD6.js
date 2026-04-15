(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();function I(){const e=document.getElementById("nav-toggle"),t=document.getElementById("nav-links");e==null||e.addEventListener("click",()=>{t==null||t.classList.toggle("open")}),t==null||t.querySelectorAll(".nav-link").forEach(s=>{s.addEventListener("click",()=>{t.classList.remove("open")})});function i(){const s=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(n=>{n.classList.toggle("active",n.getAttribute("href")===s)})}window.addEventListener("hashchange",i),i()}let y=null;async function g(){if(y)return y;const i=await fetch("/viaggio-croazia/data/trip.json");if(!i.ok)throw new Error(`Impossibile caricare trip.json (${i.status})`);return y=await i.json(),y}function m(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}):""}function _(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function k(e){const t=new Date;t.setHours(0,0,0,0);const i=new Date(e+"T00:00:00");return Math.round((i-t)/(1e3*60*60*24))}function S(e){return"★".repeat(e)+"☆".repeat(5-e)}async function z(){const e=document.getElementById("page-content");let t;try{t=await g()}catch(v){e.innerHTML=C(v.message);return}const{meta:i,days:s,hotels:n}=t,r=k(i.start_date),c=k(i.end_date),l=new Date().toISOString().slice(0,10),a=s.find(v=>v.date===l),o=s.find(v=>v.date>l),d=a||o,p=[],E=new Set;for(const v of s)E.has(v.location)||(E.add(v.location),p.push({location:v.location,day:v.day,date:v.date}));const x=n.reduce((v,h)=>v+h.nights,0);n.reduce((v,h)=>v+h.nights*h.price_per_night,0),e.innerHTML=`
    <div class="dashboard-hero">
      <h1>${i.emoji} ${i.title}</h1>
      <p class="subtitle">${i.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${m(i.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${m(i.end_date)}</span>
        <span class="date-badge">👥 ${i.travelers_detail||i.travelers+" viaggiatori"}</span>
      </div>
    </div>

    ${B(r,c)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${i.duration_days}</div>
        <div class="stat-label">Giorni totali</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📍</div>
        <div class="stat-value">${p.length}</div>
        <div class="stat-label">Destinazioni</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${n.length}</div>
        <div class="stat-label">Alloggi</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${x}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${p.map(v=>`
            <div class="route-stop">
              <span class="stop-day">Gg. ${v.day}</span>
              <span>📍 ${v.location}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${a?"Programma di oggi":o?"Prossima tappa":"Ultima tappa"}</div>
        ${d?`
          <div style="margin-bottom:0.75rem;">
            <strong>${d.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${d.location} · ${m(d.date)}
            </div>
          </div>
          <div class="activity-list">
            ${d.activities.slice(0,5).map(v=>`
              <div class="activity-item">
                <span class="activity-time">${v.time}</span>
                <span>${v.text}</span>
              </div>
            `).join("")}
            ${d.activities.length>5?`<div style="font-size:0.8rem;color:var(--color-text-muted);">+${d.activities.length-5} altre attività → <a href="#itinerary" style="color:var(--color-primary);">Vedi itinerario</a></div>`:""}
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
  `}function B(e,t){return e>0?`
      <div class="countdown-card">
        <div class="countdown-icon">✈️</div>
        <div>
          <div class="countdown-days">${e} giorni</div>
          <div class="countdown-text">alla partenza — il viaggio si avvicina!</div>
        </div>
      </div>
    `:e<=0&&t>=0?`
      <div class="countdown-card departed">
        <div class="countdown-icon">🌊</div>
        <div>
          <div class="countdown-days">Sei in Croazia!</div>
          <div class="countdown-text">Buon viaggio — ${t===0?"è l'ultimo giorno!":`ancora ${t} giorni`}</div>
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
  `}function C(e){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${e}</p>
    </div>
  `}async function T(){var c,l;const e=document.getElementById("page-content");let t;try{t=await g()}catch(a){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${a.message}</p></div>`;return}const{days:i,hotels:s,meta:n}=t,r=Object.fromEntries(s.map(a=>[a.id,a]));window.__itineraryData=t,e.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${n.title} · ${n.duration_days} giorni · ${m(n.start_date)} → ${m(n.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${i.map(a=>A(a,r)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(a=>{a.addEventListener("click",()=>{const o=a.nextElementSibling,d=a.querySelector(".timeline-toggle");o==null||o.classList.toggle("hidden"),d==null||d.classList.toggle("open")})}),(c=document.getElementById("expand-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(a=>a.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(a=>a.classList.add("open"))}),(l=document.getElementById("collapse-all"))==null||l.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(a=>a.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(a=>a.classList.remove("open"))})}function A(e,t){const i=e.hotel_ref?t[e.hotel_ref]:null,s=new Date().toISOString().slice(0,10),n=e.date===s;return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num" style="${e.date<s?"background:var(--color-text-muted)":n?"background:var(--color-accent)":""}">
          ${e.day}
        </div>
        <div class="timeline-date-label">
          ${_(e.date)}<br>${e.date.slice(5).replace("-","/")}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card ${n?"card--today":""}">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${e.title}${n?' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>':""}</h3>
              <span class="timeline-location-badge">📍 ${e.location}</span>
            </div>
            <span class="timeline-toggle">▼</span>
          </div>
          <div class="timeline-card-body hidden">
            ${e.description?`<p class="timeline-description">${e.description}</p>`:""}

            <div class="activities">
              ${e.activities.map(c=>`
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
  `}async function P(){const e=document.getElementById("page-content");let t;try{t=await g()}catch(a){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${a.message}</p></div>`;return}const{hotels:i}=t,s={},n=[];for(const a of i){const o=a.location_group||a.location;s[o]||(s[o]=[],n.push(o)),s[o].push(a)}const r=i.filter(a=>a.recommended&&a.price_per_night>0),c=r.reduce((a,o)=>a+o.nights,0),l=r.reduce((a,o)=>a+o.nights*o.price_per_night,0);e.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${n.length} destinazioni · ${c} notti · 3 opzioni per tappa</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${n.length}</div>
        <div class="summary-label">Destinazioni</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${c}</div>
        <div class="summary-label">Notti (opz. consigliata)</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${(l/1e3).toFixed(1)}k</div>
        <div class="summary-label">Stima opzioni consigliate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${i.filter(a=>a.status==="da_prenotare"||a.status==="da_confermare").length}</div>
        <div class="summary-label">Da prenotare</div>
      </div>
    </div>

    ${n.map(a=>{var o,d;return`
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${a}</span>
          <span class="hotels-group-nights">${(o=s[a][0])!=null&&o.nights?s[a][0].nights+" nott"+(s[a][0].nights===1?"e":"i"):""} · ${(d=s[a][0])!=null&&d.checkin?m(s[a][0].checkin)+" → "+m(s[a][0].checkout):""}</span>
        </div>
        <div class="hotels-grid">
          ${s[a].map(p=>D(p)).join("")}
        </div>
      </div>
    `}).join("")}
  `}function D(e){const t=e.nights,i=t*e.price_per_night,n=e.booking_ref&&e.booking_ref.length>0?'<span class="hotel-status-badge badge-prenotato">✅ Prenotato</span>':e.status==="da_confermare"?'<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>':'<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>',r=e.recommended?'<span class="hotel-recommended-badge">⭐ Consigliato</span>':'<span class="hotel-alt-badge">Alternativa</span>';return`
    <div class="hotel-card ${e.recommended?"hotel-card--recommended":""}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${e.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${r}
            ${n}
          </div>
        </div>
        <div class="hotel-location">📍 ${e.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${m(e.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${m(e.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${e.rating} stelle">
            ${e.rating>0?S(e.rating):'<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
          </div>
          <div class="hotel-price">
            ${e.price_per_night>0?`<strong>€${e.price_per_night}</strong>/notte · ${t} nott${t===1?"e":"i"} · <strong style="color:var(--color-text);">€${i}</strong>`:'<span style="color:var(--color-text-muted);">Prezzo da definire</span>'}
          </div>
        </div>

        <div class="hotel-amenities">
          ${e.amenities.map(c=>`<span class="amenity-tag">${c}</span>`).join("")}
        </div>

        ${e.notes?`<div class="hotel-notes">${e.notes}</div>`:""}

        ${e.booking_ref?`
          <div style="margin-top:0.75rem; font-size:0.82rem; color:var(--color-text-muted);">
            Ref. prenotazione: <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:4px;">${e.booking_ref}</code>
          </div>
        `:""}

        ${e.phone?`
          <div style="margin-top:0.5rem; font-size:0.82rem;">
            📞 <a href="tel:${e.phone}" style="color:var(--color-primary);">${e.phone}</a>
          </div>
        `:""}
      </div>
    </div>
  `}const $="viaggio_croazia_checklist_v1";function H(){try{const e=localStorage.getItem($);return e?JSON.parse(e):{}}catch{return{}}}function f(e){try{localStorage.setItem($,JSON.stringify(e))}catch(t){console.warn("[storage] Impossibile salvare checklist:",t)}}function M(){try{localStorage.removeItem($)}catch{}}async function j(){const e=document.getElementById("page-content");let t;try{t=await g()}catch(n){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${n.message}</p></div>`;return}const{categories:i}=t.checklist,s=H();e.innerHTML=`
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
      ${i.map(n=>O(n,s)).join("")}
    </div>
  `,u(i,s),q(i,s)}function O(e,t){const i=e.items.length,s=e.items.filter(n=>t[n.id]).length;return`
    <div class="category-card" data-cat="${e.id}">
      <div class="category-header">
        <span class="category-icon">${e.icon}</span>
        <span class="category-name">${e.name}</span>
        <span class="category-count" id="count-${e.id}">${s}/${i}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${e.id}" style="width:${i?s/i*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${e.id}">▼</span>
      </div>
      <div class="category-items" id="items-${e.id}">
        ${e.items.map(n=>N(n,t[n.id]||!1)).join("")}
      </div>
    </div>
  `}function N(e,t){return`
    <label class="checklist-item ${t?"checked":""}" data-id="${e.id}">
      <input type="checkbox" ${t?"checked":""} data-id="${e.id}" />
      <span class="checklist-item-text">${e.text}</span>
      ${e.priority!=="low"?`<span class="priority-badge priority-${e.priority}">${e.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function q(e,t){var i,s,n,r;(i=document.getElementById("checklist-categories"))==null||i.addEventListener("change",c=>{const l=c.target;if(l.type!=="checkbox")return;const a=l.dataset.id;t[a]=l.checked;const o=l.closest(".checklist-item");o==null||o.classList.toggle("checked",l.checked),f(t),V(e,t,a),u(e,t)}),document.querySelectorAll(".category-header").forEach(c=>{c.addEventListener("click",l=>{var p;if(l.target.tagName==="INPUT")return;const a=(p=c.closest(".category-card"))==null?void 0:p.dataset.cat,o=document.getElementById(`items-${a}`),d=document.getElementById(`chev-${a}`);o==null||o.classList.toggle("hidden"),d==null||d.classList.toggle("open")})}),(s=document.getElementById("check-all"))==null||s.addEventListener("click",()=>{e.forEach(c=>{c.items.forEach(l=>{t[l.id]=!0})}),f(t),b(e,t),u(e,t)}),(n=document.getElementById("uncheck-all"))==null||n.addEventListener("click",()=>{e.forEach(c=>{c.items.forEach(l=>{t[l.id]=!1})}),f(t),b(e,t),u(e,t)}),(r=document.getElementById("reset-btn"))==null||r.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(M(),e.forEach(c=>{c.items.forEach(l=>{t[l.id]=!1})}),b(e,t),u(e,t))})}function G(e,t){return e.find(i=>i.items.some(s=>s.id===t))}function V(e,t,i){const s=G(e,i);if(!s)return;const n=s.items.length,r=s.items.filter(o=>t[o.id]).length,c=n?r/n*100:0,l=document.getElementById(`count-${s.id}`),a=document.getElementById(`prog-${s.id}`);l&&(l.textContent=`${r}/${n}`),a&&(a.style.width=`${c}%`)}function u(e,t){const i=e.reduce((l,a)=>l+a.items.length,0),s=e.reduce((l,a)=>l+a.items.filter(o=>t[o.id]).length,0),n=i?s/i*100:0,r=document.getElementById("global-fill"),c=document.getElementById("global-text");r&&(r.style.width=`${n}%`),c&&(c.textContent=`${s} / ${i}`)}function b(e,t){e.forEach(i=>{const s=i.items.length,n=i.items.filter(a=>t[a.id]).length,r=s?n/s*100:0,c=document.getElementById(`count-${i.id}`),l=document.getElementById(`prog-${i.id}`);c&&(c.textContent=`${n}/${s}`),l&&(l.style.width=`${r}%`),i.items.forEach(a=>{const o=document.querySelector(`.checklist-item[data-id="${a.id}"]`),d=o==null?void 0:o.querySelector('input[type="checkbox"]');if(!o||!d)return;const p=t[a.id]||!1;d.checked=p,o.classList.toggle("checked",p)})})}async function K(){const e=document.getElementById("page-content");e.innerHTML=`
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
  `;const t=await g();{U(e,t);return}}function U(e,t){const i=document.getElementById("map-outer");i.innerHTML=`
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
          ${[...new Set(t.days.map(s=>s.location))].map(s=>`<li>📍 ${s}</li>`).join("")}
        </ul>
      </div>
    </div>
  `}const w={"#dashboard":z,"#itinerary":T,"#hotels":P,"#checklist":j,"#map":K};async function L(){const e=window.location.hash||"#dashboard",t=w[e]??w["#dashboard"],i=document.getElementById("page-content");i.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await t()}catch(s){console.error("[router] Errore nel rendering della pagina:",s),i.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${s.message||"Errore sconosciuto"}</p>
      </div>
    `}}I();window.addEventListener("hashchange",L);L();
