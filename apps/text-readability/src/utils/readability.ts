export interface ReadabilityResult {
  sentenceCount: number;
  wordCount: number;
  syllableCount: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  fleschReadingEase: number;
  fleschGradeLevel: number;
  charDensity: number;
  language: 'en' | 'ja';
  grade: string;
  tips: string[];
}

/**
 * Count syllables in an English word using a heuristic approach.
 */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 2) return 1;

  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;

  for (let i = 0; i < w.length; i++) {
    const isVowel = vowels.includes(w[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }

  // Silent e
  if (w.endsWith('e') && count > 1) {
    count--;
  }

  // Words like "le" at end
  if (w.endsWith('le') && w.length > 2 && !vowels.includes(w[w.length - 3])) {
    count++;
  }

  return Math.max(1, count);
}

/**
 * Split text into sentences.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?\u3002\uff01\uff1f]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Split text into words.
 */
export function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

/**
 * Detect language: Japanese if CJK chars exceed 30%.
 */
export function detectLanguage(text: string): 'en' | 'ja' {
  const jaPattern = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\uff00-\uff9f]/g;
  const jaMatches = text.match(jaPattern) || [];
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return 'en';
  return jaMatches.length / totalChars > 0.3 ? 'ja' : 'en';
}

/**
 * Get Flesch Reading Ease grade label.
 */
export function getGrade(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8th-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (Professional)';
}

/**
 * Generate improvement tips based on analysis.
 */
export function generateTips(result: Omit<ReadabilityResult, 'tips' | 'grade'>): string[] {
  const tips: string[] = [];

  if (result.language === 'en') {
    if (result.avgSentenceLength > 25) {
      tips.push('Try breaking long sentences into shorter ones (aim for under 20 words per sentence).');
    }
    if (result.avgSyllablesPerWord > 1.7) {
      tips.push('Consider using simpler words with fewer syllables.');
    }
    if (result.fleschReadingEase < 50) {
      tips.push('Your text may be difficult to read. Try simplifying vocabulary and sentence structure.');
    }
    if (result.fleschReadingEase >= 70) {
      tips.push('Good readability! Your text is accessible to a wide audience.');
    }
  } else {
    if (result.charDensity > 50) {
      tips.push('Consider adding more whitespace or breaking up dense paragraphs.');
    }
    if (result.avgSentenceLength > 40) {
      tips.push('Sentences are long. Try splitting into shorter sentences for clarity.');
    }
  }

  if (tips.length === 0) {
    tips.push('Your text has reasonable readability metrics.');
  }

  return tips;
}

/**
 * Analyze text readability.
 */
export function analyze(text: string): ReadabilityResult {
  const trimmed = text.trim();
  const language = detectLanguage(trimmed);

  if (trimmed.length === 0) {
    return {
      sentenceCount: 0,
      wordCount: 0,
      syllableCount: 0,
      avgSentenceLength: 0,
      avgSyllablesPerWord: 0,
      fleschReadingEase: 0,
      fleschGradeLevel: 0,
      charDensity: 0,
      language,
      grade: 'N/A',
      tips: ['Enter some text to analyze.'],
    };
  }

  const sentences = splitSentences(trimmed);
  const words = splitWords(trimmed);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = words.length;

  let syllableCount = 0;
  for (const word of words) {
    syllableCount += countSyllables(word);
  }

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;

  // Flesch Reading Ease: 206.835 - 1.015 * ASL - 84.6 * ASW
  const fleschReadingEase = Math.max(
    0,
    Math.min(100, 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord)
  );

  // Flesch-Kincaid Grade Level
  const fleschGradeLevel = Math.max(
    0,
    0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59
  );

  // Character density: chars per line (assuming ~80 char lines)
  const totalChars = trimmed.replace(/\s/g, '').length;
  const lineCount = Math.max(1, trimmed.split('\n').length);
  const charDensity = totalChars / lineCount;

  const partialResult = {
    sentenceCount,
    wordCount,
    syllableCount,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    fleschGradeLevel: Math.round(fleschGradeLevel * 10) / 10,
    charDensity: Math.round(charDensity * 10) / 10,
    language,
  };

  return {
    ...partialResult,
    grade: language === 'en' ? getGrade(fleschReadingEase) : 'N/A (Japanese)',
    tips: generateTips(partialResult),
  };
}
