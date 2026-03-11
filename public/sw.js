/**
 * AgriScan Service Worker
 * - Cache-first for the TF.js model (large, field-stable files)
 * - Cache-first for compiled JS/CSS/image assets (hash-named, never change)
 * - Network-first with offline fallback for HTML navigation
 * - Passthrough for Firebase API/Storage requests
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `agriscan-shell-${CACHE_VERSION}`;
const MODEL_CACHE = `agriscan-model-${CACHE_VERSION}`;

// Pre-cache minimal app shell on install
const SHELL_URLS = ['/', '/index.html', '/manifest.json'];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (k) =>
                k.startsWith('agriscan-') &&
                k !== SHELL_CACHE &&
                k !== MODEL_CACHE
            )
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Let Firebase backend requests pass through untouched (they have their own retry logic)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebasestorage.googleapis.com') ||
    url.hostname.includes('firebase.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // ── Model files: Cache-first (large, static in field) ──
  if (url.pathname.startsWith('/model/')) {
    event.respondWith(
      caches.open(MODEL_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached || new Response('Model file unavailable offline', { status: 503 }));
        })
      )
    );
    return;
  }

  // ── Compiled assets (hashed filenames): Cache-first ──
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|woff2?|ttf|svg|png|ico|webp|jpg|jpeg)$/))
  ) {
    event.respondWith(
      caches.open(SHELL_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // ── HTML navigation: Network-first, fallback to app shell ──
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches
          .open(SHELL_CACHE)
          .then((cache) => cache.match('/index.html') || cache.match('/'))
      )
    );
    return;
  }

  // ── Everything else: network with cache fallback ──
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
