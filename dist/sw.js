// Minimal service worker to enable offline caching for the SPA
const CACHE_NAME = 'nepal-connect-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css'
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)))
})

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)))
})
