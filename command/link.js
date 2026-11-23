const fs = require("fs"),
  path = require("path"),
  os = require("os");
const packageJson = require("./package.json");

const target = path.join(
  path.join(os.homedir(), process.argv[2], "extensions"),
  `${packageJson.publisher}.${packageJson.name}-${packageJson.version}`,
);

fs.rmSync(target, { recursive: true, force: true });
fs.symlinkSync(__dirname, target, "junction");
