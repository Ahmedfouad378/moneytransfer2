// Shared layout renderer for static pages
// Team note: Include this file and call renderLayout({ active, title, variant, showBranchActions })
// - active: 'branch' | 'schedule' | 'bank' | 'create'
// - variant: 'emoji' (stacked icons + small labels) or 'img' (sidebar icons with labels)
// - showBranchActions: true to show Add Track/Add Branch buttons in header

// Render sidebar; variant: 'emoji' | 'img'
function renderSidebar(active, variant) {
  // Inject brand utility classes once (uses CSS vars from syle.css)
  if (!document.getElementById('brand-styles')) {
    var css = `
      .btn-primary{background:var(--brand-blue);color:#fff;border-radius:0.75rem;height:2.5rem;padding:0 1rem}
      .btn-primary:hover{filter:brightness(0.95)}
      .btn-secondary{background:var(--brand-orange);color:#fff;border-radius:0.75rem;height:2.5rem;padding:0 1rem}
      .btn-secondary:hover{filter:brightness(0.95)}
      .btn-outline-blue{background:#fff;color:var(--brand-blue);border:1px solid var(--brand-blue);border-radius:0.75rem;height:2.5rem;padding:0 1rem}
      .btn-outline-blue:hover{background:rgba(46,49,146,0.06)}
      .focus-brand:focus{outline:none;box-shadow:0 0 0 3px rgba(46,49,146,0.25)}
      .card{border-radius:0.75rem;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.08)}
      .badge-blue{display:inline-flex;align-items:center;justify-content:center;height:1.25rem;width:1.25rem;border-radius:999px;background:var(--brand-orange);color:#fff;font-size:0.625rem}
      .icon-btn{display:inline-flex;align-items:center;justify-content:center;height:2rem;width:2rem;border-radius:0.375rem;border:1px solid #e5e7eb;background:#fff}
      .icon-btn:hover{background:#f9fafb}
      .active-link{background:rgba(46,49,146,0.08);color:var(--brand-blue);font-weight:600}
    `;
    var style = document.createElement('style');
    style.id = 'brand-styles';
    style.innerHTML = css; document.head.appendChild(style);
  }
  // Inline SVG markup (no <img>) so icons are built-in and cannot break
  // Colors updated for a modern Teal/Indigo theme
  var eyeSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var calendarSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  var bankSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6"/><path d="M4 10h16v10H4z"/><path d="M9 21v-6M12 21v-6M15 21v-6"/></svg>';
  var plusSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var uploadSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e3192" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  var checkSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e3192" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/><path d="m22 22-1.5-1.5"/><path d="M9 11l3 3L22 4"/><path d="M3 12l3 3 3-3"/></svg>';
  var chartSVG = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e3192" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>';
  var items = [
    { href: 'dashboard.html', key: 'dashboard', label: 'Dashboard', icon: '📊', svg: chartSVG },
    { href: 'branch.html', key: 'branch', label: 'Track View', icon: '👁️', svg: eyeSVG },
    { href: 'schedule.html', key: 'schedule', label: 'Schedule', icon: '📅', svg: calendarSVG },
    { href: 'add-branch.html', key: 'bank', label: 'Bank', icon: '🏦', svg: bankSVG },
    { href: 'create-track.html', key: 'create', label: 'Create Track', icon: '➕', svg: plusSVG },
    { href: 'upload-order.html', key: 'upload', label: 'Upload Orders', icon: '⤴️', svg: uploadSVG },
    { href: 'approvals.html', key: 'approvals', label: 'Approvals', icon: '✔️', svg: checkSVG },
    { href: 'reports.html', key: 'reports', label: 'Reports', icon: '📊', svg: chartSVG }
  ];
  var list = items.map(function(it){
    // Enhanced styling with brand colors and better visual hierarchy
    var isActive = it.key === active;
    var activeClass = isActive ? ' bg-blue-50 text-blue-700 border-r-2 border-blue-500 font-semibold' : ' text-gray-600 hover:text-gray-800';
    var hoverClass = isActive ? '' : ' hover:bg-gray-50 hover:text-gray-800';
    var icon = variant === 'img' ? ('<span class="h-5 w-5 inline-block align-middle">' + it.svg + '</span>') : '<span class="h-6 w-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs">' + it.icon + '</span>';
    var textClass = variant === 'img' ? 'hidden lg:inline text-sm font-medium' : 'text-[10px] lg:text-xs font-medium';
    return '<li><a href="' + it.href + '" class="group flex ' + (variant === 'img' ? 'items-center gap-3' : 'flex-col items-center gap-1') + ' px-3 py-3 rounded-lg transition-all duration-200' + hoverClass + activeClass + '">' + icon + '<span class="' + textClass + '">' + it.label + '</span></a></li>';
  }).join('');
  // Enhanced sidebar with better design and brand colors
  return (
    '<aside class="w-16 sm:w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">' +
      '<div class="mb-8">' +
        '<div class="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-200 flex items-center justify-center overflow-hidden shadow-md">' +
          '<svg aria-hidden="true" viewBox="0 0 24 24" class="h-8 w-8"><circle cx="12" cy="12" r="10" fill="white"/><text x="12" y="16" text-anchor="middle" font-size="14" fill="#2e3192" font-family="sans-serif" font-weight="bold">T</text></svg>' +
        '</div>' +
      '</div>' +
      '<nav class="flex-1 w-full px-2"><ul class="space-y-1">' + list + '</ul></nav>' +
      '<div class="mt-auto text-xs text-slate-500 hidden lg:block px-3 py-2 bg-gray-50 rounded-lg mx-2">v1.0</div>' +
    '</aside>'
  );
}

