// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

(async function () {
  const openapiApp = path.resolve("openapi", "app");
  const openapiJson = fs.readFileSync(
    path.resolve(openapiApp, "openapi.json"),
    { encoding: "utf8" },
  );
  const fetchedZipLink = await fetch(
    "https://api.openapi-generator.tech/api/gen/clients/typescript-fetch",
    {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ spec: JSON.parse(openapiJson) }),
      method: "POST",
    },
  );
  const fetchedZipLinkJson = await fetchedZipLink.json();
  const fetchedZip = await fetch(fetchedZipLinkJson?.link);
  const openapiZip = path.resolve(openapiApp, "openapi.json.zip");
  fs.writeFileSync(openapiZip, new Uint8Array(await fetchedZip.arrayBuffer()));
  child_process.spawnSync("python3", [
    "-m",
    "zipfile",
    "-e",
    openapiZip,
    openapiApp,
  ]);
  // child_process.spawnSync("unzip", [openapiFilePath, "-d", openapiApp]);
  fs.rmSync(openapiZip, { recursive: true, force: true });
})();
