function openSheet(id) { document.getElementById(id).classList.add('open'); }
function closeSheet(id) { document.getElementById(id).classList.remove('open'); }
function closeSheetOnOverlay(e, id) { if(e.target.id === id) closeSheet(id); }

function togglePlanFields() {
  const planEl = document.getElementById('f_plan');
  if (!planEl) return;
  
  const plan = planEl.value;
  const repFields = document.getElementById('repeatingFields');
  const custFields = document.getElementById('customFields');
  
  if (repFields) repFields.style.display = plan === 'repeating' ? 'block' : 'none';
  if (custFields) custFields.style.display = plan === 'custom' ? 'block' : 'none';
}

function openAddSheet() {
  appState.editingId = null;
  const titleEl = document.getElementById('addSheetTitle');
  if (titleEl) titleEl.innerText = '✦ إضافة محفوظة';
  
  const contentEl = document.getElementById('f_content');
  if (contentEl) contentEl.value = '';
  
  const pagesEl = document.getElementById('f_pages');
  if (pagesEl) pagesEl.value = '';
  
  const dateEl = document.getElementById('f_date');
  if (dateEl) dateEl.value = appState.currentDateStr;
  
  const noteEl = document.getElementById('f_note');
  if (noteEl) {
      if (noteEl.tagName === 'TEXTAREA' || noteEl.tagName === 'INPUT') noteEl.value = '';
      else noteEl.innerHTML = '';
  }
  
  const planEl = document.getElementById('f_plan');
  if (planEl) planEl.value = 'default';
  
  const customEl = document.getElementById('f_custom');
  if (customEl) customEl.value = '';
  
  const intervalEl = document.getElementById('f_interval');
  if (intervalEl) intervalEl.value = '15'; // قيمة افتراضية لتجنب الفراغ
  
  togglePlanFields();
  openSheet('addSheet');
}

function openEditSheet(id) {
  const item = appState.items.find(i => i.id === id);
  if(!item) return;
  appState.editingId = id;
  
  const titleEl = document.getElementById('addSheetTitle');
  if (titleEl) titleEl.innerText = '✎ تعديل المحفوظة';
  
  const contentEl = document.getElementById('f_content');
  if (contentEl) contentEl.value = item.content || '';
  
  const pagesEl = document.getElementById('f_pages');
  if (pagesEl) pagesEl.value = item.pages || '';
  
  const dateEl = document.getElementById('f_date');
  if (dateEl) dateEl.value = item.date || '';
  
  const noteEl = document.getElementById('f_note');
  if (noteEl) {
      if (noteEl.tagName === 'TEXTAREA' || noteEl.tagName === 'INPUT') noteEl.value = item.note || '';
      else noteEl.innerHTML = item.note || '';
  }
  
  const planEl = document.getElementById('f_plan');
  if (planEl) planEl.value = item.scheduleType || 'default';
  
  const intervalEl = document.getElementById('f_interval');
  if (intervalEl && item.interval) intervalEl.value = item.interval;
  
  const customEl = document.getElementById('f_custom');
  if (customEl && item.customPlan) customEl.value = item.customPlan;
  
  togglePlanFields();
  openSheet('addSheet');
}

function openImportSheet() { openSheet('importSheet'); }

/**
 * دالة بديلة قوية لتوليد المعرفات في حال عدم دعم المتصفح أو غياب بروتوكول HTTPS
 */
function generateSafeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch(e) {
      // تجاهل الخطأ واللجوء للبديل
    }
  }
  // بديل موثوق يعتمد على الوقت ورقم عشوائي
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

async function saveItem() {
  const contentEl = document.getElementById('f_content');
  if(!contentEl || !contentEl.value.trim()) {
      return showToast("أدخل المحتوى");
  }

  // قراءة الملاحظة بطريقة آمنة سواء كانت Textarea أو Div
  const noteEl = document.getElementById('f_note');
  const noteVal = noteEl ? (noteEl.tagName === 'TEXTAREA' || noteEl.tagName === 'INPUT' ? noteEl.value : noteEl.innerHTML) : '';

  const intervalEl = document.getElementById('f_interval');
  const customEl = document.getElementById('f_custom');
  const pagesEl = document.getElementById('f_pages');
  const dateEl = document.getElementById('f_date');
  const planEl = document.getElementById('f_plan');

  const item = {
    id: appState.editingId || generateSafeId(),
    content: contentEl.value.trim(),
    pages: pagesEl ? pagesEl.value : '',
    date: dateEl ? dateEl.value : appState.currentDateStr,
    note: noteVal,
    scheduleType: planEl ? planEl.value : 'default',
    interval: intervalEl ? intervalEl.value : '',
    customPlan: customEl ? customEl.value : ''
  };
  
  try {
    await putItem(item);
    closeSheet('addSheet');
    await loadData(); 
    renderApp(); 
    showToast("تم الحفظ بنجاح");
  } catch (error) {
    console.error("خطأ أثناء حفظ البيانات:", error);
    showToast("حدث خطأ أثناء الحفظ");
  }
}