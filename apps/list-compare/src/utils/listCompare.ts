export interface CompareResult {
  onlyInA: string[];
  onlyInB: string[];
  common: string[];
  union: string[];
}

export function compareLists(textA: string, textB: string, caseSensitive: boolean): CompareResult {
  const normalize = (s: string) => (caseSensitive ? s : s.toLowerCase());
  const linesA = textA.split('\n').filter((l) => l.trim());
  const linesB = textB.split('\n').filter((l) => l.trim());

  const setA = new Set(linesA.map(normalize));
  const setB = new Set(linesB.map(normalize));

  const onlyInA = linesA.filter((l) => !setB.has(normalize(l)));
  const onlyInB = linesB.filter((l) => !setA.has(normalize(l)));
  const common = linesA.filter((l) => setB.has(normalize(l)));
  const union = [...new Set([...linesA, ...linesB.filter((l) => !setA.has(normalize(l)))])];

  return { onlyInA, onlyInB, common, union };
}
