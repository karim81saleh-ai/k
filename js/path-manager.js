// js/path-manager.js

/**
 * الدالة الرئيسية لعرض تبويب المسارات
 */
function renderPathTab(container) {
    const pathData = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    
    container.innerHTML = `
      <div class="path-container" style="padding:15px;">
        
        <div class="item-card" style="text-align:center; background:var(--accent); color:white; border:none; margin-bottom:15px;">
            <div id="liveClock" style="font-size:24px; font-weight:800; letter-spacing:1px;">00:00:00</div>
            <div id="liveDate" style="font-size:12px; opacity:0.9; margin-top:5px;">-- --- ----</div>
        </div>

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
        
        <div style="display:flex; gap:10px; margin-top:20px; padding-bottom:30px;">
          <button onclick="exportPathData()" class="filter-btn" style="flex:1; font-size:11px">تصدير النسخة</button>
          <button onclick="clearPathData()" class="filter-btn" style="flex:1; font-size:11px; color:var(--s-late)">مسح السجل</button>
        </div>
      </div>
    `;

    // تشغيل الساعة
    startPathClock();
}

/**
 * توليد بطاقة المسار مع حساب "اليوم الحالي" برمجياً
 */
function generatePathCardHtml(item, index) {
    const start = new Date(item.startDate);
    const today = new Date();
    // حساب الفرق بالأيام (اليوم الأول = 1)
    const diffTime = today - start;
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let daysHtml = '';
    for (let i = 1; i <= 30; i++) {
        const isDone = item.progress && item.progress[i];
        const isToday = i === currentDay;
        
        // تحديد التنسيق بناءً على الحالة (منجز، اليوم، مستقبلي)
        let dayClass = "";
        let dayStyle = `background:var(--surface2); color:var(--text-3); border:1px solid var(--border);`;

        if (isDone) {
            dayStyle = `background:var(--s-new); color:white; border-color:var(--s-new);`;
        } else if (isToday) {
            dayStyle = `background:var(--accent-dim); color:var(--accent); border:2px solid var(--accent); font-weight:800; transform:scale(1.1);`;
        }

        daysHtml += `
            <div onclick="togglePathDay(${index}, ${i})" 
                 style="width:34px; height:34px; display:flex; align-items:center; justify-content:center; 
                 border-radius:10px; font-size:11px; cursor:pointer; transition:0.2s; ${dayStyle}">
                ${i}
            </div>`;
    }

    return `
    <div class="item-card" style="margin-bottom:15px; display:block; position:relative;">
        <div class="card-header" style="margin-bottom:10px;">
            <div>
                <div class="card-title">صفحة: ${item.pageId}</div>
                <div style="font-size:11px; color:var(--text-3); margin-top:2px;">
                    بدأت في: ${item.startDate} (أنت في اليوم: ${currentDay > 0 ? currentDay : 'لم يبدأ بعد'})
                </div>
            </div>
            <button onclick="deletePathItem(${index})" style="background:none; border:none; color:var(--text-3); cursor:pointer; padding:5px;">
                <i class="fas fa-trash-can"></i>
            </button>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(34px, 1fr)); gap:7px; justify-content: center;">
            ${daysHtml}
        </div>
    </div>`;
}

/**
 * منطق الساعة الحية
 */
let clockInterval;
function startPathClock() {
    if (clockInterval) clearInterval(clockInterval);
    
    const update = () => {
        const now = new Date();
        const clockEl = document.getElementById('liveClock');
        const dateEl = document.getElementById('liveDate');
        
        if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-GB');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('ar-SA', options);
        }
    };
    
    update();
    clockInterval = setInterval(update, 1000);
}

/**
 * الوظائف الإجرائية (CRUD)
 */
function addPathItem() {
    const pageId = document.getElementById('path_pageId').value;
    const startDate = document.getElementById('path_startDate').value;
    if (!pageId || !startDate) return showToast("أدخل رقم الصفحة والتاريخ");

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
    if(confirm("هل تريد حذف هذا المسار؟")) {
        let data = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
        data.splice(index, 1);
        localStorage.setItem('quran_tracker_v7', JSON.stringify(data));
        renderApp();
    }
}

function clearPathData() {
    if(confirm("سيتم حذف جميع المسارات نهائياً، هل أنت متأكد؟")) {
        localStorage.removeItem('quran_tracker_v7');
        renderApp();
    }
}

function exportPathData() {
    const data = localStorage.getItem('quran_tracker_v7');
    if (!data) return showToast("لا توجد بيانات لتصديرها");
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tamkeen_path_backup.json`;
    a.click();
}