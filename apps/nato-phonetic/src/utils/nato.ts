export const NATO_ALPHABET: Record<string, string> = {
  A: 'Alfa',
  B: 'Bravo',
  C: 'Charlie',
  D: 'Delta',
  E: 'Echo',
  F: 'Foxtrot',
  G: 'Golf',
  H: 'Hotel',
  I: 'India',
  J: 'Juliett',
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
  '9': 'Niner',
};

const REVERSE_NATO: Record<string, string> = {};
for (const [key, value] of Object.entries(NATO_ALPHABET)) {
  REVERSE_NATO[value.toLowerCase()] = key;
}

export interface NatoEntry {
  char: string;
  nato: string;
}

export function textToNato(text: string): NatoEntry[] {
  return [...text].map((char) => {
    const upper = char.toUpperCase();
    const nato = NATO_ALPHABET[upper];
    return {
      char,
      nato: nato || char,
    };
  });
}

export function textToNatoString(text: string): string {
  const entries = textToNato(text);
  const words: string[] = [];
  for (const entry of entries) {
    if (entry.char === ' ') {
      words.push('(space)');
    } else if (entry.nato !== entry.char) {
      words.push(entry.nato);
    } else {
      words.push(entry.char);
    }
  }
  return words.join(' ');
}

export function natoToText(nato: string): string {
  const words = nato.trim().split(/\s+/);
  return words
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === '(space)') return ' ';
      return REVERSE_NATO[lower] || word;
    })
    .join('');
}

export function getReferenceTable(): Array<{ char: string; nato: string }> {
  return Object.entries(NATO_ALPHABET).map(([char, nato]) => ({ char, nato }));
}
