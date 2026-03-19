export const NATO_ALPHABET: Record<string, string> = {
  A: 'Alpha',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliet',
  K: 'Kilo',
  L: 'Lima',
  M: 'Mike',
  N: 'November',
  O: 'Oscar',
  P: 'Papa',
  Q: 'Quebec',
  R: 'Romeo',
  S: 'Sierra',
  T: 'Tango',
  U: 'Uniform',
  V: 'Victor',
  W: 'Whiskey',
  X: 'X-ray',
  Y: 'Yankee',
  Z: 'Zulu',
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
};

export interface PhoneticWord {
  original: string;
  phonetic: string;
  isSpace: boolean;
}

export function textToNato(text: string): PhoneticWord[] {
  const result: PhoneticWord[] = [];

  for (const char of text) {
    if (char === ' ') {
      result.push({ original: char, phonetic: '(space)', isSpace: true });
    } else {
      const upper = char.toUpperCase();
      const phonetic = NATO_ALPHABET[upper];
      result.push({
        original: char,
        phonetic: phonetic || `[${char}]`,
        isSpace: false,
      });
    }
  }

  return result;
}

export function natoToText(natoStr: string): string {
  const reverseMap = new Map<string, string>();
  for (const [key, value] of Object.entries(NATO_ALPHABET)) {
    reverseMap.set(value.toLowerCase(), key);
  }

  const words = natoStr.trim().split(/\s+/);
  let result = '';

  for (const word of words) {
    const lower = word.toLowerCase();
    const char = reverseMap.get(lower);
    if (char !== undefined) {
      result += char;
    } else if (lower === '(space)') {
      result += ' ';
    } else {
      result += `[${word}]`;
    }
  }

  return result;
}

export function formatPhoneticOutput(words: PhoneticWord[]): string {
  return words.map((w) => w.phonetic).join(' ');
}

export function getReferenceTable(): { letter: string; word: string }[] {
  return Object.entries(NATO_ALPHABET).map(([letter, word]) => ({
    letter,
    word,
  }));
}
