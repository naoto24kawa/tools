export interface WordFrequencyItem {
  word: string;
  count: number;
  percentage: number;
}

export interface FrequencyOptions {
  caseSensitive: boolean;
  minLength: number;
  sortBy: 'count' | 'alphabetical';
}

export const DEFAULT_OPTIONS: FrequencyOptions = {
  caseSensitive: false,
  minLength: 1,
  sortBy: 'count',
};

export function analyzeWordFrequency(text: string, options: FrequencyOptions): WordFrequencyItem[] {
  const { caseSensitive, minLength, sortBy } = options;

  const processed = caseSensitive ? text : text.toLowerCase();
  const words = processed.match(/[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/g);

  if (!words) return [];

  const frequency = new Map<string, number>();
  for (const word of words) {
    if (word.length >= minLength) {
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }
  }

  const totalWords = [...frequency.values()].reduce((sum, count) => sum + count, 0);

  const items: WordFrequencyItem[] = [...frequency.entries()].map(([word, count]) => ({
    word,
    count,
    percentage: totalWords > 0 ? (count / totalWords) * 100 : 0,
  }));

  if (sortBy === 'count') {
    items.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  } else {
    items.sort((a, b) => a.word.localeCompare(b.word));
  }

  return items;
}
