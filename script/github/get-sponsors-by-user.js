const fs = require("node:fs"),
  output = `${process.argv[1]}.md`,
  user = process.argv[2],
  filters = ["active", "inactive"],
  pages = Array.from({ length: 10 }, (_, index) => index + 1),
  sponsorPattern = /href="\/(.*?)"/g,
  sponsors = /** @type {Set<string>} */ (new Set()),
  delay = () => new Promise((resolve) => setTimeout(resolve, 101));
Array.from({ length: filters.length * pages.length }, (_, index) => {
  return () => {
    const filter = filters[Math.floor(index / pages.length)],
      page = pages[index % pages.length];
    return fetch(
      `https://github.com/sponsors/${user}/sponsors_partial?filter=${filter}&page=${page}`,
    )
      .then((response) => Promise.all([response, response.text()]))
      .then(([response, text]) => {
        return Array.from(text.matchAll(sponsorPattern), ([, sponsorHref]) => {
          return () => {
            return fetch(`https://github.com/${sponsorHref}`)
              .then((response) => Promise.all([response, response.text()]))
              .then(([response, text]) => {
                const details = [
                  `\`${sponsorHref}\``,
                  `${text.match(/title="Label: Verified"/g) ? "Verified" : ""}`,
                  `${text.match(/title="Label: GitHub Sponsor"/g) ? "Sponsor" : ""}`,
                ].filter((item) => !!item);
                sponsors.add(
                  `- ![${filter}](https://github.com/${sponsorHref}.png)<br>${details.length ? `(${details})` : ""}`,
                );
                console.log(response.url, "ok");
              });
          };
        })
          .reduce((a, b) => a.then(b).then(delay), Promise.resolve())
          .then(() => console.log(response.url, "ok"));
      });
  };
})
  .reduce((a, b) => a.then(b).then(delay), Promise.resolve())
  .then(() => {
    fs.writeFileSync(output, Array.from(sponsors).sort().join("\n"));
  });