// Render top header; options.showBranchActions adds action buttons used in Track View
function renderHeader(title, options) {
  options = options || {};
  var actions = '';
  if (options.showBranchActions) {
    // Updated button classes: Add Track (Teal/Primary) and Add Branch (Orange/Secondary)
    actions += '<a href="create-track.html" class="hidden sm:inline-flex items-center justify-center w-36 h-10 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition duration-150 mr-2">Add Track</a>';
    actions += '<a href="add-branch.html" class="inline-flex items-center justify-center w-40 h-10 rounded-md bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition duration-150">Add New Branch</a>';
  }
  return (
    '<header class="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center">' +
      '<div class="px-6 w-full max-w-screen-2xl mx-auto flex items-center justify-between">' +
        '<h1 class="text-xl font-bold text-gray-800">' + title + '</h1>' +
        '<div class="flex items-center gap-4">' + actions +
          '<div class="text-right hidden sm:block">' +
            '<div class="text-sm font-semibold text-gray-800">Main Admin</div>' +
            '<div class="text-xs text-slate-500">Welcome back</div>' +
          '</div>' +
          '<div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">M</div>' +
        '</div>' +
      '</div>' +
    '</header>'
  );
}

// Main entry: wraps page content with sidebar + header and moves current content into #page-main
function renderLayout(cfg) {
  var c = cfg || {}; var active = c.active || 'branch'; var title = c.title || '';
  var variant = c.variant || 'emoji';
  var showBranchActions = Boolean(c.showBranchActions);
  var app = document.getElementById('app');
  if (!app) return;
  // If page already includes aside/header, replace them to keep consistent
  var container = document.createElement('div');
  container.className = 'min-h-screen flex bg-gray-50'; // Added light background for app
  container.innerHTML = renderSidebar(active, variant) + '<div class="flex-1 flex flex-col">' + renderHeader(title, { showBranchActions: showBranchActions }) + '<main id="page-main" class="px-4 py-6 w-full max-w-screen-2xl mx-auto"></main></div>';
  // Move existing main content into #page-main
  var oldChildren = Array.prototype.slice.call(app.children);
  app.innerHTML = '';
  app.appendChild(container);
  var pageMain = document.getElementById('page-main');
  oldChildren.forEach(function(node){ if (node.tagName !== 'SCRIPT') pageMain.appendChild(node); });
}

window.__layout = { renderLayout: renderLayout };
/* Tiny data layer to demo charts. Replace with your AJAX/fetch. */
const sample = {
  orders: { inProgress: 12, done: 8, failed: 3 },
  techPerf: [65, 72, 68, 80, 76, 84, 90], // % SLA per day
  kpis: { active: 12, delayed: 3, art: "1h 12m", cash: 560000 }
};

function money(x){ return "£E " + x.toLocaleString(); }

window.addEventListener("DOMContentLoaded", () => {
  // KPIs
  document.getElementById("kpi-active").textContent  = sample.kpis.active;
  document.getElementById("kpi-delayed").textContent = sample.kpis.delayed;
  document.getElementById("kpi-art").textContent     = sample.kpis.art;
  document.getElementById("kpi-cash").textContent    = money(sample.kpis.cash);

  // Orders chart
  const ctx1 = document.getElementById("ordersChart");
  new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["In Progress", "Done", "Failed"],
      datasets: [{
        label: "Orders",
        data: [sample.orders.inProgress, sample.orders.done, sample.orders.failed]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });

  // Technician performance (line)
  const ctx2 = document.getElementById("techChart");
  new Chart(ctx2, {
    type: "line",
    data: {
      labels: ["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],
      datasets: [{
        label: "SLA %",
        data: sample.techPerf,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } }
    }
  });

  // Example: push a new notification after 3s (demo of real-time)
  setTimeout(() => {
    addNotif("blue", "New bank order uploaded for Track A");
  }, 3000);
});

function addNotif(color, text){
  const host = document.getElementById("notif-list");
  const row = document.createElement("div");
  row.className = "notif";
  row.innerHTML = `<span class="badge ${color}">•</span>${text}`;
  host.prepend(row);
}
// Auto-fill Recent Orders dynamically (demo)
const ordersFeed = document.getElementById("orders-feed");
const demoOrders = [
  { id: 433, bank: "Bank Misr", atm: 1402, status: "In progress", color: "blue" },
  { id: 434, bank: "NBE", atm: 2205, status: "Done", color: "green" },
  { id: 435, bank: "CIB", atm: 3321, status: "Delayed 2h", color: "red" }
];

demoOrders.forEach(o => {
  const row = document.createElement("div");
  row.innerHTML = `#${o.id} - ${o.bank} ATM ${o.atm} • <span class="status ${o.color}">${o.status}</span>`;
  ordersFeed.appendChild(row);
});
