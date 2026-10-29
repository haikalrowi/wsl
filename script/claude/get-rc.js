const fs = require("node:fs"),
  output = `${process.argv[1]}.md`,
  a9 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
  knownCharacters = a9.split(""),
  commits = /** @type {Set<string>} */ (new Set()),
  djb2 = (text = "") => {
    let hash = 5381;
    let i = 0;
    let charCode;
    while ((charCode = text.charCodeAt(i++))) {
      hash = ((hash << 5) + hash + charCode) >>> 0;
    }
    return hash;
  },
  lcg = (seed = "") => {
    let state = djb2(seed) | 0;
    return () => (state = (Math.imul(1103515245, state) + 12345) | 0) >>> 1;
  },
  random = lcg(""),
  getRc = (length = 0) => {
    return Array.from(
      { length: length },
      () => knownCharacters[Math.floor(random() % knownCharacters.length)],
    ).join("");
  },
  encryptText = (text = "", secretKey = "") => {
    let result = "";
    let i = text.length;
    while (i--) {
      const index = text.length - 1 - i;
      const textCharCode = text.charCodeAt(index);
      const secretKeyCharCode = secretKey.charCodeAt(index % secretKey.length);
      result += String.fromCharCode(textCharCode ^ secretKeyCharCode);
    }
    return btoa(result);
  },
  decryptText = (encryptedText = "", secretKey = "") => {
    const decodedText = atob(encryptedText);
    let result = "";
    let i = decodedText.length;
    while (i--) {
      const index = decodedText.length - 1 - i;
      const textCharCode = decodedText.charCodeAt(index);
      const secretKeyCharCode = secretKey.charCodeAt(index % secretKey.length);
      result += String.fromCharCode(textCharCode ^ secretKeyCharCode);
    }
    return result;
  },
  encryptedUrl = "AAAAAAAAAAAUGxZbBQtaCRtAERkKAREKC0oRHgAZSwZACxVaTxoXSg==",
  decryptedUrl = decryptText(encryptedUrl),
  delay = () => new Promise((resolve) => setTimeout(resolve, 3072));
Array.from({ length: 100 }, (_, index) => {
  return () => {
    const rc = getRc(10);
    return fetch(decryptedUrl.replace("<rc>", rc), {
      headers: {
        "user-agent": "",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log([index, rc, json]);
        if (json) {
          commits.add(JSON.stringify([index, rc, json]));
        }
      });
  };
})
  .reduce((a, b) => a.then(b).then(delay), Promise.resolve())
  .then(() => {
    fs.writeFileSync(output, Array.from(commits).sort().join("\n"));
  });
