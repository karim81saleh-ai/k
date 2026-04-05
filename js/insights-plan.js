// js/insights-plan.js - محرك المحاكاة الزمنية

let userPlans = [];

// إعدادات اللغة العربية للتقويم
const ArabicFullLocale = {
    firstDayOfWeek: 6,
    weekdays: {
        shorthand: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
        longhand: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    },
    months: {
        shorthand: ["كانون 2", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين 1", "تشرين 2", "كانون 1"],
        longhand: ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"]
    }
};

/**
 * فتح واجهة إضافة خطة جديدة وتهيئة التقويم
 */
function openPlanSheet() {
    const select = document.getElementById('p_surah');
    // تصفية السور التي لم يتم حفظها بالكامل بعد
    select.innerHTML = QURAN_DATA
        .filter(s => (memorizedData[s.id] || 0) < s.actualPages)
        .map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    // تهيئة التقويم الاحترافي
    flatpickr("#p_start", {
        locale: ArabicFullLocale,
        defaultDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true,
        static: false, 
        onReady: function(selectedDates, dateStr, instance) {
            // منطق عكس الأسهم
            const prevBtn = instance.prevMonthNav;
            const nextBtn = instance.nextMonthNav;

            prevBtn.addEventListener("click", (e) => {
                e.preventDefault(); e.stopPropagation();
                instance.changeMonth(1); // اليمين يأخذ للشهر التالي
            });

            nextBtn.addEventListener("click", (e) => {
                e.preventDefault(); e.stopPropagation();
                instance.changeMonth(-1); // اليسار يأخذ للشهر السابق
            });
        },
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            // تمييز يوم الجمعة
            if (dayElem.dateObj.getDay() === 5) {
                dayElem.classList.add("friday-highlight");
            }
        }
    });

    openSheet('planSheet');
}

/**
 * حفظ المسار الجديد في الـ IndexedDB (Meta)
 */
async function saveNewPlanTrack() {
    const surahId = parseInt(document.getElementById('p_surah').value);
    const weeklyRate = parseFloat(document.getElementById('p_rate').value);
    const startDate = document.getElementById('p_start').value;

    if (!weeklyRate || weeklyRate <= 0) return alert("يرجى إدخال معدل حفظ صحيح");
    if (!startDate) return alert("يرجى تحديد تاريخ البدء");

    const newTrack = { surahId, weeklyRate, startDate };
    
    // جلب الخطط القديمة وإضافة الجديدة
    let currentPlans = await getMeta('quran_plans') || [];
    currentPlans = currentPlans.filter(p => p.surahId !== surahId); // منع التكرار
    currentPlans.push(newTrack);
    
    await setMeta('quran_plans', currentPlans);
    closeSheet('planSheet');
    renderPlanTab();
}

/**
 * المحرك الرياضي لحساب التواريخ
 */
function calculateTrackDetails(track) {
    const surah = QURAN_DATA.find(s => s.id === track.surahId);
    const memorized = memorizedData[track.surahId] || 0;
    const remaining = surah.actualPages - memorized;
    
    const dailyRate = track.weeklyRate / 7;
    const daysRequired = Math.ceil(remaining / dailyRate);
    
    const start = new Date(track.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + daysRequired);
    
    const progressPercent = (memorized / surah.actualPages) * 100;

    return {
        surahName: surah.name,
        remaining,
        endDate: end.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
        rawEndDate: end,
        progressPercent
    };
}

/**
 * رسم تبويبة الخطة
 */
async function renderPlanTab() {
    const plans = await getMeta('quran_plans') || [];
    const container = document.getElementById('active-tracks-container');
    const visionCard = document.getElementById('grand-vision-card');
    
    if (plans.length === 0) {
        container.innerHTML = `<div class="placeholder-card">لا توجد مسارات حفظ حالية. ابدأ بإضافة سورة!</div>`;
        visionCard.style.display = 'none';
        return;
    }

    // 💡 التعديل الجوهري: ترتيب الخطط زمنياً بناءً على تاريخ البدء (الأقرب أولاً)
    plans.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    let latestDate = new Date(0);
    
    container.innerHTML = plans.map(plan => {
        const details = calculateTrackDetails(plan);
        if (details.rawEndDate > latestDate) latestDate = details.rawEndDate;

        return `
            <div class="track-card">
                <div class="track-header">
                    <span class="track-name">سورة ${details.surahName}</span>
                    <span class="delete-track" onclick="deleteTrack(${plan.surahId})">×</span>
                </div>
                <div class="track-stats">
                    <span>المعدل: ${plan.weeklyRate} صفحات/أسبوع</span>
                    <span class="track-end-date">الختم المتوقع: ${details.endDate}</span>
                </div>
                <div class="track-progress-bar">
                    <div class="track-progress-fill" style="width: ${details.progressPercent}%"></div>
                </div>
                <div class="track-stats">
                    <span>متبقي ${details.remaining.toFixed(1)} صفحة</span>
                    <span>إنجاز ${Math.round(details.progressPercent)}%</span>
                </div>
            </div>
        `;
    }).join('');

    // تحديث الرؤية الكبرى
    visionCard.style.display = 'block';
    document.getElementById('final-finish-date').innerText = latestDate.toLocaleDateString('ar-EG', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
}

async function deleteTrack(surahId) {
    let currentPlans = await getMeta('quran_plans') || [];
    currentPlans = currentPlans.filter(p => p.surahId !== surahId);
    await setMeta('quran_plans', currentPlans);
    renderPlanTab();
}