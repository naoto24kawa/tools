import {
  toLowerCase,
  toSentenceCase,
  toTitleCase,
  toUpperCase,
} from '../../apps/text-case-converter/src/utils/caseConverter.js';
import {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '../../apps/text-code-case/src/utils/codeCase.js';
import {
  reverseCharacters,
  reverseLines,
  reverseWords,
} from '../../apps/text-reverse/src/utils/textReverse.js';
import {
  DEFAULT_OPTIONS as SLUGIFY_DEFAULTS,
  slugify,
} from '../../apps/text-slugify/src/utils/slugify.js';
import { DEFAULT_SORT_OPTIONS, sortText } from '../../apps/text-sort/src/utils/textSort.js';
import {
  toHiragana,
  toKatakana,
} from '../../apps/text-kana-converter/src/utils/kanaConverter.js';

type ToolFn = (input: string) => string;

export const REGISTRY: Record<string, ToolFn> = {
  'upper-case': (t) => toUpperCase(t),
  'lower-case': (t) => toLowerCase(t),
  'title-case': (t) => toTitleCase(t),
  'sentence-case': (t) => toSentenceCase(t),
  'camel-case': (t) => toCamelCase(t),
  'pascal-case': (t) => toPascalCase(t),
  'snake-case': (t) => toSnakeCase(t),
  'kebab-case': (t) => toKebabCase(t),
  'reverse-chars': (t) => reverseCharacters(t),
  'reverse-words': (t) => reverseWords(t),
  'reverse-lines': (t) => reverseLines(t),
  'slugify': (t) => slugify(t, SLUGIFY_DEFAULTS),
  'sort-lines': (t) => sortText(t, DEFAULT_SORT_OPTIONS),
  'to-katakana': (t) => toKatakana(t),
  'to-hiragana': (t) => toHiragana(t),
};

export const TOOL_NAMES = Object.keys(REGISTRY) as [string, ...string[]];
