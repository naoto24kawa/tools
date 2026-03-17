const BRAILLE_MAP: Record<string, string> = {
  a: '\u2801',
  b: '\u2803',
  c: '\u2809',
  d: '\u2819',
  e: '\u2811',
  f: '\u280b',
  g: '\u281b',
  h: '\u2813',
  i: '\u280a',
  j: '\u281a',
  k: '\u2805',
  l: '\u2807',
  m: '\u280d',
  n: '\u281d',
  o: '\u2815',
  p: '\u280f',
  q: '\u281f',
  r: '\u2817',
  s: '\u280e',
  t: '\u281e',
  u: '\u2825',
  v: '\u2827',
  w: '\u283a',
  x: '\u282d',
  y: '\u283d',
  z: '\u2835',
  ' ': '\u2800',
  '1': '\u2801',
  '2': '\u2803',
  '3': '\u2809',
  '4': '\u2819',
  '5': '\u2811',
  '6': '\u280b',
  '7': '\u281b',
  '8': '\u2813',
  '9': '\u280a',
  '0': '\u281a',
  '.': '\u2832',
  ',': '\u2802',
  '!': '\u2816',
  '?': '\u2826',
  '-': '\u2824',
  ':': '\u2812',
  ';': '\u2806',
  "'": '\u2804',
};

// Number indicator for Braille
const NUM_INDICATOR = '\u283c';

const REVERSE_MAP: Record<string, string> = {};
const REVERSE_DIGIT_MAP: Record<string, string> = {};
for (const [key, value] of Object.entries(BRAILLE_MAP)) {
  if (key.match(/[a-z .,!?\-:;']/)) {
    REVERSE_MAP[value] = key;
  }
  if (key >= '0' && key <= '9') {
    REVERSE_DIGIT_MAP[value] = key;
  }
}

export function textToBraille(text: string): string {
  const lower = text.toLowerCase();
  let result = '';
  let inNumber = false;

  for (const char of lower) {
    if (char >= '0' && char <= '9') {
      if (!inNumber) {
        result += NUM_INDICATOR;
        inNumber = true;
      }
      result += BRAILLE_MAP[char] ?? '\u2800';
    } else {
      inNumber = false;
      result += BRAILLE_MAP[char] ?? '\u2800';
    }
  }
  return result;
}

export function brailleToText(braille: string): string {
  let result = '';
  let inNumber = false;

  for (const char of braille) {
    if (char === NUM_INDICATOR) {
      inNumber = true;
      continue;
    }
    if (char === '\u2800') {
      inNumber = false;
      result += ' ';
      continue;
    }
    if (inNumber) {
      result += REVERSE_DIGIT_MAP[char] ?? '';
    } else {
      result += REVERSE_MAP[char] ?? '';
    }
  }
  return result;
}
