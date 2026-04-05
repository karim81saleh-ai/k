const DB_NAME = "TamkeenPro";
const DB_VERSION = 1;
let _db = null;

async function initDB() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta');
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror = e => reject(e.target.error);
  });
}

async function getItems() {
  await initDB();
  return new Promise(res => {
    const req = _db.transaction('items','readonly').objectStore('items').getAll();
    req.onsuccess = () => res(req.result || []);
  });
}

async function putItem(item) {
  await initDB();
  return new Promise(res => {
    const req = _db.transaction('items','readwrite').objectStore('items').put(item);
    req.onsuccess = () => res();
  });
}

async function deleteItem(id) {
  await initDB();
  return new Promise(res => {
    const req = _db.transaction('items','readwrite').objectStore('items').delete(id);
    req.onsuccess = () => res();
  });
}

async function replaceAllItems(items) {
  await initDB();
  return new Promise(res => {
    const tx = _db.transaction('items','readwrite');
    tx.objectStore('items').clear();
    items.forEach(i => tx.objectStore('items').put(i));
    tx.oncomplete = () => res();
  });
}

async function getMeta(key) {
  await initDB();
  return new Promise(res => {
    const req = _db.transaction('meta','readonly').objectStore('meta').get(key);
    req.onsuccess = () => res(req.result);
  });
}

async function setMeta(key, val) {
  await initDB();
  return new Promise(res => {
    const req = _db.transaction('meta','readwrite').objectStore('meta').put(val, key);
    req.onsuccess = () => res();
  });
}