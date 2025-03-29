/**
 * Checks if any of the strings in the `matches` array exist in the `list` array,
 * ignoring case sensitivity.
 *
 * @param list - An array of strings to search within.
 * @param matches - An array of strings to search for.
 * @returns `true` if any string in `matches` is found in `list` (case-insensitive), otherwise `false`.
 */
export default function findFirstMatch(list: string[], matches: string[]) {
  for (const el of list) {
    const cleanedEl = el.toLowerCase().replace(/[:\-_]/gm, "");

    if (matches.map((m) => m.toLowerCase()).includes(cleanedEl)) {
      return el
    }
  }

  return ""
}
