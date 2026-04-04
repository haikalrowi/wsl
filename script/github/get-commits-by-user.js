// @ts-check

import fs from "node:fs";

(async function (
  githubUrl = new URL(`/${process.argv[2]}`, "https://github.com/").href,
  fromYear = new Date().getFullYear(),
  toYear = 2000,
  output = `${new URL(import.meta.url).pathname}.txt`,
  fetchConcurrency = 100,
  fetchDelay = 120e3,
) {
  const years = [];
  for (const year in Array.from({ length: 1 + fromYear - toYear })) {
    for (const month in Array.from({ length: 12 })) {
      years.push(new Date(fromYear - +year, 11 - +month));
    }
  }
  const links = new Set();
  const linkPromises = [];
  for (const item of years) {
    if (linkPromises.length && linkPromises.length % fetchConcurrency === 0) {
      console.log(
        `${Math.floor(linkPromises.length / fetchConcurrency)}/${Math.floor(years.length / fetchConcurrency)}`,
      );
      await new Promise((resolve) => global.setTimeout(resolve, fetchDelay));
    }
    const linkPromise = (async () => {
      const year = Intl.DateTimeFormat("en", { year: "numeric" }).format(item);
      const month = Intl.DateTimeFormat("en", { month: "2-digit" }).format(
        item,
      );
      const dateTo = Intl.DateTimeFormat("en", { day: "2-digit" }).format(
        new Date(item.getFullYear(), item.getMonth() + 1, 0),
      );
      const url = new URL(
        `?tab=overview&from=${year}-${month}-01&to=${year}-${month}-${dateTo}`,
        githubUrl,
      );
      const response = await fetch(url, {
        headers: { "x-requested-with": "XMLHttpRequest" },
      });
      console.log(url.href, response.status);
      const text = await response.text();
      for (const item of text.matchAll(/href="(.*?\/commits\?author=.*?)"/g)) {
        links.add(new URL(item[1], url).href);
      }
    })();
    linkPromises.push(linkPromise);
  }
  await Promise.all(linkPromises);
  fs.writeFileSync(output, Array.from(links).sort().join("\n"));
})();
