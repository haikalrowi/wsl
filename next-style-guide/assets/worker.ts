/// <reference lib="webworker" />

import { expose } from "comlink";

const api = {
  getDateNow() {
    const start = Date.now();
    while (Date.now() - start <= 1e3) {}
    return Date.now() - start;
  },
};

const self_ = self as typeof globalThis;

if (
  self_.DedicatedWorkerGlobalScope &&
  self_ instanceof DedicatedWorkerGlobalScope
) {
  expose(api);
} else if (
  self_.SharedWorkerGlobalScope &&
  self_ instanceof SharedWorkerGlobalScope
) {
  self_.onconnect = (e) => {
    expose(api, e.ports[0]);
  };
}

export type Api = typeof api;
