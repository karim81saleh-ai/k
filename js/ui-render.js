// js/ui-render.js

function renderStats() {
  const total = appState.items.reduce((s, i) => s + (parseFloat(i.pages) || 0), 0);
  const wirdItems = appState.items.filter(i => WIRD_SET.has(i._status) && !appState.completedWirds.has(i.id));
  const reqPages = wirdItems.reduce((s, i) => s + (parseFloat(i.pages) || 0), 0);

  const statsBar = document.getElementById("statsBar");
  if (statsBar) {
    statsBar.innerHTML = `
      <div class="stat-chip">إجمالي: <span class="val">${total}</span> ص</div>
      <div class="stat-chip">مطلوب اليوم: <span class="val" style="color:var(--s-late)">${reqPages}</span> ص</div>
    `;
  }
}

function renderTabs() {
  const counts = { wird: 0, path: 0, periodic: 0, REST: 0 };
  
  appState.items.forEach(i => {
    if (WIRD_SET.has(i._status)) counts.wird++;
    else if (i.scheduleType === 'repeating' && !WIRD_SET.has(i._status)) counts.periodic++;
    else if (i.scheduleType === 'default' && (i._status === 'WAIT' || i._status === 'OVERDUE')) counts.REST++;
  });

  // إضافة مرونة في جلب الحاوية لتفادي أخطاء المسميات
  const tabsContainer = document.getElementById("tabs") || document.getElementById("comp-tabs");
  if (tabsContainer) {
    tabsContainer.innerHTML = `
      <button class="filter-btn ${appState.activeFilter === 'wird' ? 'active' : ''}" onclick="setFilter('wird')">
        ورد اليوم (${counts.wird})
      </button>
      <button class="filter-btn ${appState.activeFilter === 'path' ? 'active' : ''}" onclick="setFilter('path')">
        المسارات
      </button>
      <button class="filter-btn ${appState.activeFilter === 'periodic' ? 'active' : ''}" onclick="setFilter('periodic')">
        المراجعة (${counts.periodic})
      </button>
      <button class="filter-btn ${appState.activeFilter === 'REST' ? 'active' : ''}" onclick="setFilter('REST')">
        الانتظار (${counts.REST})
      </button>
    `;
  }
}

function renderApp() {
  renderStats();
  renderTabs();
  
  // إضافة مرونة في جلب الحاوية لتفادي التوقف المبكر (Return)
  const listDiv = document.getElementById("itemsList") || document.getElementById("comp-list");
  if (!listDiv) return;

  if (appState.activeFilter === 'path') {
    listDiv.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-3);">
        <div style="font-size: 48px; margin-bottom: 15px;">🏗️</div>
        <div style="font-size: 18px; font-weight: 700; color: var(--text-1);">قسم المسارات</div>
        <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">هذا القسم قيد الإنشاء حالياً لبرمجة خطط الحفظ.</div>
      </div>
    `;
    return;
  }

  let filtered = [];
  if (appState.activeFilter === 'wird') {
    filtered = appState.items.filter(i => WIRD_SET.has(i._status));
  } else if (appState.activeFilter === 'periodic') {
    filtered = appState.items.filter(i => i.scheduleType === 'repeating' && !WIRD_SET.has(i._status));
  } else if (appState.activeFilter === 'REST') {
    filtered = appState.items.filter(i => i.scheduleType === 'default' && (i._status === 'WAIT' || i._status === 'OVERDUE'));
  }

  if (filtered.length === 0) {
    listDiv.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-3);">لا يوجد عناصر هنا</div>`;
    return;
  }

  filtered.sort((a, b) => (a._status === 'OVERDUE' ? -1 : 1));
  listDiv.innerHTML = filtered.map(item => renderItemCard(item)).join('');
}

function renderItemCard(item) {
  const isWird = WIRD_SET.has(item._status);
  const isDone = appState.completedWirds.has(item.id);
  const diff = getDiffDays(item.date);
  const isOverdue = item._status === 'OVERDUE';
  const nextDays = getNextReviewDays(item, diff);
  
  const titleStyle = isDone ? 'text-decoration: line-through; opacity: 0.5;' : '';
  const overdueStyle = isOverdue ? 'border-right: 4px solid var(--s-late); background-color: #fff9f9;' : '';

  return `
    <div class="item-card ${isDone ? 'completed' : ''}" style="${overdueStyle}">
      <div class="card-main" onclick="openEditSheet('${item.id}')">
        <div class="card-header">
          <div class="card-title" style="${titleStyle}">${item.content}</div>
          <div class="status-badge badge-${item._status}">${STATUS_AR[item._status] || item._status}</div>
        </div>
        <div class="card-meta">
          <span>📅 ${item.date}</span> 
          <span>📄 ${item.pages} ص</span>
          ${(!isWird && nextDays !== null) ? `<span>🔄 بعد ${nextDays} يوم</span>` : ""}
        </div>
      </div>
      <div class="card-actions">
        ${isWird ? `<input type="checkbox" class="wird-checkbox" ${isDone?'checked':''} onchange="toggleWird(this, '${item.id}')">` : ''}
      </div>
    </div>
  `;
}