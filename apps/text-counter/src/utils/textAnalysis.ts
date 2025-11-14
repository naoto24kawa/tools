import type { TextStats, CountSettings, Language } from '@types';
import { READING_SPEED } from '@config/constants';

/**
 * 言語を自動検出
 */
export function detectLanguage(text: string): Language {
  if (!text.trim()) return 'unknown';

  // 日本語文字（ひらがな、カタカナ、漢字）の正規表現
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

  // テキストに日本語文字が含まれているかチェック
  const hasJapanese = japanesePattern.test(text);

  return hasJapanese ? 'ja' : 'en';
}

/**
 * 単語数をカウント（言語別）
 */
function countWords(text: string, language: Language): number {
  if (!text.trim()) return 0;

  if (language === 'ja') {
    // 日本語: スペース、句読点、記号で区切られた単位をカウント
    const words = text
      .split(/[\s、。！？]/g)
      .filter((word) => word.trim().length > 0);
    return words.length;
  } else {
    // 英語: スペースで区切られた単語をカウント
    const words = text.split(/\s+/).filter((word) => word.trim().length > 0);
    return words.length;
  }
}

/**
 * 段落数をカウント
 */
function countParagraphs(text: string): number {
  if (!text.trim()) return 0;

  // 空行で区切られた段落をカウント
  const paragraphs = text
    .split(/\n\n+/)
    .filter((paragraph) => paragraph.trim().length > 0);

  return paragraphs.length;
}

/**
 * UTF-8バイト数を計算
 */
function calculateBytes(text: string): number {
  return new Blob([text]).size;
}

/**
 * 読了時間を計算（分）
 */
function calculateReadingTime(
  language: Language,
  wordCount: number,
  charCount: number
): number {
  if (language === 'ja') {
    // 日本語: 文字数ベース
    return Math.ceil(charCount / READING_SPEED.ja);
  } else {
    // 英語: 単語数ベース
    return Math.ceil(wordCount / READING_SPEED.en);
  }
}

/**
 * テキストを解析して統計情報を取得
 */
export function analyzeText(
  text: string,
  settings: CountSettings
): TextStats {
  // 言語検出
  const detectedLanguage = detectLanguage(text);
  const language = settings.language === 'auto' ? detectedLanguage : settings.language;

  // 基本的な文字数カウント
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;

  // 行数カウント
  const lines = text.split('\n').length;

  // 単語数カウント
  const words = countWords(text, language);

  // 段落数カウント
  const paragraphs = countParagraphs(text);

  // バイト数計算
  const bytes = calculateBytes(text);

  // 読了時間計算
  const readingTimeMinutes = calculateReadingTime(
    language,
    words,
    charsWithoutSpaces
  );

  return {
    charsWithSpaces,
    charsWithoutSpaces,
    words,
    lines,
    paragraphs,
    bytes,
    readingTimeMinutes,
  };
}
