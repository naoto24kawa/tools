// Combining characters for Zalgo text
const COMBINING_ABOVE = [
  '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
  '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
  '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u033D',
  '\u033E', '\u033F', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346',
  '\u034A', '\u034B', '\u034C', '\u0350', '\u0351', '\u0352', '\u0357', '\u035B',
];

const COMBINING_BELOW = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
  '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
  '\u0328', '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
  '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033A', '\u033B', '\u033C',
  '\u0345', '\u0347', '\u0348', '\u0349', '\u034D', '\u034E', '\u0353', '\u0354',
  '\u0355', '\u0356', '\u0359', '\u035A',
];

const COMBINING_MIDDLE = [
  '\u0334', '\u0335', '\u0336', '\u0337', '\u0338',
];

export type ZalgoIntensity = 'mini' | 'normal' | 'max';

function getIntensityRange(intensity: ZalgoIntensity): [number, number] {
  switch (intensity) {
    case 'mini':
      return [1, 3];
    case 'normal':
      return [3, 8];
    case 'max':
      return [8, 20];
  }
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function zalgoify(
  text: string,
  intensity: ZalgoIntensity,
  above: boolean = true,
  below: boolean = true,
  middle: boolean = true
): string {
  const [min, max] = getIntensityRange(intensity);
  let result = '';

  for (const char of text) {
    // Skip if it's already a combining character
    const cp = char.codePointAt(0) || 0;
    if (cp >= 0x0300 && cp <= 0x036f) {
      result += char;
      continue;
    }

    result += char;

    if (above) {
      const count = randomRange(min, max);
      for (let i = 0; i < count; i++) {
        result += randomPick(COMBINING_ABOVE);
      }
    }
    if (middle) {
      const count = randomRange(Math.max(1, min - 1), Math.max(2, max - 3));
      for (let i = 0; i < count; i++) {
        result += randomPick(COMBINING_MIDDLE);
      }
    }
    if (below) {
      const count = randomRange(min, max);
      for (let i = 0; i < count; i++) {
        result += randomPick(COMBINING_BELOW);
      }
    }
  }

  return result;
}

export function removeZalgo(text: string): string {
  // Remove all combining diacritical marks (U+0300 - U+036F)
  // and combining diacritical marks extended (U+1AB0 - U+1AFF)
  // and combining diacritical marks supplement (U+1DC0 - U+1DFF)
  return text.replace(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g, '');
}

export function countCombining(text: string): number {
  const combining = text.match(/[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g);
  return combining ? combining.length : 0;
}
