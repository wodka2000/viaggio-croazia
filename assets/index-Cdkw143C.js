(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();function ge(){const e=document.getElementById("nav-toggle"),a=document.getElementById("nav-links");e==null||e.addEventListener("click",()=>{a==null||a.classList.toggle("open")}),a==null||a.querySelectorAll(".nav-link").forEach(o=>{o.addEventListener("click",()=>{a.classList.remove("open")})});function t(){const o=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(i=>{i.classList.toggle("active",i.getAttribute("href")===o)})}window.addEventListener("hashchange",t),t()}let B=null;async function L(){if(B)return B;const t=await fetch("/viaggio-croazia/data/trip.json");if(!t.ok)throw new Error(`Impossibile caricare trip.json (${t.status})`);return B=await t.json(),B}function g(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}):""}function ve(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function J(e){const a=new Date;a.setHours(0,0,0,0);const t=new Date(e+"T00:00:00");return Math.round((t-a)/(1e3*60*60*24))}function be(e){return"★".repeat(e)+"☆".repeat(5-e)}async function fe(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(u){e.innerHTML=ye(u.message);return}const{meta:t,days:o,hotels:i}=a,n=J(t.start_date),s=J(t.end_date),c=new Date().toISOString().slice(0,10),l=o.find(u=>u.date===c),d=o.find(u=>u.date>c),r=l||d,m=[],v=new Set;for(const u of o)v.has(u.location)||(v.add(u.location),m.push({location:u.location,day:u.day,date:u.date}));const $=i.reduce((u,y)=>u+y.nights,0);i.reduce((u,y)=>u+y.nights*y.price_per_night,0),e.innerHTML=`
    <div class="dashboard-hero">
      <h1>${t.emoji} ${t.title}</h1>
      <p class="subtitle">${t.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${g(t.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${g(t.end_date)}</span>
        <span class="date-badge">👥 ${t.travelers_detail||t.travelers+" viaggiatori"}</span>
      </div>
    </div>

    ${he(n,s)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${t.duration_days}</div>
        <div class="stat-label">Giorni totali</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📍</div>
        <div class="stat-value">${m.length}</div>
        <div class="stat-label">Destinazioni</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${i.length}</div>
        <div class="stat-label">Alloggi</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${$}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${m.map(u=>`
            <div class="route-stop">
              <span class="stop-day">Gg. ${u.day}</span>
              <span>📍 ${u.location}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${l?"Programma di oggi":d?"Prossima tappa":"Ultima tappa"}</div>
        ${r?`
          <div style="margin-bottom:0.75rem;">
            <strong>${r.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${r.location} · ${g(r.date)}
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
  `}function he(e,a){return e>0?`
      <div class="countdown-card">
        <div class="countdown-icon">✈️</div>
        <div>
          <div class="countdown-days">${e} giorni</div>
          <div class="countdown-text">alla partenza — il viaggio si avvicina!</div>
        </div>
      </div>
    `:e<=0&&a>=0?`
      <div class="countdown-card departed">
        <div class="countdown-icon">🌊</div>
        <div>
          <div class="countdown-days">Sei in Croazia!</div>
          <div class="countdown-text">Buon viaggio — ${a===0?"è l'ultimo giorno!":`ancora ${a} giorni`}</div>
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
  `}function ye(e){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${e}</p>
    </div>
  `}const ie="viaggio_croazia_ideas_v1",oe=[{value:"alloggio",label:"🏨 Alloggio"},{value:"ristorante",label:"🍽️ Ristorante"},{value:"esperienza",label:"🎯 Esperienza"},{value:"spiaggia",label:"🏖️ Spiaggia"},{value:"escursione",label:"🥾 Escursione"},{value:"cantina",label:"🍷 Cantina / Cibo"},{value:"shopping",label:"🛍️ Shopping"},{value:"varia",label:"💡 Varia"}],P=[{value:"idea",label:"Idea",color:"#6366f1"},{value:"da-verificare",label:"Da verificare",color:"#f59e0b"},{value:"prenotare",label:"Prenotare",color:"#ef4444"},{value:"approvata",label:"Approvata",color:"#10b981"},{value:"scartata",label:"Scartata",color:"#94a3b8"}],ne=[{value:"alta",label:"🔴 Alta"},{value:"media",label:"🟡 Media"},{value:"bassa",label:"🟢 Bassa"}],$e=[{value:"#f59e0b",label:"Giallo"},{value:"#ef4444",label:"Rosso"},{value:"#8b5cf6",label:"Viola"},{value:"#10b981",label:"Verde"},{value:"#f97316",label:"Arancio"}];function ke(){return"idea_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function N(e){return{categoria:"varia",link:"",priorita:"media",stato:"idea",note:e.note??"",location_name:e.location_name??null,...e}}function p(){try{const e=localStorage.getItem(ie);return e?JSON.parse(e).map(N):[]}catch{return[]}}function A(e){try{localStorage.setItem(ie,JSON.stringify(e)),window.dispatchEvent(new CustomEvent("ideas:updated",{detail:{ideas:e}}))}catch(a){console.warn("[ideas] localStorage non disponibile:",a)}}function j(e){const a=p(),t=N({id:ke(),text:"",note:"",categoria:"varia",link:"",priorita:"media",stato:"idea",created_at:new Date().toISOString(),day_date:null,location_name:null,coordinates:null,add_to_checklist:!1,add_to_map:!1,marker_color:"#f59e0b",completed:!1,...e});return a.unshift(t),A(a),t}function S(e,a){const t=p(),o=t.findIndex(i=>i.id===e);return o===-1?null:(t[o]={...t[o],...a},A(t),t[o])}function se(e){A(p().filter(a=>a.id!==e))}function Ee(e){return p().filter(a=>a.day_date===e)}function _e(){return p().filter(e=>e.add_to_checklist)}function Ie(){return JSON.stringify(p(),null,2)}function Le(e){const a=JSON.parse(e);if(!Array.isArray(a))throw new Error("JSON non valido: deve essere un array");const t=p(),o=new Set(t.map(s=>s.id));let i=0;const n=[...t];return a.forEach(s=>{o.has(s.id)||(n.push(N(s)),i++)}),A(n),i}async function we(){var c,l;const e=document.getElementById("page-content");let a;try{a=await L()}catch(d){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${d.message}</p></div>`;return}const{days:t,hotels:o,meta:i}=a,n=Object.fromEntries(o.map(d=>[d.id,d]));e.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${i.title} · ${i.duration_days} giorni · ${g(i.start_date)} → ${g(i.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${t.map(d=>Se(d,n)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(d=>{d.addEventListener("click",()=>{const r=d.nextElementSibling,m=d.querySelector(".timeline-toggle");r==null||r.classList.toggle("hidden"),m==null||m.classList.toggle("open")})}),(c=document.getElementById("expand-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(d=>d.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(d=>d.classList.add("open"))}),(l=document.getElementById("collapse-all"))==null||l.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(d=>d.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(d=>d.classList.remove("open"))}),xe(t);const s=()=>{document.querySelectorAll(".day-ideas-section").forEach(d=>{const r=d.dataset.date;r&&(d.innerHTML=le(r))})};window.addEventListener("ideas:updated",s),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",s)}function Se(e,a){const t=e.hotel_ref?a[e.hotel_ref]:null,o=new Date().toISOString().slice(0,10),i=e.date===o,n=e.date<o,s=e.coordinates?JSON.stringify(e.coordinates):"null";return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num"
          style="${n?"background:var(--color-text-muted)":i?"background:var(--color-accent)":""}">
          ${e.day}
        </div>
        <div class="timeline-date-label">
          ${ve(e.date)}<br>${e.date.slice(5).replace("-","/")}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${e.title}${i?' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>':""}</h3>
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

            ${t?`
              <div class="hotel-ref-badge">
                🏨 ${t.name} · Check-in ${t.checkin} / Check-out ${t.checkout}
              </div>
            `:""}

            <!-- SEZIONE IDEE DEL GIORNO -->
            <div class="day-ideas-wrap">
              <div class="day-ideas-section" id="day-ideas-${e.date}" data-date="${e.date}">
                ${le(e.date)}
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
  `}function le(e){const a=Ee(e);return a.length===0?"":a.map(t=>`
    <div class="day-idea-pill ${t.completed?"day-idea-pill--done":""}" data-id="${t.id}">
      <span class="day-idea-text">${Be(t.text)}</span>
      ${t.add_to_checklist?'<span class="idea-tiny-badge">📋</span>':""}
      ${t.add_to_map?'<span class="idea-tiny-badge">🗺️</span>':""}
      ${t.completed?'<span class="idea-tiny-badge">✅</span>':""}
      <button class="day-idea-del" data-id="${t.id}" title="Elimina">×</button>
    </div>
  `).join("")}function xe(e){const a=document.querySelector(".timeline");a&&(a.addEventListener("click",t=>{var s,c;const o=t.target.closest(".day-add-idea-btn");if(o){const l=o.dataset.date,d=document.getElementById(`quick-form-${l}`);if(!d)return;const r=d.classList.contains("hidden");document.querySelectorAll(".day-quick-form").forEach(m=>m.classList.add("hidden")),r&&(d.classList.remove("hidden"),(s=d.querySelector(".quick-idea-text"))==null||s.focus())}const i=t.target.closest(".quick-cancel");i&&((c=i.closest(".day-quick-form"))==null||c.classList.add("hidden"));const n=t.target.closest(".day-idea-del");if(n){const l=n.dataset.id;confirm("Eliminare questa idea?")&&se(l)}}),a.addEventListener("submit",t=>{var d,r,m,v;const o=t.target.closest(".day-quick-form");if(!o)return;t.preventDefault();const i=(d=o.querySelector(".quick-idea-text"))==null?void 0:d.value.trim();if(!i){(r=o.querySelector(".quick-idea-text"))==null||r.focus();return}const n=o.dataset.date,s=e.find($=>$.date===n),c=(m=o.querySelector(".quick-map"))==null?void 0:m.checked,l=(v=o.querySelector(".quick-checklist"))==null?void 0:v.checked;j({text:i,day_date:n,location_name:(s==null?void 0:s.location)??null,coordinates:c&&(s!=null&&s.coordinates)?s.coordinates:null,add_to_checklist:!!l,add_to_map:!!(c&&(s!=null&&s.coordinates))}),o.querySelector(".quick-idea-text").value="",o.querySelector(".quick-map").checked=!1,o.querySelector(".quick-checklist").checked=!1,o.classList.add("hidden")}))}function Be(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function ze(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(l){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${l.message}</p></div>`;return}const{hotels:t}=a,o={},i=[];for(const l of t){const d=l.location_group||l.location;o[d]||(o[d]=[],i.push(d)),o[d].push(l)}const n=t.filter(l=>l.recommended&&l.price_per_night>0),s=n.reduce((l,d)=>l+d.nights,0),c=n.reduce((l,d)=>l+d.nights*d.price_per_night,0);e.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${i.length} destinazioni · ${s} notti · 3 opzioni per tappa</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${i.length}</div>
        <div class="summary-label">Destinazioni</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${s}</div>
        <div class="summary-label">Notti (opz. consigliata)</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">€${(c/1e3).toFixed(1)}k</div>
        <div class="summary-label">Stima opzioni consigliate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${t.filter(l=>l.status==="da_prenotare"||l.status==="da_confermare").length}</div>
        <div class="summary-label">Da prenotare</div>
      </div>
    </div>

    ${i.map(l=>{var d,r;return`
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${l}</span>
          <span class="hotels-group-nights">${(d=o[l][0])!=null&&d.nights?o[l][0].nights+" nott"+(o[l][0].nights===1?"e":"i"):""} · ${(r=o[l][0])!=null&&r.checkin?g(o[l][0].checkin)+" → "+g(o[l][0].checkout):""}</span>
        </div>
        <div class="hotels-grid">
          ${o[l].map(m=>Ae(m)).join("")}
        </div>
      </div>
    `}).join("")}
  `}function Ae(e){const a=e.nights,t=a*e.price_per_night,i=e.booking_ref&&e.booking_ref.length>0?'<span class="hotel-status-badge badge-prenotato">✅ Prenotato</span>':e.status==="da_confermare"?'<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>':'<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>',n=e.recommended?'<span class="hotel-recommended-badge">⭐ Consigliato</span>':'<span class="hotel-alt-badge">Alternativa</span>';return`
    <div class="hotel-card ${e.recommended?"hotel-card--recommended":""}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${e.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${n}
            ${i}
          </div>
        </div>
        <div class="hotel-location">📍 ${e.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${g(e.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${g(e.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${e.rating} stelle">
            ${e.rating>0?be(e.rating):'<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
          </div>
          <div class="hotel-price">
            ${e.price_per_night>0?`<strong>€${e.price_per_night}</strong>/notte · ${a} nott${a===1?"e":"i"} · <strong style="color:var(--color-text);">€${t}</strong>`:'<span style="color:var(--color-text-muted);">Prezzo da definire</span>'}
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
  `}const H="viaggio_croazia_checklist_v1",ce="viaggio_croazia_custom_items_v1";function Ce(){try{const e=localStorage.getItem(H);return e?JSON.parse(e):{}}catch{return{}}}function O(e){try{localStorage.setItem(H,JSON.stringify(e))}catch(a){console.warn("[storage] Impossibile salvare checklist:",a)}}function qe(){try{localStorage.removeItem(H)}catch{}}function Me(){return"ci_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function C(){try{const e=localStorage.getItem(ce);return e?JSON.parse(e):[]}catch{return[]}}function q(e){try{localStorage.setItem(ce,JSON.stringify(e)),window.dispatchEvent(new CustomEvent("customitems:updated"))}catch(a){console.warn("[storage] Impossibile salvare custom items:",a)}}function Te(e,a="Varie"){const t=C(),o={id:Me(),text:e.trim(),category:a,checked:!1,created_at:new Date().toISOString()};return t.unshift(o),q(t),o}function Oe(e,a){q(C().map(t=>t.id===e?{...t,checked:a}:t))}function De(e){q(C().filter(a=>a.id!==e))}function Pe(){q([])}async function Ne(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(s){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${s.message}</p></div>`;return}const{categories:t}=a.checklist,o=Ce();e.innerHTML=`
    <div class="page-header">
      <h1>✅ Checklist di Viaggio</h1>
      <p>Spunta gli elementi man mano che prepari il bagaglio. Aggiungi anche voci personalizzate.</p>
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

    <!-- Categorie statiche da trip.json -->
    <div class="checklist-categories" id="checklist-categories">
      ${t.map(s=>je(s,o)).join("")}
    </div>

    <!-- Idee collegate alla checklist -->
    <div id="checklist-ideas-section">
      ${U()}
    </div>

    <!-- Sezione voci personalizzate (CRUD) -->
    <div id="custom-items-section">
      ${Z()}
    </div>
  `,w(t,o),Re(t,o),K(),Y();const i=()=>{const s=document.getElementById("checklist-ideas-section");s&&(s.innerHTML=U(),K())},n=()=>{const s=document.getElementById("custom-items-section");s&&(s.innerHTML=Z(),Y())};window.addEventListener("ideas:updated",i),window.addEventListener("customitems:updated",n),window.__currentPageCleanup=()=>{window.removeEventListener("ideas:updated",i),window.removeEventListener("customitems:updated",n)}}function U(){const e=_e();if(e.length===0)return"";const a=e.filter(i=>i.completed).length,t=e.length,o=t?a/t*100:0;return`
    <div class="category-card" id="ideas-checklist-card">
      <div class="category-header">
        <span class="category-icon">💡</span>
        <span class="category-name">Idee / Da fare</span>
        <span class="category-count" id="ideas-cl-count">${a}/${t}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="ideas-cl-prog" style="width:${o}%"></div>
        </div>
        <span class="category-chevron" id="ideas-cl-chev">▼</span>
      </div>
      <div class="category-items" id="ideas-cl-items">
        ${e.map(i=>`
          <label class="checklist-item ${i.completed?"checked":""}" data-idea-id="${i.id}">
            <input type="checkbox" data-idea-id="${i.id}" ${i.completed?"checked":""} />
            <span class="checklist-item-text">${z(i.text)}</span>
            ${i.location_name?`<span class="priority-badge" style="background:#eff6ff;color:var(--color-primary)">📍 ${z(i.location_name)}</span>`:""}
          </label>
        `).join("")}
        <div style="padding:0.5rem 1.25rem;">
          <a href="#ideas" class="btn btn-outline" style="font-size:0.78rem;padding:0.3rem 0.75rem;">
            + Aggiungi idea dalla sezione Idee
          </a>
        </div>
      </div>
    </div>
  `}function K(){var e,a;(e=document.querySelector("#ideas-checklist-card .category-header"))==null||e.addEventListener("click",t=>{var o,i;t.target.tagName!=="INPUT"&&((o=document.getElementById("ideas-cl-items"))==null||o.classList.toggle("hidden"),(i=document.getElementById("ideas-cl-chev"))==null||i.classList.toggle("open"))}),(a=document.getElementById("ideas-cl-items"))==null||a.addEventListener("change",t=>{const o=t.target;if(o.type!=="checkbox")return;const i=o.dataset.ideaId;i&&S(i,{completed:o.checked})})}function Z(){const e=C(),a=e.filter(t=>t.checked).length;return`
    <div class="category-card custom-items-card" id="custom-items-card">
      <div class="category-header" id="custom-items-header">
        <span class="category-icon">✏️</span>
        <span class="category-name">Voci Personalizzate</span>
        <span class="category-count">${a}/${e.length}</span>
        <div class="category-progress">
          <div class="category-progress-fill"
            style="width:${e.length?a/e.length*100:0}%"></div>
        </div>
        <span class="category-chevron" id="custom-chev">▼</span>
      </div>

      <div class="category-items" id="custom-items-list">
        ${e.length===0?'<div class="custom-items-empty">Nessuna voce personalizzata. Aggiungine una qui sotto.</div>':e.map(t=>`
              <div class="checklist-item custom-item" data-cid="${t.id}">
                <input type="checkbox" class="custom-item-cb" data-cid="${t.id}" ${t.checked?"checked":""} />
                <span class="checklist-item-text ${t.checked?"line-through":""}">${z(t.text)}</span>
                ${t.category!=="Varie"?`<span class="priority-badge" style="background:#f1f5f9;color:#64748b;">${z(t.category)}</span>`:""}
                <button class="custom-item-del" data-cid="${t.id}" title="Elimina">×</button>
              </div>
            `).join("")}

        <!-- Form aggiunta voce -->
        <div class="custom-add-form" id="custom-add-form">
          <input type="text" id="custom-item-text" class="custom-add-input"
            placeholder="Aggiungi voce…" autocomplete="off" />
          <select id="custom-item-cat" class="custom-add-select">
            <option value="Varie">Varie</option>
            <option value="Documenti">Documenti</option>
            <option value="Bambini">Bambini</option>
            <option value="Mare">Mare</option>
            <option value="Abbigliamento">Abbigliamento</option>
            <option value="Farmaci">Farmaci</option>
            <option value="Tecnologia">Tecnologia</option>
            <option value="Da prenotare">Da prenotare</option>
          </select>
          <button class="btn btn-primary custom-add-btn" id="custom-add-btn">+ Aggiungi</button>
        </div>

        ${e.length>0?`
          <div style="padding:0.5rem 1.25rem;">
            <button class="btn btn-outline" id="clear-custom-btn"
              style="font-size:0.78rem;padding:0.3rem 0.75rem;color:var(--color-accent);">
              🗑️ Elimina tutte le voci personalizzate
            </button>
          </div>
        `:""}
      </div>
    </div>
  `}function Y(){var a,t,o;const e=document.getElementById("custom-items-header");e==null||e.addEventListener("click",i=>{var n,s;i.target.closest(".custom-add-form")||i.target.closest("button")||((n=document.getElementById("custom-items-list"))==null||n.classList.toggle("hidden"),(s=document.getElementById("custom-chev"))==null||s.classList.toggle("open"))}),(a=document.getElementById("custom-items-list"))==null||a.addEventListener("change",i=>{const n=i.target;n.classList.contains("custom-item-cb")&&Oe(n.dataset.cid,n.checked)}),(t=document.getElementById("custom-items-list"))==null||t.addEventListener("click",i=>{const n=i.target.closest(".custom-item-del");if(n){De(n.dataset.cid);return}i.target.closest("#custom-add-btn")&&W(),i.target.closest("#clear-custom-btn")&&confirm("Eliminare tutte le voci personalizzate?")&&Pe()}),(o=document.getElementById("custom-item-text"))==null||o.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),W())})}function W(){var o;const e=document.getElementById("custom-item-text"),a=((o=document.getElementById("custom-item-cat"))==null?void 0:o.value)??"Varie",t=e==null?void 0:e.value.trim();if(!t){e==null||e.focus();return}Te(t,a),e&&(e.value="")}function je(e,a){const t=e.items.length,o=e.items.filter(i=>a[i.id]).length;return`
    <div class="category-card" data-cat="${e.id}">
      <div class="category-header">
        <span class="category-icon">${e.icon}</span>
        <span class="category-name">${e.name}</span>
        <span class="category-count" id="count-${e.id}">${o}/${t}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${e.id}"
            style="width:${t?o/t*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${e.id}">▼</span>
      </div>
      <div class="category-items" id="items-${e.id}">
        ${e.items.map(i=>He(i,a[i.id]||!1)).join("")}
      </div>
    </div>
  `}function He(e,a){return`
    <label class="checklist-item ${a?"checked":""}" data-id="${e.id}">
      <input type="checkbox" ${a?"checked":""} data-id="${e.id}" />
      <span class="checklist-item-text">${e.text}</span>
      ${e.priority!=="low"?`<span class="priority-badge priority-${e.priority}">${e.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function Re(e,a){var t,o,i,n;(t=document.getElementById("checklist-categories"))==null||t.addEventListener("change",s=>{var d;const c=s.target;if(c.type!=="checkbox")return;const l=c.dataset.id;a[l]=c.checked,(d=c.closest(".checklist-item"))==null||d.classList.toggle("checked",c.checked),O(a),Fe(e,a,l),w(e,a)}),document.querySelectorAll(".category-header").forEach(s=>{s.addEventListener("click",c=>{var d,r,m;if(c.target.tagName==="INPUT")return;const l=(d=s.closest(".category-card"))==null?void 0:d.dataset.cat;l&&((r=document.getElementById(`items-${l}`))==null||r.classList.toggle("hidden"),(m=document.getElementById(`chev-${l}`))==null||m.classList.toggle("open"))})}),(o=document.getElementById("check-all"))==null||o.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(c=>{a[c.id]=!0})),O(a),D(e,a),w(e,a)}),(i=document.getElementById("uncheck-all"))==null||i.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(c=>{a[c.id]=!1})),O(a),D(e,a),w(e,a)}),(n=document.getElementById("reset-btn"))==null||n.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(qe(),e.forEach(s=>s.items.forEach(c=>{a[c.id]=!1})),D(e,a),w(e,a))})}function Fe(e,a,t){const o=e.find(d=>d.items.some(r=>r.id===t));if(!o)return;const i=o.items.length,n=o.items.filter(d=>a[d.id]).length,s=i?n/i*100:0,c=document.getElementById(`count-${o.id}`),l=document.getElementById(`prog-${o.id}`);c&&(c.textContent=`${n}/${i}`),l&&(l.style.width=`${s}%`)}function w(e,a){const t=e.reduce((c,l)=>c+l.items.length,0),o=e.reduce((c,l)=>c+l.items.filter(d=>a[d.id]).length,0),i=t?o/t*100:0,n=document.getElementById("global-fill"),s=document.getElementById("global-text");n&&(n.style.width=`${i}%`),s&&(s.textContent=`${o} / ${t}`)}function D(e,a){e.forEach(t=>{const o=t.items.length,i=t.items.filter(l=>a[l.id]).length,n=o?i/o*100:0,s=document.getElementById(`count-${t.id}`),c=document.getElementById(`prog-${t.id}`);s&&(s.textContent=`${i}/${o}`),c&&(c.style.width=`${n}%`),t.items.forEach(l=>{const d=document.querySelector(`.checklist-item[data-id="${l.id}"]`),r=d==null?void 0:d.querySelector('input[type="checkbox"]');!d||!r||(r.checked=a[l.id]||!1,d.classList.toggle("checked",r.checked))})})}function z(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}let Q=null;async function Ve(){const e=document.getElementById("page-content");e.innerHTML=`
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
  `,Q=await L();{Ge(e,Q);return}}function Ge(e,a){document.getElementById("map-outer").innerHTML=`
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
          ${[...new Set(a.days.map(t=>t.location))].map(t=>`<li>📍 ${t}</li>`).join("")}
        </ul>
      </div>
    </div>
  `}let E=null,_="tutte",x=[],b=!1;async function Je(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(o){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${o.message}</p></div>`;return}x=a.days,E=null,_="tutte",e.innerHTML=`
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Cattura idee al volo — si sincronizzano con Checklist, Mappa e Itinerario.</p>
    </div>

    <!-- FORM RAPIDO -->
    <div class="ideas-form-wrap" id="ideas-form-wrap">
      ${M(null)}
    </div>

    <!-- TOOLBAR: filtri + export/import -->
    <div class="ideas-toolbar" id="ideas-toolbar">
      <div class="ideas-filters-row" id="ideas-filters-row">
        ${de()}
      </div>
      <div class="ideas-io-btns">
        <button class="btn btn-outline ideas-io-btn" id="export-btn" title="Esporta JSON">⬆️ Esporta</button>
        <label class="btn btn-outline ideas-io-btn" title="Importa JSON">
          ⬇️ Importa
          <input type="file" id="import-file" accept=".json" style="display:none" />
        </label>
      </div>
    </div>

    <!-- LISTA -->
    <div id="ideas-list">
      ${ue()}
    </div>
  `,T(),me(),re(),Ye();const t=()=>{h(),I()};window.addEventListener("ideas:updated",t),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",t)}function M(e){var s,c;const a=!!e,t=x.map(l=>`<option value="${l.date}" ${(e==null?void 0:e.day_date)===l.date?"selected":""}>
      Gg. ${l.day} — ${l.location} · ${l.date.slice(5).replace("-","/")}
    </option>`).join(""),o=P.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.stato)??"idea")===l.value?"selected":""}>${l.label}</option>`).join(""),i=oe.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.categoria)??"varia")===l.value?"selected":""}>${l.label}</option>`).join(""),n=ne.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.priorita)??"media")===l.value?"selected":""}>${l.label}</option>`).join("");return`
    <form id="idea-form" class="ideas-form">
      <div class="ideas-form-title">${a?"✏️ Modifica idea":"💡 Nuova idea"}</div>

      <!-- TITOLO — unico campo obbligatorio, grande e prominente -->
      <input type="text" id="idea-text" class="ideas-input ideas-input--title"
        placeholder="Cosa vuoi ricordare…"
        value="${f((e==null?void 0:e.text)??"")}"
        autocomplete="off" />

      <!-- ROW: categoria / stato / priorità -->
      <div class="ideas-row3">
        <div class="ideas-field-mini">
          <label class="ideas-label">Categoria</label>
          <select id="idea-categoria" class="ideas-select">${i}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Stato</label>
          <select id="idea-stato" class="ideas-select">${o}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Priorità</label>
          <select id="idea-priorita" class="ideas-select">${n}</select>
        </div>
      </div>

      <!-- Toggle dettagli aggiuntivi -->
      <button type="button" class="ideas-toggle-advanced" id="ideas-toggle-advanced">
        ${b?"▲ Meno dettagli":"▼ Più dettagli"}
      </button>

      <div id="ideas-advanced" class="${b?"":"hidden"}">
        <!-- Nota -->
        <textarea id="idea-note" class="ideas-input ideas-textarea"
          rows="2" placeholder="Nota aggiuntiva…">${f((e==null?void 0:e.note)??"")}</textarea>

        <!-- Luogo + Link -->
        <div class="ideas-row2">
          <input type="text" id="idea-location" class="ideas-input"
            placeholder="📍 Luogo"
            value="${f((e==null?void 0:e.location_name)??"")}" />
          <input type="url" id="idea-link" class="ideas-input"
            placeholder="🔗 Link (opz.)"
            value="${f((e==null?void 0:e.link)??"")}" />
        </div>

        <!-- Giorno -->
        <select id="idea-day" class="ideas-select">
          <option value="">📅 Nessun giorno specifico</option>
          ${t}
        </select>

        <!-- Coordinate (auto-fill da giorno) -->
        <div class="ideas-coords-row">
          <span class="ideas-coords-label">Coord.</span>
          <input type="number" id="idea-lat" class="ideas-input ideas-input--coord"
            placeholder="Lat" step="0.0001" value="${((s=e==null?void 0:e.coordinates)==null?void 0:s.lat)??""}" />
          <input type="number" id="idea-lng" class="ideas-input ideas-input--coord"
            placeholder="Lng" step="0.0001" value="${((c=e==null?void 0:e.coordinates)==null?void 0:c.lng)??""}" />
          <span id="idea-coords-hint" class="ideas-coords-hint" style="font-size:0.72rem;color:var(--color-text-muted);">
            Seleziona giorno per auto-fill
          </span>
        </div>

        <!-- Checklist + Mappa -->
        <div class="ideas-checks">
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-checklist" ${e!=null&&e.add_to_checklist?"checked":""} />
            📋 Checklist
          </label>
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-map" ${e!=null&&e.add_to_map?"checked":""} />
            🗺️ Mappa
          </label>
        </div>

        <!-- Color picker (visibile solo se Mappa) -->
        <div class="idea-color-row ${e!=null&&e.add_to_map?"":"hidden"}" id="idea-color-row">
          <span class="ideas-label">Colore marker:</span>
          <div class="idea-color-picker">
            ${$e.map(l=>`
              <label class="color-option" title="${l.label}">
                <input type="radio" name="idea-color" value="${l.value}"
                  ${((e==null?void 0:e.marker_color)??"#f59e0b")===l.value?"checked":""} />
                <span class="color-dot" style="background:${l.value}"></span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Azioni form -->
      <div class="ideas-form-actions">
        <button type="submit" class="btn btn-primary ideas-save-btn" id="idea-save-btn">
          ${a?"💾 Aggiorna":"💾 Salva"}
        </button>
        <button type="button" class="btn btn-outline ${a?"":"hidden"}" id="idea-cancel-btn">
          ✕ Annulla
        </button>
      </div>
    </form>
  `}function T(){var a,t,o;const e=document.getElementById("ideas-form-wrap");e&&((a=document.getElementById("ideas-toggle-advanced"))==null||a.addEventListener("click",()=>{b=!b;const i=document.getElementById("ideas-advanced"),n=document.getElementById("ideas-toggle-advanced");i==null||i.classList.toggle("hidden",!b),n&&(n.textContent=b?"▲ Meno dettagli":"▼ Più dettagli")}),e.addEventListener("change",i=>{var n;if(i.target.id==="idea-day"){const s=x.find(c=>c.date===i.target.value);s!=null&&s.coordinates&&(document.getElementById("idea-lat").value=s.coordinates.lat,document.getElementById("idea-lng").value=s.coordinates.lng,document.getElementById("idea-coords-hint").textContent=`Auto-riempito da "${s.location}"`)}i.target.id==="idea-add-map"&&((n=document.getElementById("idea-color-row"))==null||n.classList.toggle("hidden",!i.target.checked))}),(t=document.getElementById("idea-form"))==null||t.addEventListener("submit",i=>{i.preventDefault(),Ue()}),(o=document.getElementById("idea-cancel-btn"))==null||o.addEventListener("click",()=>{E=null,document.getElementById("ideas-form-wrap").innerHTML=M(null),T()}))}function Ue(){var s,c,l,d,r,m,v,$,u,y,R,F,V,G;const e=(s=document.getElementById("idea-text"))==null?void 0:s.value.trim();if(!e){(c=document.getElementById("idea-text"))==null||c.focus();return}const a=parseFloat((l=document.getElementById("idea-lat"))==null?void 0:l.value),t=parseFloat((d=document.getElementById("idea-lng"))==null?void 0:d.value),o=!isNaN(a)&&!isNaN(t)?{lat:a,lng:t}:null,i=(r=document.getElementById("idea-add-map"))==null?void 0:r.checked,n={text:e,note:((m=document.getElementById("idea-note"))==null?void 0:m.value.trim())??"",categoria:((v=document.getElementById("idea-categoria"))==null?void 0:v.value)??"varia",stato:(($=document.getElementById("idea-stato"))==null?void 0:$.value)??"idea",priorita:((u=document.getElementById("idea-priorita"))==null?void 0:u.value)??"media",day_date:((y=document.getElementById("idea-day"))==null?void 0:y.value)||null,location_name:((R=document.getElementById("idea-location"))==null?void 0:R.value.trim())||null,link:((F=document.getElementById("idea-link"))==null?void 0:F.value.trim())||"",coordinates:o,add_to_checklist:((V=document.getElementById("idea-add-checklist"))==null?void 0:V.checked)??!1,add_to_map:i&&o!==null,marker_color:((G=document.querySelector('input[name="idea-color"]:checked'))==null?void 0:G.value)??"#f59e0b"};E?(S(E,n),E=null):j(n),b=!1,document.getElementById("ideas-form-wrap").innerHTML=M(null),T(),h(),I()}function de(){const e=p();return[{key:"tutte",label:`Tutte (${e.length})`},{key:"idea",label:`Idea (${e.filter(t=>t.stato==="idea").length})`},{key:"da-verificare",label:`Da verificare (${e.filter(t=>t.stato==="da-verificare").length})`},{key:"prenotare",label:`Prenotare (${e.filter(t=>t.stato==="prenotare").length})`},{key:"approvata",label:`Approvate (${e.filter(t=>t.stato==="approvata").length})`},{key:"scartata",label:`Scartate (${e.filter(t=>t.stato==="scartata").length})`}].map(t=>`
    <button class="idea-filter-btn ${_===t.key?"active":""}" data-f="${t.key}">
      ${t.label}
    </button>
  `).join("")}function re(){var e;(e=document.getElementById("ideas-filters-row"))==null||e.querySelectorAll(".idea-filter-btn").forEach(a=>{a.addEventListener("click",()=>{_=a.dataset.f,I(),h()})})}function I(){const e=document.getElementById("ideas-filters-row");e&&(e.innerHTML=de(),re())}function ue(){let e=p();return _!=="tutte"&&(e=e.filter(a=>a.stato===_)),e.length===0?`<div class="ideas-empty">${_==="tutte"?"Nessuna idea salvata. Aggiungine una qui sopra.":"Nessuna idea per questo filtro."}</div>`:e.map(Ke).join("")}function Ke(e){const a=P.find(n=>n.value===e.stato),t=oe.find(n=>n.value===e.categoria),o=ne.find(n=>n.value===e.priorita),i=e.day_date?x.find(n=>n.date===e.day_date):null;return`
    <div class="idea-card ${e.stato==="scartata"?"idea-card--scartata":""}" data-id="${e.id}">
      <div class="idea-card-main">
        <div class="idea-card-header-row">
          <span class="idea-card-text">${f(e.text)}</span>
          <div class="idea-card-badges-inline">
            ${a?`<span class="idea-stato-badge" style="background:${a.color}20;color:${a.color};border-color:${a.color}40;">${a.label}</span>`:""}
            ${t?`<span class="idea-cat-badge">${t.label}</span>`:""}
            ${o?`<span class="idea-pri-dot" title="${o.label}" style="background:${We(e.priorita)}"></span>`:""}
          </div>
        </div>

        ${e.note?`<div class="idea-card-note">${f(e.note)}</div>`:""}

        <div class="idea-card-meta">
          ${i?`<span class="idea-meta-chip">📅 Gg. ${i.day} — ${i.location}</span>`:""}
          ${e.location_name?`<span class="idea-meta-chip">📍 ${f(e.location_name)}</span>`:""}
          ${e.add_to_checklist?'<span class="idea-meta-chip">📋 Checklist</span>':""}
          ${e.add_to_map?`<span class="idea-meta-chip" style="border-left:3px solid ${e.marker_color}">🗺️ Mappa</span>`:""}
          ${e.link?`<a href="${f(e.link)}" target="_blank" rel="noopener" class="idea-meta-chip idea-meta-link">🔗 Link</a>`:""}
        </div>
      </div>

      <div class="idea-card-actions">
        <!-- Stato rapido -->
        <select class="idea-stato-select" data-action="stato" data-id="${e.id}" title="Cambia stato">
          ${P.map(n=>`<option value="${n.value}" ${e.stato===n.value?"selected":""}>${n.label}</option>`).join("")}
        </select>

        <div class="idea-card-btns">
          <!-- Aggiungi alla checklist -->
          <button class="idea-action-btn ${e.add_to_checklist?"idea-action-btn--active":""}"
            data-action="checklist" data-id="${e.id}"
            title="${e.add_to_checklist?"Rimuovi dalla checklist":"Aggiungi alla checklist"}">
            📋
          </button>

          <!-- Aggiungi all'itinerario (collega a giorno) -->
          <button class="idea-action-btn ${e.day_date?"idea-action-btn--active":""}"
            data-action="day-link" data-id="${e.id}"
            title="${e.day_date?"Giorno: "+e.day_date:"Collega a giorno"}">
            📅
          </button>

          <!-- Modifica -->
          <button class="idea-action-btn" data-action="edit" data-id="${e.id}" title="Modifica">✏️</button>

          <!-- Elimina -->
          <button class="idea-action-btn idea-action-btn--del" data-action="delete" data-id="${e.id}" title="Elimina">🗑️</button>
        </div>
      </div>
    </div>
  `}function Ze(e){var i,n,s;const a=p().find(c=>c.id===e);if(!a)return;(i=document.getElementById("day-link-modal"))==null||i.remove();const t=x.map(c=>`<option value="${c.date}" ${a.day_date===c.date?"selected":""}>
      Gg. ${c.day} — ${c.location} · ${c.date.slice(5).replace("-","/")}
    </option>`).join(""),o=document.createElement("div");o.id="day-link-modal",o.className="day-link-modal-overlay",o.innerHTML=`
    <div class="day-link-modal">
      <div class="day-link-modal-title">📅 Collega all'itinerario</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">
        L'idea apparirà nella scheda del giorno selezionato.
      </p>
      <select id="day-link-select" class="ideas-select">
        <option value="">Nessun giorno</option>
        ${t}
      </select>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button class="btn btn-primary" id="day-link-confirm">✓ Conferma</button>
        <button class="btn btn-outline" id="day-link-cancel">Annulla</button>
      </div>
    </div>
  `,document.body.appendChild(o),(n=document.getElementById("day-link-confirm"))==null||n.addEventListener("click",()=>{var l;const c=((l=document.getElementById("day-link-select"))==null?void 0:l.value)||null;S(e,{day_date:c}),o.remove(),h()}),(s=document.getElementById("day-link-cancel"))==null||s.addEventListener("click",()=>o.remove()),o.addEventListener("click",c=>{c.target===o&&o.remove()})}function me(){const e=document.getElementById("ideas-list");e&&(e.addEventListener("change",a=>{a.target.dataset.action==="stato"&&(S(a.target.dataset.id,{stato:a.target.value}),h(),I())}),e.addEventListener("click",a=>{var n;const t=a.target.closest("[data-action]");if(!t)return;const o=t.dataset.id,i=t.dataset.action;if(i==="delete"){if(!confirm("Eliminare questa idea?"))return;se(o),h(),I()}if(i==="edit"){E=o;const s=p().find(c=>c.id===o);if(!s)return;b=!0,document.getElementById("ideas-form-wrap").innerHTML=M(s),T(),(n=document.getElementById("ideas-form-wrap"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})}if(i==="checklist"){const s=p().find(c=>c.id===o);if(!s)return;S(o,{add_to_checklist:!s.add_to_checklist}),h()}i==="day-link"&&Ze(o)}))}function h(){const e=document.getElementById("ideas-list");e&&(e.innerHTML=ue(),me())}function Ye(){var e,a;(e=document.getElementById("export-btn"))==null||e.addEventListener("click",()=>{const t=Ie(),o=new Blob([t],{type:"application/json"}),i=URL.createObjectURL(o),n=document.createElement("a");n.href=i,n.download=`idee_viaggio_${new Date().toISOString().slice(0,10)}.json`,n.click(),URL.revokeObjectURL(i)}),(a=document.getElementById("import-file"))==null||a.addEventListener("change",async t=>{var i;const o=(i=t.target.files)==null?void 0:i[0];if(o){try{const n=await o.text(),s=Le(n);alert(`Importazione completata: ${s} nuove idee aggiunte.`),h(),I()}catch(n){alert("Errore importazione: "+n.message)}t.target.value=""}})}function We(e){return e==="alta"?"#ef4444":e==="media"?"#f59e0b":"#22c55e"}function f(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const k=[{id:"zlatni-rat",nome:"Zlatni Rat",area:"Brač",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia",descrizione:"La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete.",bambini:!0,bambini_nota:"Ottimo — acque basse, spiaggia servita, pini per l'ombra",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.3246,lng:16.6372}},{id:"vidova-gora",nome:"Vidova Gora",area:"Brač",categoria:"panorama",categoriaLabel:"⛰️ Panorama",descrizione:"Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar, il canale e il mare aperto. Si raggiunge in auto su strada asfaltata.",bambini:!0,bambini_nota:"In auto facilissimo; il sentiero a piedi è impegnativo",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:43.3621,lng:16.6588}},{id:"telascica",nome:"Telašćica Nature Park",area:"Area di Zara",categoria:"parco",categoriaLabel:"🌿 Parco naturale",descrizione:"Baia naturale nell'isola di Dugi Otok: scogliere alte 200 m, acqua smeraldo, e il Lago Mir (salato con effetti benefici). Accesso in barca da Zadar o Biograd.",bambini:!0,bambini_nota:"Bello per tutta la famiglia — solo in barca, fare il bagno nel lago è esperienza unica",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:43.9044,lng:15.1533}},{id:"vransko-lake",nome:"Vransko Lake",area:"Area di Zara",categoria:"lago",categoriaLabel:"🦢 Lago / Ornitologia",descrizione:"Il lago più grande della Croazia (30 km²), riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica, kayak, ambiente tranquillo.",bambini:!0,bambini_nota:"Adatto — pista ciclabile e percorsi piani ideali con i bambini",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.8856,lng:15.5475}},{id:"paklenica",nome:"Paklenica National Park",area:"Area di Zara",categoria:"parco",categoriaLabel:"🏔️ Canyon / Trekking",descrizione:"Canyon spettacolari ai piedi delle Alpi Dinare. Due gole (Velika e Mala Paklenica) con sentieri per tutti i livelli, pareti d'arrampicata e la grotta Manita Peć.",bambini:!1,bambini_nota:"Sentieri brevi e facili esistono, ma le gole principali sono impegnative per bambini piccoli",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.3219,lng:15.4722}},{id:"zrmanja",nome:"Canyon Zrmanja",area:"Area di Zara",categoria:"fiume",categoriaLabel:"🌊 Fiume / Rafting",descrizione:"Uno dei fiumi più belli della Dalmazia: acque turchesi carsiche, cascate di travertino e canyon selvaggi. Kayak e rafting disponibili da operatori locali.",bambini:!1,bambini_nota:"Rafting non adatto ai bambini piccoli; belvedere sul canyon accessibile a tutti",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:44.1867,lng:15.8753}},{id:"brijuni",nome:"Brijuni National Park",area:"Istria",categoria:"parco",categoriaLabel:"🦒 Parco / Safari",descrizione:"Arcipelago di 14 isole con safari park (zebre, elefanti), resti romani e spiagge meravigliose. Accesso solo in traghetto da Fažana (vicino Pola). Era la residenza di Tito.",bambini:!0,bambini_nota:"Fantastico per i bambini — safari su trenino, animali esotici, mare pulito",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:44.9167,lng:13.7636}},{id:"lim-fjord",nome:"Lim Fjord (Limski Kanal)",area:"Istria",categoria:"natura",categoriaLabel:"🌲 Fiordo / Paesaggio",descrizione:"Canale marino di 10 km incastrato tra boschi e vigneti istriani. Famoso per le ostriche allevate in acqua. Belvedere dall'alto accessibile in auto, gita in barca dal basso.",bambini:!0,bambini_nota:"Il belvedere è accessibile a tutti; la barca è ottima per i bambini",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1419,lng:13.6408}},{id:"dobbiaco",nome:"Lago di Dobbiaco",area:"Sesto / Alta Pusteria",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:"Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla famosa pista ciclabile. Acque verdissime, Dolomiti come sfondo.",bambini:!0,bambini_nota:"Perfetto — pista ciclabile pianeggiante, riva accessibile, area pic-nic",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:46.7358,lng:12.2214}},{id:"braies",nome:"Lago di Braies",area:"Sesto / Alta Pusteria",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo ai piedi delle Dolomiti di Sesto. Barche a remi, sentiero attorno al lago (3 km). Molto frequentato in agosto — meglio la mattina presto.',bambini:!0,bambini_nota:"Adatto — sentiero pianeggiante attorno al lago, barche a noleggio",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:46.6948,lng:12.0853}}],Qe={"sosta-breve":{label:"Sosta breve",icon:"⚡",cls:"impegno-breve"},"mezza-giornata":{label:"Mezza giornata",icon:"🕐",cls:"impegno-mezza"},"giornata-piena":{label:"Giornata piena",icon:"📅",cls:"impegno-piena"}},Xe={"molto-consigliato":{label:"⭐ Molto consigliato",cls:"nota-top"},opzionale:{label:"✔ Opzionale",cls:"nota-ok"},"solo-se-c-e-tempo":{label:"⏱ Solo se c'è tempo",cls:"nota-ifpos"}};async function et(){var o;const e=document.getElementById("page-content"),a=[...new Set(k.map(i=>i.area))];let t="tutte";e.innerHTML=`
    <div class="page-header">
      <h1>🌿 Natura & Deviazioni</h1>
      <p>Attrazioni naturalistiche lungo il percorso — compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte (${k.length})</button>
      ${a.map(i=>`
        <button class="natura-filter-btn" data-area="${i}">
          ${i} (${k.filter(n=>n.area===i).length})
        </button>
      `).join("")}
    </div>

    <div class="natura-grid" id="natura-grid">
      ${k.map(X).join("")}
    </div>
  `,(o=document.getElementById("natura-filters"))==null||o.addEventListener("click",i=>{const n=i.target.closest(".natura-filter-btn");if(!n)return;t=n.dataset.area,document.querySelectorAll(".natura-filter-btn").forEach(c=>c.classList.remove("active")),n.classList.add("active");const s=document.getElementById("natura-grid");if(s){const c=t==="tutte"?k:k.filter(l=>l.area===t);s.innerHTML=c.map(X).join(""),ee()}}),ee()}function X(e){const a=Qe[e.impegno]||{label:e.impegno,icon:"🕐",cls:""},t=Xe[e.nota_tipo]||{label:e.nota_tipo,cls:""},o=`https://www.google.com/maps/search/?api=1&query=${e.coords.lat},${e.coords.lng}`;return`
    <div class="natura-card ${t.cls}" data-id="${e.id}">
      <div class="natura-card-top">
        <div>
          <div class="natura-nome">${e.nome}</div>
          <div class="natura-area">📍 ${e.area}</div>
        </div>
        <span class="natura-nota-badge ${t.cls}">${t.label}</span>
      </div>

      <div class="natura-badges">
        <span class="natura-badge natura-cat">${e.categoriaLabel}</span>
        <span class="natura-badge ${a.cls}">${a.icon} ${a.label}</span>
        <span class="natura-badge ${e.bambini?"natura-kid-ok":"natura-kid-no"}">
          ${e.bambini?"👶 Kids ✓":"👶 Kids ≠"}
        </span>
      </div>

      <p class="natura-desc">${e.descrizione}</p>

      ${e.bambini_nota?`
        <div class="natura-kids-note">
          <span style="font-size:0.9rem;">👶</span>
          <span>${e.bambini_nota}</span>
        </div>
      `:""}

      <div class="natura-actions">
        <a href="${o}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🗺️ Apri in Google Maps
        </a>
        <button class="btn btn-outline natura-add-idea-btn"
          data-nome="${te(e.nome)}"
          data-area="${te(e.area)}"
          data-lat="${e.coords.lat}"
          data-lng="${e.coords.lng}">
          💡 Aggiungi alle Idee
        </button>
      </div>
    </div>
  `}function ee(){document.querySelectorAll(".natura-add-idea-btn").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.nome,t=e.dataset.area,o=parseFloat(e.dataset.lat),i=parseFloat(e.dataset.lng);j({text:a,location_name:t,categoria:"escursione",stato:"da-verificare",add_to_map:!0,coordinates:{lat:o,lng:i},marker_color:"#10b981"}),e.textContent="✅ Aggiunta!",e.disabled=!0,setTimeout(()=>{e.textContent="💡 Aggiungi alle Idee",e.disabled=!1},2e3)})})}function te(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const ae={"#dashboard":fe,"#itinerary":we,"#hotels":ze,"#checklist":Ne,"#map":Ve,"#ideas":Je,"#natura":et};async function pe(){typeof window.__currentPageCleanup=="function"&&(window.__currentPageCleanup(),window.__currentPageCleanup=null);const e=window.location.hash||"#dashboard",a=ae[e]??ae["#dashboard"],t=document.getElementById("page-content");t.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await a()}catch(o){console.error("[router]",o),t.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${o.message||"Errore sconosciuto"}</p>
      </div>
    `}}ge();window.addEventListener("hashchange",pe);pe();
