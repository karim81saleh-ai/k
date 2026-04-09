// js/path-manager.js

// دالة العرض الرئيسية لتبويب المسارات
function renderPathTab(container) {
    const pathData = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    
    container.innerHTML = `
      <div class="path-container" style="padding:15px;">
        <div class="item-card" style="margin-bottom:20px; border: 1px dashed var(--accent);">
          <div style="padding:10px;">
            <h4 style="margin-bottom:12px; color:var(--accent);">✦ إضافة مسار مراجعة جديد</h4>
            <div class="form-row">
              <div class="form-group">
                <input type="number" id="path_pageId" class="form-input" placeholder="رقم الصفحة">
              </div>
              <div class="form-group">
                <input type="date" id="path_startDate" class="form-input" value="${appState.currentDateStr}">
              </div>
            </div>
            <button onclick="addPathItem()" class="filter-btn active" style="width:100%; margin-top:10px; border-radius:var(--radius-sm)">
               إضافة المسار
            </button>
          </div>
        </div>

        <div id="pathList">
          ${pathData.length === 0 ? 
            `<div style="text-align:center; padding:40px; color:var(--text-3);">لا توجد مسارات مراجعة حالياً</div>` : 
            pathData.map((item, index) => generatePathCardHtml(item, index)).join('')
          }
        </div>
        
        <div style="display:flex; gap:10px; margin-top:20px;">
          <button onclick="exportPathData()" class="filter-btn" style="font-size:11px">تصدير المسارات</button>
          <button onclick="clearPathData()" class="filter-btn" style="font-size:11px; color:var(--s-late)">مسح السجل</button>
        </div>
      </div>
    `;
}

function generatePathCardHtml(item, index) {
    let daysHtml = '';
    for (let i = 1; i <= 30; i++) {
        const isDone = item.progress && item.progress[i];
        const dayStyle = isDone 
            ? `background:var(--s-new); color:white; border-color:var(--s-new);` 
            : `background:var(--surface2); color:var(--text-2);`;
            
        daysHtml += `
            <div onclick="togglePathDay(${index}, ${i})" 
                 style="width:32px; height:32px; display:flex; align-items:center; justify-content:center; 
                 border-radius:8px; font-size:11px; font-weight:700; cursor:pointer; transition:0.2s; border:1px solid var(--border); ${dayStyle}">
                ${i}
            </div>`;
    }

    return `
    <div class="item-card" style="margin-bottom:15px; display:block;">
        <div class="card-header" style="margin-bottom:12px;">
            <div class="card-title">صفحة: ${item.pageId}</div>
            <button onclick="deletePathItem(${index})" style="background:none; border:none; color:var(--text-3); cursor:pointer;">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div style="font-size:12px; color:var(--text-3); margin-bottom:10px;">بداية المسار: ${item.startDate}</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); gap:6px;">
            ${daysHtml}
        </div>
    </div>`;
}

// الدوال الوظيفية
function addPathItem() {
    const pageId = document.getElementById('path_pageId').value;
    const startDate = document.getElementById('path_startDate').value;
    if (!pageId || !startDate) return showToast("أدخل البيانات كاملة");

    let data = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    data.push({ pageId, startDate, progress: {} });
    localStorage.setItem('quran_tracker_v7', JSON.stringify(data));
    renderApp();
}

function togglePathDay(itemIndex, day) {
    let data = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    if (!data[itemIndex].progress) data[itemIndex].progress = {};
    data[itemIndex].progress[day] = !data[itemIndex].progress[day];
    localStorage.setItem('quran_tracker_v7', JSON.stringify(data));
    renderApp();
}

function deletePathItem(index) {
    if(confirm("حذف هذا المسار؟")) {
        let data = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
        data.splice(index, 1);
        localStorage.setItem('quran_tracker_v7', JSON.stringify(data));
        renderApp();
    }
}

function clearPathData() {
    if(confirm("سيتم مسح كل سجل المسارات نهائياً؟")) {
        localStorage.removeItem('quran_tracker_v7');
        renderApp();
    }
}

function exportPathData() {
    const data = localStorage.getItem('quran_tracker_v7');
    if (!data) return showToast("لا توجد بيانات");
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tamkeen_paths_backup.json`;
    a.click();
}