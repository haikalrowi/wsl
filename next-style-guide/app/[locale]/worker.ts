/// <reference lib="webworker" />

const workerApi = {
  getDateNow() {
    const start = Date.now();
    while (Date.now() - start <= 2e3) {}
    return Date.now() - start;
  },
};

export type WorkerApi = typeof workerApi;

//#region comlink

import { expose } from "comlink";

declare const self: WorkerGlobalScope;
expose(workerApi);
// declare const self: SharedWorkerGlobalScope;
// self.onconnect = (e) => {
//   expose(workerApi, e.ports[0]);
// };

console.log(self.location);

//#endregion
