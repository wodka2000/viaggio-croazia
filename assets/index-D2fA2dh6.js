(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();function _e(){const e=document.getElementById("nav-toggle"),a=document.getElementById("nav-links");e==null||e.addEventListener("click",()=>{a==null||a.classList.toggle("open")}),a==null||a.querySelectorAll(".nav-link").forEach(i=>{i.addEventListener("click",()=>{a.classList.remove("open")})});function t(){const i=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(o=>{o.classList.toggle("active",o.getAttribute("href")===i)})}window.addEventListener("hashchange",t),t()}let q=null;async function L(){if(q)return q;const t=await fetch("/viaggio-croazia/data/trip.json");if(!t.ok)throw new Error(`Impossibile caricare trip.json (${t.status})`);return q=await t.json(),q}function f(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"}):""}function J(e){if(!e)return"";const[,a,t]=e.split("-");return`${t}/${a}`}function Ie(e){return e?new Date(e+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function te(e){const a=new Date;a.setHours(0,0,0,0);const t=new Date(e+"T00:00:00");return Math.round((t-a)/(1e3*60*60*24))}function we(e){return"★".repeat(e)+"☆".repeat(5-e)}async function Le(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(u){e.innerHTML=Se(u.message);return}const{meta:t,days:i,hotels:o}=a,n=te(t.start_date),s=te(t.end_date),c=new Date().toISOString().slice(0,10),l=i.find(u=>u.date===c),d=i.find(u=>u.date>c),r=l||d,m=[],p=new Set;for(const u of i)p.has(u.location)||(p.add(u.location),m.push({location:u.location,day:u.day,date:u.date}));const b=o.filter(u=>u.recommended),M=b.reduce((u,k)=>u+k.nights,0);b.filter(u=>u.price_per_night>0).reduce((u,k)=>u+k.nights*k.price_per_night,0),e.innerHTML=`
    <div class="dashboard-hero">
      <h1>${t.emoji} ${t.title}</h1>
      <p class="subtitle">${t.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${f(t.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">${f(t.end_date)}</span>
        <span class="date-badge">👥 ${t.travelers_detail||t.travelers+" viaggiatori"}</span>
      </div>
    </div>

    ${xe(n,s)}

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
        <div class="stat-value">${b.length}</div>
        <div class="stat-label">Alloggi selezionati</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${M}</div>
        <div class="stat-label">Notti totali</div>
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
              📍 ${r.location} · ${f(r.date)}
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
      <a href="#natura" class="btn btn-outline">🌿 Natura &amp; Deviazioni</a>
      <a href="#ideas" class="btn btn-outline">💡 Idee rapide</a>
    </div>
  `}function xe(e,a){return e>0?`
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
  `}function Se(e){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${e}</p>
    </div>
  `}const ue="viaggio_croazia_ideas_v1",me=[{value:"alloggio",label:"🏨 Alloggio"},{value:"ristorante",label:"🍽️ Ristorante"},{value:"esperienza",label:"🎯 Esperienza"},{value:"spiaggia",label:"🏖️ Spiaggia"},{value:"escursione",label:"🥾 Escursione"},{value:"cantina",label:"🍷 Cantina / Cibo"},{value:"shopping",label:"🛍️ Shopping"},{value:"varia",label:"💡 Varia"}],F=[{value:"idea",label:"Idea",color:"#6366f1"},{value:"da-verificare",label:"Da verificare",color:"#f59e0b"},{value:"prenotare",label:"Prenotare",color:"#ef4444"},{value:"approvata",label:"Approvata",color:"#10b981"},{value:"scartata",label:"Scartata",color:"#94a3b8"}],pe=[{value:"alta",label:"🔴 Alta"},{value:"media",label:"🟡 Media"},{value:"bassa",label:"🟢 Bassa"}],Be=[{value:"#f59e0b",label:"Giallo"},{value:"#ef4444",label:"Rosso"},{value:"#8b5cf6",label:"Viola"},{value:"#10b981",label:"Verde"},{value:"#f97316",label:"Arancio"}];function ze(){return"idea_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function K(e){return{categoria:"varia",link:"",priorita:"media",stato:"idea",note:e.note??"",location_name:e.location_name??null,...e}}function g(){try{const e=localStorage.getItem(ue);return e?JSON.parse(e).map(K):[]}catch{return[]}}function D(e){try{localStorage.setItem(ue,JSON.stringify(e)),window.dispatchEvent(new CustomEvent("ideas:updated",{detail:{ideas:e}}))}catch(a){console.warn("[ideas] localStorage non disponibile:",a)}}function Z(e){const a=g(),t=K({id:ze(),text:"",note:"",categoria:"varia",link:"",priorita:"media",stato:"idea",created_at:new Date().toISOString(),day_date:null,location_name:null,coordinates:null,add_to_checklist:!1,add_to_map:!1,marker_color:"#f59e0b",completed:!1,...e});return a.unshift(t),D(a),t}function B(e,a){const t=g(),i=t.findIndex(o=>o.id===e);return i===-1?null:(t[i]={...t[i],...a},D(t),t[i])}function ge(e){D(g().filter(a=>a.id!==e))}function Ce(e){return g().filter(a=>a.day_date===e)}function Ae(){return g().filter(e=>e.add_to_checklist)}function P(){return g().filter(e=>{var a;return e.add_to_map&&((a=e.coordinates)==null?void 0:a.lat)!=null})}function Me(){return JSON.stringify(g(),null,2)}function qe(e){const a=JSON.parse(e);if(!Array.isArray(a))throw new Error("JSON non valido: deve essere un array");const t=g(),i=new Set(t.map(s=>s.id));let o=0;const n=[...t];return a.forEach(s=>{i.has(s.id)||(n.push(K(s)),o++)}),D(n),o}async function Te(){var c,l;const e=document.getElementById("page-content");let a;try{a=await L()}catch(d){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${d.message}</p></div>`;return}const{days:t,hotels:i,meta:o}=a,n=Object.fromEntries(i.map(d=>[d.id,d]));e.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${o.title} · ${o.duration_days} giorni · ${f(o.start_date)} → ${f(o.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${t.map(d=>Oe(d,n)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(d=>{d.addEventListener("click",()=>{const r=d.nextElementSibling,m=d.querySelector(".timeline-toggle");r==null||r.classList.toggle("hidden"),m==null||m.classList.toggle("open")})}),(c=document.getElementById("expand-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(d=>d.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(d=>d.classList.add("open"))}),(l=document.getElementById("collapse-all"))==null||l.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(d=>d.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(d=>d.classList.remove("open"))}),De(t);const s=()=>{document.querySelectorAll(".day-ideas-section").forEach(d=>{const r=d.dataset.date;r&&(d.innerHTML=ve(r))})};window.addEventListener("ideas:updated",s),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",s)}function Oe(e,a){const t=e.hotel_ref?a[e.hotel_ref]:null,i=new Date().toISOString().slice(0,10),o=e.date===i,n=e.date<i,s=e.coordinates?JSON.stringify(e.coordinates):"null";return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num"
          style="${n?"background:var(--color-text-muted)":o?"background:var(--color-accent)":""}">
          ${e.day}
        </div>
        <div class="timeline-date-label">
          ${Ie(e.date)}<br>${J(e.date)}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${e.title}${o?' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>':""}</h3>
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
                ${ve(e.date)}
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
  `}function ve(e){const a=Ce(e);return a.length===0?"":a.map(t=>`
    <div class="day-idea-pill ${t.completed?"day-idea-pill--done":""}" data-id="${t.id}">
      <span class="day-idea-text">${Pe(t.text)}</span>
      ${t.add_to_checklist?'<span class="idea-tiny-badge">📋</span>':""}
      ${t.add_to_map?'<span class="idea-tiny-badge">🗺️</span>':""}
      ${t.completed?'<span class="idea-tiny-badge">✅</span>':""}
      <button class="day-idea-del" data-id="${t.id}" title="Elimina">×</button>
    </div>
  `).join("")}function De(e){const a=document.querySelector(".timeline");a&&(a.addEventListener("click",t=>{var s,c;const i=t.target.closest(".day-add-idea-btn");if(i){const l=i.dataset.date,d=document.getElementById(`quick-form-${l}`);if(!d)return;const r=d.classList.contains("hidden");document.querySelectorAll(".day-quick-form").forEach(m=>m.classList.add("hidden")),r&&(d.classList.remove("hidden"),(s=d.querySelector(".quick-idea-text"))==null||s.focus())}const o=t.target.closest(".quick-cancel");o&&((c=o.closest(".day-quick-form"))==null||c.classList.add("hidden"));const n=t.target.closest(".day-idea-del");if(n){const l=n.dataset.id;confirm("Eliminare questa idea?")&&ge(l)}}),a.addEventListener("submit",t=>{var d,r,m,p;const i=t.target.closest(".day-quick-form");if(!i)return;t.preventDefault();const o=(d=i.querySelector(".quick-idea-text"))==null?void 0:d.value.trim();if(!o){(r=i.querySelector(".quick-idea-text"))==null||r.focus();return}const n=i.dataset.date,s=e.find(b=>b.date===n),c=(m=i.querySelector(".quick-map"))==null?void 0:m.checked,l=(p=i.querySelector(".quick-checklist"))==null?void 0:p.checked;Z({text:o,day_date:n,location_name:(s==null?void 0:s.location)??null,coordinates:c&&(s!=null&&s.coordinates)?s.coordinates:null,add_to_checklist:!!l,add_to_map:!!(c&&(s!=null&&s.coordinates))}),i.querySelector(".quick-idea-text").value="",i.querySelector(".quick-map").checked=!1,i.querySelector(".quick-checklist").checked=!1,i.classList.add("hidden")}))}function Pe(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function Ne(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(l){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${l.message}</p></div>`;return}const{hotels:t}=a,i={},o=[];for(const l of t){const d=l.location_group||l.location;i[d]||(i[d]=[],o.push(d)),i[d].push(l)}const n=t.filter(l=>l.recommended&&l.price_per_night>0),s=n.reduce((l,d)=>l+d.nights,0),c=n.reduce((l,d)=>l+d.nights*d.price_per_night,0);e.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${o.length} destinazioni · ${s} notti · 3 opzioni per tappa</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${o.length}</div>
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

    ${o.map(l=>{var d,r;return`
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${l}</span>
          <span class="hotels-group-nights">${(d=i[l][0])!=null&&d.nights?i[l][0].nights+" nott"+(i[l][0].nights===1?"e":"i"):""} · ${(r=i[l][0])!=null&&r.checkin?f(i[l][0].checkin)+" → "+f(i[l][0].checkout):""}</span>
        </div>
        <div class="hotels-grid">
          ${i[l].map(m=>He(m)).join("")}
        </div>
      </div>
    `}).join("")}
  `}function He(e){const a=e.nights,t=a*e.price_per_night,o=e.booking_ref&&e.booking_ref.length>0?'<span class="hotel-status-badge badge-prenotato">✅ Prenotato</span>':e.status==="da_confermare"?'<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>':'<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>',n=e.recommended?'<span class="hotel-recommended-badge">⭐ Consigliato</span>':'<span class="hotel-alt-badge">Alternativa</span>';return`
    <div class="hotel-card ${e.recommended?"hotel-card--recommended":""}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${e.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${n}
            ${o}
          </div>
        </div>
        <div class="hotel-location">📍 ${e.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${f(e.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${f(e.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${e.rating} stelle">
            ${e.rating>0?we(e.rating):'<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
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
  `}const Y="viaggio_croazia_checklist_v1",fe="viaggio_croazia_custom_items_v1";function je(){try{const e=localStorage.getItem(Y);return e?JSON.parse(e):{}}catch{return{}}}function j(e){try{localStorage.setItem(Y,JSON.stringify(e))}catch(a){console.warn("[storage] Impossibile salvare checklist:",a)}}function Re(){try{localStorage.removeItem(Y)}catch{}}function Fe(){return"ci_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function x(){try{const e=localStorage.getItem(fe);return e?JSON.parse(e):[]}catch{return[]}}function C(e){try{localStorage.setItem(fe,JSON.stringify(e)),window.dispatchEvent(new CustomEvent("customitems:updated"))}catch(a){console.warn("[storage] Impossibile salvare custom items:",a)}}function Ve(e,a="Varie"){const t=x(),i={id:Fe(),text:e.trim(),category:a,checked:!1,created_at:new Date().toISOString()};return t.unshift(i),C(t),i}function Ge(e,a){C(x().map(t=>t.id===e?{...t,checked:a}:t))}function Ue(e,a){const t=a.trim();t&&C(x().map(i=>i.id===e?{...i,text:t}:i))}function We(e){C(x().filter(a=>a.id!==e))}function Je(){C([])}async function Ke(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(s){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${s.message}</p></div>`;return}const{categories:t}=a.checklist,i=je();e.innerHTML=`
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
      ${t.map(s=>Ye(s,i)).join("")}
    </div>

    <!-- Idee collegate alla checklist -->
    <div id="checklist-ideas-section">
      ${ae()}
    </div>

    <!-- Sezione voci personalizzate (CRUD) -->
    <div id="custom-items-section">
      ${V()}
    </div>
  `,S(t,i),Xe(t,i),ie(),G();const o=()=>{const s=document.getElementById("checklist-ideas-section");s&&(s.innerHTML=ae(),ie())},n=()=>{const s=document.getElementById("custom-items-section");s&&(s.innerHTML=V(),G())};window.addEventListener("ideas:updated",o),window.addEventListener("customitems:updated",n),window.__currentPageCleanup=()=>{window.removeEventListener("ideas:updated",o),window.removeEventListener("customitems:updated",n)}}function ae(){const e=Ae();if(e.length===0)return"";const a=e.filter(o=>o.completed).length,t=e.length,i=t?a/t*100:0;return`
    <div class="category-card" id="ideas-checklist-card">
      <div class="category-header">
        <span class="category-icon">💡</span>
        <span class="category-name">Idee / Da fare</span>
        <span class="category-count" id="ideas-cl-count">${a}/${t}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="ideas-cl-prog" style="width:${i}%"></div>
        </div>
        <span class="category-chevron" id="ideas-cl-chev">▼</span>
      </div>
      <div class="category-items" id="ideas-cl-items">
        ${e.map(o=>`
          <label class="checklist-item ${o.completed?"checked":""}" data-idea-id="${o.id}">
            <input type="checkbox" data-idea-id="${o.id}" ${o.completed?"checked":""} />
            <span class="checklist-item-text">${O(o.text)}</span>
            ${o.location_name?`<span class="priority-badge" style="background:#eff6ff;color:var(--color-primary)">📍 ${O(o.location_name)}</span>`:""}
          </label>
        `).join("")}
        <div style="padding:0.5rem 1.25rem;">
          <a href="#ideas" class="btn btn-outline" style="font-size:0.78rem;padding:0.3rem 0.75rem;">
            + Aggiungi idea dalla sezione Idee
          </a>
        </div>
      </div>
    </div>
  `}function ie(){var e,a;(e=document.querySelector("#ideas-checklist-card .category-header"))==null||e.addEventListener("click",t=>{var i,o;t.target.tagName!=="INPUT"&&((i=document.getElementById("ideas-cl-items"))==null||i.classList.toggle("hidden"),(o=document.getElementById("ideas-cl-chev"))==null||o.classList.toggle("open"))}),(a=document.getElementById("ideas-cl-items"))==null||a.addEventListener("change",t=>{const i=t.target;if(i.type!=="checkbox")return;const o=i.dataset.ideaId;o&&B(o,{completed:i.checked})})}function V(){const e=x(),a=e.filter(t=>t.checked).length;return`
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
                <span class="checklist-item-text ${t.checked?"line-through":""}">${O(t.text)}</span>
                ${t.category!=="Varie"?`<span class="priority-badge" style="background:#f1f5f9;color:#64748b;">${O(t.category)}</span>`:""}
                <button class="custom-item-edit" data-cid="${t.id}" title="Modifica">✏️</button>
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
  `}function G(){var a,t,i;const e=document.getElementById("custom-items-header");e==null||e.addEventListener("click",o=>{var n,s;o.target.closest(".custom-add-form")||o.target.closest("button")||((n=document.getElementById("custom-items-list"))==null||n.classList.toggle("hidden"),(s=document.getElementById("custom-chev"))==null||s.classList.toggle("open"))}),(a=document.getElementById("custom-items-list"))==null||a.addEventListener("change",o=>{const n=o.target;n.classList.contains("custom-item-cb")&&Ge(n.dataset.cid,n.checked)}),(t=document.getElementById("custom-items-list"))==null||t.addEventListener("click",o=>{const n=o.target.closest(".custom-item-del");if(n){We(n.dataset.cid);return}const s=o.target.closest(".custom-item-edit");if(s){Ze(s.dataset.cid);return}if(o.target.closest("#custom-add-btn")){oe();return}o.target.closest("#clear-custom-btn")&&confirm("Eliminare tutte le voci personalizzate?")&&Je()}),(i=document.getElementById("custom-item-text"))==null||i.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),oe())})}function oe(){var i;const e=document.getElementById("custom-item-text"),a=((i=document.getElementById("custom-item-cat"))==null?void 0:i.value)??"Varie",t=e==null?void 0:e.value.trim();if(!t){e==null||e.focus();return}Ve(t,a),e&&(e.value="")}function Ze(e){const a=x().find(p=>p.id===e);if(!a)return;const t=document.querySelector(`.custom-item[data-cid="${e}"]`);if(!t)return;const i=t.querySelector(".checklist-item-text"),o=t.querySelector(".custom-item-edit"),n=t.querySelector(".custom-item-del"),s=t.querySelector(".priority-badge");if(!i)return;const c=document.createElement("input");c.type="text",c.value=a.text,c.className="custom-edit-input";const l=document.createElement("button");l.textContent="✓",l.className="custom-item-save-edit",l.title="Salva";const d=document.createElement("button");d.textContent="✕",d.className="custom-item-cancel-edit",d.title="Annulla",i.replaceWith(c),s&&(s.style.display="none"),o&&o.replaceWith(l),n&&(n.style.display="none"),l.after(d),c.focus(),c.select();function r(){const p=c.value.trim();if(!p){c.focus();return}Ue(e,p)}function m(){const p=document.getElementById("custom-items-section");p&&(p.innerHTML=V(),G())}c.addEventListener("keydown",p=>{p.key==="Enter"&&(p.preventDefault(),r()),p.key==="Escape"&&m()}),l.addEventListener("click",r),d.addEventListener("click",m)}function Ye(e,a){const t=e.items.length,i=e.items.filter(o=>a[o.id]).length;return`
    <div class="category-card" data-cat="${e.id}">
      <div class="category-header">
        <span class="category-icon">${e.icon}</span>
        <span class="category-name">${e.name}</span>
        <span class="category-count" id="count-${e.id}">${i}/${t}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${e.id}"
            style="width:${t?i/t*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${e.id}">▼</span>
      </div>
      <div class="category-items" id="items-${e.id}">
        ${e.items.map(o=>Qe(o,a[o.id]||!1)).join("")}
      </div>
    </div>
  `}function Qe(e,a){return`
    <label class="checklist-item ${a?"checked":""}" data-id="${e.id}">
      <input type="checkbox" ${a?"checked":""} data-id="${e.id}" />
      <span class="checklist-item-text">${e.text}</span>
      ${e.priority!=="low"?`<span class="priority-badge priority-${e.priority}">${e.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function Xe(e,a){var t,i,o,n;(t=document.getElementById("checklist-categories"))==null||t.addEventListener("change",s=>{var d;const c=s.target;if(c.type!=="checkbox")return;const l=c.dataset.id;a[l]=c.checked,(d=c.closest(".checklist-item"))==null||d.classList.toggle("checked",c.checked),j(a),et(e,a,l),S(e,a)}),document.querySelectorAll(".category-header").forEach(s=>{s.addEventListener("click",c=>{var d,r,m;if(c.target.tagName==="INPUT")return;const l=(d=s.closest(".category-card"))==null?void 0:d.dataset.cat;l&&((r=document.getElementById(`items-${l}`))==null||r.classList.toggle("hidden"),(m=document.getElementById(`chev-${l}`))==null||m.classList.toggle("open"))})}),(i=document.getElementById("check-all"))==null||i.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(c=>{a[c.id]=!0})),j(a),R(e,a),S(e,a)}),(o=document.getElementById("uncheck-all"))==null||o.addEventListener("click",()=>{e.forEach(s=>s.items.forEach(c=>{a[c.id]=!1})),j(a),R(e,a),S(e,a)}),(n=document.getElementById("reset-btn"))==null||n.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(Re(),e.forEach(s=>s.items.forEach(c=>{a[c.id]=!1})),R(e,a),S(e,a))})}function et(e,a,t){const i=e.find(d=>d.items.some(r=>r.id===t));if(!i)return;const o=i.items.length,n=i.items.filter(d=>a[d.id]).length,s=o?n/o*100:0,c=document.getElementById(`count-${i.id}`),l=document.getElementById(`prog-${i.id}`);c&&(c.textContent=`${n}/${o}`),l&&(l.style.width=`${s}%`)}function S(e,a){const t=e.reduce((c,l)=>c+l.items.length,0),i=e.reduce((c,l)=>c+l.items.filter(d=>a[d.id]).length,0),o=t?i/t*100:0,n=document.getElementById("global-fill"),s=document.getElementById("global-text");n&&(n.style.width=`${o}%`),s&&(s.textContent=`${i} / ${t}`)}function R(e,a){e.forEach(t=>{const i=t.items.length,o=t.items.filter(l=>a[l.id]).length,n=i?o/i*100:0,s=document.getElementById(`count-${t.id}`),c=document.getElementById(`prog-${t.id}`);s&&(s.textContent=`${o}/${i}`),c&&(c.style.width=`${n}%`),t.items.forEach(l=>{const d=document.querySelector(`.checklist-item[data-id="${l.id}"]`),r=d==null?void 0:d.querySelector('input[type="checkbox"]');!d||!r||(r.checked=a[l.id]||!1,d.classList.toggle("checked",r.checked))})})}function O(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const tt="AIzaSyCAFbyemD6aGU_oemr3qi_CFc6UHpaMsU8";let v=null,U=[],W=[],z=[],T=null,ne=null;async function at(){const e=document.getElementById("page-content");e.innerHTML=`
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
  `,ne=await L(),await it(tt),ot(ne),dt(),se();const a=()=>{if(!v)return;z.forEach(i=>i.setMap(null)),z=[],be(),se();const t=document.querySelector('.map-btn[data-layer="ideas"]');if(t){const i=P().length;t.textContent=`💡 Idee${i>0?` (${i})`:""}`}};window.addEventListener("ideas:updated",a),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",a)}function it(e){return new Promise((a,t)=>{var n;if((n=window.google)!=null&&n.maps){a();return}const i="__gmapsReady_"+Date.now();window[i]=()=>{delete window[i],a()};const o=document.createElement("script");o.src=`https://maps.googleapis.com/maps/api/js?key=${e}&callback=${i}&loading=async`,o.async=!0,o.onerror=()=>t(new Error("Impossibile caricare Google Maps")),document.head.appendChild(o)})}function ot(e){const a=document.getElementById("google-map");a&&(v=new google.maps.Map(a,{center:{lat:44,lng:15.5},zoom:7,mapTypeId:"roadmap",styles:[{featureType:"water",elementType:"geometry",stylers:[{color:"#a2daf5"}]},{featureType:"landscape",stylers:[{color:"#f5f5f0"}]}]}),nt(e),st(e),lt(e),be(),ct(e))}function nt(e){W=[];const a=new Map;e.days.filter(t=>t.coordinates).forEach(t=>{const i=`${t.coordinates.lat},${t.coordinates.lng}`;a.has(i)||a.set(i,[]),a.get(i).push(t)}),a.forEach(t=>{const i=t[0],o=t[t.length-1],n=t.length>1?`Giorni ${i.day}–${o.day} — ${i.location}`:`Giorno ${i.day} — ${i.location}`,s=new google.maps.Marker({position:i.coordinates,map:v,title:i.location,label:{text:String(i.day),color:"#fff",fontWeight:"bold",fontSize:"11px"},icon:{path:google.maps.SymbolPath.CIRCLE,scale:16,fillColor:"#1e40af",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:2},zIndex:10}),c=t.map(d=>`<div style="margin-top:5px;font-size:12px;border-top:1px solid #e2e8f0;padding-top:4px;">
        <span style="color:#1e40af;font-weight:700;">Gg. ${d.day}</span>
        <span style="color:#64748b;"> · ${d.date}</span><br>
        <span>${d.title}</span>
      </div>`).join(""),l=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#1e40af;">${n}</strong>
          ${c}
        </div>`});s.addListener("click",()=>l.open(v,s)),W.push(s)})}function st(e){U=[],e.hotels.filter(a=>a.recommended).forEach(a=>{const t=new google.maps.Marker({position:a.coordinates,map:v,title:a.name,icon:{path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,scale:7,fillColor:"#059669",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:1.5},zIndex:5}),i=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#065f46;">🏨 ${a.name}</strong>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${a.address}</div>
          <div style="margin-top:6px;font-size:12px;">
            ${a.checkin} → ${a.checkout} · ${a.nights} notti
          </div>
          ${a.notes?`<div style="margin-top:6px;font-size:11px;color:#64748b;font-style:italic;">${a.notes}</div>`:""}
        </div>`});t.addListener("click",()=>i.open(v,t)),U.push(t)})}function be(){z=[],P().forEach(e=>{const a=new google.maps.Marker({position:e.coordinates,map:v,title:e.text,icon:{path:google.maps.SymbolPath.CIRCLE,scale:10,fillColor:e.marker_color||"#f59e0b",fillOpacity:.9,strokeColor:"#ffffff",strokeWeight:2},zIndex:15}),t=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:220px;">
          <strong style="color:#92400e;">💡 ${e.text}</strong>
          ${e.note?`<div style="font-size:12px;color:#64748b;margin-top:4px;">${e.note}</div>`:""}
          ${e.location_name?`<div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${e.location_name}</div>`:""}
          ${e.add_to_checklist?'<div style="margin-top:4px;font-size:11px;">📋 In checklist</div>':""}
        </div>`});a.addListener("click",()=>t.open(v,a)),z.push(a)})}function lt(e){T=new google.maps.Polyline({path:e.days.filter(a=>a.coordinates).map(a=>a.coordinates),geodesic:!0,strokeColor:"#3b82f6",strokeOpacity:.7,strokeWeight:3,icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale:3},repeat:"120px"}],map:v})}function ct(e){const a=new google.maps.LatLngBounds;e.days.filter(t=>t.coordinates).forEach(t=>a.extend(t.coordinates)),e.hotels.filter(t=>t.recommended).forEach(t=>a.extend(t.coordinates)),v.fitBounds(a,60)}function dt(){var t;const e=P().length,a=document.querySelector('.map-btn[data-layer="ideas"]');a&&e>0&&(a.textContent=`💡 Idee (${e})`),(t=document.getElementById("map-controls"))==null||t.addEventListener("click",i=>{const o=i.target.closest(".map-btn");if(!o)return;document.querySelectorAll(".map-btn").forEach(s=>s.classList.remove("active")),o.classList.add("active");const n=o.dataset.layer;W.forEach(s=>s.setVisible(n==="all"||n==="route")),U.forEach(s=>s.setVisible(n==="all"||n==="hotels")),z.forEach(s=>s.setVisible(n==="all"||n==="ideas")),T==null||T.setVisible(n==="all"||n==="route")})}function se(){const e=document.getElementById("map-legend");if(!e)return;const a=P().length;e.innerHTML=`
    <div class="legend-item">
      <div class="legend-dot" style="background:#1e40af;"></div>
      <span>Tappa giornaliera</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#059669;"></div>
      <span>Hotel (consigliato)</span>
    </div>
    <div class="legend-item">
      <div class="legend-dot" style="background:#3b82f6;width:20px;height:6px;border-radius:3px;border:none;box-shadow:none;"></div>
      <span>Percorso</span>
    </div>
    ${a>0?`
    <div class="legend-item">
      <div class="legend-dot" style="background:#f59e0b;"></div>
      <span>Idee (${a})</span>
    </div>`:""}
  `}let _=null,I="tutte",A=[],h=!1;async function rt(){const e=document.getElementById("page-content");let a;try{a=await L()}catch(i){e.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${i.message}</p></div>`;return}A=a.days,_=null,I="tutte",e.innerHTML=`
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Cattura idee al volo — si sincronizzano con Checklist, Mappa e Itinerario.</p>
    </div>

    <!-- FORM RAPIDO -->
    <div class="ideas-form-wrap" id="ideas-form-wrap">
      ${N(null)}
    </div>

    <!-- TOOLBAR: filtri + export/import -->
    <div class="ideas-toolbar" id="ideas-toolbar">
      <div class="ideas-filters-row" id="ideas-filters-row">
        ${he()}
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
      ${$e()}
    </div>
  `,H(),ke(),ye(),gt();const t=()=>{$(),w()};window.addEventListener("ideas:updated",t),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",t)}function N(e){var s,c;const a=!!e,t=A.map(l=>`<option value="${l.date}" ${(e==null?void 0:e.day_date)===l.date?"selected":""}>
      Gg. ${l.day} — ${l.location} · ${J(l.date)}
    </option>`).join(""),i=F.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.stato)??"idea")===l.value?"selected":""}>${l.label}</option>`).join(""),o=me.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.categoria)??"varia")===l.value?"selected":""}>${l.label}</option>`).join(""),n=pe.map(l=>`<option value="${l.value}" ${((e==null?void 0:e.priorita)??"media")===l.value?"selected":""}>${l.label}</option>`).join("");return`
    <form id="idea-form" class="ideas-form">
      <div class="ideas-form-title">${a?"✏️ Modifica idea":"💡 Nuova idea"}</div>

      <!-- TITOLO — unico campo obbligatorio, grande e prominente -->
      <input type="text" id="idea-text" class="ideas-input ideas-input--title"
        placeholder="Cosa vuoi ricordare…"
        value="${y((e==null?void 0:e.text)??"")}"
        autocomplete="off" />

      <!-- ROW: categoria / stato / priorità -->
      <div class="ideas-row3">
        <div class="ideas-field-mini">
          <label class="ideas-label">Categoria</label>
          <select id="idea-categoria" class="ideas-select">${o}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Stato</label>
          <select id="idea-stato" class="ideas-select">${i}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Priorità</label>
          <select id="idea-priorita" class="ideas-select">${n}</select>
        </div>
      </div>

      <!-- Toggle dettagli aggiuntivi -->
      <button type="button" class="ideas-toggle-advanced" id="ideas-toggle-advanced">
        ${h?"▲ Meno dettagli":"▼ Più dettagli"}
      </button>

      <div id="ideas-advanced" class="${h?"":"hidden"}">
        <!-- Nota -->
        <textarea id="idea-note" class="ideas-input ideas-textarea"
          rows="2" placeholder="Nota aggiuntiva…">${y((e==null?void 0:e.note)??"")}</textarea>

        <!-- Luogo + Link -->
        <div class="ideas-row2">
          <input type="text" id="idea-location" class="ideas-input"
            placeholder="📍 Luogo"
            value="${y((e==null?void 0:e.location_name)??"")}" />
          <input type="url" id="idea-link" class="ideas-input"
            placeholder="🔗 Link (opz.)"
            value="${y((e==null?void 0:e.link)??"")}" />
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
            ${Be.map(l=>`
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
  `}function H(){var a,t,i;const e=document.getElementById("ideas-form-wrap");e&&((a=document.getElementById("ideas-toggle-advanced"))==null||a.addEventListener("click",()=>{h=!h;const o=document.getElementById("ideas-advanced"),n=document.getElementById("ideas-toggle-advanced");o==null||o.classList.toggle("hidden",!h),n&&(n.textContent=h?"▲ Meno dettagli":"▼ Più dettagli")}),e.addEventListener("change",o=>{var n;if(o.target.id==="idea-day"){const s=A.find(c=>c.date===o.target.value);s!=null&&s.coordinates&&(document.getElementById("idea-lat").value=s.coordinates.lat,document.getElementById("idea-lng").value=s.coordinates.lng,document.getElementById("idea-coords-hint").textContent=`Auto-riempito da "${s.location}"`)}o.target.id==="idea-add-map"&&((n=document.getElementById("idea-color-row"))==null||n.classList.toggle("hidden",!o.target.checked))}),(t=document.getElementById("idea-form"))==null||t.addEventListener("submit",o=>{o.preventDefault(),ut()}),(i=document.getElementById("idea-cancel-btn"))==null||i.addEventListener("click",()=>{_=null,document.getElementById("ideas-form-wrap").innerHTML=N(null),H()}))}function ut(){var s,c,l,d,r,m,p,b,M,u,k,Q,X,ee;const e=(s=document.getElementById("idea-text"))==null?void 0:s.value.trim();if(!e){(c=document.getElementById("idea-text"))==null||c.focus();return}const a=parseFloat((l=document.getElementById("idea-lat"))==null?void 0:l.value),t=parseFloat((d=document.getElementById("idea-lng"))==null?void 0:d.value),i=!isNaN(a)&&!isNaN(t)?{lat:a,lng:t}:null,o=(r=document.getElementById("idea-add-map"))==null?void 0:r.checked,n={text:e,note:((m=document.getElementById("idea-note"))==null?void 0:m.value.trim())??"",categoria:((p=document.getElementById("idea-categoria"))==null?void 0:p.value)??"varia",stato:((b=document.getElementById("idea-stato"))==null?void 0:b.value)??"idea",priorita:((M=document.getElementById("idea-priorita"))==null?void 0:M.value)??"media",day_date:((u=document.getElementById("idea-day"))==null?void 0:u.value)||null,location_name:((k=document.getElementById("idea-location"))==null?void 0:k.value.trim())||null,link:((Q=document.getElementById("idea-link"))==null?void 0:Q.value.trim())||"",coordinates:i,add_to_checklist:((X=document.getElementById("idea-add-checklist"))==null?void 0:X.checked)??!1,add_to_map:o&&i!==null,marker_color:((ee=document.querySelector('input[name="idea-color"]:checked'))==null?void 0:ee.value)??"#f59e0b"};_?(B(_,n),_=null):Z(n),h=!1,document.getElementById("ideas-form-wrap").innerHTML=N(null),H(),$(),w()}function he(){const e=g();return[{key:"tutte",label:`Tutte (${e.length})`},{key:"idea",label:`Idea (${e.filter(t=>t.stato==="idea").length})`},{key:"da-verificare",label:`Da verificare (${e.filter(t=>t.stato==="da-verificare").length})`},{key:"prenotare",label:`Prenotare (${e.filter(t=>t.stato==="prenotare").length})`},{key:"approvata",label:`Approvate (${e.filter(t=>t.stato==="approvata").length})`},{key:"scartata",label:`Scartate (${e.filter(t=>t.stato==="scartata").length})`}].map(t=>`
    <button class="idea-filter-btn ${I===t.key?"active":""}" data-f="${t.key}">
      ${t.label}
    </button>
  `).join("")}function ye(){var e;(e=document.getElementById("ideas-filters-row"))==null||e.querySelectorAll(".idea-filter-btn").forEach(a=>{a.addEventListener("click",()=>{I=a.dataset.f,w(),$()})})}function w(){const e=document.getElementById("ideas-filters-row");e&&(e.innerHTML=he(),ye())}function $e(){let e=g();return I!=="tutte"&&(e=e.filter(a=>a.stato===I)),e.length===0?`<div class="ideas-empty">${I==="tutte"?"Nessuna idea salvata. Aggiungine una qui sopra.":"Nessuna idea per questo filtro."}</div>`:e.map(mt).join("")}function mt(e){const a=F.find(n=>n.value===e.stato),t=me.find(n=>n.value===e.categoria),i=pe.find(n=>n.value===e.priorita),o=e.day_date?A.find(n=>n.date===e.day_date):null;return`
    <div class="idea-card ${e.stato==="scartata"?"idea-card--scartata":""}" data-id="${e.id}">
      <div class="idea-card-main">
        <div class="idea-card-header-row">
          <span class="idea-card-text">${y(e.text)}</span>
          <div class="idea-card-badges-inline">
            ${a?`<span class="idea-stato-badge" style="background:${a.color}20;color:${a.color};border-color:${a.color}40;">${a.label}</span>`:""}
            ${t?`<span class="idea-cat-badge">${t.label}</span>`:""}
            ${i?`<span class="idea-pri-dot" title="${i.label}" style="background:${vt(e.priorita)}"></span>`:""}
          </div>
        </div>

        ${e.note?`<div class="idea-card-note">${y(e.note)}</div>`:""}

        <div class="idea-card-meta">
          ${o?`<span class="idea-meta-chip">📅 Gg. ${o.day} — ${o.location}</span>`:""}
          ${e.location_name?`<span class="idea-meta-chip">📍 ${y(e.location_name)}</span>`:""}
          ${e.add_to_checklist?'<span class="idea-meta-chip">📋 Checklist</span>':""}
          ${e.add_to_map?`<span class="idea-meta-chip" style="border-left:3px solid ${e.marker_color}">🗺️ Mappa</span>`:""}
          ${e.link?`<a href="${y(e.link)}" target="_blank" rel="noopener" class="idea-meta-chip idea-meta-link">🔗 Link</a>`:""}
        </div>
      </div>

      <div class="idea-card-actions">
        <!-- Stato rapido -->
        <select class="idea-stato-select" data-action="stato" data-id="${e.id}" title="Cambia stato">
          ${F.map(n=>`<option value="${n.value}" ${e.stato===n.value?"selected":""}>${n.label}</option>`).join("")}
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
  `}function pt(e){var o,n,s;const a=g().find(c=>c.id===e);if(!a)return;(o=document.getElementById("day-link-modal"))==null||o.remove();const t=A.map(c=>`<option value="${c.date}" ${a.day_date===c.date?"selected":""}>
      Gg. ${c.day} — ${c.location} · ${J(c.date)}
    </option>`).join(""),i=document.createElement("div");i.id="day-link-modal",i.className="day-link-modal-overlay",i.innerHTML=`
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
  `,document.body.appendChild(i),(n=document.getElementById("day-link-confirm"))==null||n.addEventListener("click",()=>{var l;const c=((l=document.getElementById("day-link-select"))==null?void 0:l.value)||null;B(e,{day_date:c}),i.remove(),$()}),(s=document.getElementById("day-link-cancel"))==null||s.addEventListener("click",()=>i.remove()),i.addEventListener("click",c=>{c.target===i&&i.remove()})}function ke(){const e=document.getElementById("ideas-list");e&&(e.addEventListener("change",a=>{a.target.dataset.action==="stato"&&(B(a.target.dataset.id,{stato:a.target.value}),$(),w())}),e.addEventListener("click",a=>{var n;const t=a.target.closest("[data-action]");if(!t)return;const i=t.dataset.id,o=t.dataset.action;if(o==="delete"){if(!confirm("Eliminare questa idea?"))return;ge(i),$(),w()}if(o==="edit"){_=i;const s=g().find(c=>c.id===i);if(!s)return;h=!0,document.getElementById("ideas-form-wrap").innerHTML=N(s),H(),(n=document.getElementById("ideas-form-wrap"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})}if(o==="checklist"){const s=g().find(c=>c.id===i);if(!s)return;B(i,{add_to_checklist:!s.add_to_checklist}),$()}o==="day-link"&&pt(i)}))}function $(){const e=document.getElementById("ideas-list");e&&(e.innerHTML=$e(),ke())}function gt(){var e,a;(e=document.getElementById("export-btn"))==null||e.addEventListener("click",()=>{const t=Me(),i=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(i),n=document.createElement("a");n.href=o,n.download=`idee_viaggio_${new Date().toISOString().slice(0,10)}.json`,n.click(),URL.revokeObjectURL(o)}),(a=document.getElementById("import-file"))==null||a.addEventListener("change",async t=>{var o;const i=(o=t.target.files)==null?void 0:o[0];if(i){try{const n=await i.text(),s=qe(n);alert(`Importazione completata: ${s} nuove idee aggiunte.`),$(),w()}catch(n){alert("Errore importazione: "+n.message)}t.target.value=""}})}function vt(e){return e==="alta"?"#ef4444":e==="media"?"#f59e0b":"#22c55e"}function y(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const E=[{id:"zlatni-rat",nome:"Zlatni Rat",area:"Brač",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia",descrizione:"La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete.",bambini:!0,bambini_nota:"Ottimo — acque basse, spiaggia servita, pini per l'ombra",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.3246,lng:16.6372}},{id:"vidova-gora",nome:"Vidova Gora",area:"Brač",categoria:"panorama",categoriaLabel:"⛰️ Panorama",descrizione:"Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar, il canale e il mare aperto. Si raggiunge in auto su strada asfaltata.",bambini:!0,bambini_nota:"In auto facilissimo; il sentiero a piedi è impegnativo",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:43.3621,lng:16.6588}},{id:"telascica",nome:"Telašćica Nature Park",area:"Area di Zara",categoria:"parco",categoriaLabel:"🌿 Parco naturale",descrizione:"Baia naturale nell'isola di Dugi Otok: scogliere alte 200 m, acqua smeraldo, e il Lago Mir (salato con effetti benefici). Accesso in barca da Zadar o Biograd.",bambini:!0,bambini_nota:"Bello per tutta la famiglia — solo in barca, fare il bagno nel lago è esperienza unica",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:43.9044,lng:15.1533}},{id:"vransko-lake",nome:"Vransko Lake",area:"Area di Zara",categoria:"lago",categoriaLabel:"🦢 Lago / Ornitologia",descrizione:"Il lago più grande della Croazia (30 km²), riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica, kayak, ambiente tranquillo.",bambini:!0,bambini_nota:"Adatto — pista ciclabile e percorsi piani ideali con i bambini",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.8856,lng:15.5475}},{id:"paklenica",nome:"Paklenica National Park",area:"Area di Zara",categoria:"parco",categoriaLabel:"🏔️ Canyon / Trekking",descrizione:"Canyon spettacolari ai piedi delle Alpi Dinare. Due gole (Velika e Mala Paklenica) con sentieri per tutti i livelli, pareti d'arrampicata e la grotta Manita Peć.",bambini:!1,bambini_nota:"Sentieri brevi e facili esistono, ma le gole principali sono impegnative per bambini piccoli",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.3219,lng:15.4722}},{id:"zrmanja",nome:"Canyon Zrmanja",area:"Area di Zara",categoria:"fiume",categoriaLabel:"🌊 Fiume / Rafting",descrizione:"Uno dei fiumi più belli della Dalmazia: acque turchesi carsiche, cascate di travertino e canyon selvaggi. Kayak e rafting disponibili da operatori locali.",bambini:!1,bambini_nota:"Rafting non adatto ai bambini piccoli; belvedere sul canyon accessibile a tutti",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:44.1867,lng:15.8753}},{id:"brijuni",nome:"Brijuni National Park",area:"Istria",categoria:"parco",categoriaLabel:"🦒 Parco / Safari",descrizione:"Arcipelago di 14 isole con safari park (zebre, elefanti), resti romani e spiagge meravigliose. Accesso solo in traghetto da Fažana (vicino Pola). Era la residenza di Tito.",bambini:!0,bambini_nota:"Fantastico per i bambini — safari su trenino, animali esotici, mare pulito",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:44.9167,lng:13.7636}},{id:"lim-fjord",nome:"Lim Fjord (Limski Kanal)",area:"Istria",categoria:"natura",categoriaLabel:"🌲 Fiordo / Paesaggio",descrizione:"Canale marino di 10 km incastrato tra boschi e vigneti istriani. Famoso per le ostriche allevate in acqua. Belvedere dall'alto accessibile in auto, gita in barca dal basso.",bambini:!0,bambini_nota:"Il belvedere è accessibile a tutti; la barca è ottima per i bambini",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1419,lng:13.6408}},{id:"dobbiaco",nome:"Lago di Dobbiaco",area:"Sesto / Alta Pusteria",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:"Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla famosa pista ciclabile. Acque verdissime, Dolomiti come sfondo.",bambini:!0,bambini_nota:"Perfetto — pista ciclabile pianeggiante, riva accessibile, area pic-nic",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:46.7358,lng:12.2214}},{id:"braies",nome:"Lago di Braies",area:"Sesto / Alta Pusteria",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo ai piedi delle Dolomiti di Sesto. Barche a remi, sentiero attorno al lago (3 km). Molto frequentato in agosto — meglio la mattina presto.',bambini:!0,bambini_nota:"Adatto — sentiero pianeggiante attorno al lago, barche a noleggio",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:46.6948,lng:12.0853}}],ft={"sosta-breve":{label:"Sosta breve",icon:"⚡",cls:"impegno-breve"},"mezza-giornata":{label:"Mezza giornata",icon:"🕐",cls:"impegno-mezza"},"giornata-piena":{label:"Giornata piena",icon:"📅",cls:"impegno-piena"}},bt={"molto-consigliato":{label:"⭐ Molto consigliato",cls:"nota-top"},opzionale:{label:"✔ Opzionale",cls:"nota-ok"},"solo-se-c-e-tempo":{label:"⏱ Solo se c'è tempo",cls:"nota-ifpos"}};async function ht(){var i;const e=document.getElementById("page-content"),a=[...new Set(E.map(o=>o.area))];let t="tutte";e.innerHTML=`
    <div class="page-header">
      <h1>🌿 Natura & Deviazioni</h1>
      <p>Attrazioni naturalistiche lungo il percorso — compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte (${E.length})</button>
      ${a.map(o=>`
        <button class="natura-filter-btn" data-area="${o}">
          ${o} (${E.filter(n=>n.area===o).length})
        </button>
      `).join("")}
    </div>

    <div class="natura-grid" id="natura-grid">
      ${E.map(le).join("")}
    </div>
  `,(i=document.getElementById("natura-filters"))==null||i.addEventListener("click",o=>{const n=o.target.closest(".natura-filter-btn");if(!n)return;t=n.dataset.area,document.querySelectorAll(".natura-filter-btn").forEach(c=>c.classList.remove("active")),n.classList.add("active");const s=document.getElementById("natura-grid");if(s){const c=t==="tutte"?E:E.filter(l=>l.area===t);s.innerHTML=c.map(le).join(""),ce()}}),ce()}function le(e){const a=ft[e.impegno]||{label:e.impegno,icon:"🕐",cls:""},t=bt[e.nota_tipo]||{label:e.nota_tipo,cls:""},i=`https://www.google.com/maps/search/?api=1&query=${e.coords.lat},${e.coords.lng}`;return`
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
        <a href="${i}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🗺️ Apri in Google Maps
        </a>
        <button class="btn btn-outline natura-add-idea-btn"
          data-nome="${de(e.nome)}"
          data-area="${de(e.area)}"
          data-lat="${e.coords.lat}"
          data-lng="${e.coords.lng}">
          💡 Aggiungi alle Idee
        </button>
      </div>
    </div>
  `}function ce(){document.querySelectorAll(".natura-add-idea-btn").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.nome,t=e.dataset.area,i=parseFloat(e.dataset.lat),o=parseFloat(e.dataset.lng);Z({text:a,location_name:t,categoria:"escursione",stato:"da-verificare",add_to_map:!0,coordinates:{lat:i,lng:o},marker_color:"#10b981"}),e.textContent="✅ Aggiunta!",e.disabled=!0,setTimeout(()=>{e.textContent="💡 Aggiungi alle Idee",e.disabled=!1},2e3)})})}function de(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const re={"#dashboard":Le,"#itinerary":Te,"#hotels":Ne,"#checklist":Ke,"#map":at,"#ideas":rt,"#natura":ht};async function Ee(){typeof window.__currentPageCleanup=="function"&&(window.__currentPageCleanup(),window.__currentPageCleanup=null);const e=window.location.hash||"#dashboard",a=re[e]??re["#dashboard"],t=document.getElementById("page-content");t.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await a()}catch(i){console.error("[router]",i),t.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${i.message||"Errore sconosciuto"}</p>
      </div>
    `}}_e();window.addEventListener("hashchange",Ee);Ee();
