// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  //
  const openapiSpec = require("../openapi/app/openapi.json");
  const openapiPath = path.resolve("openapi", "app");

  //
  const fetchedZip = await fetch(
    "https://api.openapi-generator.tech/api/gen/clients/typescript-fetch",
    {
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ spec: openapiSpec }),
      method: "POST",
    },
  );
  const fetchedZipJson = await fetchedZip.json();
  const fetchedZipLink = await fetch(`${fetchedZipJson?.link}`);
  const openapiFilePath = path.resolve(openapiPath, "openapi.json.zip");
  fs.writeFileSync(
    openapiFilePath,
    new Uint8Array(await fetchedZipLink.arrayBuffer()),
  );
  child_process.spawnSync("unzip", [openapiFilePath, "-d", openapiPath]);
  fs.rmSync(openapiFilePath, { recursive: true, force: true });
})();
