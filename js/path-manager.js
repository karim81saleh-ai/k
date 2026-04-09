// js/path-manager.js

// الثوابت الخاصة بجدول التكرار والمراجعة المتباعدة
const REPETITION_SCHEDULE = [20, 6, 5, 4, 3, 2, 1, 1];
const SPACED_DAYS = [10, 17, 30];

/**
 * الدالة الرئيسية التي يستدعيها ui-render.js
 */
function renderPathTab(container) {
    container.innerHTML = `
      <div class="path-container" style="padding:15px;">
        
        <div class="item-card" style="text-align:center; background:var(--accent); color:white; border:none; margin-bottom:15px;">
            <div id="time-display" style="font-size:24px; font-weight:800; letter-spacing:1px;">00:00</div>
            <div id="date-display" style="font-size:12px; opacity:0.9; margin-top:5px;">-- --- ----</div>
        </div>

        <div class="item-card" style="margin-bottom:20px; border: 1px dashed var(--accent);">
          <div style="padding:10px;">
            <h4 style="margin-bottom:12px; color:var(--accent);">✦ إضافة صفحة جديدة للدورة</h4>
            <div class="form-row">
              <div class="form-group">
                <input type="number" id="pageNumber" class="form-input" placeholder="رقم الصفحة">
              </div>
              <div class="form-group">
                <input type="date" id="path_startDate" class="form-input">
              </div>
            </div>
            <button onclick="addNewPage()" class="filter-btn active" style="width:100%; margin-top:10px; border-radius:var(--radius-sm)">
               إدراج في الجدول
            </button>
          </div>
        </div>

        <h5 style="margin: 15px 5px 10px; color: var(--text-2);">🔄 دورة التكرار (أول 8 أيام)</h5>
        <div id="currentCycleList"></div>

        <h5 style="margin: 25px 5px 10px; color: var(--text-2);">📡 المراجعة المتباعدة (10، 17، 30)</h5>
        <div id="spacedCycleList"></div>
        
        <div style="display:flex; gap:10px; margin-top:30px; padding-bottom:30px;">
          <button onclick="exportPathData()" class="filter-btn" style="flex:1; font-size:11px">تصدير</button>
          <button onclick="clearPathData()" class="filter-btn" style="flex:1; font-size:11px; color:var(--s-late)">مسح الكل</button>
        </div>
      </div>
    `;

    // ضبط التاريخ الافتراضي لليوم
    document.getElementById('path_startDate').value = appState.currentDateStr;
    
    // تشغيل الساعة والبدء برسم القوائم
    startPathClock();
    renderPathLogic();
}

/**
 * منطق الساعة المحدث
 */
