import {
  decodeBase64,
  encodeBase64,
} from '../../apps/encode-base64-string/src/utils/base64.js';
import {
  decodeHTMLEntities,
  encodeHTMLEntities,
} from '../../apps/encode-html-entity/src/utils/htmlEntity.js';
import { uudecode, uuencode } from '../../apps/uuencode/src/utils/uuencode.js';
import {
  formatJSON,
  minifyJSON,
} from '../../apps/json-formatter/src/utils/jsonFormatter.js';
import { formatXml } from '../../apps/xml-formatter/src/utils/xmlFormatter.js';
import {
  formatHtml,
  minifyHtml,
} from '../../apps/html-formatter/src/utils/htmlFormatter.js';
import {
  jsonToYaml,
  yamlToJson,
} from '../../apps/yaml-formatter/src/utils/yamlFormatter.js';
import { parse as parseToml } from '../../apps/toml-to-json/src/utils/tomlParser.js';
import { caesarEncrypt } from '../../apps/crypto-caesar/src/utils/caesar.js';
import { atbash } from '../../apps/crypto-atbash/src/utils/atbash.js';
import {
  generateULID,
  generateUUIDv4,
} from '../../apps/uuid-generator/src/utils/uuidGenerator.js';
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

// シンプルなXML→JSON変換 (DOMParserを使わず文字列操作で実装)
function simpleXmlToJson(xml: string): string {
  const trimmed = xml.trim();
  if (!trimmed) throw new Error('Input is empty');

  // Guard: reject XML features the simple parser cannot handle
  if (/<(!--|!\[CDATA\[|\?)/.test(xml)) {
    throw new Error('xml-to-json: comments, CDATA, and processing instructions are not supported');
  }

  // トークナイザー: タグと文字列を分割
  function tokenize(str: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] === '<') {
        let j = i + 1;
        while (j < str.length && str[j] !== '>') j++;
        tokens.push(str.slice(i, j + 1));
        i = j + 1;
      } else {
        let j = i;
        while (j < str.length && str[j] !== '<') j++;
        const text = str.slice(i, j).trim();
        if (text) tokens.push(text);
        i = j;
      }
    }
    return tokens;
  }

  // 再帰パーサー
  function parse(tokens: string[], pos: number): [unknown, number] {
    const token = tokens[pos];
    if (!token) return [null, pos + 1];

    // 自己閉じタグ
    if (token.startsWith('<') && token.endsWith('/>')) {
      const tagMatch = token.match(/^<([^\s/>]+)/);
      const tag = tagMatch ? tagMatch[1] : 'unknown';
      return [{ [tag]: null }, pos + 1];
    }

    // 開始タグ
    if (token.startsWith('<') && !token.startsWith('</')) {
      const tagMatch = token.match(/^<([^\s>]+)/);
      const tag = tagMatch ? tagMatch[1] : 'unknown';
      const children: Record<string, unknown> = {};
      let textContent = '';
      let cur = pos + 1;

      while (cur < tokens.length) {
        const t = tokens[cur];
        if (t === `</${tag}>`) {
          cur++;
          break;
        }
        if (t.startsWith('<') && !t.startsWith('</')) {
          const [child, next] = parse(tokens, cur);
          const childObj = child as Record<string, unknown>;
          for (const [k, v] of Object.entries(childObj)) {
            if (k in children) {
              if (!Array.isArray(children[k])) children[k] = [children[k]];
              (children[k] as unknown[]).push(v);
            } else {
              children[k] = v;
            }
          }
          cur = next;
        } else if (!t.startsWith('<')) {
          textContent += t;
          cur++;
        } else {
          cur++;
        }
      }

      const hasChildren = Object.keys(children).length > 0;
      let value: unknown;
      if (hasChildren) {
        value = textContent ? { ...children, '#text': textContent } : children;
      } else {
        value = textContent || null;
      }

      return [{ [tag]: value }, cur];
    }

    return [null, pos + 1];
  }

  const tokens = tokenize(trimmed);
  const [result] = parse(tokens, 0);
  return JSON.stringify(result, null, 2);
}

export type ToolFn = (input: string) => string | Promise<string>;

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
  // Encode
  'base64-encode': (t) => encodeBase64(t),
  'base64-decode': (t) => decodeBase64(t),
  'html-entity-encode': (t) => encodeHTMLEntities(t),
  'html-entity-decode': (t) => decodeHTMLEntities(t),
  'uuencode': (t) => uuencode(t),
  'uudecode': (t) => uudecode(t),
  // Format
  'json-format': (t) => {
    const result = formatJSON(t, 2);
    if (result.error) throw new Error(result.error);
    return result.formatted;
  },
  'json-minify': (t) => {
    const result = minifyJSON(t);
    if (result.error) throw new Error(result.error);
    return result.formatted;
  },
  'xml-format': (t) => formatXml(t),
  'html-format': (t) => formatHtml(t),
  'html-minify': (t) => minifyHtml(t),
  'yaml-to-json': (t) => yamlToJson(t),
  'json-to-yaml': (t) => jsonToYaml(t),
  'xml-to-json': (t) => simpleXmlToJson(t),
  'toml-to-json': (t) => JSON.stringify(parseToml(t), null, 2),
  // Crypto
  'atbash': (t) => atbash(t),
  'caesar-encrypt': (t) => {
    try {
      const parsed: unknown = JSON.parse(t);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'text' in parsed &&
        'shift' in parsed &&
        typeof (parsed as Record<string, unknown>).text === 'string' &&
        typeof (parsed as Record<string, unknown>).shift === 'number'
      ) {
        return caesarEncrypt(
          (parsed as Record<string, unknown>).text as string,
          (parsed as Record<string, unknown>).shift as number,
        );
      }
    } catch {
      // not JSON — treat as plain text
    }
    return caesarEncrypt(t, 3);
  },
  // Generate
  'uuid-v4': () => generateUUIDv4(),
  'ulid': () => generateULID(),
};

export const TOOL_NAMES = Object.keys(REGISTRY) as [string, ...string[]];
