function openSheet(id) { document.getElementById(id).classList.add('open'); }
function closeSheet(id) { document.getElementById(id).classList.remove('open'); }
function closeSheetOnOverlay(e, id) { if(e.target.id === id) closeSheet(id); }

function togglePlanFields() {
  const plan = document.getElementById('f_plan').value;
  document.getElementById('repeatingFields').style.display = plan === 'repeating' ? 'block' : 'none';
  document.getElementById('customFields').style.display = plan === 'custom' ? 'block' : 'none';
}

function openAddSheet() {
  appState.editingId = null;
  document.getElementById('addSheetTitle').innerText = '✦ إضافة محفوظة';
  document.getElementById('f_content').value = '';
  document.getElementById('f_pages').value = '';
  document.getElementById('f_date').value = appState.currentDateStr;
  document.getElementById('f_note').innerHTML = '';
  document.getElementById('f_plan').value = 'default';
  document.getElementById('f_custom').value = '';
  togglePlanFields();
  openSheet('addSheet');
}

function openEditSheet(id) {
  const item = appState.items.find(i => i.id === id);
  if(!item) return;
  appState.editingId = id;
  document.getElementById('addSheetTitle').innerText = '✎ تعديل المحفوظة';
  document.getElementById('f_content').value = item.content || '';
  document.getElementById('f_pages').value = item.pages || '';
  document.getElementById('f_date').value = item.date || '';
  document.getElementById('f_note').innerHTML = item.note || '';
  document.getElementById('f_plan').value = item.scheduleType;
  if(item.interval) document.getElementById('f_interval').value = item.interval;
  if(item.customPlan) document.getElementById('f_custom').value = item.customPlan;
  togglePlanFields();
  openSheet('addSheet');
}

function openImportSheet() { openSheet('importSheet'); }

async function saveItem() {
  const item = {
    id: appState.editingId || crypto.randomUUID(),
    content: document.getElementById('f_content').value,
    pages: document.getElementById('f_pages').value,
    date: document.getElementById('f_date').value,
    note: document.getElementById('f_note').innerHTML,
    scheduleType: document.getElementById('f_plan').value,
    interval: document.getElementById('f_interval').value,
    customPlan: document.getElementById('f_custom').value
  };
  if(!item.content) return showToast("أدخل المحتوى");
  await putItem(item);
  closeSheet('addSheet');
  await loadData(); renderApp(); showToast("تم الحفظ");
}