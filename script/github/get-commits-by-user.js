// @ts-check

import fs from "node:fs";
import path from "node:path";

const githubSlashUser = new URL(`https://github.com/${process.argv[2]}`);
const startYear = +process.argv[3] || new Date().getFullYear();
const endYear = +process.argv[4] || 2000;
const output = path.resolve(process.cwd(), "output.json");

(async () => {
  const years = [];
  for (const year in Array.from({ length: startYear - endYear })) {
    for (const month in Array.from({ length: 12 })) {
      years.push(new Date(startYear - +year, 11 - +month));
    }
  }
  const responses = [];
  for (const item of years) {
    const year = `${item.getFullYear()}`.padStart(4, "0");
    const month = `${item.getMonth() + 1}`.padStart(2, "0");
    const url = new URL(
      `?tab=overview&from=${year}-${month}-31&to=${year}-${month}-01`,
      githubSlashUser,
    );
    console.log(`${url}`);
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
