// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */

const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const jsonSpec = require("../openapi/app/openapi.json");
  const base = path.resolve("openapi", "app");

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
    const zipArrayBUffer = await zipResponse.arrayBuffer();
    const file = path.resolve(base, "openapi.json.zip");
    fs.writeFileSync(file, new Uint8Array(zipArrayBUffer));
    child_process.spawnSync("unzip", [file, "-d", base]);
  }
})();
