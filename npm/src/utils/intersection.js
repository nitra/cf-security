/**
 * @param {Array<string>} a - First array
 * @param {Array<string>} b - Second array
 * @returns {Array<string>} - Intersection of two arrays.
 */
export function intersection(a, b) {
  const setA = new Set(a)
  return b.filter(value => setA.has(value))
}
