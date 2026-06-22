import fs from "node:fs";

(async function (username = process.argv[2], output = `${process.argv[1]}.md`) {
  const sponsors = new Set();
  const getSponsors = async (filter = "", page = 0) => {
    const request = new Request(
      `https://github.com/sponsors/${username}/sponsors_partial?filter=${filter}&page=${page}`,
    );
    const response = await fetch(request).catch((reason) => {
      return new Response(null, { headers: { "x-catch": `${reason}` } });
    });
    const text = await response.text();
    const regexp = /href="(\/.*?)"/g;
    for (const [, href] of text.matchAll(regexp)) {
      const username = href.slice(1);
      if (username) {
        sponsors.add(
          `![${filter}](https://github.com/${username}.png)\n<br>\n\`${username}\`,(${(await getDetails(username)).join(",")})`,
        );
      }
    }
    console.log(request.url, response.status, response.headers.get("x-catch"));
  };
  const getDetails = async (username = "") => {
    const request = new Request(`https://github.com/${username}`);
    const response = await fetch(request);
    const text = await response.text();
    return [
      text.match(/title="Label: Verified"/g) ? "Verified" : "",
      text.match(/title="Label: GitHub Sponsor"/g) ? "Sponsor" : "",
    ].filter((value) => value);
  };
  const promises = [];
  for (const page of Array(50).keys()) {
    promises.push(getSponsors("active", page), getSponsors("inactive", page));
  }
  await Promise.all(promises);
  fs.writeFileSync(output, Array.from(sponsors).sort().join("\n\n"));
})();
