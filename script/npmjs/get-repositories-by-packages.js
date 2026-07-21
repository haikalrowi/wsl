const fs = require("node:fs"),
  md = String.raw,
  output = `${process.argv[1]}.md`,
  packages = md`
@mantine/hooks@^9.0.0
react-dom@^19.0.0
react@^19.0.0
scheduler@^0.x.x
  `,
  repositoryPattern =
    /href="(https:\/\/github\.com\/.*?)".*?i-simple-icons:github/,
  repositories = /** @type {Set<string>} */ (new Set()),
  delay = () => new Promise((resolve) => setTimeout(resolve, 101));
Array.from(packages.split(/\s+/).slice(1, -1), (package_) => {
  return () => {
    return fetch(
      `https://npmx.dev/package/${package_.replace(/(.+?)@(.+?)/, "$1/v/$2")}`,
    )
      .then((response) => Promise.all([response, response.text()]))
      .then(([response, text]) => {
        repositories.add(
          `- ${text.match(repositoryPattern)?.[1]}#_${package_}`,
        );
        console.log(response.url, "ok");
      });
  };
})
  .reduce((a, b) => a.then(b).then(delay), Promise.resolve())
  .then(() => {
    fs.writeFileSync(output, Array.from(repositories).sort().join("\n"));
  });
