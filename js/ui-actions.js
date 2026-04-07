function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

async function changeSimDate(val) {
  appState.currentDateStr = val || new Date().toISOString().split('T')[0];
  document.getElementById('simDate').value = appState.currentDateStr;
  await loadData();
  renderApp();
}

async function toggleWird(checkbox, id) {
  if(checkbox.checked) appState.completedWirds.add(id);
  else appState.completedWirds.delete(id);
  await setMeta('prog_' + appState.currentDateStr, Array.from(appState.completedWirds));
  
  const card = checkbox.closest('.item-card');
  card.classList.toggle('completed', checkbox.checked);
  
  // تطبيق تأثير الشطب والشفافية لحظياً على العنوان
  const titleEl = card.querySelector('.card-title');
  if (titleEl) {
    titleEl.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
    titleEl.style.opacity = checkbox.checked ? '0.6' : '1';
  }
  
  // تحديث العدادات (هذه الدالة ستقوم بخصم صفحات الورد المكتمل من المطلوب اليوم)
  renderStats(); 
}

function setFilter(f) {
  appState.activeFilter = f;
  renderApp();
}

async function exportData() {
  const data = await getItems();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tamkeen_backup_${appState.currentDateStr}.json`;
  a.click();
}

async function importData() {
  const file = document.getElementById('importFile').files[0];
  if(!file) return showToast("اختر ملفاً");
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      await replaceAllItems(data);
      closeSheet('importSheet');
      await loadData(); renderApp(); showToast("تم الاستيراد بنجاح");
    } catch { showToast("ملف غير صالح"); }
  };
  reader.readAsText(file);
}

async function removeCard(id) {
  if(!confirm("حذف هذه المحفوظة نهائياً؟")) return;
  await deleteItem(id);
  await loadData(); renderApp(); showToast("تم الحذف");
}

function navigateToInsights() {
    // الانتقال لصفحة الرؤى
    window.location.href = 'insights.html';
}