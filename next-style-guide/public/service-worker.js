/// <reference lib="webworker" />

const g = /** @type {typeof globalThis} */ (self);

if (g.ServiceWorkerGlobalScope && g instanceof ServiceWorkerGlobalScope) {
  g.oninstall = (e) => {};
  g.onactivate = (e) => {};
  g.onfetch = (e) => {
    if (e.request.url.match("/get-date-now")) {
      const start = Date.now();
      while (Date.now() - start <= 1e3) {}
      e.respondWith(new Response(`${Date.now() - start}`));
    }
  };
}
