export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  error: string | null;
}

export function testRegex(pattern: string, flags: string, testString: string): RegexResult {
  if (!pattern) return { matches: [], error: null };

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes('g')) {
      for (const result of testString.matchAll(regex)) {
        matches.push({
          match: result[0],
          index: result.index ?? 0,
          groups: result.slice(1),
        });
      }
    } else {
      const result = regex.exec(testString);
      if (result) {
        matches.push({
          match: result[0],
          index: result.index,
          groups: result.slice(1),
        });
      }
    }

    return { matches, error: null };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' };
  }
}

export const COMMON_PATTERNS = [
  { label: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+' },
  { label: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./-]*)?' },
  { label: 'IP Address', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
  { label: 'Phone (JP)', pattern: '0\\d{1,4}-\\d{1,4}-\\d{4}' },
  { label: 'Hex Color', pattern: '#[0-9a-fA-F]{3,8}' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
] as const;
