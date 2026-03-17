export interface ValidationResult {
  valid: boolean;
  error: string | null;
  errorLine: number | null;
  errorColumn: number | null;
  formatted: string;
  stats: { keys: number; depth: number; arrays: number; objects: number } | null;
}

function getStats(obj: unknown): { keys: number; depth: number; arrays: number; objects: number } {
  let keys = 0;
  let maxDepth = 0;
  let arrays = 0;
  let objects = 0;

  function traverse(val: unknown, depth: number): void {
    if (depth > maxDepth) maxDepth = depth;
    if (Array.isArray(val)) {
      arrays++;
      for (const item of val) traverse(item, depth + 1);
    } else if (val !== null && typeof val === 'object') {
      objects++;
      const entries = Object.entries(val as Record<string, unknown>);
      keys += entries.length;
      for (const [, v] of entries) traverse(v, depth + 1);
    }
  }

  traverse(obj, 0);
  return { keys, depth: maxDepth, arrays, objects };
}

function getErrorPosition(json: string, errorMsg: string): { line: number; column: number } | null {
  const posMatch = errorMsg.match(/position (\d+)/i);
  if (!posMatch) return null;
  const pos = Number(posMatch[1]);
  const before = json.slice(0, pos);
  const line = (before.match(/\n/g) || []).length + 1;
  const lastNewline = before.lastIndexOf('\n');
  const column = pos - lastNewline;
  return { line, column };
}

export function validateJSON(input: string): ValidationResult {
  if (!input.trim())
    return {
      valid: false,
      error: null,
      errorLine: null,
      errorColumn: null,
      formatted: '',
      stats: null,
    };

  try {
    const parsed = JSON.parse(input);
    return {
      valid: true,
      error: null,
      errorLine: null,
      errorColumn: null,
      formatted: JSON.stringify(parsed, null, 2),
      stats: getStats(parsed),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    const pos = getErrorPosition(input, msg);
    return {
      valid: false,
      error: msg,
      errorLine: pos?.line ?? null,
      errorColumn: pos?.column ?? null,
      formatted: '',
      stats: null,
    };
  }
}
