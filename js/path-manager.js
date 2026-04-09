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

    // جلب البيانات من IndexedDB (نفس المصدر الرئيسي للتطبيق)
    const items = await getItems();
    
    // فلترة العناصر التي تنتمي للمسارات فقط (بناءً على وجود خاصية المسار أو نوع معين)
    // هنا سنفترض أن أي عنصر يحمل وسم 'path' أو يتم تمييزه بنظام المسارات
    const pathItems = items.filter(item => item.isPathItem === true);

    let currentCardsHTML = '';
    let spacedCardsHTML = '';
    
    const todayStr = appState.currentDateStr;
    const today = new Date(todayStr).setHours(0,0,0,0);

    pathItems.forEach(item => {
        const start = new Date(item.date).setHours(0,0,0,0);
        const daysPassed = Math.round((today - start) / (1000 * 60 * 60 * 24));
        
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
            const doneCount = (item.pathProgress && item.pathProgress[todayStr]) ? item.pathProgress[todayStr] : 0;
            const remaining = totalRequired - doneCount;
            const isNew = daysPassed === 0;

            const cardHTML = `
                <div class="item-card ${isNew ? 'is-new-path' : ''} ${isSpaced ? 'is-spaced-path' : ''}">
                    <div class="card-main">
                        <div class="card-header">
                            <div class="card-title">
                                <h3>${item.content}</h3>
                                <div class="badge-mini">${isNew ? 'حفظ جديد' : 'اليوم ' + daysPassed}</div>
                            </div>
                            <button class="btn-del-mini" onclick="handleDeletePath('${item.id}')">×</button>
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
        showToast("تم تحديث التقدم");
    }
}

/**
 * حذف عنصر من المسار
 */
async function handleDeletePath(id) {
    if (confirm("هل تريد إزالة هذه الصفحة من المسارات؟")) {
        await deleteItem(id);
        renderPathTab();
        showToast("تم الحذف");
    }
}

/**
 * فتح واجهة إضافة مسار جديد (يمكنك ربطها بـ modals.js)
 */
function openAddPathSheet() {
    // منطق فتح الشيت الخاص بالإضافة
    // يمكن استدعاء openAddSheet() وتعديل الـ State ليكون العنصر الجديد مخصص للمسارات
    appState.editingId = null;
    openSheet('addSheet');
    // إضافة علامة مخفية أو وسام يحدد أن هذا العنصر 'isPathItem: true' عند الحفظ
}