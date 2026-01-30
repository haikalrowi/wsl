// @ts-check

export function GET() {
  return fetch("https://github.com/haikalrowi/wsl/raw/HEAD/p-cv/README.md")
    .then((r) => {
      return r.text();
    })
    .then((text) => {
      return fetch("https://api.github.com/markdown", {
        method: "POST",
        headers: { Accept: "text/html", "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });
    })
    .then((r) => r.text())
    .then((text) => {
      return new Response(text, { headers: { "Content-Type": "text/html" } });
    });
}
