export interface TreeNode {
  key: string;
  value: unknown;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children: TreeNode[];
}

export function parseToTree(key: string, value: unknown): TreeNode {
  if (value === null) return { key, value, type: 'null', children: [] };
  if (Array.isArray(value)) {
    return {
      key,
      value,
      type: 'array',
      children: value.map((item, i) => parseToTree(String(i), item)),
    };
  }
  if (typeof value === 'object') {
    return {
      key,
      value,
      type: 'object',
      children: Object.entries(value as Record<string, unknown>).map(([k, v]) => parseToTree(k, v)),
    };
  }
  return { key, value, type: typeof value as 'string' | 'number' | 'boolean', children: [] };
}

export function parseJSON(input: string): { tree: TreeNode | null; error: string | null } {
  if (!input.trim()) return { tree: null, error: null };
  try {
    const parsed = JSON.parse(input);
    return { tree: parseToTree('root', parsed), error: null };
  } catch (e) {
    return { tree: null, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}
