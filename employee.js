/* =========================================================
   EMPLOYEE WEB — ENHANCED DASHBOARD & REQUESTS (Front-only)
   - Replace demo data with real API calls later.
   - All selectors and IDs are stable for backend wiring.
   ========================================================= */

   function $(sel, root=document){ return root.querySelector(sel); }
   function $all(sel, root=document){ return [...root.querySelectorAll(sel)]; }
   
   /* ---------------------- Demo Data ----------------------- */
   const DATA = {
     employeeName: "Employee",
     summary: { totalOrders: 120, completed: 98, pending: 22, activeTechs: 15 },
     alerts: [
       { type: "warn", text: "ATM 20-155 delayed more than 3h" },
       { type: "bad",  text: "Technician Ali missed check-in" }
     ],
     scheduleToday: [
       { time: "09:00", text: "Shift start" },
       { time: "11:30", text: "Follow-up: ATM 20-200 (Network)" },
       { time: "14:00", text: "Meet bank engineer" }
     ],
     urgent: {
       call: [
         { id:"256314", status:"paper crash", time:"3:12 AM", done:true },
         { id:"256315", status:"paper crash", time:"3:12 AM", done:true },
         { id:"256316", status:"paper crash", time:"3:12 AM", done:false }
       ],
       meet: [ { id:"949112", status:"engineer meet", time:"12:40 PM", done:false } ],
       maintenance: [
         { id:"771203", status:"cassette jam", time:"10:02 AM", done:false },
         { id:"771204", status:"sensor error", time:"10:11 AM", done:false }
       ],
       feed: []
     },
     reqProgress: {
       call: [
         { label:"Call engineer – ATM 20-155", percent:60 },
         { label:"Confirm line test – ATM 20-200", percent:30 }
       ],
       meet: [
         { label:"Meet engineer – main branch", percent:80 }
       ]
     },
     pendingRequests: [
       { id:1, type:"call", title:"Call bank engineer", atm:"20-155", status:"Pending", when:"25-6-2024 12:12 AM" },
       { id:2, type:"meet", title:"Schedule meeting", atm:"20-200", status:"Pending", when:"26-6-2024 11:20 AM" },
       { id:3, type:"maintenance", title:"Cassette check", atm:"20-100", status:"In Progress", when:"Today 10:00 AM" }
     ],
     myRequests: {
       call: [
         { id:11, ok:true,  detail:"S/4h settlement block 3 ground floor", when:"25-6-2024 12:12 AM" },
         { id:12, ok:false, detail:"Network down", when:"— 12:12 AM" }
       ],
       meet: [
         { id:21, ok:true, detail:"Meet bank engineer", when:"26-6-2024 11:20 AM" }
       ]
     }
   };
   
   /* ------------------- Helper: Pills ---------------------- */
   function setPill(groupEl, value){
     $all('.pill', groupEl).forEach(p=>{
       const key = p.dataset.tab || p.dataset.type;
       p.setAttribute('aria-selected', String(key === value));
     });
   }
   
   /* ------------------ Render: Welcome/KPI ----------------- */
   function renderWelcome(){
     const name = DATA.employeeName;
     const date = new Date();
     const nice = date.toLocaleString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });
     const t = $("#todayText"); const n = $("#empName");
     if (n) n.textContent = name;
     if (t) t.textContent = nice;
   }
   
   function renderKPI(){
     const grid = $("#kpiGrid"); if (!grid) return;
     const s = DATA.summary;
     const items = [
       { title:"Total Orders Today", value:s.totalOrders, icon:"🧾" },
       { title:"Completed", value:s.completed, icon:"✅" },
       { title:"Pending", value:s.pending, icon:"⏳" },
       { title:"Active Technicians", value:s.activeTechs, icon:"👷" }
     ];
     grid.innerHTML = items.map(i=>`
       <div class="kpi-card">
         <div>
           <div class="kpi-title">${i.title}</div>
           <div class="kpi-value">${i.value}</div>
         </div>
         <div class="kpi-icon">${i.icon}</div>
       </div>
     `).join('');
     // TODO: GET /api/summary
   }
   
   /* ------------------ Render: Alerts/Calendar ------------- */
   function renderAlerts(){
     const list = $("#alertsList"); if (!list) return;
     list.innerHTML = DATA.alerts.map(a=>`
       <li class="flex items-center gap-2">
         <span class="dot ${a.type}"></span><span>${a.text}</span>
       </li>
     `).join('');
     // TODO: GET /api/notifications
   }
   
   function renderCalendarToday(){
     const el = $("#calendarDate"); const ul = $("#scheduleToday");
     if (el) {
       const d = new Date();
       el.textContent = d.toLocaleDateString(undefined, { weekday:"long", month:"short", day:"numeric" });
     }
     if (ul) {
       ul.innerHTML = DATA.scheduleToday.map(s=>`
         <li class="flex items-center justify-between">
           <span class="text-slate-600">${s.text}</span>
           <span class="text-slate-500">${s.time}</span>
         </li>
       `).join('');
     }
     // TODO: GET /api/schedule/today
   }
   
   /* ------------------ Render: Urgent + Progress ----------- */
   function renderUrgent(kind='call'){
     const tb = $("#urgentTbody"); if (!tb) return;
     const rows = (DATA.urgent[kind]||[]).map(r=>`
       <tr>
         <td>${r.id}</td>
         <td>${r.status}</td>
         <td class="cell-right">${r.time}</td>
         <td class="cell-right">${r.done ? '✅' : '⬜️'}</td>
       </tr>
     `).join('');
     tb.innerHTML = rows || `<tr><td colspan="4" class="p-3 text-slate-500">No items</td></tr>`;
     const done = (DATA.urgent[kind]||[]).filter(x=>x.done).length;
     const total = (DATA.urgent[kind]||[]).length || 1;
     const pct = Math.round(done/total*100);
     const bar = $("#urgentProgress"); const txt = $("#urgentProgressText");
     if (bar) bar.style.width = pct + "%";
     if (txt) txt.textContent = pct + "%";
     // TODO: GET /api/urgent?type=
   }
   
   /* ------------- Render: Request Progress Bars ------------ */
   function renderReqProgress(kind='call'){
     const wrap = $("#reqProgressList"); if (!wrap) return;
     wrap.innerHTML = (DATA.reqProgress[kind]||[]).map(it=>`
       <div>
         <div class="flex items-center justify-between text-sm">
           <div class="text-slate-700">${it.label}</div>
           <div class="text-slate-500">${it.percent}%</div>
         </div>
         <div class="progress-bar mt-1"><div class="progress-fill" style="width:${it.percent}%"></div></div>
       </div>
     `).join('') || `<div class="text-sm text-slate-500">No progress items</div>`;
     // TODO: GET /api/progress/status
   }
   
   /* --------------- Render: Pending Request Cards ---------- */
   function renderPendingRequests(){
     const grid = $("#pendingRequests"); if (!grid) return;
     grid.innerHTML = DATA.pendingRequests.map(r=>`
       <div class="request-card">
         <div class="flex items-start justify-between gap-3">
           <div>
             <div class="request-title">${iconForType(r.type)} ${r.title} <span class="text-slate-500">— ATM ${r.atm}</span></div>
             <div class="request-meta mt-1">${r.status} • ${r.when}</div>
           </div>
           <div class="flex items-center gap-2">
             <button class="btn-edit" data-edit="${r.id}">Edit</button>
             <button class="btn-delete" data-delete="${r.id}">Delete</button>
           </div>
         </div>
       </div>
     `).join('') || `<div class="text-sm text-slate-500">No pending requests</div>`;
     // TODO: GET /requests?status=pending
   }
   
   function iconForType(t){
     if (t==='call') return '📞';
     if (t==='meet') return '🤝';
     if (t==='maintenance') return '🧰';
     return '🗂️';
   }
   
   /* ----------------- Requests Page (CRUD) ----------------- */
   let EDIT_ID = null;
   
   function renderMyRequests(kind='call'){
     const tb = $("#myRequestsTbody"); if (!tb) return;
     tb.innerHTML = (DATA.myRequests[kind]||[]).map(r=>`
       <tr>
         <td>${r.ok?'Approved':'Pending'}</td>
         <td>${r.detail}</td>
         <td class="cell-right">${r.when}</td>
         <td class="cell-right">
           <button class="btn-edit" data-edit="${r.id}">Edit</button>
           <button class="btn-delete" data-delete="${r.id}">Delete</button>
         </td>
       </tr>
     `).join('') || `<tr><td colspan="4" class="p-3 text-slate-500">No requests</td></tr>`;
     // TODO: GET /requests
   }
   
   function openEditModal(req){
     const modal = $("#editModal"); if (!modal) return;
     $("#editType").value = req.type || (req.ok ? 'call' : 'meet');
     $("#editAtm").value = req.atm || '';
     $("#editWhen").value = req.when || '';
     $("#editReason").value = req.detail || req.title || '';
     modal.classList.remove('hidden');
   }
   
   function closeModal(){
     const modal = $("#editModal"); if (modal) modal.classList.add('hidden');
     EDIT_ID = null;
   }
   
   /* --------- Event Delegation (Edit/Delete/Submit) -------- */
   document.addEventListener('click', (e)=>{
     // Pills (tabs)
     const pill = e.target.closest('.pill[role="tab"], .pill[data-type]');
     if (pill) {
       const group = pill.closest('.pill-group');
       const tab = pill.dataset.tab || pill.dataset.type;
       setPill(group, tab);
       if (group?.id === 'urgentTabs') renderUrgent(tab);
       if (group?.id === 'reqTabs') renderReqProgress(tab);
       if (group?.id === 'listType') renderMyRequests(tab);
       return;
     }
   
     // Delete request (dashboard cards or table)
     const del = e.target.closest('[data-delete]');
     if (del) {
       const id = +del.dataset.delete;
       if (!confirm('Are you sure you want to delete this request?')) return;
       DATA.pendingRequests = DATA.pendingRequests.filter(x=>x.id!==id);
       for (const k of Object.keys(DATA.myRequests)) {
         DATA.myRequests[k] = DATA.myRequests[k].filter(x=>x.id!==id);
       }
       renderPendingRequests();
       const sel = $("#listType .pill[aria-selected=\"true\"]")?.dataset.type || 'call';
       renderMyRequests(sel);
       // TODO: DELETE /requests/:id
       return;
     }
   
     // Edit request (dashboard cards or table)
     const ed = e.target.closest('[data-edit]');
     if (ed) {
       const id = +ed.dataset.edit; EDIT_ID = id;
       const candCard = DATA.pendingRequests.find(x=>x.id===id);
       const buckets = Object.values(DATA.myRequests).flat();
       const candList = buckets.find(x=>x.id===id);
       openEditModal(candCard || candList || {id});
       return;
     }
   
     // Modal close
     if (e.target.matches('[data-close]')) { closeModal(); return; }
   
     // Save edit
     if (e.target.id === 'saveEditBtn') {
       const t = $("#editType").value.trim().toLowerCase();
       const atm = $("#editAtm").value.trim();
       const when = $("#editWhen").value.trim();
       const reason = $("#editReason").value.trim();
   
       const p = DATA.pendingRequests.find(x=>x.id===EDIT_ID);
       if (p) { p.type = t; p.atm = atm; p.when = when; p.title = reason || p.title; }
       for (const k of Object.keys(DATA.myRequests)) {
         const idx = DATA.myRequests[k].findIndex(x=>x.id===EDIT_ID);
         if (idx>-1) DATA.myRequests[k][idx] = { ...DATA.myRequests[k][idx], when, detail: reason };
       }
       closeModal();
       renderPendingRequests();
       const sel = $("#listType .pill[aria-selected=\"true\"]")?.dataset.type || 'call';
       renderMyRequests(sel);
       // TODO: PUT /requests/:id
       return;
     }
   
     // Create request (requests page)
     if (e.target.id === 'reqSubmit') {
       const type = $("#createType .pill[aria-selected=\"true\"]")?.dataset.type || 'call';
       const atm = $("#reqAtm").value.trim();
       const person = $("#reqPerson").value.trim(); // reserved for backend
       const when = $("#reqWhen").value.trim();
       const reason = $("#reqReason").value.trim();
       if (!atm || !reason) { alert('ATM and Reason are required.'); return; }
       const newId = Math.floor(Math.random()*1e6);
       const detail = reason || `${type} • ${atm}`;
       DATA.myRequests[type] = DATA.myRequests[type] || [];
       DATA.myRequests[type].push({ id:newId, ok:false, detail, when });
       DATA.pendingRequests.unshift({ id:newId, type, title: reason || 'Request', atm, status:'Pending', when });
       renderPendingRequests();
       const sel = $("#listType .pill[aria-selected=\"true\"]")?.dataset.type || 'call';
       renderMyRequests(sel);
       $("#reqAtm").value = $("#reqPerson").value = $("#reqWhen").value = $("#reqReason").value = '';
       // TODO: POST /requests
     }
   });
   
   /* ------------------ Page Initializers ------------------- */
   window.EmpInit = {
     enhancedDashboard(){
       renderWelcome(); renderKPI(); renderAlerts();
       renderCalendarToday(); renderUrgent('call'); renderReqProgress('call');
       renderPendingRequests();
     },
     requests(){
       setPill($("#createType"), 'call');
       setPill($("#listType"), 'call');
       renderMyRequests('call');
     }
   };
  function renderTechFlow() {
    const el = document.getElementById('techFlowBar');
    if (!el) return;
    const data = { pending: 30, progress: 50, done: 20 }; // demo data
    el.innerHTML = `
      <div class="flowbar">
        <div class="flow-segment flow-pending" style="width:${data.pending}%;">${data.pending}%</div>
        <div class="flow-segment flow-progress" style="width:${data.progress}%;">${data.progress}%</div>
        <div class="flow-segment flow-done" style="width:${data.done}%;">${data.done}%</div>
      </div>`;
    // TODO: Connect to backend API for real data
  }
  
   
   /* ==================== Backend TODOs ======================
   - GET  /api/summary
   - GET  /api/notifications
   - GET  /api/schedule/today
   - GET  /api/urgent?type=
   - GET  /api/progress/status?type=
   - GET  /api/requests
   - GET  /api/requests?status=pending
   - POST /api/requests
   - PUT  /api/requests/:id
   - DELETE /api/requests/:id
   ========================================================== */
   