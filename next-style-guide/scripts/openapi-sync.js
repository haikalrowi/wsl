// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const jsonSpec = require("../openapi/app/openapi.json");
  const basePath = path.resolve("openapi", "app");

  {
    const response = await fetch(
      "https://api.openapi-generator.tech/api/gen/clients/typescript-fetch",
      {
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ spec: jsonSpec }),
        method: "POST",
      },
    );
    const json = await response.json();
    const zipResponse = await fetch(`${json?.link}`);
    const zipArrayBuffer = await zipResponse.arrayBuffer();
    const filePath = path.resolve(basePath, "openapi.json.zip");
    fs.writeFileSync(filePath, new Uint8Array(zipArrayBuffer));
    child_process.spawnSync("unzip", [filePath, "-d", basePath]);
  }
})();
