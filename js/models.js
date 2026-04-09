/**
 * دالة للحصول على التاريخ المحلي للجهاز بصيغة YYYY-MM-DD
 * تضمن الانتقال الفوري لليوم التالي عند الساعة 00:00 حسب توقيت المستخدم المحلي
 */
function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// متغير داخلي لتتبع "آخر يوم حقيقي" تمت فيه المزامنة
let lastKnownToday = getLocalDateString();

const appState = {
  items: [],
  completedWirds: new Set(),
  activeFilter: 'wird',
  currentDateStr: getLocalDateString(), // يبدأ التطبيق دائماً بيوم اليوم
  editingId: null
};

// تم تغيير ARCHIVE إلى OVERDUE (متجاوز)
const STATUS_AR = { NEW: "جديد", TAWKEEN: "تمكين", SPACED: "متباعد", REVIEW: "مراجعة", WAIT: "انتظار", OVERDUE: "متجاوز" };
const WIRD_SET = new Set(["NEW", "TAWKEEN", "SPACED", "REVIEW"]);

/**
 * حساب فرق الأيام بناءً على التوقيت المحلي الصرف
 * مع استخدام Math.round لتفادي مشاكل التوقيت الصيفي (DST)
 */
function getDiffDays(dateString) {
  // حماية إضافية تمنع الانهيار إن كان التاريخ مفقوداً
  if (!dateString) dateString = appState.currentDateStr;

  const [tYear, tMonth, tDay] = appState.currentDateStr.split('-').map(Number);
  const targetLocal = new Date(tYear, tMonth - 1, tDay);
  
  const cleanDate = dateString.includes('T') ? dateString.split('T')[0] : dateString;
  const [iYear, iMonth, iDay] = cleanDate.split('-').map(Number);
  const itemLocal = new Date(iYear, iMonth - 1, iDay);
  
  return Math.round((targetLocal - itemLocal) / 86_400_000);
}

function resolveStatus(item, diff) {
  if (diff < 0) return "WAIT";
  
  if (item.scheduleType === 'repeating') {
    const interval = parseInt(item.interval) || 15;
    return (diff % interval === 0) ? "REVIEW" : "WAIT";
  }
  
  if (item.scheduleType === 'custom') {
    const days = (item.customPlan || "").split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (days.includes(diff)) return "REVIEW";
    if (days.length > 0 && diff < Math.max(...days)) return "WAIT";
    return "OVERDUE"; // بدلاً من الأرشفة
  }
  
  if (diff === 0) return "NEW";
  if (diff >= 1 && diff <= 7) return "TAWKEEN";
  if ([10, 17, 30].includes(diff)) return "SPACED";
  if (diff < 30) return "WAIT";
  return "OVERDUE"; // بدلاً من الأرشفة
}

function getNextReviewDays(item, diff) {
  if (diff < 0) return Math.abs(diff); 
  
  if (item.scheduleType === 'repeating') {
    const interval = parseInt(item.interval) || 15;
    const remainder = diff % interval;
    return remainder === 0 ? interval : interval - remainder;
  }
  
  if (item.scheduleType === 'custom') {
    const days = (item.customPlan || "").split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)).sort((a,b)=>a-b);
    const next = days.find(d => d > diff);
    return next ? next - diff : null;
  }
  
  const defaultDays = [1, 2, 3, 4, 5, 6, 7, 10, 17, 30];
  const next = defaultDays.find(d => d > diff);
  return next ? next - diff : null;
}

/**
 * دالة تحميل البيانات مع منطق المزامنة الذكي (Smart Sync)
 */
async function loadData() {
  const actualToday = getLocalDateString();
  
  if (appState.currentDateStr === lastKnownToday) {
      appState.currentDateStr = actualToday;
  }
  
  lastKnownToday = actualToday;

  const raw = await getItems();
  const progress = await getMeta('prog_' + appState.currentDateStr);
  appState.completedWirds = new Set(progress || []);

  appState.items = raw.map(r => {
    const diff = getDiffDays(r.date);
    return {
      ...r,
      scheduleType: r.scheduleType || r.schedule || 'default',
      _diffDays: diff,
      _status: resolveStatus(r, diff),
      _nextDays: getNextReviewDays(r, diff)
    };
  }).sort((a,b) => new Date(b.date) - new Date(a.date));
}