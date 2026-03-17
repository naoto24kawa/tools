export function queryJsonPath(data: unknown, path: string): unknown[] {
  if (!path.startsWith('$')) {
    throw new Error('JSONPath must start with $');
  }

  const tokens = tokenize(path.slice(1));
  let current: unknown[] = [data];

  for (const token of tokens) {
    const next: unknown[] = [];
    for (const item of current) {
      next.push(...resolveToken(token, item));
    }
    current = next;
  }

  return current;
}

function resolveToken(token: string, item: unknown): unknown[] {
  if (token === '') return [];
  if (token === '*') return resolveWildcard(item);
  if (token === '..') return deepScan(item);
  if (token.startsWith('[') && token.endsWith(']')) return resolveIndex(token, item);
  return resolveProperty(token, item);
}

function resolveWildcard(item: unknown): unknown[] {
  if (Array.isArray(item)) return item;
  if (item !== null && typeof item === 'object') {
    return Object.values(item as Record<string, unknown>);
  }
  return [];
}

function resolveIndex(token: string, item: unknown): unknown[] {
  const inner = token.slice(1, -1);
  if (!Array.isArray(item)) return [];
  const index = Number.parseInt(inner, 10);
  if (!Number.isNaN(index) && index >= 0 && index < item.length) {
    return [item[index]];
  }
  return [];
}

function resolveProperty(token: string, item: unknown): unknown[] {
  if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
    const obj = item as Record<string, unknown>;
    if (token in obj) return [obj[token]];
  }
  return [];
}

function tokenize(path: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < path.length) {
    if (path[i] === '.') {
      if (path[i + 1] === '.') {
        tokens.push('..');
        i += 2;
      } else {
        i++;
      }
    } else if (path[i] === '[') {
      const end = path.indexOf(']', i);
      if (end === -1) break;
      tokens.push(path.slice(i, end + 1));
      i = end + 1;
    } else {
      let end = i;
      while (end < path.length && path[end] !== '.' && path[end] !== '[') {
        end++;
      }
      tokens.push(path.slice(i, end));
      i = end;
    }
  }
  return tokens;
}

function deepScan(obj: unknown): unknown[] {
  const results: unknown[] = [];
  if (obj === null || typeof obj !== 'object') return results;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      results.push(item);
      results.push(...deepScan(item));
    }
  } else {
    for (const value of Object.values(obj as Record<string, unknown>)) {
      results.push(value);
      results.push(...deepScan(value));
    }
  }
  return results;
}
