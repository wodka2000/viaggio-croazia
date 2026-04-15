(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const d of n)if(d.type==="childList")for(const s of d.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function a(n){const d={};return n.integrity&&(d.integrity=n.integrity),n.referrerPolicy&&(d.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?d.credentials="include":n.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function i(n){if(n.ep)return;n.ep=!0;const d=a(n);fetch(n.href,d)}})();function W(){const e=document.getElementById("nav-toggle"),t=document.getElementById("nav-links");e==null||e.addEventListener("click",()=>{t==null||t.classList.toggle("open")}),t==null||t.querySelectorAll(".nav-link").forEach(i=>{i.addEventListener("click",()=>{t.classList.remove("open")})});function a(){const i=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(n=>{n.classList.toggle("active",n.getAttribute("href")===i)})}window.addEventListener("hashchange",a),a()}let L=null;async function E(){if(L)return L;const a=await fetch("/viaggio-croazia/data/trip.json");if(!a.ok)throw new Error(`Impossibile caricare trip.json (${a.status})`);return L=await a.json(),L}function v(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}):""}function Z(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function D(e){const t=new Date;t.setHours(0,0,0,0);const a=new Date(e+"T00:00:00");return Math.round((a-t)/(1e3*60*60*24))}function Q(e){return"★".repeat(e)+"☆".repeat(5-e)}async function X(){const e=document.getElementById("page-content");let t;try{t=await E()}catch(u){e.innerHTML=te(u.message);return}const{meta:a,days:i,hotels:n}=t,d=D(a.start_date),s=D(a.end_date),l=new Date().toISOString().slice(0,10),c=i.find(u=>u.date===l),o=i.find(u=>u.date>l),r=c||o,p=[],h=new Set;for(const u of i)h.has(u.location)||(h.add(u.location),p.push({location:u.location,day:u.day,date:u.date}));const y=n.reduce((u,f)=>u+f.nights,0);n.reduce((u,f)=>u+f.nights*f.price_per_night,0),e.innerHTML=`
    <div class="dashboard-hero">
      <h1>${a.emoji} ${a.title}</h1>
      <p class="subtitle">${a.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${v(a.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${v(a.end_date)}</span>
        <span class="date-badge">👥 ${a.travelers_detail||a.travelers+" viaggiatori"}</span>
      </div>
    </div>

    ${ee(d,s)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${a.duration_days}</div>
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
        <div class="stat-value">${y}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${p.map(u=>`
            <div class="route-stop">
              <span class="stop-day">Gg. ${u.day}</span>
              <span>📍 ${u.location}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${c?"Programma di oggi":o?"Prossima tappa":"Ultima tappa"}</div>
        ${r?`
          <div style="margin-bottom:0.75rem;">
            <strong>${r.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${r.location} · ${v(r.date)}
            </div>
          </div>
          <div class="activity-list">
            ${r.activities.slice(0,5).map(u=>`
              <div class="activity-item">
                <span class="activity-time">${u.time}</span>
                <span>${u.text}</span>
              </div>
            `).join("")}
            ${r.activities.length>5?`<div style="font-size:0.8rem;color:var(--color-text-muted);">+${r.activities.length-5} altre attività → <a href="#itinerary" style="color:var(--color-primary);">Vedi itinerario</a></div>`:""}
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
  `}function ee(e,t){return e>0?`
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
  `}function te(e){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${e}</p>
    </div>
  `}const G="viaggio_croazia_ideas_v1";function ae(){return"idea_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function g(){try{const e=localStorage.getItem(G);return e?JSON.parse(e):[]}catch{return[]}}function M(e){try{localStorage.setItem(G,JSON.stringify(e)),window.dispatchEvent(new CustomEvent("ideas:updated",{detail:{ideas:e}}))}catch(t){console.warn("[ideas] localStorage non disponibile:",t)}}function F(e){const t=g(),a={id:ae(),text:"",note:"",created_at:new Date().toISOString(),day_date:null,location_name:null,coordinates:null,add_to_checklist:!1,add_to_map:!1,marker_color:"#f59e0b",completed:!1,...e};return t.unshift(a),M(t),a}function z(e,t){const a=g(),i=a.findIndex(n=>n.id===e);return i===-1?null:(a[i]={...a[i],...t},M(a),a[i])}function V(e){M(g().filter(t=>t.id!==e))}function ie(e){return g().filter(t=>t.day_date===e)}function ne(){return g().filter(e=>e.add_to_checklist)}async function se(){var l,c;const e=document.getElementById("page-content");let t;try{t=await E()}catch(o){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${o.message}</p></div>`;return}const{days:a,hotels:i,meta:n}=t,d=Object.fromEntries(i.map(o=>[o.id,o]));e.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${n.title} · ${n.duration_days} giorni · ${v(n.start_date)} → ${v(n.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${a.map(o=>de(o,d)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(o=>{o.addEventListener("click",()=>{const r=o.nextElementSibling,p=o.querySelector(".timeline-toggle");r==null||r.classList.toggle("hidden"),p==null||p.classList.toggle("open")})}),(l=document.getElementById("expand-all"))==null||l.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(o=>o.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(o=>o.classList.add("open"))}),(c=document.getElementById("collapse-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(o=>o.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(o=>o.classList.remove("open"))}),oe(a);const s=()=>{document.querySelectorAll(".day-ideas-section").forEach(o=>{const r=o.dataset.date;r&&(o.innerHTML=R(r))})};window.addEventListener("ideas:updated",s),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",s)}function de(e,t){const a=e.hotel_ref?t[e.hotel_ref]:null,i=new Date().toISOString().slice(0,10),n=e.date===i,d=e.date<i,s=e.coordinates?JSON.stringify(e.coordinates):"null";return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num"
          style="${d?"background:var(--color-text-muted)":n?"background:var(--color-accent)":""}">
          ${e.day}
        </div>
        <div class="timeline-date-label">
          ${Z(e.date)}<br>${e.date.slice(5).replace("-","/")}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card">
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
              ${e.activities.map(l=>`
                <div class="activity-item with-dot">
                  <span class="activity-time">${l.time}</span>
                  <span>${l.text}</span>
                </div>
              `).join("")}
            </div>

            ${a?`
              <div class="hotel-ref-badge">
                🏨 ${a.name} · Check-in ${a.checkin} / Check-out ${a.checkout}
              </div>
            `:""}

            <!-- SEZIONE IDEE DEL GIORNO -->
            <div class="day-ideas-wrap">
              <div class="day-ideas-section" id="day-ideas-${e.date}" data-date="${e.date}">
                ${R(e.date)}
              </div>
              <button class="day-add-idea-btn"
                data-date="${e.date}"
                data-coords='${s}'
                data-location="${e.location}">
                💡 Aggiungi idea
              </button>
              <form class="day-quick-form hidden" id="quick-form-${e.date}" data-date="${e.date}">
                <input type="text" class="quick-idea-text idea-input" placeholder="Descrivi l'idea…" />
                <div class="quick-form-checks">
                  <label class="idea-check-label">
                    <input type="checkbox" class="quick-checklist" /> 📋 Checklist
                  </label>
                  <label class="idea-check-label">
                    <input type="checkbox" class="quick-map" /> 🗺️ Mappa
                  </label>
                </div>
                <div style="display:flex;gap:0.5rem;">
                  <button type="submit" class="btn btn-primary" style="font-size:0.82rem;padding:0.35rem 0.75rem;">Salva</button>
                  <button type="button" class="btn btn-outline quick-cancel" style="font-size:0.82rem;padding:0.35rem 0.75rem;">Annulla</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function R(e){const t=ie(e);return t.length===0?"":t.map(a=>`
    <div class="day-idea-pill ${a.completed?"day-idea-pill--done":""}" data-id="${a.id}">
      <span class="day-idea-text">${ce(a.text)}</span>
      ${a.add_to_checklist?'<span class="idea-tiny-badge">📋</span>':""}
      ${a.add_to_map?'<span class="idea-tiny-badge">🗺️</span>':""}
      ${a.completed?'<span class="idea-tiny-badge">✅</span>':""}
      <button class="day-idea-del" data-id="${a.id}" title="Elimina">×</button>
    </div>
  `).join("")}function oe(e){const t=document.querySelector(".timeline");t&&(t.addEventListener("click",a=>{var s,l;const i=a.target.closest(".day-add-idea-btn");if(i){const c=i.dataset.date,o=document.getElementById(`quick-form-${c}`);if(!o)return;const r=o.classList.contains("hidden");document.querySelectorAll(".day-quick-form").forEach(p=>p.classList.add("hidden")),r&&(o.classList.remove("hidden"),(s=o.querySelector(".quick-idea-text"))==null||s.focus())}const n=a.target.closest(".quick-cancel");n&&((l=n.closest(".day-quick-form"))==null||l.classList.add("hidden"));const d=a.target.closest(".day-idea-del");if(d){const c=d.dataset.id;confirm("Eliminare questa idea?")&&V(c)}}),t.addEventListener("submit",a=>{var o,r,p,h;const i=a.target.closest(".day-quick-form");if(!i)return;a.preventDefault();const n=(o=i.querySelector(".quick-idea-text"))==null?void 0:o.value.trim();if(!n){(r=i.querySelector(".quick-idea-text"))==null||r.focus();return}const d=i.dataset.date,s=e.find(y=>y.date===d),l=(p=i.querySelector(".quick-map"))==null?void 0:p.checked,c=(h=i.querySelector(".quick-checklist"))==null?void 0:h.checked;F({text:n,day_date:d,location_name:(s==null?void 0:s.location)??null,coordinates:l&&(s!=null&&s.coordinates)?s.coordinates:null,add_to_checklist:!!c,add_to_map:!!(l&&(s!=null&&s.coordinates))}),i.querySelector(".quick-idea-text").value="",i.querySelector(".quick-map").checked=!1,i.querySelector(".quick-checklist").checked=!1,i.classList.add("hidden")}))}function ce(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function le(){const e=document.getElementById("page-content");let t;try{t=await E()}catch(c){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${c.message}</p></div>`;return}const{hotels:a}=t,i={},n=[];for(const c of a){const o=c.location_group||c.location;i[o]||(i[o]=[],n.push(o)),i[o].push(c)}const d=a.filter(c=>c.recommended&&c.price_per_night>0),s=d.reduce((c,o)=>c+o.nights,0),l=d.reduce((c,o)=>c+o.nights*o.price_per_night,0);e.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${n.length} destinazioni · ${s} notti · 3 opzioni per tappa</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${n.length}</div>
        <div class="summary-label">Destinazioni</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${s}</div>
        <div class="summary-label">Notti (opz. consigliata)</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${(l/1e3).toFixed(1)}k</div>
        <div class="summary-label">Stima opzioni consigliate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${a.filter(c=>c.status==="da_prenotare"||c.status==="da_confermare").length}</div>
        <div class="summary-label">Da prenotare</div>
      </div>
    </div>

    ${n.map(c=>{var o,r;return`
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${c}</span>
          <span class="hotels-group-nights">${(o=i[c][0])!=null&&o.nights?i[c][0].nights+" nott"+(i[c][0].nights===1?"e":"i"):""} · ${(r=i[c][0])!=null&&r.checkin?v(i[c][0].checkin)+" → "+v(i[c][0].checkout):""}</span>
        </div>
        <div class="hotels-grid">
          ${i[c].map(p=>re(p)).join("")}
        </div>
      </div>
    `}).join("")}
  `}function re(e){const t=e.nights,a=t*e.price_per_night,n=e.booking_ref&&e.booking_ref.length>0?'<span class="hotel-status-badge badge-prenotato">✅ Prenotato</span>':e.status==="da_confermare"?'<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>':'<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>',d=e.recommended?'<span class="hotel-recommended-badge">⭐ Consigliato</span>':'<span class="hotel-alt-badge">Alternativa</span>';return`
    <div class="hotel-card ${e.recommended?"hotel-card--recommended":""}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${e.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${d}
            ${n}
          </div>
        </div>
        <div class="hotel-location">📍 ${e.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${v(e.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${v(e.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${e.rating} stelle">
            ${e.rating>0?Q(e.rating):'<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
          </div>
          <div class="hotel-price">
            ${e.price_per_night>0?`<strong>€${e.price_per_night}</strong>/notte · ${t} nott${t===1?"e":"i"} · <strong style="color:var(--color-text);">€${a}</strong>`:'<span style="color:var(--color-text-muted);">Prezzo da definire</span>'}
          </div>
        </div>

        <div class="hotel-amenities">
          ${e.amenities.map(s=>`<span class="amenity-tag">${s}</span>`).join("")}
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
  `}const T="viaggio_croazia_checklist_v1";function ue(){try{const e=localStorage.getItem(T);return e?JSON.parse(e):{}}catch{return{}}}function B(e){try{localStorage.setItem(T,JSON.stringify(e))}catch(t){console.warn("[storage] Impossibile salvare checklist:",t)}}function pe(){try{localStorage.removeItem(T)}catch{}}async function ve(){const e=document.getElementById("page-content");let t;try{t=await E()}catch(d){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${d.message}</p></div>`;return}const{categories:a}=t.checklist,i=ue();e.innerHTML=`
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
      ${a.map(d=>me(d,i)).join("")}
    </div>

    <!-- Sezione idee da checklist (sincronizzata) -->
    <div id="checklist-ideas-section">
      ${H()}
    </div>
  `,_(a,i),he(a,i);const n=()=>{const d=document.getElementById("checklist-ideas-section");d&&(d.innerHTML=H(),N())};window.addEventListener("ideas:updated",n),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",n),N()}function H(){const e=ne();if(e.length===0)return"";const t=e.filter(n=>n.completed).length,a=e.length,i=a?t/a*100:0;return`
    <div class="category-card" id="ideas-checklist-card">
      <div class="category-header">
        <span class="category-icon">💡</span>
        <span class="category-name">Idee / Da fare</span>
        <span class="category-count" id="ideas-cl-count">${t}/${a}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="ideas-cl-prog" style="width:${i}%"></div>
        </div>
        <span class="category-chevron" id="ideas-cl-chev">▼</span>
      </div>
      <div class="category-items" id="ideas-cl-items">
        ${e.map(n=>`
          <label class="checklist-item ${n.completed?"checked":""}"
            data-idea-id="${n.id}">
            <input type="checkbox" data-idea-id="${n.id}" ${n.completed?"checked":""} />
            <span class="checklist-item-text">${O(n.text)}</span>
            ${n.location_name?`<span class="priority-badge" style="background:#eff6ff;color:var(--color-primary)">📍 ${O(n.location_name)}</span>`:""}
          </label>
        `).join("")}
        <div style="padding:0.5rem 1.25rem;">
          <a href="#ideas" class="btn btn-outline" style="font-size:0.78rem;padding:0.3rem 0.75rem;">
            + Aggiungi idea dalla sezione Idee
          </a>
        </div>
      </div>
    </div>
  `}function N(){var e,t;(e=document.querySelector("#ideas-checklist-card .category-header"))==null||e.addEventListener("click",a=>{var i,n;a.target.tagName!=="INPUT"&&((i=document.getElementById("ideas-cl-items"))==null||i.classList.toggle("hidden"),(n=document.getElementById("ideas-cl-chev"))==null||n.classList.toggle("open"))}),(t=document.getElementById("ideas-cl-items"))==null||t.addEventListener("change",a=>{const i=a.target;if(i.type!=="checkbox")return;const n=i.dataset.ideaId;n&&z(n,{completed:i.checked})})}function me(e,t){const a=e.items.length,i=e.items.filter(n=>t[n.id]).length;return`
    <div class="category-card" data-cat="${e.id}">
      <div class="category-header">
        <span class="category-icon">${e.icon}</span>
        <span class="category-name">${e.name}</span>
        <span class="category-count" id="count-${e.id}">${i}/${a}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${e.id}" style="width:${a?i/a*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${e.id}">▼</span>
      </div>
      <div class="category-items" id="items-${e.id}">
        ${e.items.map(n=>ge(n,t[n.id]||!1)).join("")}
      </div>
    </div>
  `}function ge(e,t){return`
    <label class="checklist-item ${t?"checked":""}" data-id="${e.id}">
      <input type="checkbox" ${t?"checked":""} data-id="${e.id}" />
      <span class="checklist-item-text">${e.text}</span>
      ${e.priority!=="low"?`<span class="priority-badge priority-${e.priority}">${e.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function he(e,t){var a,i,n,d;(a=document.getElementById("checklist-categories"))==null||a.addEventListener("change",s=>{var o;const l=s.target;if(l.type!=="checkbox")return;const c=l.dataset.id;t[c]=l.checked,(o=l.closest(".checklist-item"))==null||o.classList.toggle("checked",l.checked),B(t),fe(e,t,c),_(e,t)}),document.querySelectorAll(".category-header").forEach(s=>{s.addEventListener("click",l=>{var o,r,p;if(l.target.tagName==="INPUT")return;const c=(o=s.closest(".category-card"))==null?void 0:o.dataset.cat;(r=document.getElementById(`items-${c}`))==null||r.classList.toggle("hidden"),(p=document.getElementById(`chev-${c}`))==null||p.classList.toggle("open")})}),(i=document.getElementById("check-all"))==null||i.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(l=>{t[l.id]=!0})),B(t),q(e,t),_(e,t)}),(n=document.getElementById("uncheck-all"))==null||n.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(l=>{t[l.id]=!1})),B(t),q(e,t),_(e,t)}),(d=document.getElementById("reset-btn"))==null||d.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(pe(),e.forEach(s=>s.items.forEach(l=>{t[l.id]=!1})),q(e,t),_(e,t))})}function fe(e,t,a){const i=e.find(o=>o.items.some(r=>r.id===a));if(!i)return;const n=i.items.length,d=i.items.filter(o=>t[o.id]).length,s=n?d/n*100:0,l=document.getElementById(`count-${i.id}`),c=document.getElementById(`prog-${i.id}`);l&&(l.textContent=`${d}/${n}`),c&&(c.style.width=`${s}%`)}function _(e,t){const a=e.reduce((l,c)=>l+c.items.length,0),i=e.reduce((l,c)=>l+c.items.filter(o=>t[o.id]).length,0),n=a?i/a*100:0,d=document.getElementById("global-fill"),s=document.getElementById("global-text");d&&(d.style.width=`${n}%`),s&&(s.textContent=`${i} / ${a}`)}function q(e,t){e.forEach(a=>{const i=a.items.length,n=a.items.filter(c=>t[c.id]).length,d=i?n/i*100:0,s=document.getElementById(`count-${a.id}`),l=document.getElementById(`prog-${a.id}`);s&&(s.textContent=`${n}/${i}`),l&&(l.style.width=`${d}%`),a.items.forEach(c=>{const o=document.querySelector(`.checklist-item[data-id="${c.id}"]`),r=o==null?void 0:o.querySelector('input[type="checkbox"]');!o||!r||(r.checked=t[c.id]||!1,o.classList.toggle("checked",r.checked))})})}function O(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}let P=null;async function ye(){const e=document.getElementById("page-content");e.innerHTML=`
    <div class="page-header">
      <h1>🗺️ Mappa del Viaggio</h1>
      <p>Percorso completo, alloggi e idee geo-localizzate</p>
    </div>
    <div class="map-container" id="map-outer">
      <div class="map-controls" id="map-controls">
        <button class="map-btn active" data-layer="all">Tutto</button>
        <button class="map-btn" data-layer="route">Solo Tappe</button>
        <button class="map-btn" data-layer="hotels">Solo Hotel</button>
        <button class="map-btn" data-layer="ideas">💡 Idee</button>
      </div>
      <div id="google-map"></div>
      <div class="map-legend" id="map-legend"></div>
    </div>
  `,P=await E();{be(e,P);return}}function be(e,t){document.getElementById("map-outer").innerHTML=`
    <div class="map-no-key">
      <div class="map-no-key-icon">🗺️</div>
      <h3>API Key Google Maps non configurata</h3>
      <p>
        Crea il file <code>.env.local</code> con:<br><br>
        <code>VITE_GOOGLE_MAPS_API_KEY=LA_TUA_API_KEY</code><br><br>
        Poi riavvia con <code>npm run dev</code>.
        Vedi <code>src/config.template.js</code> per le istruzioni.
      </p>
      <div style="margin-top:1rem;text-align:left;">
        <strong>Tappe del viaggio:</strong>
        <ul style="margin-top:0.5rem;color:var(--color-text-muted);font-size:0.88rem;line-height:2;">
          ${[...new Set(t.days.map(a=>a.location))].map(a=>`<li>📍 ${a}</li>`).join("")}
        </ul>
      </div>
    </div>
  `}let b=null,m="all",I=[];const $e=[{value:"#f59e0b",label:"Giallo"},{value:"#ef4444",label:"Rosso"},{value:"#8b5cf6",label:"Viola"},{value:"#10b981",label:"Verde"},{value:"#f97316",label:"Arancio"}];async function ke(){const e=document.getElementById("page-content");let t;try{t=await E()}catch(i){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${i.message}</p></div>`;return}I=t.days,b=null,m="all",e.innerHTML=`
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Annota idee, luoghi e cose da fare. Ogni idea si sincronizza con Itinerario, Checklist e Mappa.</p>
    </div>

    <div class="idea-form-card" id="idea-form-container">
      ${x(null)}
    </div>

    <div id="ideas-filters-wrap">
      ${K()}
    </div>

    <div id="ideas-list">
      ${J()}
    </div>
  `,S(),U();const a=()=>{$(),w()};window.addEventListener("ideas:updated",a),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",a)}function x(e){var i,n;const t=!!e,a=I.map(d=>`<option value="${d.date}" ${(e==null?void 0:e.day_date)===d.date?"selected":""}>
      Gg. ${d.day} · ${d.date.slice(5).replace("-","/")} — ${d.location}
    </option>`).join("");return`
    <h2 class="idea-form-title">${t?"✏️ Modifica idea":"💡 Nuova idea"}</h2>

    <div class="idea-field">
      <input type="text" id="idea-text" class="idea-input"
        placeholder="Descrivi l'idea…"
        value="${k((e==null?void 0:e.text)??"")}" />
    </div>

    <div class="idea-field">
      <textarea id="idea-note" class="idea-textarea" rows="2"
        placeholder="Note aggiuntive (opzionale)…">${k((e==null?void 0:e.note)??"")}</textarea>
    </div>

    <div class="idea-form-row">
      <div class="idea-field idea-field--half">
        <label class="idea-label">📅 Giorno</label>
        <select id="idea-day" class="idea-select">
          <option value="">Nessun giorno</option>
          ${a}
        </select>
      </div>
      <div class="idea-field idea-field--half">
        <label class="idea-label">📍 Luogo (testo)</label>
        <input type="text" id="idea-location" class="idea-input"
          placeholder="es. Caletta Lucice"
          value="${k((e==null?void 0:e.location_name)??"")}" />
      </div>
    </div>

    <div class="idea-coords-row" id="idea-coords-section">
      <span class="idea-coords-label">Coordinate</span>
      <input type="number" id="idea-lat" class="idea-input idea-input--coord"
        placeholder="Lat" step="0.0001"
        value="${((i=e==null?void 0:e.coordinates)==null?void 0:i.lat)??""}" />
      <input type="number" id="idea-lng" class="idea-input idea-input--coord"
        placeholder="Lng" step="0.0001"
        value="${((n=e==null?void 0:e.coordinates)==null?void 0:n.lng)??""}" />
      <span id="idea-coords-hint" class="idea-coords-hint">Seleziona un giorno per auto-riempire</span>
    </div>

    <div class="idea-checkboxes">
      <label class="idea-check-label">
        <input type="checkbox" id="idea-add-checklist" ${e!=null&&e.add_to_checklist?"checked":""} />
        📋 Aggiungi alla checklist
      </label>
      <label class="idea-check-label">
        <input type="checkbox" id="idea-add-map" ${e!=null&&e.add_to_map?"checked":""} />
        🗺️ Mostra sulla mappa
      </label>
    </div>

    <div class="idea-color-row ${e!=null&&e.add_to_map?"":"hidden"}" id="idea-color-row">
      <span class="idea-label">Colore marker:</span>
      <div class="idea-color-picker">
        ${$e.map(d=>`
          <label class="color-option" title="${d.label}">
            <input type="radio" name="idea-color" value="${d.value}"
              ${((e==null?void 0:e.marker_color)??"#f59e0b")===d.value?"checked":""} />
            <span class="color-dot" style="background:${d.value}"></span>
          </label>
        `).join("")}
      </div>
    </div>

    <div class="idea-form-actions">
      <button class="btn btn-primary" id="idea-save-btn">
        ${t?"💾 Aggiorna":"💾 Salva idea"}
      </button>
      <button class="btn btn-outline ${t?"":"hidden"}" id="idea-cancel-btn">
        ✕ Annulla
      </button>
    </div>
  `}function S(){var t,a;const e=document.getElementById("idea-form-container");e&&(e.addEventListener("change",i=>{var n;if(i.target.id==="idea-day"){const d=i.target.value,s=I.find(l=>l.date===d);s!=null&&s.coordinates?(document.getElementById("idea-lat").value=s.coordinates.lat,document.getElementById("idea-lng").value=s.coordinates.lng,document.getElementById("idea-coords-hint").textContent=`Auto-riempito da "${s.location}"`):document.getElementById("idea-coords-hint").textContent="Seleziona un giorno per auto-riempire"}i.target.id==="idea-add-map"&&((n=document.getElementById("idea-color-row"))==null||n.classList.toggle("hidden",!i.target.checked))}),(t=document.getElementById("idea-save-btn"))==null||t.addEventListener("click",Ee),(a=document.getElementById("idea-cancel-btn"))==null||a.addEventListener("click",()=>{b=null,document.getElementById("idea-form-container").innerHTML=x(null),S()}))}function Ee(){var l,c,o,r,p,h,y,u,f,A;const e=(l=document.getElementById("idea-text"))==null?void 0:l.value.trim();if(!e){(c=document.getElementById("idea-text"))==null||c.focus();return}const t=parseFloat((o=document.getElementById("idea-lat"))==null?void 0:o.value),a=parseFloat((r=document.getElementById("idea-lng"))==null?void 0:r.value),i=!isNaN(t)&&!isNaN(a)?{lat:t,lng:a}:null,n=(p=document.getElementById("idea-add-map"))==null?void 0:p.checked,d=((h=document.querySelector('input[name="idea-color"]:checked'))==null?void 0:h.value)??"#f59e0b",s={text:e,note:((y=document.getElementById("idea-note"))==null?void 0:y.value.trim())??"",day_date:((u=document.getElementById("idea-day"))==null?void 0:u.value)||null,location_name:((f=document.getElementById("idea-location"))==null?void 0:f.value.trim())||null,coordinates:i,add_to_checklist:((A=document.getElementById("idea-add-checklist"))==null?void 0:A.checked)??!1,add_to_map:n&&i!==null,marker_color:d};b?(z(b,s),b=null):F(s),document.getElementById("idea-form-container").innerHTML=x(null),S(),$(),w()}function K(){const e=g(),t=e.filter(i=>i.add_to_checklist).length,a=e.filter(i=>i.add_to_map).length;return`
    <div class="ideas-filters">
      <button class="idea-filter-btn ${m==="all"?"active":""}" data-f="all">Tutte (${e.length})</button>
      <button class="idea-filter-btn ${m==="day"?"active":""}" data-f="day">Per giorno</button>
      <button class="idea-filter-btn ${m==="checklist"?"active":""}" data-f="checklist">📋 Checklist (${t})</button>
      <button class="idea-filter-btn ${m==="map"?"active":""}" data-f="map">🗺️ Mappa (${a})</button>
    </div>
  `}function w(){const e=document.getElementById("ideas-filters-wrap");e&&(e.innerHTML=K(),e.querySelectorAll(".idea-filter-btn").forEach(t=>{t.addEventListener("click",()=>{m=t.dataset.f,w(),$()})}))}function J(){const e=g();if(e.length===0)return'<div class="ideas-empty">Nessuna idea salvata. Aggiungine una qui sopra.</div>';let t=e;if(m==="checklist"&&(t=e.filter(a=>a.add_to_checklist)),m==="map"&&(t=e.filter(a=>a.add_to_map)),m==="day"){const a={},i=[];t.forEach(s=>{s.day_date?(a[s.day_date]||(a[s.day_date]=[]),a[s.day_date].push(s)):i.push(s)});const n=Object.keys(a).sort();let d="";return n.forEach(s=>{const l=I.find(c=>c.date===s);d+=`
        <div class="ideas-day-group">
          <div class="ideas-day-header">
            📅 ${l?`Gg. ${l.day} — ${l.location} · ${v(s)}`:v(s)}
          </div>
          ${a[s].map(C).join("")}
        </div>
      `}),i.length>0&&(d+=`
        <div class="ideas-day-group">
          <div class="ideas-day-header">📌 Senza giorno specifico</div>
          ${i.map(C).join("")}
        </div>
      `),d||'<div class="ideas-empty">Nessuna idea per questo filtro.</div>'}return t.length===0?'<div class="ideas-empty">Nessuna idea per questo filtro.</div>':t.map(C).join("")}function C(e){const t=e.day_date?I.find(a=>a.date===e.day_date):null;return`
    <div class="idea-card ${e.completed?"idea-card--done":""}" data-id="${e.id}">
      <div class="idea-card-content">
        <div class="idea-card-text">${k(e.text)}</div>
        ${e.note?`<div class="idea-card-note">${k(e.note)}</div>`:""}
        <div class="idea-card-badges">
          ${t?`<span class="idea-badge idea-badge--day">📅 Gg. ${t.day} · ${t.location}</span>`:""}
          ${e.location_name?`<span class="idea-badge idea-badge--loc">📍 ${k(e.location_name)}</span>`:""}
          ${e.add_to_checklist?'<span class="idea-badge idea-badge--cl">📋 Checklist</span>':""}
          ${e.add_to_map?`<span class="idea-badge idea-badge--map" style="border-left:3px solid ${e.marker_color}">🗺️ Mappa</span>`:""}
          ${e.completed?'<span class="idea-badge idea-badge--done">✅ Fatto</span>':""}
        </div>
      </div>
      <div class="idea-card-actions">
        ${e.add_to_checklist?`<button class="idea-action" data-action="toggle" data-id="${e.id}" title="${e.completed?"Segna come da fare":"Segna come fatto"}">
               ${e.completed?"↩️":"✅"}
             </button>`:""}
        <button class="idea-action" data-action="edit" data-id="${e.id}" title="Modifica">✏️</button>
        <button class="idea-action idea-action--del" data-action="delete" data-id="${e.id}" title="Elimina">🗑️</button>
      </div>
    </div>
  `}function $(){const e=document.getElementById("ideas-list");e&&(e.innerHTML=J(),U())}function U(){var e;(e=document.getElementById("ideas-list"))==null||e.addEventListener("click",t=>{var d;const a=t.target.closest("[data-action]");if(!a)return;const i=a.dataset.id,n=a.dataset.action;if(n==="delete"){if(!confirm("Eliminare questa idea?"))return;V(i),$(),w()}if(n==="edit"){b=i;const s=g().find(l=>l.id===i);if(!s)return;document.getElementById("idea-form-container").innerHTML=x(s),S(),(d=document.getElementById("idea-form-container"))==null||d.scrollIntoView({behavior:"smooth",block:"start"})}if(n==="toggle"){const s=g().find(l=>l.id===i);if(!s)return;z(i,{completed:!s.completed}),$()}}),document.querySelectorAll(".idea-filter-btn").forEach(t=>{t.addEventListener("click",()=>{m=t.dataset.f,w(),$()})})}function k(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const j={"#dashboard":X,"#itinerary":se,"#hotels":le,"#checklist":ve,"#map":ye,"#ideas":ke};async function Y(){typeof window.__currentPageCleanup=="function"&&(window.__currentPageCleanup(),window.__currentPageCleanup=null);const e=window.location.hash||"#dashboard",t=j[e]??j["#dashboard"],a=document.getElementById("page-content");a.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await t()}catch(i){console.error("[router]",i),a.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${i.message||"Errore sconosciuto"}</p>
      </div>
    `}}W();window.addEventListener("hashchange",Y);Y();
