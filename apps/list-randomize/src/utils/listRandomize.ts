export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const j = randomValues[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleLines(text: string): string {
  if (!text.trim()) return '';
  const lines = text.split('\n');
  return shuffleArray(lines).join('\n');
}

export function pickRandom(text: string, count: number): string {
  if (!text.trim()) return '';
  const lines = text.split('\n').filter((l) => l.trim());
  const shuffled = shuffleArray(lines);
  return shuffled.slice(0, Math.min(count, shuffled.length)).join('\n');
}
