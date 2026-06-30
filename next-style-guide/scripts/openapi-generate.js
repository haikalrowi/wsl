// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const childProcess = require("node:child_process"),
  fs = require("node:fs"),
  path = require("node:path"),
  app = path.resolve("openapi", "app"),
  json = path.resolve(app, "openapi.json"),
  zip = path.resolve(app, "openapi.json.zip");
fetch("https://api.openapi-generator.tech/api/gen/clients/typescript-fetch", {
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ spec: JSON.parse(fs.readFileSync(json, "utf8")) }),
  method: "POST",
})
  .then((response) => response.json())
  .then((json) => fetch(json.link))
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => {
    fs.writeFileSync(zip, new Uint8Array(arrayBuffer));
    childProcess.spawnSync("python3", ["-m", "zipfile", "-e", zip, app]);
    // childProcess.spawnSync("unzip", [zip, "-d", app]);
    fs.rmSync(zip, { recursive: true, force: true });
  });
