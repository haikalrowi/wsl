// @ts-check

"use strict";

import fs from "node:fs";
import path from "node:path";

const githubSlashUser = new URL(`https://github.com/${process.argv[2]}`);
const fromYear = +process.argv[3] || new Date().getFullYear();
const toYear = +process.argv[4] || 2000;
const output = path.resolve(process.cwd(), "output.json");

(async () => {
  const years = [];
  for (const iYear in Array.from({ length: fromYear - toYear })) {
    for (const iMonth in Array.from({ length: 12 })) {
      years.push(new Date(fromYear - +iYear, 11 - +iMonth));
    }
  }
  const responses = [];
  for (const item of years.flat(1)) {
    const year = `${item.getFullYear()}`.padStart(4, "0");
    const month = `${item.getMonth() + 1}`.padStart(2, "0");
    const url = `${githubSlashUser}?tab=overview&from=${year}-${month}-31&to=${year}-${month}-01`;
    console.log(url);
    const fetched = fetch(url, {
      headers: { "x-requested-with": "XMLHttpRequest" },
    });
    responses.push(fetched.then((response) => response.text()));
  }
  const linkRegexp = /href="(.*?)"/;
  const links = [];
  for (const item of await Promise.all(responses)) {
    const matched = item.match(new RegExp(linkRegexp, "g"));
    for (const item of matched || []) {
      const link = item.match(linkRegexp)?.[1];
      if (link?.includes("/commits?author=")) {
        links.push(`${new URL(link, githubSlashUser)}`);
      }
    }
  }
  fs.writeFileSync(
    output,
    JSON.stringify(Array.from(new Set(links.sort())), null, 2),
  );
})();
