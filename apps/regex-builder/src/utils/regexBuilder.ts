export type BlockType =
  | 'literal'
  | 'character-class'
  | 'quantifier'
  | 'group'
  | 'anchor'
  | 'alternation';

export interface RegexBlock {
  id: string;
  type: BlockType;
  value: string;
  label: string;
}

export interface RegexFlags {
  global: boolean;
  caseInsensitive: boolean;
  multiline: boolean;
  dotAll: boolean;
}

export interface MatchResult {
  match: string;
  index: number;
  length: number;
}

export const BLOCK_PRESETS: Record<BlockType, { label: string; value: string }[]> = {
  'literal': [
    { label: 'Custom text', value: '' },
  ],
  'character-class': [
    { label: 'Any digit [0-9]', value: '\\d' },
    { label: 'Non-digit [^0-9]', value: '\\D' },
    { label: 'Word char [a-zA-Z0-9_]', value: '\\w' },
    { label: 'Non-word char', value: '\\W' },
    { label: 'Whitespace', value: '\\s' },
    { label: 'Non-whitespace', value: '\\S' },
    { label: 'Any character', value: '.' },
    { label: 'Custom class [...]', value: '[]' },
  ],
  'quantifier': [
    { label: 'Zero or more *', value: '*' },
    { label: 'One or more +', value: '+' },
    { label: 'Zero or one ?', value: '?' },
    { label: 'Exactly n {n}', value: '{n}' },
    { label: 'n or more {n,}', value: '{n,}' },
    { label: 'Between {n,m}', value: '{n,m}' },
    { label: 'Lazy *?', value: '*?' },
    { label: 'Lazy +?', value: '+?' },
  ],
  'group': [
    { label: 'Capturing group (...)', value: '()' },
    { label: 'Non-capturing (?:...)', value: '(?:)' },
    { label: 'Lookahead (?=...)', value: '(?=)' },
    { label: 'Neg lookahead (?!...)', value: '(?!)' },
  ],
  'anchor': [
    { label: 'Start of string ^', value: '^' },
    { label: 'End of string $', value: '$' },
    { label: 'Word boundary \\b', value: '\\b' },
    { label: 'Non-word boundary \\B', value: '\\B' },
  ],
  'alternation': [
    { label: 'Alternation |', value: '|' },
  ],
};

let blockIdCounter = 0;

/**
 * Create a new regex block.
 */
export function createBlock(type: BlockType, value: string, label: string): RegexBlock {
  blockIdCounter++;
  return {
    id: `block-${blockIdCounter}-${Date.now()}`,
    type,
    value,
    label,
  };
}

/**
 * Build regex string from blocks.
 */
export function buildRegexString(blocks: RegexBlock[]): string {
  return blocks.map((b) => b.value).join('');
}

/**
 * Build flags string from flag object.
 */
export function buildFlagsString(flags: RegexFlags): string {
  let result = '';
  if (flags.global) result += 'g';
  if (flags.caseInsensitive) result += 'i';
  if (flags.multiline) result += 'm';
  if (flags.dotAll) result += 's';
  return result;
}

/**
 * Try to compile regex and return matches against test string.
 * Note: This uses RegExp.prototype.exec(), which is a standard JS method
 * for executing regex matching - not related to child_process.exec().
 */
export function testRegex(
  pattern: string,
  flags: string,
  testString: string
): { matches: MatchResult[]; error: string | null } {
  if (!pattern) return { matches: [], error: null };

  try {
    const regex = new RegExp(pattern, flags);
    const matches: MatchResult[] = [];

    if (flags.includes('g')) {
      let result: RegExpExecArray | null;
      let safetyCount = 0;
      // RegExp.prototype.exec() - standard JS regex execution method
      while ((result = regex.exec(testString)) !== null && safetyCount < 1000) {
        matches.push({
          match: result[0],
          index: result.index,
          length: result[0].length,
        });
        if (result[0].length === 0) {
          regex.lastIndex++;
        }
        safetyCount++;
      }
    } else {
      // RegExp.prototype.exec() - standard JS regex execution method
      const result = regex.exec(testString);
      if (result) {
        matches.push({
          match: result[0],
          index: result.index,
          length: result[0].length,
        });
      }
    }

    return { matches, error: null };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : 'Invalid regex' };
  }
}

/**
 * Escape a literal string for use in regex.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
