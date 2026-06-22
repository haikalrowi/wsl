import fs from "node:fs";

(async function (
  usernames = process.argv.slice(2),
  fromYear = new Date().getFullYear(),
  toYear = 2000,
  output = `${process.argv[1]}.md`,
) {
  const dates = [];
  for (const year of Array(1 + fromYear - toYear).keys()) {
    for (const month of Array(12).keys()) {
      dates.push(new Date(fromYear - year, 11 - month));
    }
  }
  const commits = new Set();
  const getCommits = async (username = "", date = new Date()) => {
    const year = `0000${date.getFullYear()}`.slice(-4);
    const month = `00${date.getMonth()}`.slice(-2);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const dateTo = `00${lastDate.getDate()}`.slice(-2);
    const request = new Request(
      `https://github.com/${username}?tab=overview&from=${year}-${month}-01&to=${year}-${month}-${dateTo}`,
      { headers: { "x-requested-with": "XMLHttpRequest" } },
    );
    const response = await fetch(request).catch((reason) => {
      return new Response(null, { headers: { "x-catch": `${reason}` } });
    });
    const text = await response.text();
    const regexp = /href="(\/.*?\/commits\?author=.*?)"/g;
    for (const [, href] of text.matchAll(regexp)) {
      commits.add(`\`${username}\`,https://github.com/${href.slice(1)}`);
    }
    console.log(request.url, response.status, response.headers.get("x-catch"));
  };
  const promises = [];
  for (const username of usernames) {
    for (const date of dates) {
      if (promises.length && promises.length % 100 === 0) {
        let count = 0;
        const intervalDelay = 1e3;
        const timeoutDelay = 120e3;
        const interval = setInterval(() => {
          count = count + 1;
          console.log(
            `${Math.floor((promises.length / (usernames.length * dates.length)) * 100)}%`,
            `${count}/${timeoutDelay / intervalDelay}`,
          );
        }, intervalDelay);
        await new Promise((resolve) => {
          setTimeout(resolve, timeoutDelay);
        });
        clearInterval(interval);
      }
      promises.push(getCommits(username, date));
    }
  }
  await Promise.all(promises);
  fs.writeFileSync(output, Array.from(commits).sort().join("\n"));
})();
