(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}})();function we(){const a=document.getElementById("nav-toggle"),e=document.getElementById("nav-links");a==null||a.addEventListener("click",()=>{e==null||e.classList.toggle("open")}),e==null||e.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",()=>{e.classList.remove("open")})});function i(){const t=window.location.hash||"#dashboard";document.querySelectorAll(".nav-link").forEach(o=>{o.classList.toggle("active",o.getAttribute("href")===t)})}window.addEventListener("hashchange",i),i()}let X=null;async function S(){if(X)return X;const e="/viaggio-croazia/data/trip.json";let i;try{i=await fetch(e)}catch{throw new Error("Dati del viaggio non disponibili offline. Apri l’app una volta con la rete: da quel momento resta consultabile anche senza connessione.")}if(!i.ok)throw new Error(`Impossibile caricare trip.json (${i.status})`);return X=await i.json(),X}function f(a){if(!a)return"";const[,e,i]=a.split("-");return`${i}/${e}`}function Be(a){return a?new Date(a+"T00:00:00").toLocaleDateString("it-IT",{weekday:"short"}).toUpperCase():""}function qa(a){const e=new Date;e.setHours(0,0,0,0);const i=new Date(a+"T00:00:00");return Math.round((i-e)/(1e3*60*60*24))}function Ae(a){return"★".repeat(a)+"☆".repeat(5-a)}function x(a){return`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}&travelmode=driving`}function Ca(a,e){return`https://www.google.com/maps/dir/?api=1&destination=${a},${e}&travelmode=driving`}const xa={mattina:8*60,mattino:8*60,colazione:8*60,pranzo:13*60,pomeriggio:15*60,aperitivo:18*60,sera:20*60,serata:20*60,cena:20*60,notte:23*60};function Z(a){const e=String(a??"").trim().toLowerCase();if(!e)return 9998;const i=e.match(/(\d{1,2})\s*[:.,h]\s*(\d{2})/)||e.match(/^(\d{1,2})(\d{2})$/)||e.match(/^(\d{1,2})$/);if(i){const t=Number(i[1]),o=i[2]!=null?Number(i[2]):0;if(t<=23&&o<=59)return t*60+o}for(const t in xa)if(e.includes(t))return xa[t];return 9998}function qe(a){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`}function Pa(a){const e=String(a??"").trim();return e?/^https?:\/\//i.test(e)?e:qe(e):""}const Ka="viaggio_croazia_ideas_v1",Ja=[{value:"alloggio",label:"🏨 Alloggio"},{value:"ristorante",label:"🍽️ Ristorante"},{value:"esperienza",label:"🎯 Esperienza"},{value:"spiaggia",label:"🏖️ Spiaggia"},{value:"escursione",label:"🥾 Escursione"},{value:"cantina",label:"🍷 Cantina / Cibo"},{value:"shopping",label:"🛍️ Shopping"},{value:"varia",label:"💡 Varia"}],ba=[{value:"idea",label:"Idea",color:"#6366f1"},{value:"da-verificare",label:"Da verificare",color:"#f59e0b"},{value:"prenotare",label:"Prenotare",color:"#ef4444"},{value:"approvata",label:"Approvata",color:"#10b981"},{value:"scartata",label:"Scartata",color:"#94a3b8"}],Wa=[{value:"alta",label:"🔴 Alta"},{value:"media",label:"🟡 Media"},{value:"bassa",label:"🟢 Bassa"}],Ce=[{value:"#f59e0b",label:"Giallo"},{value:"#ef4444",label:"Rosso"},{value:"#8b5cf6",label:"Viola"},{value:"#10b981",label:"Verde"},{value:"#f97316",label:"Arancio"}];function xe(){return"idea_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function $a(a){return{categoria:"varia",link:"",priorita:"media",stato:"idea",note:a.note??"",location_name:a.location_name??null,...a}}function z(){try{const a=localStorage.getItem(Ka);return a?JSON.parse(a).map($a):[]}catch{return[]}}function sa(a){try{localStorage.setItem(Ka,JSON.stringify(a)),window.dispatchEvent(new CustomEvent("ideas:updated",{detail:{ideas:a}}))}catch(e){console.warn("[ideas] localStorage non disponibile:",e)}}function la(a){const e=z(),i=$a({id:xe(),text:"",note:"",categoria:"varia",link:"",priorita:"media",stato:"idea",created_at:new Date().toISOString(),day_date:null,location_name:null,coordinates:null,add_to_checklist:!1,add_to_map:!1,marker_color:"#f59e0b",completed:!1,...a});return e.unshift(i),sa(e),i}function U(a,e){const i=z(),t=i.findIndex(o=>o.id===a);return t===-1?null:(i[t]={...i[t],...e},sa(i),i[t])}function za(a){sa(z().filter(e=>e.id!==a))}function Pe(a){return z().filter(e=>e.day_date===a)}function Me(){return z().filter(a=>a.add_to_checklist)}function ca(){return z().filter(a=>{var e;return a.add_to_map&&((e=a.coordinates)==null?void 0:e.lat)!=null})}function je(){return JSON.stringify(z(),null,2)}function De(a){const e=JSON.parse(a);if(!Array.isArray(e))throw new Error("JSON non valido: deve essere un array");const i=z(),t=new Set(i.map(s=>s.id));let o=0;const n=[...i];return e.forEach(s=>{t.has(s.id)||(n.push($a(s)),o++)}),sa(n),o}function _a(a,e){if(!a||!e)return[];const i=e.toLowerCase();return a.filter(t=>i.includes(t.area.toLowerCase()))}function La(a){return z().filter(e=>e.day_date===a&&e.stato!=="scartata")}function Ea(a){return/sesto/i.test(a.location||"")}function Ya(a,e){var n;const i=((n=a.activities)==null?void 0:n.length)||0,t=Ea(a)?0:_a(e,a.location).length,o=La(a.date).length;return i+t+o}function h(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Te=a=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;function Qa(a,e,i=[]){var v,_,L;const t=_a(e,a.location),o=La(a.date),n=((v=a.tips)==null?void 0:v.do)||[],s=((_=a.tips)==null?void 0:_.eat)||[],r=Ea(a),l=(L=a.activities)!=null&&L.length?`<div class="sugg-section">
         <div class="sugg-section-title">🎯 Programma del giorno</div>
         <div class="sugg-activities">
           ${a.activities.map(g=>`
             <div class="sugg-activity">
               <span class="sugg-activity-time">${h(g.time)}</span>
               <span>${h(g.text)}</span>
             </div>`).join("")}
         </div>
       </div>`:"",c=!r&&n.length?`<div class="sugg-section">
         <div class="sugg-section-title">✨ Cose da fare in zona</div>
         <ul class="sugg-tips">${n.map(g=>`<li>${h(g)}</li>`).join("")}</ul>
       </div>`:"";let d="";if(r){const g=o.map(y=>i.find(m=>m.id===y.hike_id)).filter(y=>y&&Array.isArray(y.tips)&&y.tips.length);g.length&&(d=`<div class="sugg-section">
        <div class="sugg-section-title">✨ Consigli — in base alle attività scelte</div>
        <div class="sugg-eat-list">
          ${g.map(y=>`
            <div class="sugg-eat">
              <span class="sugg-eat-act">${h(y.name)}</span>
              <ul class="sugg-tips">${y.tips.map(m=>`<li>${h(m)}</li>`).join("")}</ul>
            </div>`).join("")}
        </div>
      </div>`)}let u="";if(r){const g=o.map(y=>i.find(m=>m.id===y.hike_id)).filter(y=>y&&y.eat);g.length&&(u=`<div class="sugg-section">
        <div class="sugg-section-title">🍽️ Dove mangiare — in base alle attività scelte</div>
        <div class="sugg-eat-list">
          ${g.map(y=>`
            <div class="sugg-eat">
              <span class="sugg-eat-act">${h(y.name)}</span>
              <span class="sugg-eat-tip">${h(y.eat)}</span>
            </div>`).join("")}
        </div>
      </div>`)}else(t.length||s.length)&&(u=`<div class="sugg-section">
         <div class="sugg-section-title">🍽️ Dove mangiare in zona</div>
         ${s.length?`<ul class="sugg-tips">${s.map(g=>`<li>${h(g)}</li>`).join("")}</ul>`:""}
         <div class="sugg-dining">
           ${t.map(g=>`
             <a class="sugg-dining-item" target="_blank" rel="noopener" href="${Te(g.name+" "+g.town)}">
               <div class="sugg-dining-head">
                 <span class="sugg-dining-name">${h(g.name)}</span>
                 ${g.type?`<span class="sugg-dining-type">${h(g.type)}</span>`:""}
               </div>
               <div class="sugg-dining-town">📍 ${h(g.town)}</div>
               <div class="sugg-dining-spec">${h(g.specialty)}</div>
             </a>`).join("")}
         </div>
       </div>`);const p=`
    <div class="sugg-section">
      <div class="sugg-section-title">💡 Le tue idee per questo giorno</div>
      ${o.length?`<div class="sugg-ideas">${o.map(g=>`
            <div class="sugg-idea">
              <span class="sugg-idea-text">${h(g.text)}</span>
              ${g.note?`<span class="sugg-idea-note">${h(g.note)}</span>`:""}
              ${g.location_name?`<span class="sugg-idea-chip">📍 ${h(g.location_name)}</span>`:""}
              ${g.link?`<a href="${h(g.link)}" target="_blank" rel="noopener" class="sugg-idea-chip">🔗 Link</a>`:""}
            </div>`).join("")}</div>`:'<p class="sugg-empty">Nessuna idea abbinata a questo giorno. Aggiungine dalla pagina <a href="#ideas">💡 Idee rapide</a> (imposta il campo “Giorno”).</p>'}
    </div>`;return l+c+d+u+p}function Oe(a){return String(a??"").replace(/\s*\(.*?\)\s*/g,"").trim()}function Re(a,e){if(!a)return[];const i=[],t=new Set,o=(r,l,c)=>{if(!l||!c)return;const d=l.toLowerCase();t.has(d)||(t.add(d),i.push({icon:r,label:l,url:c}))},n=(e.ferries||[]).find(r=>r.day===a.day);if(n){const r=Oe(n.from);r&&o("⛴️",`Porto di ${r}`,x(`Porto di ${r}`))}const s=(e.hotels||[]).find(r=>r.id===a.hotel_ref);if(s){const r=s.coordinates?Ca(s.coordinates.lat,s.coordinates.lng):x([s.name,s.address].filter(Boolean).join(" "));o("🏨",s.name,r)}return La(a.date).forEach(r=>{var l;((l=r.coordinates)==null?void 0:l.lat)!=null?o("💡",r.text,Ca(r.coordinates.lat,r.coordinates.lng)):r.location_name&&o("💡",r.text,x(r.location_name))}),Ve(e.dining,a).forEach(r=>{o("🍽️",r.name,x(`${r.name} ${r.town}`))}),i}function Ne(a){return[a.title,...(a.activities||[]).map(e=>e.text)].filter(Boolean).join(" ").toLowerCase()}function Ve(a,e){if(!(a!=null&&a.length))return[];const i=Ne(e);return i?_a(a,e.location).filter(t=>{const o=String(t.name??"").toLowerCase().trim();return o?i.includes(o)?!0:o.split(/[–—\-\/]/).map(n=>n.trim()).filter(n=>n.length>=4).some(n=>i.includes(n)):!1}):[]}function Ma(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function He(a,e,i="🚗 Naviga"){const t=Re(a,e);return t.length?`
    <div class="route-nav">
      <div class="route-nav-title">${i} <span>(partenza: la tua posizione)</span></div>
      <div class="route-nav-list">
        ${t.map(o=>`
          <a class="route-nav-btn" target="_blank" rel="noopener" href="${Ma(o.url)}">
            <span>${o.icon}</span>
            <span>${Ma(o.label)}</span>
          </a>`).join("")}
      </div>
    </div>
  `:""}async function Ge(){var y;const a=document.getElementById("page-content");let e;try{e=await S()}catch(m){a.innerHTML=Ke(m.message);return}const{meta:i,days:t,hotels:o}=e,n=qa(i.start_date),s=qa(i.end_date),r=new Date().toISOString().slice(0,10),l=t.find(m=>m.date===r),c=t.find(m=>m.date>r),d=l||c,u=[],p=new Set;for(const m of t)p.has(m.location)||(p.add(m.location),u.push({location:m.location,day:m.day,date:m.date}));const v=o.filter(m=>m.status==="confermata"),_=v.length,L=v.reduce((m,Q)=>m+Q.nights,0),g=d?Ya(d,e.dining):0;a.innerHTML=`
    <div class="dashboard-hero">
      <h1>${i.emoji} ${i.title}</h1>
      <p class="subtitle">${i.subtitle}</p>
      <div class="dates">
        <span class="date-badge">✈️ ${f(i.start_date)}</span>
        <span style="color:rgba(255,255,255,0.5);">→</span>
        <span class="date-badge">🏔️ ${f(i.end_date)}</span>
        <span class="date-badge">👥 ${i.travelers_detail||i.travelers+" viaggiatori"}</span>
      </div>
    </div>

    ${Fe(n,s)}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-value">${i.duration_days}</div>
        <div class="stat-label">Giorni (${f(i.start_date)}–${f(i.end_date)})</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏨</div>
        <div class="stat-value">${_}</div>
        <div class="stat-label">Strutture confermate</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌙</div>
        <div class="stat-value">${L}</div>
        <div class="stat-label">Notti prenotate</div>
      </div>
      <button type="button" class="stat-card stat-card--action" id="suggestions-card"
        title="Vedi i suggerimenti per ${d?d.location:"la tappa"}">
        <div class="stat-icon">💡</div>
        <div class="stat-value">${g}</div>
        <div class="stat-label">Attività suggerite<br><span class="stat-card-cta">tocca per aprire →</span></div>
      </button>
    </div>

    <div class="dashboard-grid">
      <div class="card card-body">
        <div class="section-title">Rotta del viaggio</div>
        <div class="route-stops">
          ${u.map(m=>`
            <div class="route-stop">
              <span class="stop-day">Gg. ${m.day}</span>
              <span>📍 ${m.location}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="card card-body today-card">
        <div class="section-title">${l?"Programma di oggi":c?"Prossima tappa":"Ultima tappa"}</div>
        ${d?`
          <div style="margin-bottom:0.75rem;">
            <strong>${d.title}</strong>
            <div style="font-size:0.82rem; color:var(--color-text-muted); margin-top:0.2rem;">
              📍 ${d.location} · ${f(d.date)}
            </div>
          </div>
          <div class="activity-list">
            ${d.activities.slice(0,5).map(m=>`
              <div class="activity-item">
                <span class="activity-time">${m.time}</span>
                <span>${m.text}</span>
              </div>
            `).join("")}
            ${d.activities.length>5?`<div style="font-size:0.8rem;color:var(--color-text-muted);">+${d.activities.length-5} altre attività → <a href="#itinerary" style="color:var(--color-primary);">Vedi itinerario</a></div>`:""}
          </div>
          ${He(d,e)}
        `:'<p style="color:var(--color-text-muted);font-size:0.9rem;">Nessuna tappa disponibile.</p>'}
      </div>
    </div>

    <div style="margin-top:1.25rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
      <a href="#itinerary" class="btn btn-primary">📅 Vai all'itinerario</a>
      <a href="#hotels" class="btn btn-outline">🏨 Controlla gli hotel</a>
      <a href="#checklist" class="btn btn-outline">✅ Apri la checklist</a>
      <a href="#map" class="btn btn-outline">🗺️ Visualizza la mappa</a>
      <a href="#natura" class="btn btn-outline">🌿 Natura &amp; Cultura</a>
      <a href="#logistics" class="btn btn-outline">📋 Note logistiche</a>
      <a href="#logistics" class="btn btn-outline">🎫 Biglietti traghetti</a>
      <a href="#ideas" class="btn btn-outline">💡 Idee rapide</a>
    </div>
  `,(y=document.getElementById("suggestions-card"))==null||y.addEventListener("click",()=>{d&&Ze(d,e.dining,e.hikes)})}function Ze(a,e,i){var s,r,l;(s=document.getElementById("suggestions-modal"))==null||s.remove();const t=Qa(a,e,i),o=document.createElement("div");o.id="suggestions-modal",o.className="day-link-modal-overlay",o.innerHTML=`
    <div class="day-link-modal suggestions-modal">
      <button type="button" class="sugg-close" id="sugg-close" aria-label="Chiudi">✕</button>
      <div class="sugg-header">
        <div class="sugg-title">💡 Suggerimenti — Gg. ${a.day}</div>
        <div class="sugg-subtitle">📍 ${Ue(a.location)} · ${f(a.date)}</div>
      </div>
      <div class="sugg-body">${t}</div>
      <a href="#attivita" class="sugg-all-link" id="sugg-all-link">📋 Vedi i suggerimenti di tutte le tappe →</a>
    </div>
  `,document.body.appendChild(o);const n=()=>o.remove();(r=document.getElementById("sugg-close"))==null||r.addEventListener("click",n),(l=document.getElementById("sugg-all-link"))==null||l.addEventListener("click",n),o.addEventListener("click",c=>{c.target===o&&n()})}function Ue(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Fe(a,e){return a>0?`
      <div class="countdown-card">
        <div class="countdown-icon">✈️</div>
        <div>
          <div class="countdown-days">${a} giorni</div>
          <div class="countdown-text">alla partenza — il viaggio si avvicina!</div>
        </div>
      </div>
    `:a<=0&&e>=0?`
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
  `}function Ke(a){return`
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Errore caricamento dati</h2>
      <p>${a}</p>
    </div>
  `}const Xa="viaggio_croazia_bookings_v1";function Je(){return"book_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function ae(a){return{id:a.id||Je(),date:a.date??null,time:(a.time??"").trim(),place:(a.place??"").trim(),address:(a.address??"").trim(),maps_url:(a.maps_url??"").trim(),note:(a.note??"").trim(),created_at:a.created_at||new Date().toISOString()}}function ee(a){if(a.maps_url)return Pa(a.maps_url);const e=[a.place,a.address].filter(Boolean).join(", ");return e?Pa(e):""}function da(){try{const a=localStorage.getItem(Xa);return a?JSON.parse(a).map(ae):[]}catch{return[]}}function ie(a){try{localStorage.setItem(Xa,JSON.stringify(a)),window.dispatchEvent(new CustomEvent("bookings:updated",{detail:{bookings:a}}))}catch(e){console.warn("[bookings] localStorage non disponibile:",e)}}function We(a){const e=da(),i=ae(a);return e.unshift(i),ie(e),i}function Ye(a){ie(da().filter(e=>e.id!==a))}function Qe(a){return da().filter(e=>e.date===a).sort((e,i)=>Z(e.time)-Z(i.time))}const te="viaggio_croazia_attachments_v1",Xe="viaggio_croazia_files",A="attachments";function Sa(){try{const a=localStorage.getItem(te);return a?JSON.parse(a):{}}catch{return{}}}function R(a){return Sa()[a]||null}function oe(a){try{localStorage.setItem(te,JSON.stringify(a)),window.dispatchEvent(new CustomEvent("attachments:updated",{detail:{meta:a}}))}catch(e){console.warn("[attachments] localStorage non disponibile:",e)}}function Ia(){return new Promise((a,e)=>{if(!("indexedDB"in window))return e(new Error("IndexedDB non disponibile"));const i=indexedDB.open(Xe,1);i.onupgradeneeded=()=>{i.result.objectStoreNames.contains(A)||i.result.createObjectStore(A)},i.onsuccess=()=>a(i.result),i.onerror=()=>e(i.error)})}function ai(a,e){return Ia().then(i=>new Promise((t,o)=>{const n=i.transaction(A,"readwrite");n.objectStore(A).put(e,a),n.oncomplete=()=>{i.close(),t()},n.onerror=()=>{i.close(),o(n.error)}}))}function ei(a){return Ia().then(e=>new Promise((i,t)=>{const n=e.transaction(A,"readonly").objectStore(A).get(a);n.onsuccess=()=>{e.close(),i(n.result||null)},n.onerror=()=>{e.close(),t(n.error)}}))}function ii(a){return Ia().then(e=>new Promise((i,t)=>{const o=e.transaction(A,"readwrite");o.objectStore(A).delete(a),o.oncomplete=()=>{e.close(),i()},o.onerror=()=>{e.close(),t(o.error)}}))}async function ia(a,e){await ai(a,e);const i=Sa();if(i[a]={name:e.name||"allegato",type:e.type||"",size:e.size||0,added_at:new Date().toISOString()},oe(i),!R(a))throw new Error("Metadati non salvati: spazio del browser esaurito o localStorage non disponibile.");return i[a]}async function ti(a){const e=await ei(a);return e?URL.createObjectURL(e):null}async function ta(a){try{await ii(a)}catch{}const e=Sa();delete e[a],oe(e)}async function wa(a){const e=R(a),t=/^(image\/|application\/pdf)/.test((e==null?void 0:e.type)||"")?window.open("","_blank"):null;t&&(t.opener=null);try{const o=await ti(a);if(!o){t==null||t.close(),alert("File non trovato su questo dispositivo.");return}t?t.location=o:oi(o,e==null?void 0:e.name),setTimeout(()=>URL.revokeObjectURL(o),6e4)}catch(o){console.error("[attachments]",o),t==null||t.close(),alert("Impossibile aprire il file.")}}function oi(a,e){const i=document.createElement("a");i.href=a,i.download=e||"allegato",document.body.appendChild(i),i.click(),i.remove()}function ne(a){if(!a)return"📎";const e=(a.type||"").toLowerCase(),i=(a.name||"").toLowerCase();return e.startsWith("image/")||/\.(png|jpe?g|gif|webp|heic)$/.test(i)?"🖼️":e==="application/pdf"||i.endsWith(".pdf")?"📄":e==="message/rfc822"||i.endsWith(".eml")?"✉️":"📎"}const re="viaggio_croazia_program_v1";function ni(){return"act_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function q(){try{const a=localStorage.getItem(re);return a?JSON.parse(a):{}}catch{return{}}}function N(a){try{localStorage.setItem(re,JSON.stringify(a)),window.dispatchEvent(new CustomEvent("program:updated",{detail:{data:a}}))}catch(e){console.warn("[program] localStorage non disponibile:",e)}}function J(a,e){a[e]||(a[e]={edits:{},hidden:{},added:[]});const i=a[e];return i.edits=i.edits||{},i.hidden=i.hidden||{},i.added=i.added||[],i}function ri(a,e=[]){const i=q()[a]||{},t=i.edits||{},o=i.hidden||{},n=i.added||[],s=[];return e.forEach((r,l)=>{if(o[l])return;const c=t[l]||{};s.push({key:"base:"+l,base:!0,index:l,time:c.time??r.time??"",text:c.text??r.text??"",maps:r.maps??null})}),n.forEach(r=>{s.push({key:"add:"+r.id,base:!1,id:r.id,time:r.time||"",text:r.text||"",maps:r.maps||null})}),s.sort((r,l)=>Z(r.time)-Z(l.time)),s}function si(a){const e=q()[a];return e?!!(e.added&&e.added.length||e.hidden&&Object.keys(e.hidden).length||e.edits&&Object.keys(e.edits).length):!1}function li(a,e,i){const t=q(),o=J(t,a);o.edits[e]={...o.edits[e]||{},...i},N(t)}function ci(a,e){const i=q(),t=J(i,a);t.hidden[e]=!0,delete t.edits[e],N(i)}function di(a,{time:e="",text:i="",maps:t=""}={}){const o=q(),n=J(o,a),s={id:ni(),time:e.trim(),text:i.trim(),maps:(t||"").trim()};return n.added.push(s),N(o),s}function ui(a,e,i){const t=q(),o=J(t,a),n=o.added.findIndex(s=>s.id===e);n!==-1&&(o.added[n]={...o.added[n],...i},N(t))}function pi(a,e){const i=q(),t=J(i,a);t.added=t.added.filter(o=>o.id!==e),N(i)}function gi(a){const e=q();e[a]&&(delete e[a],N(e))}const G=new Set;let se={};async function mi(){var c,d;const a=document.getElementById("page-content");let e;try{e=await S()}catch(u){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${u.message}</p></div>`;return}const{days:i,hotels:t,meta:o}=e,n=e.ferries||[],s=Object.fromEntries(t.map(u=>[u.id,u]));se=Object.fromEntries(i.map(u=>[u.date,u])),a.innerHTML=`
    <div class="page-header">
      <h1>📅 Itinerario</h1>
      <p>${o.title} · ${o.duration_days} giorni · ${f(o.start_date)} → ${f(o.end_date)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.5rem;">
      <button class="btn btn-outline" id="expand-all">▼ Espandi tutto</button>
      <button class="btn btn-outline" id="collapse-all">▲ Comprimi tutto</button>
    </div>

    <div class="timeline">
      ${i.map(u=>bi(u,s,n)).join("")}
    </div>
  `,document.querySelectorAll(".timeline-card-header").forEach(u=>{u.addEventListener("click",()=>{const p=u.nextElementSibling,v=u.querySelector(".timeline-toggle");p==null||p.classList.toggle("hidden"),v==null||v.classList.toggle("open")})}),(c=document.getElementById("expand-all"))==null||c.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(u=>u.classList.remove("hidden")),document.querySelectorAll(".timeline-toggle").forEach(u=>u.classList.add("open"))}),(d=document.getElementById("collapse-all"))==null||d.addEventListener("click",()=>{document.querySelectorAll(".timeline-card-body").forEach(u=>u.classList.add("hidden")),document.querySelectorAll(".timeline-toggle").forEach(u=>u.classList.remove("open"))}),ki(i),$i();const r=()=>{document.querySelectorAll(".day-ideas-section").forEach(u=>{const p=u.dataset.date;p&&(u.innerHTML=le(p))})},l=()=>{document.querySelectorAll(".activities[data-date]").forEach(u=>{j(u.dataset.date)})};window.addEventListener("ideas:updated",r),window.addEventListener("bookings:updated",l),window.__currentPageCleanup=()=>{window.removeEventListener("ideas:updated",r),window.removeEventListener("bookings:updated",l)}}function vi(a){const e=`🎫 Traghetto ${k(a.from)} → ${k(a.to)} · 🕐 ${k(a.time)}`;return R(a.id)?`
      <button class="day-ferry-badge" data-ferry="${k(a.id)}">
        ${e} — <strong>apri biglietto</strong>
      </button>
    `:`
    <a class="day-ferry-badge day-ferry-badge-empty" href="#logistics">
      ${e} — <strong>allega il biglietto nelle Note</strong>
    </a>
  `}function bi(a,e,i=[]){const t=a.hotel_ref?e[a.hotel_ref]:null,o=i.filter(c=>c.day===a.day||c.date===a.date),n=new Date().toISOString().slice(0,10),s=a.date===n,r=a.date<n,l=a.coordinates?JSON.stringify(a.coordinates):"null";return`
    <div class="timeline-item">
      <div class="timeline-line"></div>
      <div class="timeline-left">
        <div class="timeline-day-num"
          style="${r?"background:var(--color-text-muted)":s?"background:var(--color-accent)":""}">
          ${a.day}
        </div>
        <div class="timeline-date-label">
          ${Be(a.date)}<br>${f(a.date)}
        </div>
      </div>
      <div class="timeline-right">
        <div class="timeline-card">
          <div class="timeline-card-header">
            <div class="timeline-card-title">
              <h3>${a.title}${s?' <span style="color:var(--color-accent);font-size:0.75rem;">• OGGI</span>':""}</h3>
              <span class="timeline-location-badge">📍 ${a.location}</span>
            </div>
            <span class="timeline-toggle">▼</span>
          </div>
          <div class="timeline-card-body hidden">
            ${a.description?`<p class="timeline-description">${a.description}</p>`:""}

            ${o.map(c=>vi(c)).join("")}

            <div class="activities" data-date="${a.date}">
              ${ce(a,G.has(a.date))}
            </div>

            ${Ea(a)?"":fi(a.tips)}

            ${t?`
              <div class="hotel-ref-badge">
                🏨 ${t.name} · Check-in ${f(t.checkin)} / Check-out ${f(t.checkout)}
              </div>
            `:""}

            <!-- SEZIONE IDEE DEL GIORNO -->
            <div class="day-ideas-wrap">
              <div class="day-ideas-section" id="day-ideas-${a.date}" data-date="${a.date}">
                ${le(a.date)}
              </div>
              <button class="day-add-idea-btn"
                data-date="${a.date}"
                data-coords='${l}'
                data-location="${a.location}">
                💡 Aggiungi idea
              </button>
              <form class="day-quick-form hidden" id="quick-form-${a.date}" data-date="${a.date}">
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
  `}function fi(a){if(!a)return"";const e=a.do||[],i=a.eat||[];return!e.length&&!i.length?"":`
    <div class="day-tips">
      <div class="day-tips-title">✨ Consigli del giorno</div>
      <div class="day-tips-cols">
        ${e.length?`
          <div class="day-tips-col">
            <div class="day-tips-head">🎯 Da fare</div>
            <ul>${e.map(t=>`<li>${k(t)}</li>`).join("")}</ul>
          </div>`:""}
        ${i.length?`
          <div class="day-tips-col">
            <div class="day-tips-head">🍽️ Da mangiare</div>
            <ul>${i.map(t=>`<li>${k(t)}</li>`).join("")}</ul>
          </div>`:""}
      </div>
    </div>
  `}function le(a){const e=Pe(a);return e.length===0?"":e.map(i=>`
    <div class="day-idea-pill ${i.completed?"day-idea-pill--done":""}" data-id="${i.id}">
      <span class="day-idea-text">${k(i.text)}</span>
      ${i.add_to_checklist?'<span class="idea-tiny-badge">📋</span>':""}
      ${i.add_to_map?'<span class="idea-tiny-badge">🗺️</span>':""}
      ${i.completed?'<span class="idea-tiny-badge">✅</span>':""}
      <button class="day-idea-del" data-id="${i.id}" title="Elimina">×</button>
    </div>
  `).join("")}function ce(a,e){const i=ri(a.date,a.activities);return e?`
      <div class="program-edit">
        ${i.map(hi).join("")}
        <div class="program-add-row">
          <input type="text" class="prog-add-time" placeholder="Ora" />
          <input type="text" class="prog-add-text" placeholder="Nuova attività…" />
          <button type="button" class="prog-add-btn" data-date="${a.date}" title="Aggiungi">＋</button>
        </div>
        <div class="program-controls">
          <button type="button" class="btn btn-primary program-edit-done" data-date="${a.date}"
            style="font-size:0.8rem;padding:0.3rem 0.7rem;">✓ Fine</button>
          <button type="button" class="btn btn-outline program-reset" data-date="${a.date}"
            style="font-size:0.8rem;padding:0.3rem 0.7rem;">↺ Ripristina giorno</button>
        </div>
      </div>
    `:`
    ${i.map(t=>`
      <div class="activity-item with-dot">
        <span class="activity-time">${k(t.time)}</span>
        <span>
          ${k(t.text)}
          ${t.maps?`<a class="activity-maps" href="${k(t.maps)}" target="_blank" rel="noopener">🗺️ Maps</a>`:""}
        </span>
      </div>
    `).join("")}
    ${yi(a.date)}
    <div class="program-controls">
      <button type="button" class="program-edit-toggle" data-date="${a.date}">✏️ Modifica programma</button>
      ${si(a.date)?'<span class="program-modified">modificato</span>':""}
    </div>
  `}function hi(a){const e=a.base?`data-index="${a.index}"`:`data-id="${k(a.id)}"`;return`
    <div class="program-edit-row" data-base="${a.base}" ${e}>
      <input type="text" class="prog-time" value="${k(a.time)}" placeholder="Ora" />
      <input type="text" class="prog-text" value="${k(a.text)}" placeholder="Attività" />
      <button type="button" class="prog-del" title="Elimina">🗑️</button>
    </div>
  `}function yi(a){const e=Qe(a);return e.length?e.map(i=>{const t=ee(i);return`
      <div class="activity-item with-dot activity-booking">
        <span class="activity-time">${i.time?k(i.time):"🍽️"}</span>
        <span>
          🍽️ ${k(i.place)}<span class="activity-booking-tag">prenotazione</span>
          ${t?`<a class="activity-maps" href="${k(t)}" target="_blank" rel="noopener">🗺️ Maps</a>`:""}
        </span>
      </div>
    `}).join(""):""}function j(a){const e=document.querySelector(`.activities[data-date="${a}"]`),i=se[a];e&&i&&(e.innerHTML=ce(i,G.has(a)))}function ki(a){const e=document.querySelector(".timeline");e&&(e.addEventListener("click",i=>{var r,l;const t=i.target.closest(".day-add-idea-btn");if(t){const c=t.dataset.date,d=document.getElementById(`quick-form-${c}`);if(!d)return;const u=d.classList.contains("hidden");document.querySelectorAll(".day-quick-form").forEach(p=>p.classList.add("hidden")),u&&(d.classList.remove("hidden"),(r=d.querySelector(".quick-idea-text"))==null||r.focus())}const o=i.target.closest(".quick-cancel");o&&((l=o.closest(".day-quick-form"))==null||l.classList.add("hidden"));const n=i.target.closest(".day-idea-del");if(n){const c=n.dataset.id;confirm("Eliminare questa idea?")&&za(c)}const s=i.target.closest("[data-ferry]");s&&wa(s.dataset.ferry)}),e.addEventListener("submit",i=>{var c,d,u,p;const t=i.target.closest(".day-quick-form");if(!t)return;i.preventDefault();const o=(c=t.querySelector(".quick-idea-text"))==null?void 0:c.value.trim();if(!o){(d=t.querySelector(".quick-idea-text"))==null||d.focus();return}const n=t.dataset.date,s=a.find(v=>v.date===n),r=(u=t.querySelector(".quick-map"))==null?void 0:u.checked,l=(p=t.querySelector(".quick-checklist"))==null?void 0:p.checked;la({text:o,day_date:n,location_name:(s==null?void 0:s.location)??null,coordinates:r&&(s!=null&&s.coordinates)?s.coordinates:null,add_to_checklist:!!l,add_to_map:!!(r&&(s!=null&&s.coordinates))}),t.querySelector(".quick-idea-text").value="",t.querySelector(".quick-map").checked=!1,t.querySelector(".quick-checklist").checked=!1,t.classList.add("hidden")}))}function $i(){const a=document.querySelector(".timeline");a&&(a.addEventListener("click",e=>{var r,l,c,d,u;const i=e.target.closest(".program-edit-toggle");if(i){G.add(i.dataset.date),j(i.dataset.date);return}const t=e.target.closest(".program-edit-done");if(t){G.delete(t.dataset.date),j(t.dataset.date);return}const o=e.target.closest(".program-reset");if(o){const p=o.dataset.date;confirm("Ripristinare il programma di questo giorno come nell’itinerario originale? Le modifiche fatte a questo giorno andranno perse.")&&(gi(p),G.delete(p),j(p));return}const n=e.target.closest(".prog-del");if(n){const p=n.closest(".program-edit-row"),v=(r=n.closest(".activities"))==null?void 0:r.dataset.date;if(!p||!v)return;p.dataset.base==="true"?ci(v,Number(p.dataset.index)):pi(v,p.dataset.id),j(v);return}const s=e.target.closest(".prog-add-btn");if(s){const p=s.dataset.date,v=s.closest(".program-add-row"),_=((l=v.querySelector(".prog-add-time"))==null?void 0:l.value.trim())||"",L=((c=v.querySelector(".prog-add-text"))==null?void 0:c.value.trim())||"";if(!L){(d=v.querySelector(".prog-add-text"))==null||d.focus();return}di(p,{time:_,text:L}),j(p),(u=document.querySelector(`.activities[data-date="${p}"] .prog-add-text`))==null||u.focus();return}}),a.addEventListener("keydown",e=>{var i,t;e.key==="Enter"&&e.target.classList.contains("prog-add-text")&&(e.preventDefault(),(t=(i=e.target.closest(".program-add-row"))==null?void 0:i.querySelector(".prog-add-btn"))==null||t.click())}),a.addEventListener("change",e=>{var l,c,d;const i=e.target,t=(l=i.classList)==null?void 0:l.contains("prog-time"),o=(c=i.classList)==null?void 0:c.contains("prog-text");if(!t&&!o)return;const n=i.closest(".program-edit-row"),s=(d=i.closest(".activities"))==null?void 0:d.dataset.date;if(!n||!s)return;const r={[t?"time":"text"]:i.value.trim()};n.dataset.base==="true"?li(s,Number(n.dataset.index),r):ui(s,n.dataset.id,r)}))}function k(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function zi(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(r){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${r.message}</p></div>`;return}const{hotels:i}=e,t={},o=[];for(const r of i){const l=r.location_group||r.location;t[l]||(t[l]=[],o.push(l)),t[l].push(r)}const n=i.filter(r=>r.status==="confermata"),s=n.reduce((r,l)=>r+l.nights,0);a.innerHTML=`
    <div class="page-header">
      <h1>🏨 Hotel &amp; Alloggi</h1>
      <p>${n.length} strutture confermate · ${s} notti</p>
    </div>

    <div class="hotels-summary">
      <div class="summary-item">
        <div class="summary-value">${n.length}</div>
        <div class="summary-label">Strutture confermate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${s}</div>
        <div class="summary-label">Notti prenotate</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${i.filter(r=>r.status==="da_confermare").length}</div>
        <div class="summary-label">Da confermare</div>
      </div>
    </div>

    ${o.map(r=>{var l,c;return`
      <div class="hotels-location-group">
        <div class="hotels-group-header">
          <span class="hotels-group-title">📍 ${r}</span>
          <span class="hotels-group-nights">${(l=t[r][0])!=null&&l.nights?t[r][0].nights+" nott"+(t[r][0].nights===1?"e":"i"):""} · ${(c=t[r][0])!=null&&c.checkin?f(t[r][0].checkin)+" → "+f(t[r][0].checkout):""}</span>
        </div>
        <div class="hotels-grid">
          ${t[r].map(d=>_i(d)).join("")}
        </div>
      </div>
    `}).join("")}
  `}function _i(a){const e=a.nights,t=a.status==="confermata"||a.booking_ref&&a.booking_ref.length>0?'<span class="hotel-status-badge badge-prenotato">✅ Confermata</span>':a.status==="da_confermare"?'<span class="hotel-status-badge badge-confermare">⚠️ Da confermare</span>':'<span class="hotel-status-badge badge-da-prenotare">📋 Da prenotare</span>',o=a.recommended?'<span class="hotel-recommended-badge">⭐ Consigliato</span>':'<span class="hotel-alt-badge">Alternativa</span>';return`
    <div class="hotel-card ${a.recommended?"hotel-card--recommended":""}">
      <div class="hotel-card-header">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
          <div class="hotel-name">${a.name}</div>
          <div style="display:flex;gap:0.35rem;flex-shrink:0;">
            ${o}
            ${t}
          </div>
        </div>
        <div class="hotel-location">📍 ${a.address}</div>
      </div>
      <div class="hotel-card-body">
        <div class="hotel-dates-row">
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-in</div>
            <div class="hotel-date-value">${f(a.checkin)}</div>
          </div>
          <div class="hotel-date-box">
            <div class="hotel-date-label">Check-out</div>
            <div class="hotel-date-value">${f(a.checkout)}</div>
          </div>
        </div>

        <div class="hotel-meta">
          <div class="hotel-rating" title="${a.rating} stelle">
            ${a.rating>0?Ae(a.rating):'<span style="color:var(--color-text-muted);font-size:0.78rem;">Categoria n.d.</span>'}
          </div>
          <div class="hotel-price">
            ${e} nott${e===1?"e":"i"}
          </div>
        </div>

        <div class="hotel-amenities">
          ${a.amenities.map(n=>`<span class="amenity-tag">${n}</span>`).join("")}
        </div>

        ${a.notes?`<div class="hotel-notes">${a.notes}</div>`:""}

        ${a.booking_ref?`
          <div style="margin-top:0.75rem; font-size:0.82rem; color:var(--color-text-muted);">
            Ref. prenotazione: <code style="background:#f1f5f9;padding:0.1rem 0.35rem;border-radius:4px;">${a.booking_ref}</code>
          </div>
        `:""}

        ${a.phone?`
          <div style="margin-top:0.5rem; font-size:0.82rem;">
            📞 <a href="tel:${a.phone}" style="color:var(--color-primary);">${a.phone}</a>
          </div>
        `:""}

        <div class="hotel-links">
          <a href="${x(a.name+", "+a.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🚗 Naviga
          </a>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.name+" "+a.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🗺️ Vedi su Maps
          </a>
          <a href="https://www.google.com/search?q=${encodeURIComponent(a.name+" "+a.address)}"
             target="_blank" rel="noopener" class="hotel-link-btn">
            🔍 Cerca online
          </a>
        </div>
      </div>
    </div>
  `}const Ba="viaggio_croazia_checklist_v1",de="viaggio_croazia_custom_items_v1";function Li(){try{const a=localStorage.getItem(Ba);return a?JSON.parse(a):{}}catch{return{}}}function ma(a){try{localStorage.setItem(Ba,JSON.stringify(a))}catch(e){console.warn("[storage] Impossibile salvare checklist:",e)}}function Ei(){try{localStorage.removeItem(Ba)}catch{}}function Si(){return"ci_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,5)}function V(){try{const a=localStorage.getItem(de);return a?JSON.parse(a):[]}catch{return[]}}function W(a){try{localStorage.setItem(de,JSON.stringify(a)),window.dispatchEvent(new CustomEvent("customitems:updated"))}catch(e){console.warn("[storage] Impossibile salvare custom items:",e)}}function Ii(a,e="Varie"){const i=V(),t={id:Si(),text:a.trim(),category:e,checked:!1,created_at:new Date().toISOString()};return i.unshift(t),W(i),t}function wi(a,e){W(V().map(i=>i.id===a?{...i,checked:e}:i))}function Bi(a,e){const i=e.trim();i&&W(V().map(t=>t.id===a?{...t,text:i}:t))}function Ai(a){W(V().filter(e=>e.id!==a))}function qi(){W([])}async function Ci(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(s){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${s.message}</p></div>`;return}const{categories:i}=e.checklist,t=Li();a.innerHTML=`
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
      ${i.map(s=>Pi(s,t)).join("")}
    </div>

    <!-- Idee collegate alla checklist -->
    <div id="checklist-ideas-section">
      ${ja()}
    </div>

    <!-- Sezione voci personalizzate (CRUD) -->
    <div id="custom-items-section">
      ${fa()}
    </div>
  `,H(i,t),ji(i,t),Da(),ha();const o=()=>{const s=document.getElementById("checklist-ideas-section");s&&(s.innerHTML=ja(),Da())},n=()=>{const s=document.getElementById("custom-items-section");s&&(s.innerHTML=fa(),ha())};window.addEventListener("ideas:updated",o),window.addEventListener("customitems:updated",n),window.__currentPageCleanup=()=>{window.removeEventListener("ideas:updated",o),window.removeEventListener("customitems:updated",n)}}function ja(){const a=Me();if(a.length===0)return"";const e=a.filter(o=>o.completed).length,i=a.length,t=i?e/i*100:0;return`
    <div class="category-card" id="ideas-checklist-card">
      <div class="category-header">
        <span class="category-icon">💡</span>
        <span class="category-name">Idee / Da fare</span>
        <span class="category-count" id="ideas-cl-count">${e}/${i}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="ideas-cl-prog" style="width:${t}%"></div>
        </div>
        <span class="category-chevron" id="ideas-cl-chev">▼</span>
      </div>
      <div class="category-items" id="ideas-cl-items">
        ${a.map(o=>`
          <label class="checklist-item ${o.completed?"checked":""}" data-idea-id="${o.id}">
            <input type="checkbox" data-idea-id="${o.id}" ${o.completed?"checked":""} />
            <span class="checklist-item-text">${oa(o.text)}</span>
            ${o.location_name?`<span class="priority-badge" style="background:#eff6ff;color:var(--color-primary)">📍 ${oa(o.location_name)}</span>`:""}
          </label>
        `).join("")}
        <div style="padding:0.5rem 1.25rem;">
          <a href="#ideas" class="btn btn-outline" style="font-size:0.78rem;padding:0.3rem 0.75rem;">
            + Aggiungi idea dalla sezione Idee
          </a>
        </div>
      </div>
    </div>
  `}function Da(){var a,e;(a=document.querySelector("#ideas-checklist-card .category-header"))==null||a.addEventListener("click",i=>{var t,o;i.target.tagName!=="INPUT"&&((t=document.getElementById("ideas-cl-items"))==null||t.classList.toggle("hidden"),(o=document.getElementById("ideas-cl-chev"))==null||o.classList.toggle("open"))}),(e=document.getElementById("ideas-cl-items"))==null||e.addEventListener("change",i=>{const t=i.target;if(t.type!=="checkbox")return;const o=t.dataset.ideaId;o&&U(o,{completed:t.checked})})}function fa(){const a=V(),e=a.filter(i=>i.checked).length;return`
    <div class="category-card custom-items-card" id="custom-items-card">
      <div class="category-header" id="custom-items-header">
        <span class="category-icon">✏️</span>
        <span class="category-name">Voci Personalizzate</span>
        <span class="category-count">${e}/${a.length}</span>
        <div class="category-progress">
          <div class="category-progress-fill"
            style="width:${a.length?e/a.length*100:0}%"></div>
        </div>
        <span class="category-chevron" id="custom-chev">▼</span>
      </div>

      <div class="category-items" id="custom-items-list">
        ${a.length===0?'<div class="custom-items-empty">Nessuna voce personalizzata. Aggiungine una qui sotto.</div>':a.map(i=>`
              <div class="checklist-item custom-item" data-cid="${i.id}">
                <input type="checkbox" class="custom-item-cb" data-cid="${i.id}" ${i.checked?"checked":""} />
                <span class="checklist-item-text ${i.checked?"line-through":""}">${oa(i.text)}</span>
                ${i.category!=="Varie"?`<span class="priority-badge" style="background:#f1f5f9;color:#64748b;">${oa(i.category)}</span>`:""}
                <button class="custom-item-edit" data-cid="${i.id}" title="Modifica">✏️</button>
                <button class="custom-item-del" data-cid="${i.id}" title="Elimina">×</button>
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

        ${a.length>0?`
          <div style="padding:0.5rem 1.25rem;">
            <button class="btn btn-outline" id="clear-custom-btn"
              style="font-size:0.78rem;padding:0.3rem 0.75rem;color:var(--color-accent);">
              🗑️ Elimina tutte le voci personalizzate
            </button>
          </div>
        `:""}
      </div>
    </div>
  `}function ha(){var e,i,t;const a=document.getElementById("custom-items-header");a==null||a.addEventListener("click",o=>{var n,s;o.target.closest(".custom-add-form")||o.target.closest("button")||((n=document.getElementById("custom-items-list"))==null||n.classList.toggle("hidden"),(s=document.getElementById("custom-chev"))==null||s.classList.toggle("open"))}),(e=document.getElementById("custom-items-list"))==null||e.addEventListener("change",o=>{const n=o.target;n.classList.contains("custom-item-cb")&&wi(n.dataset.cid,n.checked)}),(i=document.getElementById("custom-items-list"))==null||i.addEventListener("click",o=>{const n=o.target.closest(".custom-item-del");if(n){Ai(n.dataset.cid);return}const s=o.target.closest(".custom-item-edit");if(s){xi(s.dataset.cid);return}if(o.target.closest("#custom-add-btn")){Ta();return}o.target.closest("#clear-custom-btn")&&confirm("Eliminare tutte le voci personalizzate?")&&qi()}),(t=document.getElementById("custom-item-text"))==null||t.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),Ta())})}function Ta(){var t;const a=document.getElementById("custom-item-text"),e=((t=document.getElementById("custom-item-cat"))==null?void 0:t.value)??"Varie",i=a==null?void 0:a.value.trim();if(!i){a==null||a.focus();return}Ii(i,e),a&&(a.value="")}function xi(a){const e=V().find(p=>p.id===a);if(!e)return;const i=document.querySelector(`.custom-item[data-cid="${a}"]`);if(!i)return;const t=i.querySelector(".checklist-item-text"),o=i.querySelector(".custom-item-edit"),n=i.querySelector(".custom-item-del"),s=i.querySelector(".priority-badge");if(!t)return;const r=document.createElement("input");r.type="text",r.value=e.text,r.className="custom-edit-input";const l=document.createElement("button");l.textContent="✓",l.className="custom-item-save-edit",l.title="Salva";const c=document.createElement("button");c.textContent="✕",c.className="custom-item-cancel-edit",c.title="Annulla",t.replaceWith(r),s&&(s.style.display="none"),o&&o.replaceWith(l),n&&(n.style.display="none"),l.after(c),r.focus(),r.select();function d(){const p=r.value.trim();if(!p){r.focus();return}Bi(a,p)}function u(){const p=document.getElementById("custom-items-section");p&&(p.innerHTML=fa(),ha())}r.addEventListener("keydown",p=>{p.key==="Enter"&&(p.preventDefault(),d()),p.key==="Escape"&&u()}),l.addEventListener("click",d),c.addEventListener("click",u)}function Pi(a,e){const i=a.items.length,t=a.items.filter(o=>e[o.id]).length;return`
    <div class="category-card" data-cat="${a.id}">
      <div class="category-header">
        <span class="category-icon">${a.icon}</span>
        <span class="category-name">${a.name}</span>
        <span class="category-count" id="count-${a.id}">${t}/${i}</span>
        <div class="category-progress">
          <div class="category-progress-fill" id="prog-${a.id}"
            style="width:${i?t/i*100:0}%"></div>
        </div>
        <span class="category-chevron" id="chev-${a.id}">▼</span>
      </div>
      <div class="category-items" id="items-${a.id}">
        ${a.items.map(o=>Mi(o,e[o.id]||!1)).join("")}
      </div>
    </div>
  `}function Mi(a,e){return`
    <label class="checklist-item ${e?"checked":""}" data-id="${a.id}">
      <input type="checkbox" ${e?"checked":""} data-id="${a.id}" />
      <span class="checklist-item-text">${a.text}</span>
      ${a.priority!=="low"?`<span class="priority-badge priority-${a.priority}">${a.priority==="high"?"Alta":"Media"}</span>`:""}
    </label>
  `}function ji(a,e){var i,t,o,n;(i=document.getElementById("checklist-categories"))==null||i.addEventListener("change",s=>{var c;const r=s.target;if(r.type!=="checkbox")return;const l=r.dataset.id;e[l]=r.checked,(c=r.closest(".checklist-item"))==null||c.classList.toggle("checked",r.checked),ma(e),Di(a,e,l),H(a,e)}),document.querySelectorAll(".category-header").forEach(s=>{s.addEventListener("click",r=>{var c,d,u;if(r.target.tagName==="INPUT")return;const l=(c=s.closest(".category-card"))==null?void 0:c.dataset.cat;l&&((d=document.getElementById(`items-${l}`))==null||d.classList.toggle("hidden"),(u=document.getElementById(`chev-${l}`))==null||u.classList.toggle("open"))})}),(t=document.getElementById("check-all"))==null||t.addEventListener("click",()=>{a.forEach(s=>s.items.forEach(r=>{e[r.id]=!0})),ma(e),va(a,e),H(a,e)}),(o=document.getElementById("uncheck-all"))==null||o.addEventListener("click",()=>{a.forEach(s=>s.items.forEach(r=>{e[r.id]=!1})),ma(e),va(a,e),H(a,e)}),(n=document.getElementById("reset-btn"))==null||n.addEventListener("click",()=>{confirm("Vuoi resettare l'intera checklist?")&&(Ei(),a.forEach(s=>s.items.forEach(r=>{e[r.id]=!1})),va(a,e),H(a,e))})}function Di(a,e,i){const t=a.find(c=>c.items.some(d=>d.id===i));if(!t)return;const o=t.items.length,n=t.items.filter(c=>e[c.id]).length,s=o?n/o*100:0,r=document.getElementById(`count-${t.id}`),l=document.getElementById(`prog-${t.id}`);r&&(r.textContent=`${n}/${o}`),l&&(l.style.width=`${s}%`)}function H(a,e){const i=a.reduce((r,l)=>r+l.items.length,0),t=a.reduce((r,l)=>r+l.items.filter(c=>e[c.id]).length,0),o=i?t/i*100:0,n=document.getElementById("global-fill"),s=document.getElementById("global-text");n&&(n.style.width=`${o}%`),s&&(s.textContent=`${t} / ${i}`)}function va(a,e){a.forEach(i=>{const t=i.items.length,o=i.items.filter(l=>e[l.id]).length,n=t?o/t*100:0,s=document.getElementById(`count-${i.id}`),r=document.getElementById(`prog-${i.id}`);s&&(s.textContent=`${o}/${t}`),r&&(r.style.width=`${n}%`),i.items.forEach(l=>{const c=document.querySelector(`.checklist-item[data-id="${l.id}"]`),d=c==null?void 0:c.querySelector('input[type="checkbox"]');!c||!d||(d.checked=e[l.id]||!1,c.classList.toggle("checked",d.checked))})})}function oa(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ti="AIzaSyALcv3GTbsSIz1M6sIVyOUImjLvn1WruVE";let $=null,F=[],K=[],P=[],M=[],na="all",aa=null,ra=0;async function Oi(){const a=++ra;na="all";const e=document.getElementById("page-content");e.innerHTML=`
    <div class="page-header">
      <h1>🗺️ Mappa del Viaggio</h1>
      <p>Percorso completo, alloggi e idee geo-localizzate</p>
      <div id="route-nav" class="route-nav"></div>
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
  `,aa=await S(),Ji(aa);try{await Vi(Ti)}catch{Ni(aa);return}Hi(aa,a),Yi(),Oa();const i=()=>{if(!$)return;P.forEach(o=>o.setMap(null)),P=[],ue(),Oa();const t=document.querySelector('.map-btn[data-layer="ideas"]');if(t){const o=ca().length;t.textContent=`💡 Idee${o>0?` (${o})`:""}`}};window.addEventListener("ideas:updated",i),window.__currentPageCleanup=()=>{window.removeEventListener("ideas:updated",i),Ri()}}function Ri(){[K,F,P,M].flat().forEach(a=>{try{a.setMap(null)}catch{}}),K=[],F=[],P=[],M=[],$=null}function Ni(a){const e=document.getElementById("map-outer");if(!e)return;const i=[...new Set(a.days.map(t=>t.location))];e.innerHTML=`
    <div class="map-no-key">
      <div class="map-no-key-icon">📡</div>
      <h3>Mappa non disponibile offline</h3>
      <p>
        Google Maps ha bisogno della rete e non può essere salvato sul dispositivo.
        <strong>Il resto dell'app funziona lo stesso</strong>: itinerario, attività,
        hotel, biglietti e checklist sono tutti consultabili senza connessione.
      </p>
      <p style="margin-top:0.5rem;">
        I link “naviga” qui sopra si apriranno appena torna il campo.
      </p>
      <div style="margin-top:1rem;text-align:left;">
        <strong>Tappe del viaggio:</strong>
        <ul style="margin-top:0.5rem;color:var(--color-text-muted);font-size:0.88rem;line-height:2;">
          ${i.map(t=>`<li>📍 ${t}</li>`).join("")}
        </ul>
      </div>
    </div>
  `}function Vi(a){return new Promise((e,i)=>{var n;if((n=window.google)!=null&&n.maps){e();return}const t="__gmapsReady_"+Date.now();window[t]=()=>{delete window[t],e()};const o=document.createElement("script");o.src=`https://maps.googleapis.com/maps/api/js?key=${a}&callback=${t}&loading=async`,o.async=!0,o.onerror=()=>i(new Error("Impossibile caricare Google Maps")),document.head.appendChild(o)})}function Hi(a,e){const i=document.getElementById("google-map");i&&($=new google.maps.Map(i,{center:{lat:44,lng:15.5},zoom:7,mapTypeId:"roadmap",styles:[{featureType:"water",elementType:"geometry",stylers:[{color:"#a2daf5"}]},{featureType:"landscape",stylers:[{color:"#f5f5f0"}]}]}),Gi(a),Zi(a),Ui(a,e),ue(),Wi(a))}function Gi(a){K=[];const e=new Map;a.days.filter(i=>i.coordinates).forEach(i=>{const t=`${i.coordinates.lat},${i.coordinates.lng}`;e.has(t)||e.set(t,[]),e.get(t).push(i)}),e.forEach(i=>{const t=i[0],o=i[i.length-1],n=i.length>1?`Giorni ${t.day}–${o.day} — ${t.location}`:`Giorno ${t.day} — ${t.location}`,s=new google.maps.Marker({position:t.coordinates,map:$,title:t.location,label:{text:String(t.day),color:"#fff",fontWeight:"bold",fontSize:"11px"},icon:{path:google.maps.SymbolPath.CIRCLE,scale:16,fillColor:"#1e40af",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:2},zIndex:10}),r=i.map(c=>`<div style="margin-top:5px;font-size:12px;border-top:1px solid #e2e8f0;padding-top:4px;">
        <span style="color:#1e40af;font-weight:700;">Gg. ${c.day}</span>
        <span style="color:#64748b;"> · ${f(c.date)}</span><br>
        <span>${c.title}</span>
      </div>`).join(""),l=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#1e40af;">${n}</strong>
          ${r}
        </div>`});s.addListener("click",()=>l.open($,s)),K.push(s)})}function Zi(a){F=[],a.hotels.filter(e=>e.recommended).forEach(e=>{const i=new google.maps.Marker({position:e.coordinates,map:$,title:e.name,icon:{path:google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,scale:7,fillColor:"#059669",fillOpacity:1,strokeColor:"#ffffff",strokeWeight:1.5},zIndex:5}),t=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:240px;">
          <strong style="color:#065f46;">🏨 ${e.name}</strong>
          <div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${e.address}</div>
          <div style="margin-top:6px;font-size:12px;">
            ${f(e.checkin)} → ${f(e.checkout)} · ${e.nights} nott${e.nights===1?"e":"i"}
          </div>
          ${e.notes?`<div style="margin-top:6px;font-size:11px;color:#64748b;font-style:italic;">${e.notes}</div>`:""}
        </div>`});i.addListener("click",()=>t.open($,i)),F.push(i)})}function ue(){P=[],ca().forEach(a=>{const e=new google.maps.Marker({position:a.coordinates,map:$,title:a.text,icon:{path:google.maps.SymbolPath.CIRCLE,scale:10,fillColor:a.marker_color||"#f59e0b",fillOpacity:.9,strokeColor:"#ffffff",strokeWeight:2},zIndex:15}),i=new google.maps.InfoWindow({content:`
        <div style="font-family:system-ui,sans-serif;max-width:220px;">
          <strong style="color:#92400e;">💡 ${a.text}</strong>
          ${a.note?`<div style="font-size:12px;color:#64748b;margin-top:4px;">${a.note}</div>`:""}
          ${a.location_name?`<div style="font-size:12px;color:#64748b;margin-top:2px;">📍 ${a.location_name}</div>`:""}
          ${a.add_to_checklist?'<div style="margin-top:4px;font-size:11px;">📋 In checklist</div>':""}
        </div>`});e.addListener("click",()=>i.open($,e)),P.push(e)})}function Ui(a,e){M.forEach(o=>o.setMap(null)),M=[];const i=[];if(a.days.filter(o=>o.coordinates).forEach(o=>{const n=i[i.length-1];(!n||n.lat!==o.coordinates.lat||n.lng!==o.coordinates.lng)&&i.push(o.coordinates)}),i.length<2)return;const t=new google.maps.DirectionsService;(async()=>{for(let o=0;o<i.length-1;o++){if(e!==ra||!$)return;await Ki(t,i[o],i[o+1],e),await pe(120)}})()}const pe=a=>new Promise(e=>setTimeout(e,a));function Fi(a,e,i){return new Promise(t=>{a.route({origin:e,destination:i,travelMode:google.maps.TravelMode.DRIVING},(o,n)=>t({result:o,status:n}))})}async function Ki(a,e,i,t,o=4){let n=300;for(let s=0;s<o;s++){const{result:r,status:l}=await Fi(a,e,i);if(t!==ra||!$)return;if(l==="OK"&&r){M.push(new google.maps.DirectionsRenderer({map:$,directions:r,suppressMarkers:!0,suppressInfoWindows:!0,preserveViewport:!0,polylineOptions:{strokeColor:"#2563eb",strokeOpacity:.9,strokeWeight:5}})),ya();return}if(l!==google.maps.DirectionsStatus.OVER_QUERY_LIMIT)break;if(await pe(n),n*=2,t!==ra||!$)return}M.push(new google.maps.Polyline({path:[e,i],map:$,geodesic:!0,strokeOpacity:0,icons:[{icon:{path:"M 0,-1 0,1",strokeColor:"#f59e0b",strokeOpacity:.9,scale:3},offset:"0",repeat:"14px"}]})),ya()}function ya(){const a=na==="all"||na==="route";M.forEach(e=>e.setMap(a?$:null))}function Ji(a){const e=document.getElementById("route-nav");if(!e)return;const i=a.hotels.filter(t=>t.recommended);i.length&&(e.innerHTML=`
    <div class="route-nav-title">🚗 Naviga alla tappa <span>(partenza: la tua posizione)</span></div>
    <div class="route-nav-list">
      ${i.map((t,o)=>`
        <a class="route-nav-btn" target="_blank" rel="noopener"
           href="${x(t.name+", "+t.address)}">
          <span class="route-nav-num">${o+1}</span>
          <span class="route-nav-name">${t.name}</span>
        </a>
      `).join("")}
    </div>
  `)}function Wi(a){const e=new google.maps.LatLngBounds;a.days.filter(i=>i.coordinates).forEach(i=>e.extend(i.coordinates)),a.hotels.filter(i=>i.recommended).forEach(i=>e.extend(i.coordinates)),$.fitBounds(e,60)}function Yi(){var i;const a=ca().length,e=document.querySelector('.map-btn[data-layer="ideas"]');e&&a>0&&(e.textContent=`💡 Idee (${a})`),(i=document.getElementById("map-controls"))==null||i.addEventListener("click",t=>{const o=t.target.closest(".map-btn");if(!o)return;document.querySelectorAll(".map-btn").forEach(s=>s.classList.remove("active")),o.classList.add("active");const n=o.dataset.layer;na=n,K.forEach(s=>s.setVisible(n==="all"||n==="route")),F.forEach(s=>s.setVisible(n==="all"||n==="hotels")),P.forEach(s=>s.setVisible(n==="all"||n==="ideas")),ya()})}function Oa(){const a=document.getElementById("map-legend");if(!a)return;const e=ca().length;a.innerHTML=`
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
    ${e>0?`
    <div class="legend-item">
      <div class="legend-dot" style="background:#f59e0b;"></div>
      <span>Idee (${e})</span>
    </div>`:""}
  `}let D=null,T="tutte",Y=[],I=!1;async function Qi(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(t){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${t.message}</p></div>`;return}Y=e.days,D=null,T="tutte",a.innerHTML=`
    <div class="page-header">
      <h1>💡 Idee Rapide</h1>
      <p>Cattura idee al volo — si sincronizzano con Checklist, Mappa e Itinerario.</p>
    </div>

    <!-- FORM RAPIDO -->
    <div class="ideas-form-wrap" id="ideas-form-wrap">
      ${ua(null)}
    </div>

    <!-- TOOLBAR: filtri + export/import -->
    <div class="ideas-toolbar" id="ideas-toolbar">
      <div class="ideas-filters-row" id="ideas-filters-row">
        ${ge()}
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
      ${ve()}
    </div>
  `,pa(),be(),me(),it();const i=()=>{B(),O()};window.addEventListener("ideas:updated",i),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",i)}function ua(a){var s,r;const e=!!a,i=Y.map(l=>`<option value="${l.date}" ${(a==null?void 0:a.day_date)===l.date?"selected":""}>
      Gg. ${l.day} — ${l.location} · ${f(l.date)}
    </option>`).join(""),t=ba.map(l=>`<option value="${l.value}" ${((a==null?void 0:a.stato)??"idea")===l.value?"selected":""}>${l.label}</option>`).join(""),o=Ja.map(l=>`<option value="${l.value}" ${((a==null?void 0:a.categoria)??"varia")===l.value?"selected":""}>${l.label}</option>`).join(""),n=Wa.map(l=>`<option value="${l.value}" ${((a==null?void 0:a.priorita)??"media")===l.value?"selected":""}>${l.label}</option>`).join("");return`
    <form id="idea-form" class="ideas-form">
      <div class="ideas-form-title">${e?"✏️ Modifica idea":"💡 Nuova idea"}</div>

      <!-- TITOLO — unico campo obbligatorio, grande e prominente -->
      <input type="text" id="idea-text" class="ideas-input ideas-input--title"
        placeholder="Cosa vuoi ricordare…"
        value="${w((a==null?void 0:a.text)??"")}"
        autocomplete="off" />

      <!-- ROW: categoria / stato / priorità -->
      <div class="ideas-row3">
        <div class="ideas-field-mini">
          <label class="ideas-label">Categoria</label>
          <select id="idea-categoria" class="ideas-select">${o}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Stato</label>
          <select id="idea-stato" class="ideas-select">${t}</select>
        </div>
        <div class="ideas-field-mini">
          <label class="ideas-label">Priorità</label>
          <select id="idea-priorita" class="ideas-select">${n}</select>
        </div>
      </div>

      <!-- Toggle dettagli aggiuntivi -->
      <button type="button" class="ideas-toggle-advanced" id="ideas-toggle-advanced">
        ${I?"▲ Meno dettagli":"▼ Più dettagli"}
      </button>

      <div id="ideas-advanced" class="${I?"":"hidden"}">
        <!-- Nota -->
        <textarea id="idea-note" class="ideas-input ideas-textarea"
          rows="2" placeholder="Nota aggiuntiva…">${w((a==null?void 0:a.note)??"")}</textarea>

        <!-- Luogo + Link -->
        <div class="ideas-row2">
          <input type="text" id="idea-location" class="ideas-input"
            placeholder="📍 Luogo"
            value="${w((a==null?void 0:a.location_name)??"")}" />
          <input type="url" id="idea-link" class="ideas-input"
            placeholder="🔗 Link (opz.)"
            value="${w((a==null?void 0:a.link)??"")}" />
        </div>

        <!-- Giorno -->
        <select id="idea-day" class="ideas-select">
          <option value="">📅 Nessun giorno specifico</option>
          ${i}
        </select>

        <!-- Coordinate (auto-fill da giorno) -->
        <div class="ideas-coords-row">
          <span class="ideas-coords-label">Coord.</span>
          <input type="number" id="idea-lat" class="ideas-input ideas-input--coord"
            placeholder="Lat" step="0.0001" value="${((s=a==null?void 0:a.coordinates)==null?void 0:s.lat)??""}" />
          <input type="number" id="idea-lng" class="ideas-input ideas-input--coord"
            placeholder="Lng" step="0.0001" value="${((r=a==null?void 0:a.coordinates)==null?void 0:r.lng)??""}" />
          <span id="idea-coords-hint" class="ideas-coords-hint" style="font-size:0.72rem;color:var(--color-text-muted);">
            Seleziona giorno per auto-fill
          </span>
        </div>

        <!-- Checklist + Mappa -->
        <div class="ideas-checks">
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-checklist" ${a!=null&&a.add_to_checklist?"checked":""} />
            📋 Checklist
          </label>
          <label class="idea-check-label">
            <input type="checkbox" id="idea-add-map" ${a!=null&&a.add_to_map?"checked":""} />
            🗺️ Mappa
          </label>
        </div>

        <!-- Color picker (visibile solo se Mappa) -->
        <div class="idea-color-row ${a!=null&&a.add_to_map?"":"hidden"}" id="idea-color-row">
          <span class="ideas-label">Colore marker:</span>
          <div class="idea-color-picker">
            ${Ce.map(l=>`
              <label class="color-option" title="${l.label}">
                <input type="radio" name="idea-color" value="${l.value}"
                  ${((a==null?void 0:a.marker_color)??"#f59e0b")===l.value?"checked":""} />
                <span class="color-dot" style="background:${l.value}"></span>
              </label>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Azioni form -->
      <div class="ideas-form-actions">
        <button type="submit" class="btn btn-primary ideas-save-btn" id="idea-save-btn">
          ${e?"💾 Aggiorna":"💾 Salva"}
        </button>
        <button type="button" class="btn btn-outline ${e?"":"hidden"}" id="idea-cancel-btn">
          ✕ Annulla
        </button>
      </div>
    </form>
  `}function pa(){var e,i,t;const a=document.getElementById("ideas-form-wrap");a&&((e=document.getElementById("ideas-toggle-advanced"))==null||e.addEventListener("click",()=>{I=!I;const o=document.getElementById("ideas-advanced"),n=document.getElementById("ideas-toggle-advanced");o==null||o.classList.toggle("hidden",!I),n&&(n.textContent=I?"▲ Meno dettagli":"▼ Più dettagli")}),a.addEventListener("change",o=>{var n;if(o.target.id==="idea-day"){const s=Y.find(r=>r.date===o.target.value);s!=null&&s.coordinates&&(document.getElementById("idea-lat").value=s.coordinates.lat,document.getElementById("idea-lng").value=s.coordinates.lng,document.getElementById("idea-coords-hint").textContent=`Auto-riempito da "${s.location}"`)}o.target.id==="idea-add-map"&&((n=document.getElementById("idea-color-row"))==null||n.classList.toggle("hidden",!o.target.checked))}),(i=document.getElementById("idea-form"))==null||i.addEventListener("submit",o=>{o.preventDefault(),Xi()}),(t=document.getElementById("idea-cancel-btn"))==null||t.addEventListener("click",()=>{D=null,document.getElementById("ideas-form-wrap").innerHTML=ua(null),pa()}))}function Xi(){var s,r,l,c,d,u,p,v,_,L,g,y,m,Q;const a=(s=document.getElementById("idea-text"))==null?void 0:s.value.trim();if(!a){(r=document.getElementById("idea-text"))==null||r.focus();return}const e=parseFloat((l=document.getElementById("idea-lat"))==null?void 0:l.value),i=parseFloat((c=document.getElementById("idea-lng"))==null?void 0:c.value),t=!isNaN(e)&&!isNaN(i)?{lat:e,lng:i}:null,o=(d=document.getElementById("idea-add-map"))==null?void 0:d.checked,n={text:a,note:((u=document.getElementById("idea-note"))==null?void 0:u.value.trim())??"",categoria:((p=document.getElementById("idea-categoria"))==null?void 0:p.value)??"varia",stato:((v=document.getElementById("idea-stato"))==null?void 0:v.value)??"idea",priorita:((_=document.getElementById("idea-priorita"))==null?void 0:_.value)??"media",day_date:((L=document.getElementById("idea-day"))==null?void 0:L.value)||null,location_name:((g=document.getElementById("idea-location"))==null?void 0:g.value.trim())||null,link:((y=document.getElementById("idea-link"))==null?void 0:y.value.trim())||"",coordinates:t,add_to_checklist:((m=document.getElementById("idea-add-checklist"))==null?void 0:m.checked)??!1,add_to_map:o&&t!==null,marker_color:((Q=document.querySelector('input[name="idea-color"]:checked'))==null?void 0:Q.value)??"#f59e0b"};D?(U(D,n),D=null):la(n),I=!1,document.getElementById("ideas-form-wrap").innerHTML=ua(null),pa(),B(),O()}function ge(){const a=z();return[{key:"tutte",label:`Tutte (${a.length})`},{key:"idea",label:`Idea (${a.filter(i=>i.stato==="idea").length})`},{key:"da-verificare",label:`Da verificare (${a.filter(i=>i.stato==="da-verificare").length})`},{key:"prenotare",label:`Prenotare (${a.filter(i=>i.stato==="prenotare").length})`},{key:"approvata",label:`Approvate (${a.filter(i=>i.stato==="approvata").length})`},{key:"scartata",label:`Scartate (${a.filter(i=>i.stato==="scartata").length})`}].map(i=>`
    <button class="idea-filter-btn ${T===i.key?"active":""}" data-f="${i.key}">
      ${i.label}
    </button>
  `).join("")}function me(){var a;(a=document.getElementById("ideas-filters-row"))==null||a.querySelectorAll(".idea-filter-btn").forEach(e=>{e.addEventListener("click",()=>{T=e.dataset.f,O(),B()})})}function O(){const a=document.getElementById("ideas-filters-row");a&&(a.innerHTML=ge(),me())}function ve(){let a=z();return T!=="tutte"&&(a=a.filter(e=>e.stato===T)),a.length===0?`<div class="ideas-empty">${T==="tutte"?"Nessuna idea salvata. Aggiungine una qui sopra.":"Nessuna idea per questo filtro."}</div>`:a.map(at).join("")}function at(a){const e=ba.find(n=>n.value===a.stato),i=Ja.find(n=>n.value===a.categoria),t=Wa.find(n=>n.value===a.priorita),o=a.day_date?Y.find(n=>n.date===a.day_date):null;return`
    <div class="idea-card ${a.stato==="scartata"?"idea-card--scartata":""}" data-id="${a.id}">
      <div class="idea-card-main">
        <div class="idea-card-header-row">
          <span class="idea-card-text">${w(a.text)}</span>
          <div class="idea-card-badges-inline">
            ${e?`<span class="idea-stato-badge" style="background:${e.color}20;color:${e.color};border-color:${e.color}40;">${e.label}</span>`:""}
            ${i?`<span class="idea-cat-badge">${i.label}</span>`:""}
            ${t?`<span class="idea-pri-dot" title="${t.label}" style="background:${tt(a.priorita)}"></span>`:""}
          </div>
        </div>

        ${a.note?`<div class="idea-card-note">${w(a.note)}</div>`:""}

        <div class="idea-card-meta">
          ${o?`<span class="idea-meta-chip">📅 Gg. ${o.day} — ${o.location}</span>`:""}
          ${a.location_name?`<span class="idea-meta-chip">📍 ${w(a.location_name)}</span>`:""}
          ${a.add_to_checklist?'<span class="idea-meta-chip">📋 Checklist</span>':""}
          ${a.add_to_map?`<span class="idea-meta-chip" style="border-left:3px solid ${a.marker_color}">🗺️ Mappa</span>`:""}
          ${a.link?`<a href="${w(a.link)}" target="_blank" rel="noopener" class="idea-meta-chip idea-meta-link">🔗 Link</a>`:""}
        </div>
      </div>

      <div class="idea-card-actions">
        <!-- Stato rapido -->
        <select class="idea-stato-select" data-action="stato" data-id="${a.id}" title="Cambia stato">
          ${ba.map(n=>`<option value="${n.value}" ${a.stato===n.value?"selected":""}>${n.label}</option>`).join("")}
        </select>

        <div class="idea-card-btns">
          <!-- Aggiungi alla checklist -->
          <button class="idea-action-btn ${a.add_to_checklist?"idea-action-btn--active":""}"
            data-action="checklist" data-id="${a.id}"
            title="${a.add_to_checklist?"Rimuovi dalla checklist":"Aggiungi alla checklist"}">
            📋
          </button>

          <!-- Aggiungi all'itinerario (collega a giorno) -->
          <button class="idea-action-btn ${a.day_date?"idea-action-btn--active":""}"
            data-action="day-link" data-id="${a.id}"
            title="${a.day_date?"Giorno: "+a.day_date:"Collega a giorno"}">
            📅
          </button>

          <!-- Modifica -->
          <button class="idea-action-btn" data-action="edit" data-id="${a.id}" title="Modifica">✏️</button>

          <!-- Elimina -->
          <button class="idea-action-btn idea-action-btn--del" data-action="delete" data-id="${a.id}" title="Elimina">🗑️</button>
        </div>
      </div>
    </div>
  `}function et(a){var o,n,s;const e=z().find(r=>r.id===a);if(!e)return;(o=document.getElementById("day-link-modal"))==null||o.remove();const i=Y.map(r=>`<option value="${r.date}" ${e.day_date===r.date?"selected":""}>
      Gg. ${r.day} — ${r.location} · ${f(r.date)}
    </option>`).join(""),t=document.createElement("div");t.id="day-link-modal",t.className="day-link-modal-overlay",t.innerHTML=`
    <div class="day-link-modal">
      <div class="day-link-modal-title">📅 Collega all'itinerario</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">
        L'idea apparirà nella scheda del giorno selezionato.
      </p>
      <select id="day-link-select" class="ideas-select">
        <option value="">Nessun giorno</option>
        ${i}
      </select>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button class="btn btn-primary" id="day-link-confirm">✓ Conferma</button>
        <button class="btn btn-outline" id="day-link-cancel">Annulla</button>
      </div>
    </div>
  `,document.body.appendChild(t),(n=document.getElementById("day-link-confirm"))==null||n.addEventListener("click",()=>{var l;const r=((l=document.getElementById("day-link-select"))==null?void 0:l.value)||null;U(a,{day_date:r}),t.remove(),B()}),(s=document.getElementById("day-link-cancel"))==null||s.addEventListener("click",()=>t.remove()),t.addEventListener("click",r=>{r.target===t&&t.remove()})}function be(){const a=document.getElementById("ideas-list");a&&(a.addEventListener("change",e=>{e.target.dataset.action==="stato"&&(U(e.target.dataset.id,{stato:e.target.value}),B(),O())}),a.addEventListener("click",e=>{var n;const i=e.target.closest("[data-action]");if(!i)return;const t=i.dataset.id,o=i.dataset.action;if(o==="delete"){if(!confirm("Eliminare questa idea?"))return;za(t),B(),O()}if(o==="edit"){D=t;const s=z().find(r=>r.id===t);if(!s)return;I=!0,document.getElementById("ideas-form-wrap").innerHTML=ua(s),pa(),(n=document.getElementById("ideas-form-wrap"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})}if(o==="checklist"){const s=z().find(r=>r.id===t);if(!s)return;U(t,{add_to_checklist:!s.add_to_checklist}),B()}o==="day-link"&&et(t)}))}function B(){const a=document.getElementById("ideas-list");a&&(a.innerHTML=ve(),be())}function it(){var a,e;(a=document.getElementById("export-btn"))==null||a.addEventListener("click",()=>{const i=je(),t=new Blob([i],{type:"application/json"}),o=URL.createObjectURL(t),n=document.createElement("a");n.href=o,n.download=`idee_viaggio_${new Date().toISOString().slice(0,10)}.json`,n.click(),URL.revokeObjectURL(o)}),(e=document.getElementById("import-file"))==null||e.addEventListener("change",async i=>{var o;const t=(o=i.target.files)==null?void 0:o[0];if(t){try{const n=await t.text(),s=De(n);alert(`Importazione completata: ${s} nuove idee aggiunte.`),B(),O()}catch(n){alert("Errore importazione: "+n.message)}i.target.value=""}})}function tt(a){return a==="alta"?"#ef4444":a==="media"?"#f59e0b":"#22c55e"}function w(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const C=[{id:"zlatni-rat",nome:"Zlatni Rat",area:"Brač",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia",descrizione:"La spiaggia più fotografata della Croazia: un lungo promontorio di ciottoli bianchi che cambia forma con le correnti, circondato da acque turchesi e pinete. A ~40 min da Postira.",bambini:!0,bambini_nota:"Ottimo — acque basse, spiaggia servita, pini per l'ombra",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.256,lng:16.6372}},{id:"vidova-gora",nome:"Vidova Gora",area:"Brač",tipo:"natura",categoria:"panorama",categoriaLabel:"⛰️ Panorama",descrizione:"Il punto più alto di tutte le isole dalmate (778 m). Vista a 360° su Zlatni Rat, Hvar e il mare aperto. Si raggiunge in auto su strada asfaltata, ~45 min da Postira.",bambini:!0,bambini_nota:"In auto facilissimo; il sentiero a piedi è impegnativo",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:43.3621,lng:16.6588}},{id:"lovrecina-bay",nome:"Baia di Lovrečina",area:"Brač",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia sabbiosa",descrizione:"Una delle pochissime spiagge davvero sabbiose di Brač, con acqua turchese e bassa e i resti di una chiesa medievale tra gli ulivi alle spalle dell'arenile. Il parcheggio limitato la tiene meno affollata di altre. A ~10 min d'auto da Postira (4 km).",bambini:!0,bambini_nota:"La migliore della zona per il piccolo di 2 anni: fondo sabbioso e acqua che degrada dolcemente, senza scarpette. Poca ombra: portare ombrellone e arrivare presto per il parcheggio.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.3693,lng:16.666}},{id:"supetar-spiaggia",nome:"Spiaggia di Supetar (Banj)",area:"Brač",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia attrezzata",descrizione:"Lunga spiaggia di ghiaia su una baia poco profonda, a 5 min a piedi dal centro di Supetar. Pensata per le famiglie: scivolo d'acqua, parco acquatico gonfiabile e bar con terrazza sul mare. A ~15 min d'auto da Postira.",bambini:!0,bambini_nota:"Acqua bassa per lunghi tratti, ideale per il bimbo di 2 anni; scivolo e gonfiabili tengono occupati gli 8 e 6 anni. Molti lettini a noleggio, ma resta spazio per il telo.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.3866,lng:16.5469}},{id:"skrip-museo-brac",nome:"Škrip e il Museo dell'isola di Brač",area:"Brač",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏘️ Borgo antico",descrizione:"Il più antico insediamento dell'isola, di origine illirica: case in pietra con tetti in lastre, un castello cinquecentesco in rovina e vista sulla terraferma. Il museo, in una casa-torre fortificata, conserva un rilievo romano di Ercole, attrezzi agricoli e all'esterno mura dell'età del ferro. A ~10 min d'auto da Postira.",bambini:!0,bambini_nota:"Visita breve: il castello in rovina e la statua di Ercole piacciono ai più grandi, il museo si gira in mezz'ora. Vicoli sconnessi: meglio marsupio o zaino che passeggino.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:43.3557,lng:16.612}},{id:"pucisca",nome:"Pučišća",area:"Brač",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏘️ Borgo di pietra",descrizione:"Cittadina di cavatori in fondo a un'insenatura a Y, con due torri medievali e una scuola di scalpellini ancora attiva: la pietra bianca di Brač si estrae qui. Il porto è pulito abbastanza da farci il bagno, e a 20 min a piedi verso nord-ovest ci sono scogli attrezzabili. A ~20 min d'auto da Postira.",bambini:!0,bambini_nota:"Lungomare pianeggiante adatto anche al passeggino; il bagno in porto e gli scalpellini al lavoro incuriosiscono i bambini. Spiagge rocciose: servono scarpette da scoglio.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:43.3479,lng:16.7321}},{id:"bol-monastero-domenicano",nome:"Bol — Monastero domenicano e baie del centro",area:"Brač",tipo:"cultura",categoria:"museo",categoriaLabel:"⛪ Monastero e baie",descrizione:"Su un promontorio a est del centro di Bol: chiesa del XII secolo, chiostro e museo con una Madonna col Bambino attribuita al Tintoretto. Ai lati del monastero si aprono baie di ghiaia più tranquille dello Zlatni Rat, con ristorante e gelati. A ~35 min d'auto da Postira.",bambini:!0,bambini_nota:"Baie con acqua bassa, buone per tutti e tre, ma il fondale ha massi scivolosi: scarpette obbligatorie. Poca ombra fino a metà pomeriggio. Il museo interessa solo i più grandi, 20 minuti.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.2607,lng:16.6667}},{id:"povlja",nome:"Povlja",area:"Brač",tipo:"natura",categoria:"borgo",categoriaLabel:"⚓ Porticciolo panoramico",descrizione:"Uno dei paesi-baia più belli del nord dell'isola: poche case attorno a un porticciolo, con la strada in discesa che regala una gran vista su porto, mare e monti della costa. A est del porto un promontorio roccioso con spiaggia di ciottoloni dall'aspetto lunare. A ~40 min d'auto da Postira.",bambini:!1,bambini_nota:"Il porticciolo va bene per tutti, ma la spiaggia del promontorio è di ciottoloni grossi e taglienti, senza ombra: scomoda col bimbo di 2 anni. Da valutare solo restando sul lungomare.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.3338,lng:16.836}},{id:"milna",nome:"Milna",area:"Brač",tipo:"cultura",categoria:"borgo",categoriaLabel:"⛵ Porto da cartolina",descrizione:"Principale centro della costa occidentale, raccolto attorno a una baia profonda. Il borgo vecchio sale dal mare con vicoli stretti e case in pietra attorno alla parrocchiale settecentesca e alla loggia ottocentesca. A ~40 min d'auto da Postira, attraversando l'isola.",bambini:!0,bambini_nota:"Meta rilassata da fine giornata: lungomare piatto con caffè e barche da guardare, adatto al passeggino. Il borgo vecchio è in salita e non ha attrazioni pensate per i bambini.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.3266,lng:16.4497}},{id:"eremo-blaca",nome:"Eremo di Blaca (Pustinja Blaca)",area:"Brač",tipo:"cultura",categoria:"museo",categoriaLabel:"🏔️ Eremo nella gola",descrizione:"Fondato nel 1588 da monaci in fuga dai turchi e abitato fino agli anni Trenta, incastonato in una gola sul fianco occidentale della Vidova Gora: il colpo d'occhio è il motivo per andarci. Dentro, celle spartane e le collezioni dell'ultimo eremita, l'astronomo Niko Miličević. Da Postira ~30 min d'auto al bivio, poi sterrato e 40 min di sentiero a piedi (in discesa all'andata).",bambini:!1,bambini_nota:"Sconsigliato con questa comitiva: sentiero sassoso ed esposto al sole, impraticabile col passeggino e faticoso in risalita anche per il bimbo di 6 anni. Fattibile solo col piccolo nello zaino, molta acqua e scarpe chiuse.",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:43.2931,lng:16.5294}},{id:"supetar-cimitero-petrinovic",nome:"Cimitero di Supetar e mausoleo Petrinović",area:"Brač",tipo:"cultura",categoria:"parco",categoriaLabel:"🗿 Parco di sculture",descrizione:"Su una penisola di cipressi appena oltre la spiaggia di Supetar: più parco di sculture che camposanto, con le tombe firmate da Ivan Rendić. Il pezzo forte è il mausoleo Petrinović di Toma Rosandić, cupola neobizantina con angelo inginocchiato. A ~15 min d'auto da Postira, si abbina alla spiaggia.",bambini:!1,bambini_nota:"Non è una meta per bambini, ma è all'ombra dei cipressi e si visita in 15-20 minuti: l'angelo del mausoleo colpisce anche i più grandi. Da incastrare mentre si è già a Supetar.",impegno:"sosta-breve",nota_tipo:"solo-se-c-e-tempo",coords:{lat:43.3878,lng:16.5474}},{id:"big-blue-bol",nome:"Windsurf, kayak e SUP a Bol",area:"Brač",tipo:"natura",categoria:"attivita",categoriaLabel:"🏄 Sport acquatici",descrizione:"Grazie ai venti costanti del canale di Hvar, Bol è uno dei due poli del windsurf croato: lungo la passeggiata che porta a Zlatni Rat si allineano i centri che noleggiano attrezzatura e danno lezioni. Il più completo ha tavole, kayak, stand-up paddle, beach volley e noleggio bici. A ~35-40 min d'auto da Postira.",bambini:!0,bambini_nota:"Kayak e SUP sono gestibili coi genitori a bordo per il 6 e l'8 anni; il windsurf ha senso solo per il maggiore. Col piccolo di 2 meglio restare su beach volley e spiaggia: prevedere che un adulto stia a terra.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.26,lng:16.642}},{id:"cinema-estivo-supetar",nome:"Cinema all'aperto di Supetar (Ljetno Kino)",area:"Brač",tipo:"cultura",categoria:"attivita",categoriaLabel:"🎬 Cinema all'aperto",descrizione:"Dietro il lungomare di Supetar funziona ogni sera un cinema all'aperto con proiezioni alle 21.30, tra film d'autore, titoli hollywoodiani e animazione. Aperto da inizio luglio a fine agosto, quindi attivo durante il soggiorno (~15 min d'auto). Ce n'è un gemello a Bol, affacciato sul porto.",bambini:!0,bambini_nota:"Conviene solo nelle sere con un film d'animazione in cartellone: verificare il programma in giornata. Alle 21.30 si finisce tardi — realistico per l'8 e il 6 anni, difficile per il piccolo. Portare una felpa.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:43.3834,lng:16.5537}},{id:"diving-supetar",nome:"Immersioni a Supetar",area:"Brač",tipo:"natura",categoria:"attivita",categoriaLabel:"🤿 Diving",descrizione:"Le acque trasparenti attorno a Supetar si prestano bene alle immersioni. Il diving club locale noleggia attrezzatura, organizza corsi per principianti e porta i subacquei formati verso punti come l'Orecchio del Drago (Zmajevo uho), una grotta sottomarina. Aperto da maggio a settembre, a ~15 min da Postira.",bambini:!1,bambini_nota:"Non è un'attività per i bambini: i limiti di età li escludono tutti e tre, e la grotta è riservata a subacquei esperti. Semmai è un ritaglio di mezza giornata per un adulto, mentre l'altro sta in spiaggia coi bimbi.",impegno:"mezza-giornata",nota_tipo:"solo-se-c-e-tempo",coords:{lat:43.3868,lng:16.5452}},{id:"zara-centro",nome:"Zara — Centro Storico e Organo del Mare",area:"Area di Zara",tipo:"cultura",categoria:"citta",categoriaLabel:"🏛️ Città storica",descrizione:"La penisola antica di Zara: Foro Romano, Cattedrale di Sant'Anastasia, San Donato e i due gioielli sul lungomare — l'Organo del Mare (Morske Orgulje) e il Saluto al Sole. A ~20 min da Petrčane.",bambini:!0,bambini_nota:"Piace ai bambini — l'organo suona con le onde e il Saluto al Sole si illumina al tramonto",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.117,lng:15.22}},{id:"nin",nome:"Nin (Nona)",area:"Area di Zara",tipo:"cultura",categoria:"citta",categoriaLabel:"⛪ Borgo storico",descrizione:"Piccola città-isola con la chiesa più piccola del mondo (Santa Croce), saline storiche e una laguna con spiagge sabbiose e fanghi curativi. A ~20 min da Petrčane.",bambini:!0,bambini_nota:"Adatto — spiaggia sabbiosa bassa (rara in Croazia) e visita del borgo breve",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:44.2431,lng:15.184}},{id:"vransko-lake",nome:"Vransko Lake",area:"Area di Zara",tipo:"natura",categoria:"lago",categoriaLabel:"🦢 Lago / Ornitologia",descrizione:"Il lago più grande della Croazia, riserva ornitologica con oltre 250 specie di uccelli. Pista ciclabile panoramica e ambiente tranquillo. A ~40 min da Petrčane.",bambini:!0,bambini_nota:"Adatto — pista ciclabile e percorsi piani ideali con i bambini",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:43.8856,lng:15.5475}},{id:"paklenica",nome:"Paklenica National Park",area:"Area di Zara",tipo:"natura",categoria:"parco",categoriaLabel:"🏔️ Canyon / Trekking",descrizione:"Canyon spettacolari ai piedi delle Alpi Dinare, con sentieri per tutti i livelli e la grotta Manita Peć. Ingresso di Starigrad a ~45 min da Petrčane.",bambini:!1,bambini_nota:"Sentieri brevi facili esistono, ma le gole principali sono impegnative con bambini piccoli",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.3219,lng:15.4722}},{id:"museo-illusioni-zara",nome:"Museo delle Illusioni (Muzej iluzija), Zara",area:"Area di Zara",tipo:"cultura",categoria:"museo",categoriaLabel:"🎭 Museo interattivo",descrizione:"Ologrammi, illusioni ottiche e stanze truccate (pavimenti inclinati, arredi fuori scala) nel centro di Zara, con un negozio pieno di rompicapo. È un museo che si tocca e si prova, non che si guarda soltanto. A ~20 min d'auto da Petrčane.",bambini:!0,bambini_nota:"Il posto più adatto ai bambini in tutta Zara: l'8 e il 6 anni si divertono con le stanze deformate, il piccolo di 2 gira in braccio senza problemi. Breve e al chiuso: ottimo rifugio nelle ore calde.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:44.1141,lng:15.2297}},{id:"parco-naturale-telascica",nome:"Parco naturale di Telašćica (Dugi Otok)",area:"Area di Zara",tipo:"natura",categoria:"parco",categoriaLabel:"🏞️ Parco naturale",descrizione:"Baia lunga ~7 km sull'Isola Lunga, chiusa da colline dolci e da falesie a picco sul mare aperto, con il lago salato Jezero Mir, più caldo e salato del mare. È la meraviglia naturale più celebrata dell'arcipelago di Zara: ci si arriva in giornata con i battelli-escursione da Zara, o in catamarano fino a Sali (~1 h) più 3 km.",bambini:!0,bambini_nota:"Dal parcheggio alla baia ~20 min a piedi, fattibili per il 6 anni; per il 2 anni serve zaino. Il lago salato è tiepido e poco profondo, perfetto per i bambini. C'è un bar-ristorante.",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:43.8867,lng:15.1657}},{id:"spiaggia-borik-puntamika",nome:"Spiaggia di Borik / Puntamika, Zara",area:"Area di Zara",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia",descrizione:"Il quartiere balneare di Zara, 4 km a nord-ovest del centro: lunga spiaggia di ghiaia, pinete, hotel e marina. Sulla punta di Puntamika un bar con grande terrazza affacciata sulle isole e sul tramonto. È la spiaggia attrezzata più vicina alla base: ~15 min d'auto da Petrčane.",bambini:!0,bambini_nota:"Dietro il bar sulla punta ci sono parco giochi e chiosco di gelati: combinazione ideale con tre bambini. Fondale di ghiaia, meglio le scarpette; c'è ombra tra i pini per il piccolo.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.1338,lng:15.21}},{id:"spiaggia-saharun-dugi-otok",nome:"Spiaggia di Sakarun, Dugi Otok",area:"Area di Zara",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Spiaggia",descrizione:"Mezzo chilometro di ciottoli finissimi con bordo sabbioso e fondale basso, alla fine di una strada nella pineta verso la punta nord di Dugi Otok. La guida la dà come una delle spiagge più belle di questo tratto d'Adriatico. Si raggiunge in giornata via mare da Zara (catamarano per Božava ~1h15) o con un'escursione in barca.",bambini:!0,bambini_nota:"Acqua bassissima e fondo sabbioso: la spiaggia da sguazzare ideale per il 2 anni, e i più grandi nuotano in sicurezza. Ultimo tratto a piedi nel bosco (~500 m). Pizzeria e griglia sul retro, ma care per cinque.",impegno:"giornata-piena",nota_tipo:"opzionale",coords:{lat:44.1336,lng:14.8714}},{id:"mercato-zara",nome:"Mercato di Zara (Pijaca)",area:"Area di Zara",tipo:"cultura",categoria:"attivita",categoriaLabel:"🍑 Mercato",descrizione:"Uno dei mercati quotidiani più vivaci dell'Adriatico, in una lunga piazza addossata alle mura di Zara: frutta e verdura dalla campagna, pesce fresco nella sala accanto, chioschi di pane, formaggi e salumi. Solo la mattina; ottimo per riempire la borsa frigo prima della spiaggia. A ~20 min da Petrčane.",bambini:!0,bambini_nota:"Sosta breve e colorata: frutta da assaggiare subito e banchi del pesce che divertono i più grandi. Col passeggino si passa, ma la mattina è affollato: meglio presto.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:44.1157,lng:15.228}},{id:"barkajol-zara",nome:"Barkajol — il traghetto a remi di Zara",area:"Area di Zara",tipo:"cultura",categoria:"attivita",categoriaLabel:"🚣 Traversata a remi",descrizione:"La barchetta a remi che da secoli traghetta i passeggeri tra la Liburnska obala, nel centro storico, e la riva di fronte. La guida la definisce il mezzo di trasporto pubblico più piacevole di Zara: costa pochissimo e dura pochi minuti. Da abbinare a una passeggiata in città, ~20 min d'auto dalla base.",bambini:!0,bambini_nota:"Una vera barca a remi col barcaiolo: per i bambini vale più di molti musei, e dura abbastanza poco da tenere buono anche il 2 anni. Tenerli seduti durante la traversata.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:44.1183,lng:15.2242}},{id:"campanile-santa-anastasia-zara",nome:"Campanile di Sant'Anastasia, Zara",area:"Area di Zara",tipo:"cultura",categoria:"panorama",categoriaLabel:"🔭 Panorama",descrizione:"I 183 gradini del campanile alto 54 m, completato in stile neoromanico a fine Ottocento dall'inglese T.G. Jackson, portano a una vista che abbraccia i tetti della città vecchia e le isole all'orizzonte. Sotto, la cattedrale romanica col fregio di foglie d'acanto sul portale. A ~20 min dalla base.",bambini:!0,bambini_nota:"La salita piace all'8 anni e regge anche il 6; col 2 anni serve portarlo in braccio su una scala stretta, meglio fare i turni. Niente passeggino.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:44.116,lng:15.2248}},{id:"museo-vetro-antico-zara",nome:"Museo del Vetro Antico, Zara",area:"Area di Zara",tipo:"cultura",categoria:"museo",categoriaLabel:"🏺 Museo",descrizione:"In una villa ottocentesca fusa con un padiglione di vetro e cromo: boccette di profumo romane, oggetti d'uso e una sala di urne cinerarie in vetro trovate negli scavi in città. C'è un filmato di dieci minuti sulla soffiatura del vetro e, d'estate, dimostrazioni dal vivo. A ~20 min d'auto da Petrčane.",bambini:!0,bambini_nota:"Museo piccolo e fresco, con oggetti luccicanti che catturano i bambini per il tempo giusto; il video sulla soffiatura funziona meglio con l'8 e il 6 anni. Non fermarsi più di un'ora.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:44.1143,lng:15.2295}},{id:"sali-dugi-otok",nome:"Sali (Dugi Otok)",area:"Area di Zara",tipo:"cultura",categoria:"borgo",categoriaLabel:"⚓ Borgo di mare",descrizione:"Il paese più grande di Dugi Otok, porto peschereccio tranquillo coi caffè attorno alla darsena. È la porta d'accesso a Telašćica (3 km) e il punto di partenza delle gite alle Kornati. Catamarano da Zara ~1 h. Nel primo fine settimana di agosto ospita le Saljske užance, con concerti e la 'musica degli asini' suonata coi corni.",bambini:!0,bambini_nota:"Porto raccolto e senza traffico, facile col passeggino sul lungomare; le barche da pesca intrattengono i bambini. Da abbinare a Telašćica per non fare la traversata solo per il paese.",impegno:"giornata-piena",nota_tipo:"opzionale",coords:{lat:43.9382,lng:15.1634}},{id:"isole-kornati",nome:"Parco nazionale delle Incoronate (Kornati)",area:"Area di Zara",tipo:"natura",categoria:"parco",categoriaLabel:"🏝️ Arcipelago",descrizione:"Novanta isole spoglie e quasi lunari, dal bianco pietra all'ocra pallido, raggruppate attorno a Kornat: pascoli bruciati secoli fa, muretti a secco, acque limpidissime e taverne nelle cale. Le agenzie di Zara offrono la gita in giornata (partenza 8-9, rientro 17-18, soste bagno, ingresso al parco e di solito pranzo inclusi).",bambini:!1,bambini_nota:"Circa dieci ore di barca con lunghi trasferimenti e poca ombra: pesante per il 2 anni e noioso a tratti anche per il 6. Solo con mare calmo e se i bambini reggono le uscite in barca; le soste bagno sono il momento buono.",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:43.8054,lng:15.3221}},{id:"isola-silba",nome:"Silba — l'isola senza auto",area:"Area di Zara",tipo:"natura",categoria:"borgo",categoriaLabel:"🚫🚗 Isola senza auto",descrizione:"Isola senza automobili (e con le bici bandite tra metà luglio e fine agosto) coperta di querce, con un paese di case ombreggiate da palme e giardini murati, la torre Marinić e un parco di sculture. Sul lato est la spiaggia di Šotorišće, baia ampia e poco profonda dal fondale sabbioso. Catamarano da Zara ~1h30.",bambini:!0,bambini_nota:"Zero traffico: i bambini camminano liberi, e Šotorišće ha acqua bassa e fondo di sabbia, perfetta per il 2 anni, con un bar estivo accanto. Le altre spiagge sono a 50 min a piedi, troppo coi piccoli.",impegno:"giornata-piena",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.3762,lng:14.6962}},{id:"kraljicina-plaza-nin",nome:"Kraljičina plaža e i fanghi di Nin",area:"Area di Zara",tipo:"natura",categoria:"attivita",categoriaLabel:"🏖️ Spiaggia e fanghi",descrizione:"Uno dei pochi posti in Croazia dove ha senso portare secchiello e paletta: la 'spiaggia della Regina' è di sabbia vera, lunga e poco commercializzata, con vista sul Velebit dall'altra parte dell'acqua. Nel canneto dietro la spiaggia si raccoglie il fango peloide, che i bagnanti si spalmano addosso per i dolori reumatici. A ~20 min da Petrčane.",bambini:!0,bambini_nota:"Sabbia e acqua bassa la rendono la spiaggia migliore della zona per il bimbo di 2 anni. La spalmata di fango è un gioco perfetto per gli 8 e i 6 anni: mettere in conto una doccia lunga e costumi macchiati. Poca ombra: serve ombrellone.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.2514,lng:15.1752}},{id:"solana-nin-saline",nome:"Saline di Nin — percorso didattico",area:"Area di Zara",tipo:"cultura",categoria:"attivita",categoriaLabel:"🧂 Visita didattica",descrizione:"Saline sfruttate da almeno duemila anni, dove acqua di mare, sole e bora producono un sale oggi considerato prodotto gourmet. C'è un piccolo museo sulla storia della produzione, un negozio, e soprattutto un percorso didattico che corre sugli argini tra le vasche di evaporazione. A ~20 min da Petrčane.",bambini:!0,bambini_nota:"Il camminamento sugli argini piace molto: vasche, cumuli di sale e uccelli, tutto piano e compatibile col passeggino. Nessuna ombra: andare presto la mattina o nel tardo pomeriggio, con cappelli e acqua. Si abbina alla spiaggia di Nin.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:44.2398,lng:15.1915}},{id:"rafting-zrmanja",nome:"Rafting nel canyon della Zrmanja",area:"Area di Zara",tipo:"natura",categoria:"attivita",categoriaLabel:"🚣 Rafting",descrizione:"La Zrmanja scorre in uno dei canyon carsici più notevoli della Croazia, con pareti che arrivano a 200 m. Le agenzie di Starigrad organizzano discese in gommone e in kayak: le uscite sul tratto superiore partono da Kaštel Žegarski e finiscono a Muškovci. A ~1 h da Petrčane: si può incastrare nel trasferimento verso Otočac.",bambini:!0,bambini_nota:"Il rafting ha quasi sempre un'età minima: realistico solo per l'8 anni, da verificare per il 6, escluso il piccolo. Chiamare prima chiedendo esplicitamente il limite d'età; in alternativa una gita in barca sul tratto basso è adatta a tutti.",impegno:"giornata-piena",nota_tipo:"opzionale",coords:{lat:44.1619,lng:15.8486}},{id:"kuterevo",nome:"Kuterevo Bear Sanctuary",area:"Velebit / Lika",tipo:"natura",categoria:"natura",categoriaLabel:"🐻 Rifugio animali",descrizione:"Rifugio per orsi bruni orfani ai piedi del Velebit, gestito da volontari. Si visitano gli orsi nei recinti naturali con una guida. Esperienza educativa e a basso impatto.",bambini:!0,bambini_nota:"Ottimo per i bambini — orsi visibili da vicino in sicurezza, percorso breve",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:44.8266,lng:15.1389}},{id:"gacka",nome:"Valle della Gacka",area:"Velebit / Lika",tipo:"natura",categoria:"fiume",categoriaLabel:"🌊 Fiume / Valle",descrizione:"Uno dei fiumi carsici più limpidi d'Europa, nella piana attorno a Otočac. Mulini storici, trote, prati verdi e paesaggi tranquilli. A ~20 min dall'alloggio di Kuterevo.",bambini:!0,bambini_nota:"Adatto — passeggiate pianeggianti lungo il fiume e i mulini",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:44.8686,lng:15.2372}},{id:"plitvice-laghi",nome:"Parco Nazionale dei Laghi di Plitvice",area:"Velebit / Lika",tipo:"natura",categoria:"parco",categoriaLabel:"🌊 Parco naturale",descrizione:"Sedici laghi turchesi collegati da cascate, incassati in colline boscose e percorsi da passerelle di legno che corrono sull'acqua. Bus navetta e battello sono compresi nel biglietto e riducono molto i tratti a piedi. A ~50 min d'auto da Otočac: dall'Ingresso 1 in dieci minuti si è al Veliki Slap, la cascata da 78 m.",bambini:!0,bambini_nota:"Pesci e rane nell'acqua limpida piacciono molto a 8 e 6 anni; il piccolo di 2 va tenuto per mano o in zaino perché le passerelle sono senza parapetto. Passeggino sconsigliato.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.905,lng:15.6113}},{id:"senj-nehaj",nome:"Senj e la fortezza di Nehaj",area:"Velebit / Lika",tipo:"cultura",categoria:"museo",categoriaLabel:"🏰 Fortezza",descrizione:"Cittadina di vicoli stretti sul mare, dominata dalla fortezza di Nehaj (1558), quartier generale degli Uskoki, i guerrieri-pirati che da qui assalivano le navi veneziane. Dentro, tre piani di armi e costumi; dai camminamenti si vedono Senj e l'isola di Krk. A ~40 min d'auto da Otočac.",bambini:!0,bambini_nota:"Armi, torre e storie di pirati funzionano benissimo con 8 e 6 anni. Salita breve ma in pendenza e scale interne ripide: il bimbo di 2 va portato in braccio o in zaino.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.9865,lng:14.9034}},{id:"rastoke-slunj",nome:"Rastoke (Slunj)",area:"Velebit / Lika",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏘️ Borgo dei mulini",descrizione:"Borgo di mulini ad acqua dove lo Slunjčica precipita nella gola della Korana con una serie di cascatelle, tra case in pietra e legno collegate da ponticelli. Il punto panoramico migliore è il giardino del Pod Rastočkim Krovom, con i vecchi macchinari idraulici. A ~1 h d'auto da Otočac: ideale come sosta verso Plitvice.",bambini:!0,bambini_nota:"Giro breve e scenografico, con acqua che scorre ovunque: piace a tutti e tre. Occhio ai bordi non protetti sopra le cascate con il bimbo di 2 anni.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1213,lng:15.5876}},{id:"kuca-velebita-krasno",nome:"Casa del Velebit (Kuća Velebita), Krasno",area:"Velebit / Lika",tipo:"cultura",categoria:"museo",categoriaLabel:"🦌 Museo natura",descrizione:"Centro visite del Parco Nazionale del Velebit Settentrionale, a Krasno: flora, fauna e mestieri della montagna, con un allestimento sulla vita nelle grotte e una sala attività per bambini. Nello stesso paese anche il Museo della Silvicoltura. A ~30 min d'auto da Otočac, sulla strada che sale al Velebit.",bambini:!0,bambini_nota:"La sala interattiva e la grotta ricostruita sono il punto forte per 8 e 6 anni; al coperto e senza rischi, gestibile anche col piccolo di 2.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:44.8202,lng:15.0709}},{id:"grotte-barac",nome:"Grotte di Barać (Baračeve špilje)",area:"Velebit / Lika",tipo:"natura",categoria:"grotta",categoriaLabel:"🕯️ Grotta",descrizione:"Tre caverne in una valle boscosa presso Rakovica, poco a nord dell'Ingresso 1 di Plitvice. La visita guidata dura una quarantina di minuti su ~200 m e passa per la Sala dei Piedi di Elefante e la Sala delle Anime Perdute. A ~55 min d'auto da Otočac: ottima alternativa fresca a Plitvice.",bambini:!0,bambini_nota:"Durata contenuta e formato guidato adatti a 8 e 6 anni; dentro fa fresco (felpa anche in agosto) e ci sono scale e fondo umido, quindi il bimbo di 2 va tenuto in braccio.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:44.9838,lng:15.7228}},{id:"zavratnica-jablanac",nome:"Cala Zavratnica e Jablanac",area:"Velebit / Lika",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏖️ Cala",descrizione:"Insenatura strettissima e a pareti verticali che si incunea nelle pendici del Velebit di fronte all'isola di Rab: un sentiero costeggia tutta la cala e in fondo c'è una piccola spiaggia. Si arriva con 15 min a piedi dal porticciolo di Jablanac. A ~1 h d'auto da Otočac verso la costa.",bambini:!0,bambini_nota:"Bagno in acqua calma e riparata alla fine del sentiero; i 15 min a piedi sono facili ma col bimbo di 2 conviene lo zaino. Serve ombra: è roccioso e senza pini sulla spiaggia.",impegno:"mezza-giornata",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.6994,lng:14.8968}},{id:"rovinj-centro",nome:"Rovigno — Centro Storico e Sant'Eufemia",area:"Istria",tipo:"cultura",categoria:"citta",categoriaLabel:"⛪ Città storica",descrizione:"Il borgo veneziano arroccato sul mare: viuzze acciottolate, la Grisia degli artisti e la chiesa di Sant'Eufemia con il campanile panoramico. Alla base della tappa.",bambini:!0,bambini_nota:"Bello a piedi — gelaterie sul porto e vista dall'alto del campanile",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.0832,lng:13.631}},{id:"lim-fjord",nome:"Lim Fjord (Limski Kanal)",area:"Istria",tipo:"natura",categoria:"natura",categoriaLabel:"🌲 Fiordo / Paesaggio",descrizione:"Canale marino di 10 km incastrato tra boschi e vigneti istriani, famoso per le ostriche. Belvedere accessibile in auto, gita in barca dal basso. A ~20 min da Rovigno.",bambini:!0,bambini_nota:"Il belvedere è accessibile a tutti; la barca è ottima per i bambini",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1419,lng:13.6408}},{id:"brijuni",nome:"Brijuni National Park",area:"Istria",tipo:"natura",categoria:"parco",categoriaLabel:"🦒 Parco / Safari",descrizione:"Arcipelago con safari park (zebre, elefanti), resti romani e spiagge. Accesso in traghetto da Fažana (~30 min da Rovigno + ~15 min di traghetto).",bambini:!0,bambini_nota:"Fantastico per i bambini — safari su trenino, animali esotici, mare pulito",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:44.9167,lng:13.7636}},{id:"aquarium-rovinj",nome:"Acquario di Rovigno",area:"Istria",tipo:"natura",categoria:"natura",categoriaLabel:"🐟 Acquario",descrizione:"Piccolo acquario storico (1891) nel centro di Rovigno. Vasche con pesci, granchi e specie dell'Adriatico. Sosta breve e riparata, perfetta nelle ore calde.",bambini:!0,bambini_nota:"Ottimo con i bambini — visita breve al chiuso, animali marini da vicino",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:45.0855,lng:13.6395}},{id:"dinopark-funtana",nome:"Dinopark Funtana",area:"Istria",tipo:"natura",categoria:"parco",categoriaLabel:"🦕 Parco a tema",descrizione:"Parco a tema sui dinosauri a Funtana, a ~20 min da Rovigno. Dinosauri a grandezza naturale nel bosco, mini-golf, area giochi e trenino.",bambini:!0,bambini_nota:"Pensato per i bambini — percorsi facili e dinosauri a grandezza naturale",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:45.1695,lng:13.6076}},{id:"istralandia",nome:"Aquapark Istralandia",area:"Istria",tipo:"natura",categoria:"parco",categoriaLabel:"🏊 Parco acquatico",descrizione:"Grande parco acquatico a Brtonigla (~45 min da Rovigno): scivoli per tutte le età, piscine, zona baby e aree relax.",bambini:!0,bambini_nota:"Molto adatto — zona baby dedicata e scivoli graduati per età",impegno:"giornata-piena",nota_tipo:"opzionale",coords:{lat:45.3466,lng:13.616}},{id:"pula-arena",nome:"Pola — Arena Romana",area:"Istria",tipo:"cultura",categoria:"citta",categoriaLabel:"🏛️ Sito romano",descrizione:"Uno degli anfiteatri romani meglio conservati al mondo, con i corridoi sotterranei visitabili. Centro di Pola tutto intorno. A ~50 min da Rovigno.",bambini:!0,bambini_nota:"Piace ai bambini — si entra nell'arena e nei sotterranei come i gladiatori",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:44.8732,lng:13.8501}},{id:"porec",nome:"Parenzo — Basilica Eufrasiana",area:"Istria",tipo:"cultura",categoria:"citta",categoriaLabel:"⛪ Sito UNESCO",descrizione:"Basilica Eufrasiana (VI sec.), patrimonio UNESCO con mosaici bizantini dorati, nel cuore di Parenzo. A ~40 min da Rovigno.",bambini:!0,bambini_nota:"Visita breve; il centro pedonale e il lungomare sono comodi con i bambini",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:45.2285,lng:13.5936}},{id:"zlatni-rt-punta-corrente",nome:"Parco forestale Zlatni Rt (Punta Corrente)",area:"Istria",tipo:"natura",categoria:"parco",categoriaLabel:"🌲 Parco costiero",descrizione:"Grande pineta costiera piantata dalla famiglia Hütterott a inizio Novecento, percorsa da sentieri per camminate e bici e affacciata sulle calette ghiaiose di Lone Bay. È il classico pomeriggio rovignese all'ombra, con vista sul centro storico: ~20 min a piedi dal porto o 5 min d'auto dalla base.",bambini:!0,bambini_nota:"Sentieri pianeggianti e ombreggiati, perfetti col passeggino per il piccolo di 2 anni; le insenature ghiaiose sono comode per il bagno dei più grandi, ma servono scarpette da scoglio.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.0676,lng:13.632}},{id:"crveni-otok-isola-rossa",nome:"Isola Rossa (Crveni otok) e Santa Caterina",area:"Istria",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🏝️ Isole e bagni",descrizione:"Le due isolette davanti a Rovigno: Santa Caterina, la più vicina, e Sveti Andrija, collegata da un istmo al Crveni otok. Rive ombreggiate da pini e acqua molto pulita — secondo la guida il meglio che offra la costa intorno a Rovigno per fare il bagno. Traghetti dal porto ogni 30–45 min, traversata di pochi minuti.",bambini:!0,bambini_nota:"Il tragitto in barchetta è già un'attrazione; isole piccole e chiuse al traffico, si girano in libertà. Fondali rocciosi: portare scarpette e salvagente per il piccolo.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.0591,lng:13.6246}},{id:"jama-baredine",nome:"Grotta di Baredine (Jama Baredine)",area:"Istria",tipo:"natura",categoria:"grotta",categoriaLabel:"🕳️ Grotta carsica",descrizione:"Sistema di cavità calcaree a Nova Vas, nell'entroterra di Parenzo, visitabile con guida in ~40 min attraverso cinque sale piene di stalattiti. Si vedono anche esemplari di proteo, il 'drago' bianco delle grotte carsiche, e si racconta la leggenda medievale dei due innamorati perdutisi nelle gallerie. A ~45 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Ottimo rifugio dal caldo di agosto: dentro fa fresco, portare felpe. Ci sono scale e gradini: il bimbo di 2 anni va tenuto in braccio o in zaino, il passeggino non serve.",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.2703,lng:13.6618}},{id:"dvigrad",nome:"Dvigrad (Duecastelli)",area:"Istria",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏰 Città fantasma",descrizione:"Città murata abbandonata nel Seicento per la peste e le incursioni dei pirati, oggi un labirinto di rovine grigie tra campi e boschi, con due torri massicce, la cerchia di merli e il guscio della basilica romanica di Santa Sofia. Si entra liberamente e si cammina tra i vicoli invasi dall'erba. A ~25 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Un vero castello in rovina da esplorare: irresistibile per gli 8 e i 6 anni. Attenzione ai muri instabili e alle pietre sconnesse; col piccolo di 2 anni meglio lo zaino porta-bimbo.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1273,lng:13.8118}},{id:"vrsar",nome:"Orsera (Vrsar)",area:"Istria",tipo:"cultura",categoria:"borgo",categoriaLabel:"⛪ Borgo panoramico",descrizione:"Borgo arroccato all'imbocco del Canale di Leme, un intrico di vicoli ripidi, cortili ombrosi e case di pietra: Casanova ci passò due volte e ne scrisse nelle memorie. Dal campanile di San Martino, in cima al colle, bel panorama sulla costa. A ~25 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Salite e scalini rendono il passeggino scomodo; la vista dal campanile piace ai più grandi, mentre il porto turistico e i gelati salvano la sosta col piccolo.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.1512,lng:13.6063}},{id:"svetvincenat",nome:"Sanvincenti (Svetvinčenat)",area:"Istria",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏯 Castello e piazza",descrizione:"Paesino con quella che la guida indica come la più bella piazza dell'Istria: la facciata rinascimentale dell'Assunta da un lato e il castello dei Grimani, con cortile e due torri, dall'altro. Nel castello una mostra multimediale con visori ne racconta la storia, compreso il rogo per stregoneria del 1632. A ~35 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Castello vero con cortile e torri, più i visori VR: colpiscono soprattutto l'8enne. La piazza è pianeggiante e chiusa, comoda per far girare il piccolo; c'è una pizzeria davanti al castello.",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.0881,lng:13.8822}},{id:"cape-kamenjak",nome:"Capo Promontore (Rt Kamenjak)",area:"Istria",tipo:"natura",categoria:"spiaggia",categoriaLabel:"🦕 Riserva e calette",descrizione:"La punta più meridionale dell'Istria, riserva protetta di macchia bassa e scogliere con decine di calette appartate raggiungibili a piedi o in bici; si entra da Premantura seguendo 3 km di sterrato. Alla punta le grotte marine di Velika Kolumbarica e, vicino alla spiaggia di Pinižule, alcune impronte di dinosauro da cercare. A ~1 h d'auto da Rovigno.",bambini:!0,bambini_nota:"Le impronte di dinosauro entusiasmano i bimbi; a piedi/bici si entra gratis, in auto si paga al casello. Poca ombra e scogliere alte: scegliere una caletta riparata e andare presto. Il segnaposto punta all'ingresso di Premantura — la punta è 3,5 km più avanti su sterrato.",impegno:"giornata-piena",nota_tipo:"molto-consigliato",coords:{lat:44.7967,lng:13.9108}},{id:"vodnjan",nome:"Dignano (Vodnjan) — murales e mummie",area:"Istria",tipo:"cultura",categoria:"citta",categoriaLabel:"🎨 Murales e mummie",descrizione:"Cittadina di vicoli stretti nota per due cose molto diverse: i grandi murales contemporanei dipinti sulle facciate durante i festival di street art, e le mummie conservate nella chiesa di San Biagio, che ha il campanile più alto dell'Istria. Dietro una tenda rossa dietro l'altare, tre corpi di santi rimasti integri. A ~30 min d'auto da Rovigno.",bambini:!0,bambini_nota:"La caccia ai murales per le vie è un gioco perfetto per 8 e 6 anni. Le mummie possono impressionare: valutare se farle vedere ai più piccoli. Ingresso alla chiesa a pagamento.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:44.9607,lng:13.8477}},{id:"pazin-castello-foiba",nome:"Pisino (Pazin) — castello e foiba",area:"Istria",tipo:"cultura",categoria:"museo",categoriaLabel:"🏰 Castello e abisso",descrizione:"Il capoluogo dell'Istria interna ha un castello altomedievale che ospita il Museo etnografico istriano, con costumi e la ricostruzione di una cucina col focolare. Il castello strapiomba sulla gola della Foiba, un abisso che ispirò Dante e che Jules Verne usò per il salto del suo Mattia Sandorf; d'estate c'è una zipline di 220 m sopra il baratro. A ~45 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Castello e voragine sono spettacolari per l'8enne; la zipline ha limiti di età e peso, da verificare sul posto. Il sentiero nella gola è ripido e non fattibile col passeggino.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:45.2402,lng:13.9304}},{id:"motovun",nome:"Montona (Motovun)",area:"Istria",tipo:"cultura",categoria:"panorama",categoriaLabel:"🌄 Borgo sul colle",descrizione:"Il più celebre dei borghi collinari istriani, un grumo di case medievali su un cocuzzolo boscoso sopra la valle del Mirna, tra grano e vigneti. Dalla piazza si accede al camminamento tra le due cinte murarie, con una vista memorabile sulla campagna. A ~50 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Si parcheggia in basso e si sale a piedi ~20 min in salita: pesante col 2enne, meglio lo zaino. La guida avverte che i ristoranti di Motovun sono da gourmet e poco adatti ai bambini; alternativa la pizzeria di Karojba, 7 km a sud, con parco giochi.",impegno:"mezza-giornata",nota_tipo:"opzionale",coords:{lat:45.3367,lng:13.8283}},{id:"bale",nome:"Valle (Bale)",area:"Istria",tipo:"cultura",categoria:"borgo",categoriaLabel:"🏘️ Borgo su colle",descrizione:"Borgo su un poggio con le case disposte in cerchio difensivo, vivace e con popolazione mista croata e italiana, a differenza di tanti paesi dell'interno spopolati. Il pezzo forte è il palazzo Soardo-Bembo, gotico-veneziano del Quattrocento, accanto al quale un arco col leone di San Marco introduce al vicolo circolare del centro. A soli 20 min d'auto da Rovigno.",bambini:!1,bambini_nota:"Visita breve e tranquilla, ma poco da fare per i bambini: il giro dell'anello di vicoli dura mezz'ora e regge finché non si annoiano. Meglio abbinarla a una tappa più movimentata.",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:45.0406,lng:13.7863}},{id:"parco-sculture-dzamonja",nome:"Parco delle sculture Dušan Džamonja",area:"Istria",tipo:"cultura",categoria:"parco",categoriaLabel:"🗿 Sculture all'aperto",descrizione:"Prato-museo poco a nord di Orsera, accanto alla villa dove lo scultore Dušan Džamonja (1928–2009) passava le estati, con una grande esposizione permanente delle sue opere astratte: uova di alluminio lucido e blocchi di acciaio brunito. Ingresso libero e visita rapida, facile da abbinare a Orsera. A ~30 min d'auto da Rovigno.",bambini:!0,bambini_nota:"Prato aperto dove i bambini possono correre e girare intorno alle sculture; gratis e senza code, ma l'interesse dura poco: mezz'ora scarsa.",impegno:"sosta-breve",nota_tipo:"solo-se-c-e-tempo",coords:{lat:45.1598,lng:13.6106}},{id:"sagra-sardine-fazana",nome:"Sagra delle sardine di Fasana",area:"Istria",tipo:"cultura",categoria:"attivita",categoriaLabel:"🎉 Sagra",descrizione:"Fažana è in parte villaggio di vacanza e in parte porto peschereccio attivo, famoso per le sardine. Ad agosto si tiene la Sagra delle Sardine, con interi banchi di pesce grigliati sul lungomare. A ~35 min da Rovigno: si abbina alla giornata alle Brijuni, di cui Fažana è il porto d'imbarco. ⚠️ La guida non dà la data esatta: da confermare con l'ufficio turistico, la finestra 15-17/8 è stretta.",bambini:!0,bambini_nota:"Festa di paese sul lungomare, all'aperto e senza biglietto: si entra e si esce quando si vuole, gestibile anche col bimbo di 2 anni. Molta folla e griglie accese: tenere d'occhio il piccolo.",impegno:"sosta-breve",nota_tipo:"solo-se-c-e-tempo",coords:{lat:44.9268,lng:13.8029}},{id:"trieste-centro",nome:"Trieste — Piazza Unità d'Italia",area:"Trieste",tipo:"cultura",categoria:"citta",categoriaLabel:"🏛️ Città storica",descrizione:"La piazza affacciata sul mare più grande d'Europa, cuore della Trieste asburgica, tra caffè storici e palazzi liberty. Alla base della tappa.",bambini:!0,bambini_nota:"Spazi ampi e pedonali; gelato e passeggiata sul molo Audace",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:45.6501,lng:13.7677}},{id:"miramare",nome:"Castello di Miramare",area:"Trieste",tipo:"cultura",categoria:"citta",categoriaLabel:"🏰 Castello / Parco",descrizione:"Il castello bianco di Massimiliano d'Asburgo a picco sul golfo, con un grande parco affacciato sul mare. A ~15 min dal centro di Trieste.",bambini:!0,bambini_nota:"Ottimo — parco enorme per correre e vista mare; interni brevi",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.7025,lng:13.7125}},{id:"grotta-gigante",nome:"Grotta Gigante",area:"Trieste",tipo:"natura",categoria:"natura",categoriaLabel:"🕳️ Grotta",descrizione:"Enorme caverna del Carso triestino, tra le più grandi visitabili al mondo. Visita guidata con scalinata tra stalattiti e stalagmiti. A ~20 min da Trieste.",bambini:!0,bambini_nota:"Adatto ai più grandi — tante scale ma spettacolo assicurato; fresco d'estate",impegno:"sosta-breve",nota_tipo:"opzionale",coords:{lat:45.7099,lng:13.7646}},{id:"aquileia",nome:"Aquileia — Basilica e Area Romana",area:"Collio / Friuli",tipo:"cultura",categoria:"citta",categoriaLabel:"🏛️ Sito UNESCO",descrizione:"Antica città romana patrimonio UNESCO: basilica con il grande pavimento a mosaico paleocristiano, foro e scavi. A ~35 min da Capriva del Friuli.",bambini:!0,bambini_nota:"Adatto — mosaici enormi da percorrere su passerelle e aree archeologiche all'aperto",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:45.7696,lng:13.3709}},{id:"dobbiaco",nome:"Lago di Dobbiaco",area:"Sesto / Alta Pusteria",tipo:"natura",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:"Lago alpino in fondo alla Val Pusteria, a pochi km da Sesto. Raggiungibile a piedi o in bici sulla pista ciclabile. Acque verdissime, Dolomiti come sfondo.",bambini:!0,bambini_nota:"Perfetto — pista ciclabile pianeggiante, riva accessibile, area pic-nic",impegno:"sosta-breve",nota_tipo:"molto-consigliato",coords:{lat:46.7358,lng:12.2214}},{id:"braies",nome:"Lago di Braies",area:"Sesto / Alta Pusteria",tipo:"natura",categoria:"lago",categoriaLabel:"🏔️ Lago alpino",descrizione:'Il "lago delle fiabe" delle Dolomiti: acque verde-smeraldo, barche a remi e sentiero attorno al lago (3 km). Molto affollato in agosto — meglio la mattina presto. A ~45 min da Sesto.',bambini:!0,bambini_nota:"Adatto — sentiero pianeggiante attorno al lago, barche a noleggio",impegno:"mezza-giornata",nota_tipo:"molto-consigliato",coords:{lat:46.6948,lng:12.0853}}],ot={"zlatni-rat":"Il Corno d'Oro non sta mai fermo: la lingua di ghiaia a forma di dente di squalo cambia forma ogni anno, plasmata dai venti stagionali.","skrip-museo-brac":"Škrip è il posto abitato senza interruzioni più antico di Brač, fondato dagli Illiri. Fuori dal museo c'è un mausoleo romano che secondo la leggenda locale custodisce la moglie o la figlia dell'imperatore Diocleziano.",milna:"Dietro la loggia ottocentesca c'è una vecchia casa cadente chiamata Anglešćina: un mito locale la lega a un crociato inglese.","supetar-cimitero-petrinovic":"Il mausoleo più grandioso fu voluto da Francisco Petrinović, nato a Supetar e diventato magnate navale in Cile. Ironia: l'incarico non andò a Ivan Rendić, lo scultore locale che firmò quasi tutte le altre tombe.","zara-centro":"Alfred Hitchcock passò qui una vacanza nel 1964 e restò talmente colpito da definire il tramonto di Zara il più bello del mondo. Sul lungomare un cartellone lo ricorda ancora.",nin:"La chiesetta bianca della Santa Croce è la chiesa più antica di tutta la Croazia: sull'architrave un'iscrizione cita il conte Godečaj e risale all'anno 800. Nin fu la residenza dei primi re croati.",paklenica:"Risalendo la gola di Velika Paklenica, dopo una ventina di minuti si passa davanti a gallerie sotterranee: le fece scavare l'esercito jugoslavo come rifugio antiatomico per i dirigenti dello Stato.","parco-naturale-telascica":"Il lago di Jezero Mir è separato dal mare solo da una barriera di roccia: la sua acqua salatissima d'estate è di parecchi gradi più calda del mare. Sulla barriera i visitatori costruiscono torri e piramidi di sassi.","barkajol-zara":"Il mezzo pubblico più bello di Zara è una barca a remi: il barkajol traghetta la gente da una sponda all'altra ed è un servizio di linea a tutti gli effetti.","campanile-santa-anastasia-zara":"Il modello non è originale: Jackson lo ricopiò quasi identico dal campanile della cattedrale di Rab.","museo-vetro-antico-zara":"La sala più spettacolare è piena di urne cinerarie romane in vetro: sono saltate fuori scavando le fondamenta di un centro commerciale, dall'altra parte del porto.","sali-dugi-otok":"La tovareća muzika si chiama «musica dell'asino» perché i suonatori strombazzano nei corni fino a produrre un raglio collettivo perfettamente stonato.","isole-kornati":"Queste isole bianche e spoglie erano coperte di foreste: furono bruciate per fare pascolo alle pecore, che poi si mangiarono tutto il resto. I muretti a secco che le recintavano ci sono ancora, le pecore quasi più.","isola-silba":"Il nome viene probabilmente dal latino silva, bosco: l'isola è ancora coperta di querce.",kuterevo:"Il rifugio nato nel 2002 accoglie orsetti orfani o malati che non sopravvivrebbero nel bosco: una volta abituati all'uomo non possono più tornare liberi, e da un recinto-asilo passano a grandi aree sulla collina dietro.","plitvice-laghi":"I sedici laghi non sono stati scavati ma costruiti dall'acqua: il fiume trasporta travertino, calcare che si deposita a valle formando barriere. In migliaia di anni quelle dighe naturali hanno creato la scala di laghi.","senj-nehaj":"Nehaj significa 'non temere'. La fortezza fu tirata su nel 1558 dal comandante uscocco Ivan Lenković, che per avere le pietre fece demolire tutte le chiese e i conventi fuori dalle mura.","rastoke-slunj":"Le case di Rastoke hanno il piano basso in pietra e quello alto in legno, coi ponticelli sui torrenti: si vedono ancora il mulino da farina e quello che serviva a lavare i tappeti.","kuca-velebita-krasno":"Krasno vive di boschi da sempre: nel Museo della Silvicoltura si scopre che prima della guerra i boscaioli abbattevano gli alberi a mano col segone e portavano i tronchi fino al mare a dorso di cavallo.","grotte-barac":"Tra le attrazioni che la guida mostra c'è anche una montagnetta di guano di pipistrello vecchia trecento anni.","rovinj-centro":"Il centro storico era un'isola: il braccio di mare che lo separava dalla terraferma fu riempito a metà Settecento. Guardate i tetti — le case hanno tanti camini sottili perché ogni figlio sposato restava in casa dei genitori col proprio focolare.","lim-fjord":"Lim viene dal latino limes, confine: in epoca romana divideva il territorio di Pola da quello di Parenzo. Poi divenne un covo di pirati, e la leggenda dice che il capitano Morgan si fermò qui e fondò il villaggio di Mrgani.",brijuni:"Tito teneva sull'isola un pappagallo di nome Koki: è ancora lì e continua a ripetere le frasi imparate dal maresciallo. Nel safari park vivono zebre e antilopi, regali dei capi di Stato in visita.","pula-arena":"Nel Cinquecento i veneziani volevano smontare l'anfiteatro pezzo per pezzo e rimontarlo a Venezia. Li fermò il patrizio polese Gabriele Emo, ricordato da una lapide su una delle torri superstiti.",porec:"Il vescovo Eufrasio, che fece i mosaici nel 535, aveva fama di essere vanitosissimo: si fece ritrarre mentre regge il modellino della chiesa e sparse il proprio monogramma su tutta la decorazione.","jama-baredine":"Nelle vasche della grotta vivono alcuni proteo, salamandre bianche e cieche tipiche del carso croato e sloveno, che sembrano vermi pallidi con le zampe. La guida racconta anche la leggenda di Gabriel e Milka, due innamorati del Duecento che si persero qui dentro.",dvigrad:"Gli abitanti non sparirono nel nulla: se ne andarono e nel Seicento fondarono Kanfanar, il paese lì accanto.",svetvincenat:"Secondo la leggenda del paese, la vera colpa della donna bruciata come strega nel 1632 era una storia d'amore con uno dei Grimani.",vodnjan:"I corpi santi arrivarono da Venezia nel 1818: la credenza popolare lega il fatto che non si siano decomposti ai loro poteri di guaritori.",motovun:"Svuotata dopo il 1945, quando quasi tutti gli abitanti italiani partirono, Motovun fu ripopolata come colonia di artisti. Qui nel 1940 era nato il futuro campione automobilistico Mario Andretti.","pazin-castello-foiba":"Jules Verne ci fece cadere il suo Mattia Sandorf senza aver mai visto Pisino: si accontentò delle fotografie che gli spedì il sindaco."},nt={Brač:["Prima del turismo Brač viveva della sua pietra, un misto lattiginoso di marmo e calcare: è finita nel Reichstag di Berlino, nella Casa Bianca a Washington e nel Palazzo di Diocleziano a Spalato.","Brač è un'isola di pecore: la cucina tradizionale gira attorno all'agnello e al montone. Nell'entroterra si vedono enormi cumuli di pietre bianche, accumulati in secoli dai contadini che ripulivano un pezzo di terra per coltivare.","Se sentite dire fjaka, non è una parolaccia: in dialetto dalmata è l'arte di poltrire nel pomeriggio senza fare nulla, ed è considerata una cosa seria.","Ivan Rendić (1849-1932), cresciuto a Supetar, fu il primo grande scultore accademico croato: fece un busto del primo ministro britannico Gladstone e ricevette in cambio una lettera di ringraziamento intestata 10 Downing Street."],"Area di Zara":["Per secoli Zadar si chiamò Zara ed era una città di lingua italiana sotto Venezia. La sua università, fondata dai domenicani nel 1396, si dichiara la più antica della Croazia.","Nella chiesa di San Simeone la regina Elisabetta d'Ungheria volle a tal punto un pezzo del santo che ne staccò un dito e lo nascose in seno: si dice che marcì subito e si riprese solo una volta restituito. Il reliquiario d'argento fu la sua penitenza.","Il piatto da provare almeno una volta è l'ispod peke: carne cotta lentamente sotto un coperchio di metallo ricoperto di braci. Richiede ore, quindi va ordinato in anticipo.","In Dalmazia i bambini chiamano gli uomini adulti barba (zio, dal gergo italiano) e i signori rispettabili sjor, dal signore veneziano. Il resto della Croazia prende in giro i dalmati chiamandoli tovari, asini, per la loro lentezza."],"Velebit / Lika":["Gli Uscocchi di Senj erano profughi della Bosnia ottomana diventati soldati: pagati male dagli Asburgo, si diedero alla pirateria con barche a remi di 15 metri. I veneziani, esasperati, misero in giro la voce che mangiassero il cuore crudo dei nemici.","La bura è un vento gelido da nord-est incanalato tra le montagne: si dice che stia arrivando quando sul Velebit si forma una striscia di nuvola bianca. Nei giorni peggiori ribalta le auto e fa chiudere il ponte per Krk.","Il sentiero Premužić attraversa il Velebit per 57 km: lo tracciò negli anni Trenta Ante Premužić con un'ossessione — pendenze così dolci da camminare quasi in piano anche in mezzo alle rocce.","Nei boschi sopra i laghi di Plitvice vivono orsi, lupi e cinghiali; nei laghi turchesi nuotano pesci e bisce d'acqua, e sulle rive più tranquille a nord si vedono gli aironi."],Istria:["La caccia al tartufo comincia a fine settembre: cani addestrati e padroni spariscono nella nebbia istriana a fiutare il fungo. A Buzet, alla Buzetska Subotina, si festeggia friggendo in piazza una frittata al tartufo gigantesca.","La bevanda istriana da provare almeno una volta è la supa: vino rosso caldo con zucchero, olio d'oliva e pepe, servito in una brocca di terracotta con una fetta di pane tostato da inzuppare.","Il primo vampiro documentato d'Europa era istriano: Jure Grando, del villaggio di Kringa, che nel 1672 usciva ogni notte dalla tomba. La storia fu messa per iscritto dal geografo Valvasor, che andò a intervistare i compaesani.","Sotto Mussolini in Istria il croato fu bandito dalla vita pubblica e i cognomi slavi tradotti in italiano. Oggi i cartelli stradali sono bilingui e Rovigno ha ancora un liceo italiano."]},rt={"zlatni-rat":"Zlatni rat, Bol","vidova-gora":"Vidova gora, Brač","lovrecina-bay":"Plaža Lovrečina, Postira","supetar-spiaggia":"Plaža Banj, Supetar","skrip-museo-brac":"Muzej otoka Brača, Škrip",pucisca:"Pučišća, Brač","bol-monastero-domenicano":"Dominikanski samostan Bol",povlja:"Povlja, Brač",milna:"Milna, Brač","eremo-blaca":"Pustinja Blaca, Brač","supetar-cimitero-petrinovic":"Mauzolej Petrinović, Supetar","big-blue-bol":"Big Blue Sport, Bol","cinema-estivo-supetar":"Ljetno kino Supetar","diving-supetar":"Fun Dive Club, Supetar","zara-centro":"Morske orgulje, Zadar",nin:"Nin, Hrvatska","vransko-lake":"Park prirode Vransko jezero",paklenica:"Nacionalni park Paklenica, Starigrad","museo-illusioni-zara":"Muzej iluzija Zadar","parco-naturale-telascica":"Park prirode Telašćica","spiaggia-borik-puntamika":"Plaža Borik, Zadar","spiaggia-saharun-dugi-otok":"Plaža Sakarun, Dugi otok","mercato-zara":"Gradska tržnica Zadar","barkajol-zara":"Barkajoli, Liburnska obala, Zadar","campanile-santa-anastasia-zara":"Katedrala svete Stošije, Zadar","museo-vetro-antico-zara":"Muzej antičkog stakla, Zadar","sali-dugi-otok":"Sali, Dugi otok","isole-kornati":"Nacionalni park Kornati","isola-silba":"Silba, Hrvatska","kraljicina-plaza-nin":"Kraljičina plaža, Nin","solana-nin-saline":"Solana Nin","rafting-zrmanja":"Kaštel Žegarski, Zrmanja",kuterevo:"Utočište za mlade medvjede Kuterevo",gacka:"Izvor Gacke, Otočac","plitvice-laghi":"Nacionalni park Plitvička jezera Ulaz 1","senj-nehaj":"Tvrđava Nehaj, Senj","rastoke-slunj":"Rastoke, Slunj","kuca-velebita-krasno":"Kuća Velebita, Krasno","grotte-barac":"Baraćeve špilje, Rakovica","zavratnica-jablanac":"Uvala Zavratnica, Jablanac","rovinj-centro":"Crkva svete Eufemije, Rovinj","lim-fjord":"Limski kanal",brijuni:"Nacionalni park Brijuni, Fažana","aquarium-rovinj":"Akvarij Rovinj","dinopark-funtana":"Dinopark Funtana",istralandia:"Aquapark Istralandia, Brtonigla","pula-arena":"Pulska Arena",porec:"Eufrazijeva bazilika, Poreč","zlatni-rt-punta-corrente":"Park šuma Zlatni rt, Rovinj","crveni-otok-isola-rossa":"Crveni otok, Rovinj","jama-baredine":"Jama Baredine, Nova Vas",dvigrad:"Dvigrad, Kanfanar",vrsar:"Vrsar, Istra",svetvincenat:"Kaštel Grimani, Svetvinčenat","cape-kamenjak":"Park Kamenjak, Premantura",vodnjan:"Crkva svetog Blaža, Vodnjan","pazin-castello-foiba":"Kaštel Pazin",motovun:"Motovun, Istra",bale:"Bale, Istra","parco-sculture-dzamonja":"Park skulptura Dušan Džamonja, Vrsar","sagra-sardine-fazana":"Fažana, Istra","trieste-centro":"Piazza Unità d'Italia, Trieste",miramare:"Castello di Miramare, Trieste","grotta-gigante":"Grotta Gigante, Sgonico",aquileia:"Basilica di Aquileia",dobbiaco:"Lago di Dobbiaco",braies:"Lago di Braies"},st={"sosta-breve":{label:"Sosta breve",icon:"⚡",cls:"impegno-breve"},"mezza-giornata":{label:"Mezza giornata",icon:"🕐",cls:"impegno-mezza"},"giornata-piena":{label:"Giornata piena",icon:"📅",cls:"impegno-piena"}},lt={"molto-consigliato":{label:"⭐ Molto consigliato",cls:"nota-top"},opzionale:{label:"✔ Opzionale",cls:"nota-ok"},"solo-se-c-e-tempo":{label:"⏱ Solo se c'è tempo",cls:"nota-ifpos"}},ct={natura:{label:"🌿 Natura",cls:"tipo-natura"},cultura:{label:"🏛️ Cultura",cls:"tipo-cultura"}};async function dt(){var n,s;const a=document.getElementById("page-content"),e=[...new Set(C.map(r=>r.area))];let i="tutte",t="tutti";a.innerHTML=`
    <div class="page-header">
      <h1>🌿 Natura & Cultura</h1>
      <p>Suggerimenti in linea con l'itinerario — a max ~1 ora in auto o traghetto dalla base della tappa, compatibili con 3 bambini.</p>
    </div>

    <div class="natura-filters" id="natura-tipo-filters" style="margin-bottom:0.5rem;">
      <button class="natura-filter-btn active" data-tipo="tutti">Tutti (${C.length})</button>
      <button class="natura-filter-btn" data-tipo="natura">🌿 Natura (${C.filter(r=>r.tipo==="natura").length})</button>
      <button class="natura-filter-btn" data-tipo="cultura">🏛️ Cultura (${C.filter(r=>r.tipo==="cultura").length})</button>
    </div>

    <div class="natura-filters" id="natura-filters">
      <button class="natura-filter-btn active" data-area="tutte">Tutte le tappe</button>
      ${e.map(r=>`
        <button class="natura-filter-btn" data-area="${r}">
          ${r} (${C.filter(l=>l.area===r).length})
        </button>
      `).join("")}
    </div>

    <div id="natura-pillole-area">${Ra(i)}</div>

    <div class="natura-grid" id="natura-grid">
      ${C.map(Na).join("")}
    </div>
  `;function o(){const r=document.getElementById("natura-pillole-area");r&&(r.innerHTML=Ra(i));const l=document.getElementById("natura-grid");if(!l)return;const c=C.filter(d=>(i==="tutte"||d.area===i)&&(t==="tutti"||d.tipo===t));l.innerHTML=c.length?c.map(Na).join(""):'<p style="color:var(--color-text-muted);padding:1rem;">Nessun suggerimento per questa combinazione di filtri.</p>',Va()}(n=document.getElementById("natura-tipo-filters"))==null||n.addEventListener("click",r=>{const l=r.target.closest(".natura-filter-btn");l&&(t=l.dataset.tipo,document.querySelectorAll("#natura-tipo-filters .natura-filter-btn").forEach(c=>c.classList.remove("active")),l.classList.add("active"),o())}),(s=document.getElementById("natura-filters"))==null||s.addEventListener("click",r=>{const l=r.target.closest(".natura-filter-btn");l&&(i=l.dataset.area,document.querySelectorAll("#natura-filters .natura-filter-btn").forEach(c=>c.classList.remove("active")),l.classList.add("active"),o())}),Va()}function Ra(a){const e=nt[a];return e!=null&&e.length?`
    <div class="natura-pillole-box">
      <div class="natura-pillole-title">💡 Pillole — ${ka(a)}</div>
      <ul class="natura-pillole-list">
        ${e.map(i=>`<li>${i}</li>`).join("")}
      </ul>
    </div>
  `:""}function Na(a){const e=st[a.impegno]||{label:a.impegno,icon:"🕐",cls:""},i=lt[a.nota_tipo]||{label:a.nota_tipo,cls:""},t=ct[a.tipo]||null,o=rt[a.id]||a.nome,n=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o)}`,s=ot[a.id];return`
    <div class="natura-card ${i.cls}" data-id="${a.id}">
      <div class="natura-card-top">
        <div>
          <div class="natura-nome">${a.nome}</div>
          <div class="natura-area">📍 ${a.area}</div>
        </div>
        <span class="natura-nota-badge ${i.cls}">${i.label}</span>
      </div>

      <div class="natura-badges">
        ${t?`<span class="natura-badge ${t.cls}">${t.label}</span>`:""}
        <span class="natura-badge natura-cat">${a.categoriaLabel}</span>
        <span class="natura-badge ${e.cls}">${e.icon} ${e.label}</span>
        <span class="natura-badge ${a.bambini?"natura-kid-ok":"natura-kid-no"}">
          ${a.bambini?"👶 Kids ✓":"👶 Kids ≠"}
        </span>
      </div>

      <p class="natura-desc">${a.descrizione}</p>

      ${a.bambini_nota?`
        <div class="natura-kids-note">
          <span style="font-size:0.9rem;">👶</span>
          <span>${a.bambini_nota}</span>
        </div>
      `:""}

      ${s?`
        <div class="natura-pillola">
          <span style="font-size:0.9rem;">💡</span>
          <span><strong>Lo sapevi?</strong> ${s}</span>
        </div>
      `:""}

      <div class="natura-actions">
        <a href="${x(o)}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🚗 Naviga
        </a>
        <a href="${n}" target="_blank" rel="noopener" class="btn btn-outline natura-maps-btn">
          🗺️ Apri in Maps
        </a>
        <button class="btn btn-outline natura-add-idea-btn"
          data-nome="${ka(a.nome)}"
          data-area="${ka(a.area)}"
          data-lat="${a.coords.lat}"
          data-lng="${a.coords.lng}">
          💡 Aggiungi alle Idee
        </button>
      </div>
    </div>
  `}function Va(){document.querySelectorAll(".natura-add-idea-btn").forEach(a=>{a.addEventListener("click",()=>{const e=a.dataset.nome,i=a.dataset.area,t=parseFloat(a.dataset.lat),o=parseFloat(a.dataset.lng);la({text:e,location_name:i,categoria:"escursione",stato:"da-verificare",add_to_map:!0,coordinates:{lat:t,lng:o},marker_color:"#10b981"}),a.textContent="✅ Aggiunta!",a.disabled=!0,setTimeout(()=>{a.textContent="💡 Aggiungi alle Idee",a.disabled=!1},2e3)})})}function ka(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ha={high:{label:"Da non dimenticare",cls:"logi-prio-high"},medium:{label:"Importante",cls:"logi-prio-medium"},low:{label:"Promemoria",cls:"logi-prio-low"}},ea="guida-viaggio";async function ut(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(n){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${n.message}</p></div>`;return}const i=e.logistics||[],t=e.bookings||[],o=e.days||[];a.innerHTML=`
    <div class="page-header">
      <h1>📋 Note Logistiche</h1>
      <p>Avvisi e promemoria pratici per organizzare gli spostamenti e le giornate chiave.</p>
    </div>

    ${mt(o,t)}

    <div id="ferry-box">${ke(e.ferries)}</div>

    <div id="guide-section">${fe(e.guide)}</div>

    ${i.length===0?'<p style="color:var(--color-text-muted);">Nessuna nota logistica.</p>':`<div class="logi-list">${i.map(kt).join("")}</div>`}
  `,ft(t),pt(e.guide),yt(e.ferries)}function fe(a){const e=R(ea),i='<input type="file" id="guide-file" accept="application/pdf,.pdf,.epub" hidden />',t=a!=null&&a.url?`
    <a class="guide-card" href="${b(a.url)}" target="_blank" rel="noopener">
      <div class="guide-card-main">
        <span class="guide-name">☁️ ${b(a.title||"Guida di viaggio")}</span>
        <span class="guide-size">${b(a.note||"Apri dal cloud — serve la rete")}</span>
      </div>
      <span class="guide-open-hint">📖 Apri →</span>
    </a>
  `:"",o=e?`
    <div class="guide-card">
      <div class="guide-card-main">
        <span class="guide-name">${ne(e)} ${b(e.name)}</span>
        <span class="guide-size">${gt(e.size)} · su questo dispositivo, anche offline</span>
      </div>
      <div class="guide-card-actions">
        <button class="btn btn-primary" id="guide-open">📖 Apri</button>
        <button class="btn btn-outline" id="guide-del">Rimuovi</button>
      </div>
    </div>
  `:`
    <p class="guide-hint">
      ${t?"Per averla anche <strong>senza rete</strong> — utile in viaggio, senza scaricare 65 MB in roaming — puoi tenerne una copia su questo dispositivo.":"Carica il PDF della guida per aprirlo dalla webapp, anche <strong>offline</strong>. Resta su questo dispositivo: non viene caricato online."}
    </p>
    <button class="btn btn-outline" id="guide-add">📎 Tieni una copia offline</button>
  `;return`
    <div class="guide-section">
      <div class="section-title">📚 Guida di viaggio</div>
      ${t}
      ${o}
    </div>
    ${i}
  `}function pt(a){const e=document.getElementById("guide-section");if(!e)return;e.addEventListener("click",o=>{var n;if(o.target.closest("#guide-add")){(n=document.getElementById("guide-file"))==null||n.click();return}if(o.target.closest("#guide-open")){ye(ea);return}o.target.closest("#guide-del")&&confirm("Rimuovere la guida da questo dispositivo?")&&ta(ea)}),e.addEventListener("change",o=>{var r;const n=o.target.closest("#guide-file");if(!((r=n==null?void 0:n.files)!=null&&r.length))return;const s=n.files[0];ia(ea,s).catch(l=>{console.error("[guida]",l),alert("Impossibile salvare la guida su questo dispositivo: il file è grande e lo spazio del browser potrebbe non bastare.")}),n.value=""});const i=()=>{e.innerHTML=fe(a)};window.addEventListener("attachments:updated",i);const t=window.__currentPageCleanup;window.__currentPageCleanup=()=>{t==null||t(),window.removeEventListener("attachments:updated",i)}}function gt(a){if(a==null)return"";if(a===0)return"file vuoto (0 byte)";const e=a/(1024*1024);return e>=1?`${e.toFixed(1)} MB`:`${Math.round(a/1024)} kB`}function mt(a,e){const i=a.map(t=>`<option value="${t.date}">${f(t.date)} · ${b(t.location||t.title||"")}</option>`).join("");return`
    <div class="booking-section">
      <div class="section-title">🍽️ Prenotazioni</div>
      <p style="font-size:0.82rem;color:var(--color-text-muted);margin:-0.25rem 0 0.75rem;">
        Ristoranti, esperienze e tavoli prenotati. Ogni prenotazione ha il link diretto a Google Maps.
        Aggiungine una nuova e resta salvata su questo dispositivo.
      </p>

      <div id="bookings-list">${he(e)}</div>

      <button class="btn btn-outline" id="booking-add-toggle" style="margin-top:0.75rem;">
        ➕ Aggiungi prenotazione
      </button>

      <form class="booking-form hidden" id="booking-form">
        <input type="text" class="booking-place idea-input" placeholder="Nome del locale / attività *" />
        <div class="booking-form-row">
          <select class="booking-date idea-input">
            <option value="">— Giorno —</option>
            ${i}
          </select>
          <input type="text" class="booking-time idea-input" placeholder="Orario (es. 19:00)" />
        </div>
        <input type="text" class="booking-loc idea-input" placeholder="Indirizzo, città o link Google Maps" />
        <input type="text" class="booking-note idea-input" placeholder="Nota (opzionale — es. tavolo per 5)" />
        <label class="booking-file-label">
          📎 Allega conferma <span>(.eml, .pdf o foto — opzionale)</span>
          <input type="file" class="booking-file" accept=".eml,message/rfc822,application/pdf,image/*" />
        </label>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit" class="btn btn-primary" style="font-size:0.85rem;">Salva prenotazione</button>
          <button type="button" class="btn btn-outline" id="booking-cancel" style="font-size:0.85rem;">Annulla</button>
        </div>
      </form>
    </div>
  `}function he(a){const e=[...a.map(i=>({...i,_fixed:!0})),...da().map(i=>({...i,_fixed:!1}))].sort((i,t)=>Ga(i).localeCompare(Ga(t)));return e.length===0?'<p class="booking-empty">Nessuna prenotazione ancora. Aggiungi la prima qui sotto.</p>':`<div class="booking-list">${e.map(vt).join("")}</div>`}function vt(a){const e=ee(a),i=[a.date?f(a.date):"",a.time].filter(Boolean).join(" · ");return`
    <div class="booking-card" data-id="${b(a.id)}">
      <div class="booking-card-main">
        <div class="booking-card-head">
          <span class="booking-card-place">${b(a.place)}</span>
          ${a._fixed?'<span class="booking-badge">confermata</span>':""}
        </div>
        ${i?`<div class="booking-card-when">📅 ${b(i)}</div>`:""}
        ${a.note?`<div class="booking-card-note">${b(a.note)}</div>`:""}
        <div class="booking-card-actions">
          ${e?`<a class="booking-card-maps" href="${b(e)}" target="_blank" rel="noopener">🗺️ Apri in Google Maps</a>`:""}
          ${bt(a.id)}
        </div>
      </div>
      ${a._fixed?"":`<button class="booking-card-del" data-id="${b(a.id)}" title="Elimina prenotazione">×</button>`}
    </div>
  `}function bt(a){const e=R(a),i=`<input type="file" class="booking-attach-input" data-id="${b(a)}"
      accept=".eml,message/rfc822,application/pdf,image/*" hidden />`;return e?`
      <span class="booking-attach">
        <button class="booking-attach-open" data-id="${b(a)}" title="Apri allegato">
          ${ne(e)} ${b(e.name)}
        </button>
        <button class="booking-attach-del" data-id="${b(a)}" title="Rimuovi allegato">×</button>
        ${i}
      </span>
    `:`
    <button class="booking-attach-add" data-id="${b(a)}">📎 Allega file</button>
    ${i}
  `}function Ga(a){const e=a.date||"9999-12-31",i=String(Z(a.time)).padStart(5,"0");return`${e} ${i}`}function ft(a){var n,s;const e=document.querySelector(".booking-section");if(!e)return;const i=e.querySelector("#booking-form"),t=e.querySelector("#bookings-list");(n=e.querySelector("#booking-add-toggle"))==null||n.addEventListener("click",()=>{var r;i.classList.toggle("hidden"),i.classList.contains("hidden")||(r=i.querySelector(".booking-place"))==null||r.focus()}),(s=e.querySelector("#booking-cancel"))==null||s.addEventListener("click",()=>{i.classList.add("hidden")}),t==null||t.addEventListener("click",r=>{var p;const l=r.target.closest(".booking-card-del");if(l){confirm("Eliminare questa prenotazione?")&&ta(l.dataset.id).finally(()=>Ye(l.dataset.id));return}const c=r.target.closest(".booking-attach-add, .booking-attach");if(c&&r.target.closest(".booking-attach-add")){(p=c.parentElement.querySelector(".booking-attach-input"))==null||p.click();return}const d=r.target.closest(".booking-attach-open");if(d){ye(d.dataset.id);return}const u=r.target.closest(".booking-attach-del");if(u){confirm("Rimuovere questo allegato?")&&ta(u.dataset.id);return}}),t==null||t.addEventListener("change",r=>{var d;const l=r.target.closest(".booking-attach-input");if(!l||!((d=l.files)!=null&&d.length))return;const c=l.dataset.id;ia(c,l.files[0]).catch(u=>{console.error("[attachments]",u),alert("Impossibile salvare l’allegato su questo dispositivo.")}),l.value=""}),i==null||i.addEventListener("submit",r=>{var v,_;r.preventDefault();const l=i.querySelector(".booking-place").value.trim();if(!l){i.querySelector(".booking-place").focus();return}const c=i.querySelector(".booking-loc").value.trim(),d=/^https?:\/\//i.test(c),u=We({place:l,date:i.querySelector(".booking-date").value||null,time:i.querySelector(".booking-time").value.trim(),address:d?"":c,maps_url:d?c:"",note:i.querySelector(".booking-note").value.trim()}),p=(_=(v=i.querySelector(".booking-file"))==null?void 0:v.files)==null?void 0:_[0];p&&ia(u.id,p).catch(L=>{console.error("[attachments]",L),alert("Prenotazione salvata, ma non è stato possibile allegare il file su questo dispositivo.")}),i.reset(),i.classList.add("hidden")});const o=()=>{t&&(t.innerHTML=he(a))};window.addEventListener("bookings:updated",o),window.addEventListener("attachments:updated",o),window.__currentPageCleanup=()=>{window.removeEventListener("bookings:updated",o),window.removeEventListener("attachments:updated",o)}}const ye=wa;function ke(a){return!a||!a.length?"":`
    <div class="ferry-section">
      <div class="section-title">🎫 Biglietti traghetti</div>
      <p style="font-size:0.82rem;color:var(--color-text-muted);margin:-0.25rem 0 0.75rem;">
        I biglietti contengono nomi e documenti, quindi non stanno online: vanno allegati
        qui una volta per dispositivo e restano solo su questo. In cambio si aprono
        <strong>anche senza rete</strong>, che al gate è esattamente quando serve.
      </p>
      <div class="ferry-list">
        ${a.map(e=>ht(e)).join("")}
      </div>
      <p class="ferry-warn">
        ⚠️ Tienili anche fuori dal browser (app File del telefono, o stampati): questo è un
        archivio del browser, comodo ma non è il posto dove avere l'unica copia del biglietto.
      </p>
    </div>
  `}function ht(a){const e=R(a.id),i=`
    <div class="ferry-route">
      <span class="ferry-from">${b(a.from)}</span>
      <span class="ferry-arrow">→</span>
      <span class="ferry-to">${b(a.to)}</span>
    </div>
    <div class="ferry-meta">📅 ${f(a.date)} · 🕐 ${b(a.time)}${a.note?` · ${b(a.note)}`:""}</div>
  `,t=`<input type="file" class="ferry-file" data-id="${b(a.id)}"
      accept="application/pdf,.pdf,image/*" hidden />`;return e?`
      <div class="ferry-card" data-id="${b(a.id)}">
        ${i}
        <div class="ferry-actions">
          <button class="ferry-open" data-act="open" data-id="${b(a.id)}">📄 Apri biglietto</button>
          <button class="ferry-del" data-act="del" data-id="${b(a.id)}" title="Rimuovi da questo dispositivo">×</button>
        </div>
        ${t}
      </div>
    `:`
    <div class="ferry-card ferry-card-empty" data-id="${b(a.id)}">
      ${i}
      <button class="ferry-attach" data-act="add" data-id="${b(a.id)}">📎 Allega il biglietto</button>
      ${t}
    </div>
  `}function yt(a){const e=document.getElementById("ferry-box");if(!e)return;e.addEventListener("click",o=>{var r;const n=o.target.closest("[data-act]");if(!n)return;const s=n.dataset.id;n.dataset.act==="add"?(r=e.querySelector(`.ferry-file[data-id="${CSS.escape(s)}"]`))==null||r.click():n.dataset.act==="open"?wa(s):n.dataset.act==="del"&&confirm("Rimuovere il biglietto da questo dispositivo?")&&ta(s)}),e.addEventListener("change",o=>{var s;const n=o.target.closest(".ferry-file");(s=n==null?void 0:n.files)!=null&&s.length&&(ia(n.dataset.id,n.files[0]).catch(r=>{console.error("[biglietti]",r),alert("Impossibile salvare il biglietto su questo dispositivo: "+((r==null?void 0:r.message)||""))}),n.value="")});const i=()=>{e.innerHTML=ke(a)};window.addEventListener("attachments:updated",i);const t=window.__currentPageCleanup;window.__currentPageCleanup=()=>{t==null||t(),window.removeEventListener("attachments:updated",i)}}function kt(a){const e=Ha[a.priority]||Ha.low;return`
    <div class="logi-card ${e.cls}">
      <div class="logi-card-head">
        <span class="logi-icon">${a.icon||"📌"}</span>
        <span class="logi-title">${a.title}</span>
        <span class="logi-badge">${e.label}</span>
      </div>
      <p class="logi-text">${a.text}</p>
    </div>
  `}function b(a){return String(a??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function $t(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(l){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${l.message}</p></div>`;return}const{days:i,dining:t}=e,o=e.hikes||[],n=new Date().toISOString().slice(0,10),s=i.find(l=>l.date===n)||i.find(l=>l.date>n)||i[i.length-1];a.innerHTML=`
    <div class="page-header">
      <h1>💡 Attività suggerite</h1>
      <p>Pianifica in anticipo: programma, ristoranti della zona e le tue idee per ogni tappa. Tocca un giorno per espanderlo.</p>
    </div>
    <div class="attivita-list" id="attivita-list">
      ${i.map(l=>Za(l,t,o,l===s)).join("")}
    </div>
  `,Ua();const r=()=>{const l=new Set([...document.querySelectorAll(".attivita-card.open")].map(c=>c.dataset.date));a.querySelector("#attivita-list").innerHTML=i.map(c=>Za(c,t,o,l.has(c.date))).join(""),Ua()};window.addEventListener("ideas:updated",r),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",r)}function Za(a,e,i,t){const o=Ya(a,e);return`
    <div class="attivita-card ${t?"open":""}" data-date="${a.date}">
      <button type="button" class="attivita-head" aria-expanded="${t?"true":"false"}">
        <div class="attivita-head-main">
          <span class="attivita-day">Gg. ${a.day}</span>
          <span class="attivita-loc">📍 ${a.location}</span>
          <span class="attivita-date">${f(a.date)}</span>
        </div>
        <div class="attivita-head-right">
          <span class="attivita-count" title="${o} suggerimenti">${o}</span>
          <span class="attivita-chevron">▾</span>
        </div>
      </button>
      <div class="attivita-body">
        ${Qa(a,e,i)}
        <a href="#ideas" class="attivita-add-idea">➕ Aggiungi un'idea per questo giorno</a>
      </div>
    </div>
  `}function Ua(){document.querySelectorAll(".attivita-card .attivita-head").forEach(a=>{a.addEventListener("click",()=>{const i=a.closest(".attivita-card").classList.toggle("open");a.setAttribute("aria-expanded",i?"true":"false")})})}let E=[],Aa=[],ga="tutte";const $e=a=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;async function zt(){const a=document.getElementById("page-content");let e;try{e=await S()}catch(t){a.innerHTML=`<div class="error-state"><div class="error-icon">⚠️</div><h2>Errore</h2><p>${t.message}</p></div>`;return}E=e.hikes||[],Aa=e.days.filter(t=>t.location.toLowerCase().includes("sesto")),ga="tutte",a.innerHTML=`
    <div class="page-header">
      <h1>🥾 Passeggiate, Rifugi &amp; Gite</h1>
      <p>Dolomiti di Sesto — base al Passo Monte Croce (Kreuzbergpass). Passeggiate, rifugi e gite in zona (anche in auto). Scegli le mete e aggiungile a un giorno: compariranno nelle <a href="#attivita">attività suggerite</a> di quella data.</p>
    </div>

    <div class="hike-filters" id="hike-filters">
      ${ze()}
    </div>

    <div class="hike-grid" id="hike-grid">
      ${Ee()}
    </div>
  `,_e(),Et();const i=()=>Se();window.addEventListener("ideas:updated",i),window.__currentPageCleanup=()=>window.removeEventListener("ideas:updated",i)}function ze(){return[{key:"tutte",label:`Tutte (${E.length})`},{key:"family",label:`👶 Adatte ai bimbi (${E.filter(e=>e.family).length})`},{key:"facili",label:`🟢 Facili (${E.filter(e=>/facile/i.test(e.difficulty)).length})`},{key:"auto",label:`🚗 In auto (${E.filter(e=>e.car).length})`},{key:"rifugi",label:`🏔️ Rifugi (${E.filter(e=>/rifugio/i.test(e.type)).length})`}].map(e=>`
    <button class="hike-filter-btn ${ga===e.key?"active":""}" data-f="${e.key}">${e.label}</button>
  `).join("")}function _t(){switch(ga){case"family":return E.filter(a=>a.family);case"facili":return E.filter(a=>/facile/i.test(a.difficulty));case"auto":return E.filter(a=>a.car);case"rifugi":return E.filter(a=>/rifugio/i.test(a.type));default:return E}}function _e(){var a;(a=document.getElementById("hike-filters"))==null||a.querySelectorAll(".hike-filter-btn").forEach(e=>{e.addEventListener("click",()=>{ga=e.dataset.f,document.getElementById("hike-filters").innerHTML=ze(),_e(),Se()})})}function Le(a){return z().filter(e=>e.hike_id===a&&e.day_date).map(e=>({id:e.id,day:Aa.find(i=>i.date===e.day_date)})).filter(e=>e.day)}function Lt(a){return/impegnativ/i.test(a)?"diff-hard":/media/i.test(a)?"diff-med":"diff-easy"}function Ee(){const a=_t();return a.length?a.map(e=>{const i=Le(e.id);return`
      <div class="hike-card" data-id="${e.id}">
        <div class="hike-card-top">
          <h3 class="hike-name">${h(e.name)}</h3>
          <div class="hike-badges">
            <span class="hike-type">${h(e.type)}</span>
            <span class="hike-diff ${Lt(e.difficulty)}">${h(e.difficulty)}</span>
            ${e.car?'<span class="hike-family" title="Raggiungibile in auto">🚗</span>':""}
            ${e.family?'<span class="hike-family" title="Adatta ai bambini">👶</span>':""}
          </div>
        </div>
        <div class="hike-meta">
          <span>⏱️ ${h(e.duration)}</span>
          <span>📍 ${h(e.start)}</span>
        </div>
        <p class="hike-desc">${h(e.description)}</p>

        ${i.length?`
          <div class="hike-assigned">
            ${i.map(t=>`
              <span class="hike-assigned-chip" data-idea="${t.id}" title="Rimuovi dal giorno">
                ✓ Gg. ${t.day.day} · ${f(t.day.date)} <span class="hike-assigned-x">✕</span>
              </span>`).join("")}
          </div>`:""}

        <div class="hike-actions">
          <button class="btn btn-primary hike-add-btn" data-action="add" data-id="${e.id}">📌 Aggiungi a un giorno</button>
          <a class="btn btn-outline" target="_blank" rel="noopener" href="${$e(e.name)}">🗺️ Maps</a>
        </div>
      </div>
    `}).join(""):'<div class="ideas-empty">Nessuna meta per questo filtro.</div>'}function Se(){const a=document.getElementById("hike-grid");a&&(a.innerHTML=Ee())}function Et(){const a=document.getElementById("hike-grid");a&&a.addEventListener("click",e=>{const i=e.target.closest(".hike-assigned-chip");if(i){za(i.dataset.idea);return}const t=e.target.closest('[data-action="add"]');t&&St(t.dataset.id)})}function St(a){var s,r,l;const e=E.find(c=>c.id===a);if(!e)return;(s=document.getElementById("hike-day-modal"))==null||s.remove();const i=new Set(Le(a).map(c=>c.day.date)),t=Aa.map(c=>`
    <option value="${c.date}" ${i.has(c.date)?"disabled":""}>
      Gg. ${c.day} — ${f(c.date)}${i.has(c.date)?" (già aggiunta)":""}
    </option>
  `).join(""),o=document.createElement("div");o.id="hike-day-modal",o.className="day-link-modal-overlay",o.innerHTML=`
    <div class="day-link-modal">
      <div class="day-link-modal-title">📌 Aggiungi al giorno</div>
      <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">
        “${h(e.name)}” comparirà nelle attività suggerite del giorno scelto.
      </p>
      <select id="hike-day-select" class="ideas-select">
        ${t}
      </select>
      <div style="display:flex;gap:0.5rem;margin-top:1rem;">
        <button class="btn btn-primary" id="hike-day-confirm">✓ Aggiungi</button>
        <button class="btn btn-outline" id="hike-day-cancel">Annulla</button>
      </div>
    </div>
  `,document.body.appendChild(o);const n=()=>o.remove();(r=document.getElementById("hike-day-cancel"))==null||r.addEventListener("click",n),o.addEventListener("click",c=>{c.target===o&&n()}),(l=document.getElementById("hike-day-confirm"))==null||l.addEventListener("click",()=>{var d;const c=(d=document.getElementById("hike-day-select"))==null?void 0:d.value;c&&(la({text:e.name,note:`${e.type} · ${e.difficulty} · ${e.duration} — ${e.description}`,categoria:"escursione",stato:"idea",day_date:c,location_name:e.start,link:$e(e.name),coordinates:e.coordinates||null,add_to_map:!!e.coordinates,marker_color:"#10b981",hike_id:e.id}),n())})}const Fa={"#dashboard":Ge,"#itinerary":mi,"#attivita":$t,"#passeggiate":zt,"#hotels":zi,"#checklist":Ci,"#map":Oi,"#ideas":Qi,"#natura":dt,"#logistics":ut};async function Ie(){typeof window.__currentPageCleanup=="function"&&(window.__currentPageCleanup(),window.__currentPageCleanup=null);const a=window.location.hash||"#dashboard",e=Fa[a]??Fa["#dashboard"],i=document.getElementById("page-content");i.innerHTML=`
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>Caricamento…</p>
    </div>
  `;try{await e()}catch(t){console.error("[router]",t),i.innerHTML=`
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Errore caricamento pagina</h2>
        <p>${t.message||"Errore sconosciuto"}</p>
      </div>
    `}}we();window.addEventListener("hashchange",Ie);Ie();
