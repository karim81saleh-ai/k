function renderStats() {
  const total = appState.items.reduce((s, i) => s + (parseFloat(i.pages) || 0), 0);
  const wirdItems = appState.items.filter(i => WIRD_SET.has(i._status) && !appState.completedWirds.has(i.id));
  const reqPages = wirdItems.reduce((s, i) => s + (parseFloat(i.pages) || 0), 0);

  document.getElementById("statsBar").innerHTML = `
    <div class="stat-chip">إجمالي: <span class="val">${total}</span> ص</div>
    <div class="stat-chip">مطلوب اليوم: <span class="val" style="color:var(--s-late)">${reqPages}</span> ص</div>
  `;
}

function renderTabs() {
  const counts = { wird: 0, periodic: 0, REST: 0 };
  
  appState.items.forEach(i => {
    const isDone = appState.completedWirds.has(i.id);
    if (WIRD_SET.has(i._status) && !isDone) {
      counts.wird++;
    } else if (i._status === 'WAIT' && i.interval === 15 && !isDone) {
      counts.periodic++;
    } else {
      counts.REST++;
    }
  });

  const tabs = [
    { id: 'wird', label: 'ورد اليوم' },
    { id: 'periodic', label: 'المراجعة الدورية' },
    { id: 'REST', label: 'استراحة' }
  ];

  document.getElementById("comp-tabs").innerHTML = tabs.map(t => {
    const active = appState.activeFilter === t.id ? 'active' : '';
    return `<button class="filter-btn ${active}" onclick="setFilter('${t.id}')">${t.label} (${counts[t.id]})</button>`;
  }).join("");
}

function renderList() {
  let filtered = [];
  const today = new Date();

  // المنطق الثلاثي الجديد
  if (appState.activeFilter === 'wird') {
    filtered = appState.items.filter(i => WIRD_SET.has(i._status) && !appState.completedWirds.has(i.id));
  } else if (appState.activeFilter === 'periodic') {
    filtered = appState.items.filter(i => i._status === 'WAIT' && i.interval === 15 && !appState.completedWirds.has(i.id));
  } else if (appState.activeFilter === 'REST') {
    filtered = appState.items.filter(i => {
        const isDone = appState.completedWirds.has(i.id);
        const isPeriodic = (i._status === 'WAIT' && i.interval === 15);
        const isWird = WIRD_SET.has(i._status);
        return isDone || (!isPeriodic && !isWird);
    });
  }

  // الترتيب التنازلي (الأقرب للمراجعة أولاً)
  filtered.sort((a, b) => (a._nextDays || 0) - (b._nextDays || 0));

  document.getElementById("comp-list").innerHTML = `<div class="items-list">
    ${filtered.map(item => {
      const isDone = appState.completedWirds.has(item.id);
      const isWird = WIRD_SET.has(item._status);
      const hasNote = item.note && item.note.trim() !== '';
      
      // حساب الأيام منذ الإضافة
      const addedDate = new Date(item.date);
      const diffTime = Math.abs(today - addedDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const sinceText = `<span style="opacity:0.7; font-size:0.85em;">(منذ ${diffDays} يوم)</span>`;

      let nextReviewText = '';
      if (item._nextDays !== null && !isWird) {
        nextReviewText = `<span style="color:var(--accent); font-weight:700;">⏳ المراجعة بعد ${item._nextDays} يوم</span>`;
      } else if (item._nextDays !== null && isDone) {
        nextReviewText = `<span style="color:var(--s-new); font-weight:700;">✅ المراجعة بعد ${item._nextDays} يوم</span>`;
      }

      return `
      <div class="item-card ${isDone ? 'completed' : ''}">
        ${hasNote ? '<div class="note-indicator"></div>' : ''}
        <div class="card-main" onclick="openEditSheet('${item.id}')">
          <div class="card-header">
            <div class="card-title">${item.content}</div>
            <div class="status-badge badge-${item._status}">${STATUS_AR[item._status] || item._status}</div>
          </div>
          <div class="card-meta">
            <span>📅 ${item.date} ${isWird ? sinceText : ''}</span> 
            <span>📄 ${item.pages} ص</span>
            ${nextReviewText}
          </div>
        </div>
        <div class="card-actions">
          ${isWird ? `<input type="checkbox" class="wird-checkbox" ${isDone?'checked':''} onchange="toggleWird(this, '${item.id}')">` : '<div></div>'}
          <button class="icon-btn" onclick="removeCard('${item.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function renderApp() {
  renderStats();
  renderTabs();
  renderList();
}