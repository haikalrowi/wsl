/**
 * @param request example: https://github.com/t3dotgg
 */
export async function getGithubDetails(/**@type{Request}*/ request) {
  const response = await fetch(request);
  const text = await response.text();

  return [
    !!text.match(/title="Label: Verified"/g) ? "Verified" : "",
    !!text.match(/title="Label: GitHub Sponsor"/g) ? "Sponsor" : "",
  ].filter((value) => !!value);
}
