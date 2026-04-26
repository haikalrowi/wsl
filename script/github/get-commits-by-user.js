import fs from "node:fs";

(async function (
  user = process.argv[2],
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
  const getCommits = async (/**@type{Date}*/ date) => {
    const year = Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const month = Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    const dateTo = Intl.DateTimeFormat("en", { day: "2-digit" }).format(
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
    );
    const request = new Request(
      `https://github.com/${user}?tab=overview&from=${year}-${month}-01&to=${year}-${month}-${dateTo}`,
      { headers: { "x-requested-with": "XMLHttpRequest" } },
    );
    const response = await fetch(request).catch((reason) => {
      return new Response(null, { headers: { "x-catch": `${reason}` } });
    });
    console.log(request.url, response.status, response.headers.get("x-catch"));
    const text = await response.text();
    const regexp = /href="(\/.*?\/commits\?author=.*?)"/g;
    for (const [, href] of text.matchAll(regexp)) {
      commits.add(`https://github.com/${href.slice(1)}`);
    }
  };
  const waitAndLogProgress = async (
    /**@type{any[]}*/ tasks,
    /**@type{any[]}*/ currentTasks,
    /**@type{number}*/ concurrency,
    /**@type{number}*/ delay,
  ) => {
    if (currentTasks.length && currentTasks.length % concurrency === 0) {
      let second = 0;
      const interval = setInterval(() => {
        const progress = `${Math.floor(currentTasks.length / concurrency)}/${Math.floor(tasks.length / concurrency)}`;
        console.log(progress, (second = second + 1));
      }, 1e3);
      await new Promise((resolve) => {
        setTimeout(resolve, delay);
      });
      clearInterval(interval);
    }
  };
  const promises = [];
  for (const date of dates) {
    await waitAndLogProgress(dates, promises, 100, 120e3);
    promises.push(getCommits(date));
  }
  await Promise.all(promises);
  fs.writeFileSync(output, Array.from(commits).sort().join("\n"));
})();
