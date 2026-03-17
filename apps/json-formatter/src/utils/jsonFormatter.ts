export interface FormatResult {
  formatted: string;
  error: string | null;
}

export function formatJSON(input: string, indent: number): FormatResult {
  if (!input.trim()) return { formatted: '', error: null };
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed, null, indent), error: null };
  } catch (e) {
    return { formatted: input, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function minifyJSON(input: string): FormatResult {
  if (!input.trim()) return { formatted: '', error: null };
  try {
    const parsed = JSON.parse(input);
    return { formatted: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { formatted: input, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

export function validateJSON(input: string): { valid: boolean; error: string | null } {
  if (!input.trim()) return { valid: false, error: null };
  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
