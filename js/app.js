// نقطة الدخول للتطبيق (Bootstrapper)
async function loadComponents() {
  try {
    const [header, footer, modals] = await Promise.all([
      fetch('components/header.html').then(r => r.text()),
      fetch('components/footer.html').then(r => r.text()),
      fetch('components/modals.html').then(r => r.text())
    ]);
    
    document.getElementById('comp-header').innerHTML = header;
    document.getElementById('comp-footer').innerHTML = footer;
    document.getElementById('comp-modals').innerHTML = modals;
    
    document.getElementById('simDate').value = appState.currentDateStr;
  } catch(e) {
    console.error("يرجى تشغيل التطبيق عبر Local Server لتتمكن من تحميل المكونات.", e);
    document.body.innerHTML = "<h3 style='padding:20px'>⚠️ عذراً، يجب تشغيل التطبيق عبر خادم محلي (Live Server) ليعمل نظام الـ Components بشكل صحيح.</h3>";
  }
}

async function refreshApp() {
  await loadData();
  renderApp();
  showToast("تم التحديث");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  await loadData();
  renderApp();
});