function startPathClock() {
    const update = () => {
        const now = new Date();
        const timeEl = document.getElementById('time-display');
        const dateEl = document.getElementById('date-display');
        
        if (timeEl) timeEl.innerText = now.toLocaleTimeString('ar-EG', { hour12: true, hour: '2-digit', minute: '2-digit' });
        if (dateEl) dateEl.innerText = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    update();
    setInterval(update, 1000);
}

/**
 * المنطق الحسابي لظهور الصفحات والعدادات
 */
function renderPathLogic() {
    const pages = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    const currentList = document.getElementById('currentCycleList');
    const spacedList = document.getElementById('spacedCycleList');
    
    if (!currentList || !spacedList) return;

    currentList.innerHTML = '';
    spacedList.innerHTML = '';

    // نستخدم تاريخ التطبيق الحالي للمحاكاة أو تاريخ اليوم الحقيقي
    const today = new Date(appState.currentDateStr).setHours(0,0,0,0);

    pages.forEach((item, index) => {
        const start = new Date(item.startDate).setHours(0,0,0,0);
        const daysPassed = Math.floor((today - start) / (1000 * 60 * 60 * 24));
        
        let totalRequired = 0;
        let isSpaced = false;
        let shouldShow = false;

        if (daysPassed >= 0 && daysPassed <= 7) {
            totalRequired = REPETITION_SCHEDULE[daysPassed];
            shouldShow = true;
        } else if (SPACED_DAYS.includes(daysPassed)) {
            totalRequired = 1;
            shouldShow = true;
            isSpaced = true;
        }

        if (shouldShow) {
            const doneCount = (item.progress && item.progress[daysPassed]) ? item.progress[daysPassed] : 0;
            const remaining = totalRequired - doneCount;
            const isNew = daysPassed === 0;

            const cardHTML = `
                <div class="item-card" style="margin-bottom:10px; border-left: 5px solid ${isSpaced ? 'var(--s-review)' : (isNew ? 'var(--s-new)' : 'var(--accent)')}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <div style="font-weight:700; font-size:16px;">صفحة ${item.pageId}</div>
                            <div style="font-size:11px; color:var(--text-3);">${isNew ? '✨ حفظ جديد' : '📅 اليوم رقم ' + daysPassed}</div>
                        </div>
                        <button onclick="deletePathItem(${index})" style="background:none; border:none; color:var(--text-3); cursor:pointer; font-size:18px;">&times;</button>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; background:var(--bg); padding:8px; border-radius:var(--radius-sm);">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button class="filter-btn active" style="padding:2px 12px; font-size:18px;" onclick="changePathCount(${index}, ${daysPassed}, 1, ${totalRequired})">+</button>
                            <span style="font-size:18px; font-weight:800; min-width:20px; text-align:center;">${doneCount}</span>
                            <button class="filter-btn" style="padding:2px 12px; font-size:18px;" onclick="changePathCount(${index}, ${daysPassed}, -1, ${totalRequired})" ${doneCount <= 0 ? 'disabled' : ''}>-</button>
                        </div>
                        
                        <div style="font-size:12px; font-weight:700; padding:4px 10px; border-radius:10px; ${remaining <= 0 ? 'background:var(--s-new); color:white;' : 'background:var(--border); color:var(--text-2);'}">
                            ${remaining <= 0 ? 'تم الإنجاز ✓' : 'باقي: ' + (remaining < 0 ? 0 : remaining)}
                        </div>
                    </div>
                </div>
            `;
            if (isSpaced) spacedList.innerHTML += cardHTML;
            else currentList.innerHTML += cardHTML;
        }
    });

    if (currentList.innerHTML === '') currentList.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-3); font-size:12px;">لا توجد صفحات في دورة التكرار اليوم</div>';
    if (spacedList.innerHTML === '') spacedList.innerHTML = '<div style="text-align:center; padding:15px; color:var(--text-3); font-size:12px;">لا توجد مراجعات متباعدة اليوم</div>';
}

/**
 * وظائف التحكم
 */
function addNewPage() {
    const pageId = document.getElementById('pageNumber').value;
    const startDate = document.getElementById('path_startDate').value;
    if (!pageId || !startDate) return showToast("أدخل رقم الصفحة والتاريخ");

    let pages = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    pages.push({ pageId, startDate, progress: {} });
    localStorage.setItem('quran_tracker_v7', JSON.stringify(pages));
    document.getElementById('pageNumber').value = '';
    renderPathLogic();
    showToast("تمت الإضافة للجدول");
}

function changePathCount(pageIndex, dayIndex, step, max) {
    let pages = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
    if (!pages[pageIndex].progress) pages[pageIndex].progress = {};
    
    let current = pages[pageIndex].progress[dayIndex] || 0;
    let newValue = current + step;

    if (newValue >= 0 && newValue <= max) {
        pages[pageIndex].progress[dayIndex] = newValue;
        localStorage.setItem('quran_tracker_v7', JSON.stringify(pages));
        renderPathLogic();
    }
}

function deletePathItem(index) {
    if(confirm("حذف هذه الصفحة من الجدول؟")) {
        let pages = JSON.parse(localStorage.getItem('quran_tracker_v7') || '[]');
        pages.splice(index, 1);
        localStorage.setItem('quran_tracker_v7', JSON.stringify(pages));
        renderPathLogic();
    }
}

function clearPathData() {
    if(confirm("سيتم مسح كل السجل نهائياً؟")) {
        localStorage.removeItem('quran_tracker_v7');
        renderPathLogic();
    }
}

function exportPathData() {
    const data = localStorage.getItem('quran_tracker_v7');
    if (!data) return showToast("لا توجد بيانات");
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `quran_path_backup.json`;
    a.click();
}