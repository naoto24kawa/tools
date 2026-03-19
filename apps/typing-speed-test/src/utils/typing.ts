export const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump. The five boxing wizards jump quickly at dawn.',
  'A gentle breeze swept through the valley, carrying the sweet scent of wildflowers across the meadow.',
  'Programming is the art of telling a computer what to do. Every line of code is a step toward solving a problem.',
  'The sun set behind the mountains, painting the sky in shades of orange, pink, and purple as stars began to appear.',
];

export function getRandomText(): string {
  return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedSeconds: number;
}

export function calculateStats(
  targetText: string,
  typedText: string,
  elapsedMs: number
): TypingStats {
  const elapsedSeconds = elapsedMs / 1000;
  const elapsedMinutes = elapsedMs / 60000;

  let correctChars = 0;
  let incorrectChars = 0;
  const totalChars = typedText.length;

  for (let i = 0; i < typedText.length; i++) {
    if (i < targetText.length && typedText[i] === targetText[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 0;
  const cpm = elapsedMinutes > 0 ? Math.round(correctChars / elapsedMinutes) : 0;
  const wpm = elapsedMinutes > 0 ? Math.round(correctChars / 5 / elapsedMinutes) : 0;

  return {
    wpm,
    cpm,
    accuracy: Math.round(accuracy * 10) / 10,
    correctChars,
    incorrectChars,
    totalChars,
    elapsedSeconds: Math.round(elapsedSeconds * 10) / 10,
  };
}

export type CharStatus = 'correct' | 'incorrect' | 'pending';

export function getCharStatuses(targetText: string, typedText: string): CharStatus[] {
  return targetText.split('').map((char, i) => {
    if (i >= typedText.length) return 'pending';
    return typedText[i] === char ? 'correct' : 'incorrect';
  });
}
