export interface EnvEntry {
  key: string;
  value: string;
  comment?: string;
}

export interface EnvValidationError {
  index: number;
  key: string;
  message: string;
}

export function parse(content: string): EnvEntry[] {
  const lines = content.split('\n');
  const entries: EnvEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      continue;
    }

    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();

    // Remove surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Extract inline comment
    let comment: string | undefined;
    const commentIndex = value.indexOf(' #');
    if (commentIndex !== -1 && !value.startsWith('"') && !value.startsWith("'")) {
      comment = value.substring(commentIndex + 2).trim();
      value = value.substring(0, commentIndex).trim();
    }

    entries.push({ key, value, comment });
  }

  return entries;
}

export function stringify(entries: EnvEntry[]): string {
  return entries
    .map((entry) => {
      const needsQuotes = entry.value.includes(' ') || entry.value.includes('#');
      const value = needsQuotes ? `"${entry.value}"` : entry.value;
      const comment = entry.comment ? ` # ${entry.comment}` : '';
      return `${entry.key}=${value}${comment}`;
    })
    .join('\n') + '\n';
}

export function validate(entries: EnvEntry[]): EnvValidationError[] {
  const errors: EnvValidationError[] = [];

  entries.forEach((entry, index) => {
    if (!entry.key) {
      errors.push({ index, key: entry.key, message: 'Key is empty' });
      return;
    }

    if (/\s/.test(entry.key)) {
      errors.push({ index, key: entry.key, message: 'Key contains spaces' });
    }

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(entry.key)) {
      errors.push({
        index,
        key: entry.key,
        message: 'Key should only contain letters, numbers, and underscores',
      });
    }

    if (entry.value === '') {
      errors.push({ index, key: entry.key, message: 'Value is empty (warning)' });
    }
  });

  // Check for duplicate keys
  const seen = new Map<string, number>();
  entries.forEach((entry, index) => {
    if (seen.has(entry.key)) {
      errors.push({ index, key: entry.key, message: `Duplicate key (first at line ${(seen.get(entry.key) ?? 0) + 1})` });
    } else {
      seen.set(entry.key, index);
    }
  });

  return errors;
}

export interface DiffResult {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  differentValues: { key: string; valueA: string; valueB: string }[];
}

export function diff(entriesA: EnvEntry[], entriesB: EnvEntry[]): DiffResult {
  const mapA = new Map(entriesA.map((e) => [e.key, e.value]));
  const mapB = new Map(entriesB.map((e) => [e.key, e.value]));

  const onlyInA: string[] = [];
  const onlyInB: string[] = [];
  const inBoth: string[] = [];
  const differentValues: { key: string; valueA: string; valueB: string }[] = [];

  for (const key of mapA.keys()) {
    if (!mapB.has(key)) {
      onlyInA.push(key);
    } else {
      inBoth.push(key);
      const vA = mapA.get(key)!;
      const vB = mapB.get(key)!;
      if (vA !== vB) {
        differentValues.push({ key, valueA: vA, valueB: vB });
      }
    }
  }

  for (const key of mapB.keys()) {
    if (!mapA.has(key)) {
      onlyInB.push(key);
    }
  }

  return { onlyInA, onlyInB, inBoth, differentValues };
}
