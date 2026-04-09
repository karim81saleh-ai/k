/**
 * Path Manager - منطق إدارة تبويب المسارات (نظام التكرار المتباعد)
 * تم دمج المنطق مع نظام IndexedDB الخاص بالتطبيق
 */

const REPETITION_SCHEDULE = [20, 6, 5, 4, 3, 2, 1, 1];
const SPACED_DAYS = [10, 17, 30];

/**
 * دالة رسم تبويب المسارات
 * تستدعى عند النقر على تبويب "المسارات"
 */
async function renderPathTab() {
    const container = document.getElementById('mainContent');
    if (!container) return;

    // 1. جلب البيانات من IndexedDB
    const items = await getItems();
    
    // 2. فلترة العناصر التي تنتمي للمسارات فقط
    const pathItems = items.filter(item => item.isPathItem === true);

    let currentCardsHTML = '';
    let spacedCardsHTML = '';
    
    // 3. تحديد تاريخ اليوم بناءً على حالة التطبيق
    const todayStr = appState.currentDateStr;
    const today = new Date(todayStr).setHours(0,0,0,0);

    // 4. بناء البطاقات
    pathItems.forEach(item => {
        const start = new Date(item.date).setHours(0,0,0,0);
        // حساب الأيام المنقضية بدقة
        const daysPassed = Math.round((today - start) / (1000 * 60 * 60 * 24));
        
        let totalRequired = 0;
        let isSpaced = false;
        let shouldShow = false;

        // تحديد ما إذا كان العنصر مطلوباً اليوم والعدد المطلوب
        if (daysPassed >= 0 && daysPassed <= 7) {
            totalRequired = REPETITION_SCHEDULE[daysPassed];
            shouldShow = true;
        } else if (SPACED_DAYS.includes(daysPassed)) {
            totalRequired = 1;
            shouldShow = true;
            isSpaced = true;
        }

        // رسم البطاقة إذا كانت مطلوبة
        if (shouldShow) {
            const doneCount = (item.pathProgress && item.pathProgress[todayStr]) ? item.pathProgress[todayStr] : 0;
            const remaining = totalRequired - doneCount;
            const isNew = daysPassed === 0;

            const cardHTML = `
                <div class="item-card path-card ${isNew ? 'is-new-path' : ''} ${isSpaced ? 'is-spaced-path' : ''}" style="position: relative;">
                    <button class="btn-delete-path" 
                            onclick="handleDeletePath('${item.id}')" 
                            title="حذف من المسار"
                            style="position: absolute; top: 5px; left: 8px; background: none; border: none; color: #888; cursor: pointer; font-size: 1.2rem; font-weight: bold; padding: 0; line-height: 1; z-index: 10;">
                        ×
                    </button>

                    <div class="card-main">
                        <div class="card-header" style="padding-left: 25px;"> <div class="card-title">
                                <h3>${item.content}</h3>
                                <div class="badge-mini">${isNew ? 'حفظ جديد' : 'اليوم ' + daysPassed}</div>
                            </div>
                        </div>
                        <div class="path-counter-wrapper">
                            <div class="counter-btns">
                                <button class="btn-step" onclick="updatePathCount('${item.id}', 1, ${totalRequired})">+</button>
                                <span class="count-num">${doneCount}</span>
                                <button class="btn-step" onclick="updatePathCount('${item.id}', -1, ${totalRequired})" ${doneCount <= 0 ? 'disabled' : ''}>-</button>
                            </div>
                            <div class="path-status ${remaining <= 0 ? 'completed' : ''}">
                                ${remaining <= 0 ? '✅ تم' : 'باقي: ' + remaining}
                            </div>
                        </div>
                    </div>
                </div>`;

            if (isSpaced) spacedCardsHTML += cardHTML;
            else currentCardsHTML += cardHTML;
        }
    });

    // 5. حقن المحتوى في الصفحة
    container.innerHTML = `
        <div class="path-section">
            <div class="path-header-actions">
                <button class="btn-primary" onclick="openAddPathSheet()">+ إضافة صفحة للمسار</button>
            </div>
            
            <section class="path-group">
                <h4 class="group-title">🔥 التكرار المكثف (أول 7 أيام)</h4>
                <div class="path-grid">${currentCardsHTML || '<p class="empty-msg">لا يوجد مهام مكثفة اليوم</p>'}</div>
            </section>

            <section class="path-group">
                <h4 class="group-title">🛰️ التكرار المتباعد (10، 17، 30)</h4>
                <div class="path-grid">${spacedCardsHTML || '<p class="empty-msg">لا يوجد مراجعة متباعدة اليوم</p>'}</div>
            </section>
        </div>
    `;
}

/**
 * تحديث عداد التكرار للعنصر
 */
async function updatePathCount(id, step, max) {
    const items = await getItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (!item.pathProgress) item.pathProgress = {};
    
    const todayStr = appState.currentDateStr;
    let current = item.pathProgress[todayStr] || 0;
    let newValue = current + step;

    if (newValue >= 0 && newValue <= max) {
        item.pathProgress[todayStr] = newValue;
        await putItem(item); // حفظ في IndexedDB
        renderPathTab(); // إعادة رسم التبويب
        if(typeof showToast === 'function') showToast("تم تحديث التقدم");
    }
}

/**
 * حذف عنصر من المسار
 */
async function handleDeletePath(id) {
    if (confirm("هل تريد إزالة هذه الصفحة من المسارات نهائياً؟")) {
        await deleteItem(id); // الحذف من IndexedDB
        renderPathTab(); // إعادة رسم الواجهة
        if(typeof showToast === 'function') showToast("تم الحذف");
    }
}

/**
 * فتح واجهة إضافة مسار جديد
 */
function openAddPathSheet() {
    if(typeof openSheet === 'function') {
        appState.editingId = null;
        // ملاحظة مبرمج: يجب التأكد أن دالة الحفظ في modals.js تضع tag 'isPathItem: true'
        openSheet('addSheet'); 
    } else {
        alert("دالة فتح النموذج غير معرفة (openSheet)");
    }
} 