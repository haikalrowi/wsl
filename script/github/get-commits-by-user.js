// @ts-check

import fs from "node:fs";
import path from "node:path";

const task = {
  input: {
    githubUsername: new URL(`/${process.argv[2]}`, "https://github.com/"),
    startYear: +process.argv[3] || new Date().getFullYear(),
    endYear: +process.argv[4] || 2000,
  },
  process: {
    main: async (
      githubUsername = new URL(""),
      startYear = 0,
      endYear = 0,
      output = path.resolve(),
    ) => {
      const years = [];
      for (const year in Array.from({ length: 1 + startYear - endYear })) {
        for (const month in Array.from({ length: 12 })) {
          years.push(new Date(startYear - +year, 11 - +month));
        }
      }
      const responses = [];
      for (const item of years) {
        const year = Intl.DateTimeFormat("en", { year: "numeric" }).format(
          item,
        );
        const month = Intl.DateTimeFormat("en", { month: "2-digit" }).format(
          item,
        );
        const url = new URL(
          `?tab=overview&from=${year}-${month}-31&to=${year}-${month}-01`,
          githubUsername,
        );
        console.log(`${url}`);
        const fetched = fetch(url, {
          headers: { "x-requested-with": "XMLHttpRequest" },
        });
        responses.push(fetched.then((response) => response.text()));
      }
      const pattern = /href="(.*?)"/;
      const links = [];
      for (const item of await Promise.all(responses)) {
        const matched = item.match(new RegExp(pattern, "g"));
        for (const item of matched || []) {
          const link = item.match(pattern)?.[1];
          if (link?.includes("/commits?author=")) {
            links.push(`${new URL(link, githubUsername)}`);
          }
        }
      }
      fs.writeFileSync(
        output,
        JSON.stringify(Array.from(new Set(links.sort())), null, 2),
      );
    },
  },
  output: {
    path: path.resolve(process.cwd(), "output.json"),
  },
};

task.process.main(
  task.input.githubUsername,
  task.input.startYear,
  task.input.endYear,
  task.output.path,
);
