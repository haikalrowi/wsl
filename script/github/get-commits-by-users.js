const fs = require("node:fs"),
  output = `${process.argv[1]}.md`,
  users = process.argv.slice(2),
  fromYear = new Date().getFullYear(),
  toYear = 2000,
  dates = Array.from({ length: (1 + fromYear - toYear) * 12 }, (_, index) => {
    const year = fromYear - Math.floor(index / 12);
    const month = index % 12;
    return /** @type {const} */ ([
      `0000${year}`.slice(-4),
      `00${month + 1}`.slice(-2),
      `00${new Date(year, month + 1, 0).getDate()}`.slice(-2),
    ]);
  }),
  commitPattern = /href="\/(.*?\/commits\?author=.*?)"/g,
  commits = /** @type {Set<string>} */ (new Set()),
  delay = () => new Promise((resolve) => setTimeout(resolve, 101));
Array.from({ length: users.length * dates.length }, (_, index) => {
  return () => {
    const user = users[Math.floor(index / dates.length)],
      date = dates[index % dates.length];
    return fetch(
      `https://github.com/${user}?tab=overview&from=${date[0]}-${date[1]}-01&to=${date[0]}-${date[1]}-${date[2]}`,
      { headers: { "x-requested-with": "XMLHttpRequest" } },
    )
      .then((response) => Promise.all([response, response.text()]))
      .then(([response, text]) => {
        Array.from(text.matchAll(commitPattern), ([, commitHref]) => {
          commits.add(`- https://github.com/${commitHref}`);
        });
        console.log(response.url, "ok");
      });
  };
})
  .reduce((a, b) => a.then(b).then(delay), Promise.resolve())
  .then(() => {
    fs.writeFileSync(output, Array.from(commits).sort().join("\n"));
  });
