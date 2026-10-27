// Zyvorli service worker: the app opens instantly from the saved copy,
// and a fresh copy is fetched quietly in the background for next time.
// Bump V on every release so old copies are replaced.
const V = 'zyvorli-v5';
const FILES = ['./', 'index.html', 'config.js', 'supabase.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      const upgrade = keys.some(k => k !== V);
      return Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))).then(() => self.clients.claim()).then(() => {
        // an older version was running: reload open windows once so they use the new one
        if (upgrade) return self.clients.matchAll({ type: 'window' }).then(list => list.forEach(c => { try { c.navigate(c.url); } catch (e) {} }));
      });
    })
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return; // never cache Supabase calls
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined));
      return hit || net;
    })
  );
});

// Tapping a message alert opens or focuses the app.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
