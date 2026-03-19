import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { textResult, errorResult } from './helpers';

// --- Types (inlined from apps/text-counter/src/types/index.ts) ---
type Language = 'ja' | 'en' | 'unknown';

interface TextStats {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  readingTimeMinutes: number;
}

// --- Constants (inlined from apps/text-counter/src/config/constants.ts) ---
const READING_SPEED = { ja: 500, en: 225 } as const;

// --- analyzeText logic (from apps/text-counter/src/utils/textAnalysis.ts) ---
function detectLanguage(text: string): Language {
  if (!text.trim()) return 'unknown';
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  return japanesePattern.test(text) ? 'ja' : 'en';
}

function countWords(text: string, language: Language): number {
  if (!text.trim()) return 0;
  if (language === 'ja') {
    return text.split(/[\s、。！？]/g).filter((w) => w.trim().length > 0).length;
  }
  return text.split(/\s+/).filter((w) => w.trim().length > 0).length;
}

function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\n\n+/).filter((p) => p.trim().length > 0).length;
}

function calculateBytes(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

function analyzeTextLocal(text: string, language: 'ja' | 'en' | 'auto' = 'auto'): TextStats {
  const detectedLanguage = detectLanguage(text);
  const lang: Language = language === 'auto' ? detectedLanguage : language;

  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;
  const words = countWords(text, lang);
  const paragraphs = countParagraphs(text);
  const bytes = calculateBytes(text);

  const readingTimeMinutes =
    lang === 'ja'
      ? Math.ceil(charsWithoutSpaces / READING_SPEED.ja)
      : Math.ceil(words / READING_SPEED.en);

  return { charsWithSpaces, charsWithoutSpaces, words, lines, paragraphs, bytes, readingTimeMinutes };
}

// --- deduplicateLines logic (from apps/text-deduplicate/src/utils/deduplicate.ts) ---
interface DeduplicateSettings {
  caseSensitive: boolean;
  trimWhitespace: boolean;
  keepEmptyLines: boolean;
}

function deduplicateLinesLocal(text: string, settings: DeduplicateSettings): string {
  if (!text) return '';

  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    let processedLine = line;

    if (settings.trimWhitespace) {
      processedLine = processedLine.trim();
    }

    if (processedLine === '') {
      if (settings.keepEmptyLines) {
        result.push(line);
      }
      continue;
    }

    const key = settings.caseSensitive ? processedLine : processedLine.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return result.join('\n');
}

// --- MCP Tool Registration ---
export function registerTextTools(server: McpServer) {
  server.tool(
    'text_analyze',
    'Analyze text statistics (chars, words, lines, paragraphs, bytes, reading time)',
    {
      text: z.string().describe('Text to analyze'),
      language: z.enum(['ja', 'en', 'auto']).optional().describe('Language (default: auto-detect)'),
    },
    async ({ text, language }) => {
      try {
        const stats = analyzeTextLocal(text, language ?? 'auto');
        return textResult(JSON.stringify(stats, null, 2));
      } catch (e) {
        return errorResult('text_analyze', e);
      }
    },
  );

  server.tool(
    'text_deduplicate',
    'Remove duplicate lines from text',
    {
      text: z.string().describe('Text with potential duplicate lines'),
      caseSensitive: z.boolean().optional().describe('Case sensitive comparison (default: true)'),
      trimWhitespace: z.boolean().optional().describe('Trim whitespace before comparing (default: false)'),
      keepEmptyLines: z.boolean().optional().describe('Keep empty lines (default: true)'),
    },
    async ({ text, caseSensitive, trimWhitespace, keepEmptyLines }) => {
      try {
        const result = deduplicateLinesLocal(text, {
          caseSensitive: caseSensitive ?? true,
          trimWhitespace: trimWhitespace ?? false,
          keepEmptyLines: keepEmptyLines ?? true,
        });
        return textResult(result);
      } catch (e) {
        return errorResult('text_deduplicate', e);
      }
    },
  );
}
