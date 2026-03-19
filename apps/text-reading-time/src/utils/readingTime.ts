export interface ReadingTimeResult {
  charCount: number;
  wordCount: number;
  language: 'ja' | 'en' | 'mixed';
  readingTimeMinutes: number;
  readingTimeSeconds: number;
  speakingTimeMinutes: number;
  speakingTimeSeconds: number;
}

const JA_READING_SPEED = 500; // chars per minute
const EN_READING_SPEED = 225; // words per minute
const JA_SPEAKING_SPEED = 350; // chars per minute
const EN_SPEAKING_SPEED = 150; // words per minute

/**
 * Detect whether text is primarily Japanese or English.
 * Japanese is detected by checking for CJK characters, hiragana, and katakana.
 */
export function detectLanguage(text: string): 'ja' | 'en' | 'mixed' {
  const jaPattern = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uff00-\uff9f]/g;
  const jaMatches = text.match(jaPattern) || [];
  const totalChars = text.replace(/\s/g, '').length;

  if (totalChars === 0) return 'en';

  const jaRatio = jaMatches.length / totalChars;

  if (jaRatio > 0.3) return 'ja';
  if (jaRatio > 0.1) return 'mixed';
  return 'en';
}

/**
 * Count words in text (for English-like text).
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Count characters excluding whitespace.
 */
export function countChars(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * Estimate reading and speaking time for given text.
 */
export function estimate(text: string): ReadingTimeResult {
  const charCount = countChars(text);
  const wordCount = countWords(text);
  const language = detectLanguage(text);

  let readingMinutes: number;
  let speakingMinutes: number;

  if (language === 'ja') {
    readingMinutes = charCount / JA_READING_SPEED;
    speakingMinutes = charCount / JA_SPEAKING_SPEED;
  } else if (language === 'en') {
    readingMinutes = wordCount / EN_READING_SPEED;
    speakingMinutes = wordCount / EN_SPEAKING_SPEED;
  } else {
    // Mixed: use a blend
    const jaPattern = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uff00-\uff9f]/g;
    const jaChars = (text.match(jaPattern) || []).length;
    const enWords = countWords(text.replace(jaPattern, ' '));
    readingMinutes = jaChars / JA_READING_SPEED + enWords / EN_READING_SPEED;
    speakingMinutes = jaChars / JA_SPEAKING_SPEED + enWords / EN_SPEAKING_SPEED;
  }

  const readingTotalSeconds = Math.ceil(readingMinutes * 60);
  const speakingTotalSeconds = Math.ceil(speakingMinutes * 60);

  return {
    charCount,
    wordCount,
    language,
    readingTimeMinutes: Math.floor(readingTotalSeconds / 60),
    readingTimeSeconds: readingTotalSeconds % 60,
    speakingTimeMinutes: Math.floor(speakingTotalSeconds / 60),
    speakingTimeSeconds: speakingTotalSeconds % 60,
  };
}
