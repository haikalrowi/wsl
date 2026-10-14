/// <reference lib="webworker" />

const self_ = /** @type {typeof globalThis} */ (self);

if (
  self_.ServiceWorkerGlobalScope &&
  self_ instanceof ServiceWorkerGlobalScope
) {
  self_.oninstall = (e) => {};
  self_.onactivate = (e) => {};
  self_.onfetch = (e) => {
    if (e.request.url.match("/get-date-now")) {
      const start = Date.now();
      while (Date.now() - start <= 1e3) {}
      e.respondWith(new Response(`${Date.now() - start}`));
    }
  };
}
