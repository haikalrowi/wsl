import fs from "node:fs";
import { getGithubDetails } from "../utils/get-github-details.js";

(async function (username = process.argv[2], output = `${process.argv[1]}.md`) {
  const sponsors = new Set();
  const getSponsors = async (
    /**@type{string}*/ filter,
    /**@type{number}*/ page,
  ) => {
    const request = new Request(
      `https://github.com/sponsors/${username}/sponsors_partial?filter=${filter}&page=${page}`,
    );
    const response = await fetch(request).catch((reason) => {
      return new Response(null, { headers: { "x-catch": `${reason}` } });
    });
    console.log(request.url, response.status, response.headers.get("x-catch"));
    const text = await response.text();
    const regexp = /href="(\/.*?)"/g;
    for (const [, href] of text.matchAll(regexp)) {
      const request = new Request(`https://github.com/${href.slice(1)}`);
      const details = [filter, ...(await getGithubDetails(request))];
      sponsors.add(`![${details}](${request.url}.png)`);
    }
  };
  const promises = [];
  for (const page of Array(50).keys()) {
    promises.push(getSponsors("active", page), getSponsors("inactive", page));
  }
  await Promise.all(promises);
  fs.writeFileSync(output, Array.from(sponsors).sort().join("\n"));
})();
