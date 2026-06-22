export function hash(input: string) {
  let hash = 0x811c9dc5;
  let index = input.length;
  while (index--) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 0x01000193);
  }

  return (hash >>> 0).toString(36);
}
