export function minifyJSON(input: string): {
  result: string;
  error: string | null;
  savedBytes: number;
} {
  if (!input.trim()) return { result: '', error: null, savedBytes: 0 };
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { result: minified, error: null, savedBytes: input.length - minified.length };
  } catch (e) {
    return { result: '', error: e instanceof Error ? e.message : 'Invalid JSON', savedBytes: 0 };
  }
}
