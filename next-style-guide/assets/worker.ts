/// <reference lib="webworker" />

import { expose } from "comlink";

const api = {
  getDateNow() {
    const start = Date.now();
    while (Date.now() - start <= 1e3) {}
    return Date.now() - start;
  },
};

const g = self as typeof globalThis;

if (g.DedicatedWorkerGlobalScope && g instanceof DedicatedWorkerGlobalScope) {
  expose(api);
} else if (g.SharedWorkerGlobalScope && g instanceof SharedWorkerGlobalScope) {
  g.onconnect = (e) => {
    expose(api, e.ports[0]);
  };
}

export type Api = typeof api;
