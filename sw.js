const CACHE_NAME = 'quran-vibe-v3';
const assetsToCache = [
  './',
  './index.html',
  './insights.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Components
  './components/footer.html',
  './components/header.html',
  './components/modals.html',
  // CSS
  './css/cards.css',
  './css/flatpickr.min.css',
  './css/insights.css',
  './css/main.css',
  './css/modals.css',
  // JS
  './js/app.js',
  './js/db.js',
  './js/flatpickr.min.js',
  './js/insights-app.js',
  './js/insights-data.js',
  './js/insights-plan.js',
  './js/insights-ui.js',
  './js/modals.js',
  './js/models.js',
  './js/quranData.js',
  './js/ui-actions.js',
  './js/ui-render.js' 
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching all assets...');
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});