export interface TypingResult {
  id: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  textLength: number;
  duration: number; // seconds
  language: 'en' | 'ja';
  date: string;
}

const STORAGE_KEY = 'typing-speed-test-results';

export const SAMPLE_TEXTS_EN: string[] = [
  'The quick brown fox jumps over the lazy dog. A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.',
  'Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation. As you are about to add a comment, ask yourself how you can improve the code.',
  'In the middle of difficulty lies opportunity. Life is what happens when you are busy making other plans. The only way to do great work is to love what you do.',
  'Technology is best when it brings people together. The advance of technology is based on making it fit in so that you do not really even notice it, so it is part of everyday life.',
  'Success is not final, failure is not fatal. It is the courage to continue that counts. The greatest glory in living lies not in never falling, but in rising every time we fall.',
];

export const SAMPLE_TEXTS_JA: string[] = [
  'きょうは天気がよくて気持ちがいいですね。公園にはたくさんの人が集まっています。子供たちは楽しそうに遊んでいます。',
  'プログラミングとは、コンピュータに何をさせたいかを人間に伝える技術です。良いコードは最良のドキュメントです。',
  '努力は必ず報われるとは限らないが、成功した人は皆努力している。小さな一歩が大きな変化を生む。',
  '技術は人々をつなげるときに最も力を発揮します。日常生活の一部になることで、本当の進歩が生まれます。',
  '千里の道も一歩から始まる。どんなに長い旅も最初の一歩を踏み出すことが大切です。継続は力なりという言葉もあります。',
];

export function getRandomText(language: 'en' | 'ja'): string {
  const texts = language === 'en' ? SAMPLE_TEXTS_EN : SAMPLE_TEXTS_JA;
  return texts[Math.floor(Math.random() * texts.length)];
}

export function calculateWPM(
  correctChars: number,
  durationMs: number
): number {
  if (durationMs === 0) return 0;
  const minutes = durationMs / 60000;
  // Standard: 5 characters = 1 word
  return Math.round(correctChars / 5 / minutes);
}

export function calculateCPM(
  correctChars: number,
  durationMs: number
): number {
  if (durationMs === 0) return 0;
  const minutes = durationMs / 60000;
  return Math.round(correctChars / minutes);
}

export function calculateAccuracy(
  correctChars: number,
  totalTyped: number
): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 10000) / 100;
}

export interface CharStatus {
  char: string;
  status: 'pending' | 'correct' | 'incorrect' | 'current';
}

export function getCharStatuses(
  targetText: string,
  typedText: string,
  cursorPos: number
): CharStatus[] {
  return targetText.split('').map((char, i) => {
    if (i === cursorPos) {
      return { char, status: 'current' };
    }
    if (i >= typedText.length) {
      return { char, status: 'pending' };
    }
    return {
      char,
      status: typedText[i] === char ? 'correct' : 'incorrect',
    };
  });
}

export function loadResults(): TypingResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveResult(result: Omit<TypingResult, 'id' | 'date'>): TypingResult[] {
  const results = loadResults();
  const newResult: TypingResult = {
    ...result,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    date: new Date().toISOString(),
  };
  const updated = [newResult, ...results].slice(0, 50); // Keep last 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
