// js/insights-ui.js - تحديث ورسم واجهة الرؤى والفهرس (نسخة المبرمج الخبير)

/**
 * دالة مساعدة لتنسيق الأرقام 
 */
function formatNumber(num) {
    if (num === 0) return '';
    return Number(Math.round(num * 10) / 10).toString();
}

/**
 * رسم صندوق الإحصائيات العلوي
 */
function renderInsightsSummary() {
    const stats = getCalculatedStats();
    const container = document.getElementById('insights-summary');
    
    container.innerHTML = `
        <div class="stat-item">
            <span class="label">الصفحات المحفوظة</span>
            <span class="value">${formatNumber(stats.memorized) || '0'}</span>
        </div>
        <div class="stat-item">
            <span class="label">إجمالي المصحف</span>
            <span class="value" style="color:var(--text-1)">${formatNumber(stats.total)}</span>
        </div>
        <div class="stat-item">
            <span class="label">المتبقي</span>
            <span class="value remaining">${formatNumber(stats.remaining) || '0'}</span>
        </div>
    `;
}

/**
 * رسم فهرس السور
 */
// js/insights-ui.js - تحديث منطق الألوان الاحترافي

function renderQuranIndex() {
    const container = document.getElementById('quran-index-container');
    
    container.innerHTML = QURAN_DATA.map(surah => {
        const savedPages = memorizedData[surah.id] || 0;
        
        // منطق تحديد الكلاس (اللون)
        let statusClass = '';
        if (savedPages >= surah.actualPages) {
            statusClass = 'completed'; // أخضر صريح
        } else if (savedPages > 0) {
            statusClass = 'partial-completed'; // أخضر باهت
        }
        
        return `
        <div class="surah-card ${statusClass}" id="card-${surah.id}">
            <div class="surah-info">
                <span class="surah-id">${surah.id}</span>
                <span class="surah-name">سورة ${surah.name}</span>
            </div>
            <div class="surah-controls">
                <input type="number" 
                       class="pages-input" 
                       id="input-${surah.id}" 
                       value="${formatNumber(savedPages)}" 
                       placeholder="${surah.actualPages}" 
                       step="0.1" 
                       oninput="handlePageInputChange(${surah.id}, this.value, ${surah.actualPages})">
                
                <input type="checkbox" 
                       class="surah-checkbox" 
                       id="check-${surah.id}" 
                       ${savedPages > 0 ? 'checked' : ''}
                       onchange="handleCheckboxChange(${surah.id}, this.checked, ${surah.actualPages})">
            </div>
        </div>
        `;
    }).join('');
}

// دالة مساعدة لتحديث شكل الكرت فورياً
function updateCardStyle(surahId, pages, total) {
    const card = document.getElementById(`card-${surahId}`);
    card.classList.remove('completed', 'partial-completed');
    
    if (pages >= total) {
        card.classList.add('completed');
    } else if (pages > 0) {
        card.classList.add('partial-completed');
    }
}

async function handleCheckboxChange(surahId, isChecked, totalActualPages) {
    const inputElement = document.getElementById(`input-${surahId}`);
    let newPagesValue = isChecked ? (parseFloat(inputElement.value) || totalActualPages) : 0;
    
    inputElement.value = formatNumber(newPagesValue);
    updateCardStyle(surahId, newPagesValue, totalActualPages);
    
    await saveSurahProgress(surahId, newPagesValue);
    renderInsightsSummary();
}

/**
 * معالجة الإدخال اليدوي
 */
async function handlePageInputChange(surahId, inputValue, totalActualPages) {
    const checkboxElement = document.getElementById(`check-${surahId}`);
    const cardElement = document.getElementById(`card-${surahId}`);
    
    let parsedValue = parseFloat(inputValue) || 0;
    
    // قيود الإدخال
    if (parsedValue < 0) parsedValue = 0;
    if (parsedValue > totalActualPages) parsedValue = totalActualPages;
    
    // التقريب
    parsedValue = Math.round(parsedValue * 10) / 10;
    
    // التعديل الجوهري: تحديث حالة الـ Checkbox بناءً على وجود قيمة أكبر من صفر
    const hasProgress = parsedValue > 0;
    checkboxElement.checked = hasProgress;
    cardElement.classList.toggle('completed', hasProgress);
    
    // تحديث البيانات في الخلفية دون إعادة رسم القائمة كاملة للحفاظ على التركيز (Focus)
    await saveSurahProgress(surahId, parsedValue);
    renderInsightsSummary();
}

/**
 * التبديل بين التبويبات (الفهرس / الخطة)
 * @param {string} tabId - معرف القسم المراد إظهاره
 * @param {HTMLElement} btnElement - الزر الذي تم النقر عليه
 */
function switchTab(tabId, btnElement) {
    // 1. إخفاء جميع محتويات التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. إزالة حالة النشاط من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. إظهار التبويب المختار وتفعيل الزر الخاص به
    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
    
    // ملاحظة احترافية: إذا كنا في التبويب، نتأكد من رسم محتواه بالكامل
    if (tabId === 'index-tab') {
        renderQuranIndex();
    } else if (tabId === 'plan-tab') {
        renderPlanTab(); // 💡 الإصلاح: استدعاء الدالة عند فتح التبويب لضمان التحديث المستمر
    }
}