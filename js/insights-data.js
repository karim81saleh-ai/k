// js/insights-data.js - إدارة جلب وحفظ بيانات السور المحفوظة

const INSIGHTS_DB_KEY = "memorized_quran_data";

// كائن لتخزين حالة الحفظ الحالية (رقم السورة: عدد الصفحات المحفوظة)
let memorizedData = {};

/**
 * جلب بيانات الحفظ من قاعدة البيانات
 */
async function loadInsightsData() {
    const data = await getMeta(INSIGHTS_DB_KEY);
    memorizedData = data || {};
    return memorizedData;
}

/**
 * حفظ تحديثات سورة معينة
 * @param {number} surahId - رقم السورة
 * @param {number} pagesSaved - عدد الصفحات المحفوظة
 */
async function saveSurahProgress(surahId, pagesSaved) {
    // التأكد من أن الرقم لا يتجاوز منزلة عشرية واحدة
    memorizedData[surahId] = Math.round((parseFloat(pagesSaved) || 0) * 10) / 10;
    await setMeta(INSIGHTS_DB_KEY, memorizedData);
}

/**
 * حساب إجمالي الصفحات المحفوظة والكلية
 */
function getCalculatedStats() {
    let totalMemorized = 0;
    let totalQuranPages = 0;

    QURAN_DATA.forEach(surah => {
        totalQuranPages += surah.actualPages;
        if (memorizedData[surah.id] !== undefined) {
            // نجمع القيمة المحفوظة كما هي (سواء كانت 20 أو 47)
            totalMemorized += memorizedData[surah.id];
        }
    });

    return {
        // التقريب النهائي لمنزلة عشرية واحدة
        memorized: Math.round(totalMemorized * 10) / 10,
        total: Math.round(totalQuranPages * 10) / 10,
        remaining: Math.round((totalQuranPages - totalMemorized) * 10) / 10
    };
}