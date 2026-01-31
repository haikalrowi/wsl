// @ts-check

import fs from "node:fs";
import path from "node:path";

const readme = path.resolve("README.md");

(async () => {
  const readmeMd = fs.readFileSync(readme, "utf8");
  const readmeHtml = await fetch("https://api.github.com/markdown", {
    method: "POST",
    headers: { Accept: "text/html", "Content-Type": "application/json" },
    body: JSON.stringify({ text: readmeMd }),
  }).then((r) => r.text());
  fs.writeFileSync(
    path.resolve(".vercel", "output", "static", "index.html"),
    readmeHtml,
  );
})();
