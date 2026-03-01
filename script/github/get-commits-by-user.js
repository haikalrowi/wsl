// @ts-check

import fs from "node:fs";
import path from "node:path";

const task = {
  input: {
    githubUrl: new URL(`/${process.argv[2]}`, "https://github.com/"),
    yearFrom: +process.argv[3] || new Date().getFullYear(),
    yearTo: +process.argv[4] || 2000,
  },
  process: {
    main: async (
      /** @type {URL} */ githubUrl,
      /** @type {number} */ yearFrom,
      /** @type {number} */ yearTo,
      /** @type {string} */ output,
    ) => {
      const years = [];
      for (const year in Array.from({ length: 1 + yearFrom - yearTo })) {
        for (const month in Array.from({ length: 12 })) {
          years.push(new Date(yearFrom - +year, 11 - +month));
        }
      }
      const linksPromise = [];
      for (const item of years) {
        async function getLinks() {
          const year = Intl.DateTimeFormat("en", { year: "numeric" }).format(
            item,
          );
          const month = Intl.DateTimeFormat("en", { month: "2-digit" }).format(
            item,
          );
          const dateTo = Intl.DateTimeFormat("en", { day: "2-digit" }).format(
            new Date(item.getFullYear(), item.getMonth() + 1, 0),
          );
          githubUrl.search = `?tab=overview&from=${year}-${month}-01&to=${year}-${month}-${dateTo}`;
          console.log(`${githubUrl}`);
          const response = await fetch(githubUrl, {
            headers: { "x-requested-with": "XMLHttpRequest" },
          });
          const text = await response.text();
          return Array.from(
            text.matchAll(/href\=\"(.*?\/commits\?author\=.*?)\"/g),
            (item) => `${new URL(item[1], githubUrl)}`,
          );
        }
        linksPromise.push(getLinks());
      }
      const links = await Promise.all(linksPromise);
      fs.writeFileSync(
        output,
        JSON.stringify(Array.from(new Set(links.flat(1))).sort(), null, 2),
      );
    },
  },
  output: {
    path: path.resolve(process.cwd(), "output.json"),
  },
};

task.process.main(
  task.input.githubUrl,
  task.input.yearFrom,
  task.input.yearTo,
  task.output.path,
);
