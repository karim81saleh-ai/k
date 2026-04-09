// js/ui-render.js

/**
 * رسم شريط الإحصائيات العلوي
 */
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

/**
 * رسم التبويبات (إضافة تبويب المسارات في المنتصف)
 */
function renderTabs() {
  const counts = { wird: 0, path: 0, periodic: 0, REST: 0 };
  
  appState.items.forEach(i => {
    if (WIRD_SET.has(i._status)) {
      counts.wird++;
    } else if (i.scheduleType === 'repeating' && !WIRD_SET.has(i._status)) {
      counts.periodic++;
    } else if (i.scheduleType === 'default' && (i._status === 'WAIT' || i._status === 'OVERDUE')) {
      counts.REST++;
    }
  });

  const tabsContainer = document.getElementById("tabs");
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

/**
 * الدالة الرئيسية لرسم محتوى التطبيق
 */
function renderApp() {
  renderStats();
  renderTabs();
  
  const listDiv = document.getElementById("itemsList");
  if (!listDiv) return;

  // حالة تبويب المسارات (قيد الإنشاء)
  if (appState.activeFilter === 'path') {
    listDiv.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-3);">
        <div style="font-size: 48px; margin-bottom: 15px; filter: grayscale(0.5);">🏗️</div>
        <div style="font-size: 18px; font-weight: 700; color: var(--text-1);">قسم المسارات</div>
        <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">هذا القسم قيد الإنشاء حالياً لبرمجة خطط الحفظ.</div>
      </div>
    `;
    return;
  }

  // تصفية العناصر بناءً على التبويب النشط
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

  // ترتيب العناصر (المتجاوز أولاً ثم الأحدث)
  filtered.sort((a, b) => {
    if (a._status === 'OVERDUE' && b._status !== 'OVERDUE') return -1;
    if (a._status !== 'OVERDUE' && b._status === 'OVERDUE') return 1;
    return new Date(b.date) - new Date(a.date);
  });

  listDiv.innerHTML = filtered.map(item => renderItemCard(item)).join('');
}

/**
 * رسم بطاقة العنصر الواحد
 */
function renderItemCard(item) {
  const isWird = WIRD_SET.has(item._status);
  const isDone = appState.completedWirds.has(item.id);
  const diff = getDiffDays(item.date);
  const isOverdue = item._status === 'OVERDUE';
  
  let sinceText = "";
  if (isWird) {
    if (diff === 0) sinceText = "(اليوم)";
    else if (diff > 0) sinceText = `(منذ ${diff} يوم)`;
  }

  const nextDays = getNextReviewDays(item, diff);
  const nextReviewText = (!isWird && nextDays !== null) ? `<span>🔄 بعد ${nextDays} يوم</span>` : "";
  const hasNote = item.note && item.note.trim().length > 0;

  // ألوان وتنسيقات خاصة للحالات المتجاوزة والمكتملة
  const overdueStyle = isOverdue ? 'border-right: 4px solid var(--s-late); background-color: #fff9f9;' : '';
  const badgeStyle = isOverdue ? 'background-color: var(--s-late); color: white; border: none;' : '';
  const titleStyle = isDone ? 'text-decoration: line-through; opacity: 0.5;' : '';

  return `
    <div class="item-card ${isDone ? 'completed' : ''}" style="${overdueStyle}">
      ${hasNote ? '<div class="note-indicator" title="توجد ملاحظات"></div>' : ''}
      <div class="card-main" onclick="openEditSheet('${item.id}')">
        <div class="card-header">
          <div class="card-title" style="${titleStyle}">${item.content}</div>
          <div class="status-badge badge-${item._status}" style="${badgeStyle}">
            ${STATUS_AR[item._status] || item._status}
          </div>
        </div>
        <div class="card-meta">
          <span>📅 ${item.date} ${sinceText}</span> 
          <span>📄 ${item.pages} ص</span>
          ${nextReviewText}
        </div>
      </div>
      <div class="card-actions">
        ${isWird ? `
          <input type="checkbox" class="wird-checkbox" 
            ${isDone ? 'checked' : ''} 
            onchange="toggleWird(this, '${item.id}')">
        ` : '<div style="width:24px;"></div>'}
      </div>
    </div>
  `;
}