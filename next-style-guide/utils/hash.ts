export function hash(input: string) {
  let hash = 5381;
  let index = input.length;
  while (index--) {
    hash = (hash << 5) + hash + input.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}
