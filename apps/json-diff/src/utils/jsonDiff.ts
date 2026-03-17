export interface DiffEntry {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}

function diffObjects(a: unknown, b: unknown, path: string, result: DiffEntry[]): void {
  if (a === b) return;

  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b) || a === null || b === null) {
    if (a !== undefined)
      result.push({ path, type: a === undefined ? 'added' : 'removed', oldValue: a, newValue: b });
    if (a !== undefined && b !== undefined) {
      result[result.length - 1] = { path, type: 'changed', oldValue: a, newValue: b };
    } else if (b !== undefined && a === undefined) {
      result.push({ path, type: 'added', newValue: b });
    }
    return;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      const p = `${path}[${i}]`;
      if (i >= a.length) {
        result.push({ path: p, type: 'added', newValue: b[i] });
        continue;
      }
      if (i >= b.length) {
        result.push({ path: p, type: 'removed', oldValue: a[i] });
        continue;
      }
      diffObjects(a[i], b[i], p, result);
    }
    return;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
    for (const key of allKeys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in aObj)) {
        result.push({ path: p, type: 'added', newValue: bObj[key] });
        continue;
      }
      if (!(key in bObj)) {
        result.push({ path: p, type: 'removed', oldValue: aObj[key] });
        continue;
      }
      diffObjects(aObj[key], bObj[key], p, result);
    }
    return;
  }

  if (a !== b) result.push({ path, type: 'changed', oldValue: a, newValue: b });
}

export function compareJSON(
  jsonA: string,
  jsonB: string
): { diffs: DiffEntry[]; error: string | null } {
  if (!jsonA.trim() || !jsonB.trim()) return { diffs: [], error: null };
  try {
    const a = JSON.parse(jsonA);
    const b = JSON.parse(jsonB);
    const diffs: DiffEntry[] = [];
    diffObjects(a, b, '', diffs);
    return { diffs, error: null };
  } catch (e) {
    return { diffs: [], error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
