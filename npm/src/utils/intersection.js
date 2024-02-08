export function intersection(a, b) {
  const setA = new Set(a)
  return b.filter(value => setA.has(value))
}
