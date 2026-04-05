// js/insights-app.js - نقطة تشغيل صفحة الرؤى

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1. تهيئة الاتصال بقاعدة البيانات وجلب المحفوظات
        await initDB();
        await loadInsightsData();
        
        // 2. رسم الواجهة
        renderInsightsSummary();
        renderQuranIndex();
        await renderPlanTab(); // 💡 الإصلاح: استدعاء الدالة لجلب خطط الحفظ عند التحديث
        
    } catch (error) {
        console.error("حدث خطأ أثناء تحميل بيانات الرؤى:", error);
    }
});