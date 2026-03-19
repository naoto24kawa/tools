// Combining characters for zalgo effect
const COMBINING_ABOVE = [
  '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
  '\u0308', '\u0309', '\u030A', '\u030B', '\u030C', '\u030D', '\u030E', '\u030F',
  '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u031A', '\u033D',
  '\u033E', '\u033F', '\u0340', '\u0341', '\u0342', '\u0343', '\u0344', '\u0346',
  '\u034A', '\u034B', '\u034C', '\u0350', '\u0351', '\u0352', '\u0357', '\u035B',
  '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036A',
  '\u036B', '\u036C', '\u036D', '\u036E', '\u036F',
];

const COMBINING_MIDDLE = [
  '\u0334', '\u0335', '\u0336', '\u0337', '\u0338', '\u0339', '\u033A', '\u033B',
  '\u033C',
];

const COMBINING_BELOW = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031C', '\u031D', '\u031E', '\u031F',
  '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
  '\u0328', '\u0329', '\u032A', '\u032B', '\u032C', '\u032D', '\u032E', '\u032F',
  '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033A', '\u033B', '\u033C',
  '\u0345', '\u0347', '\u0348', '\u0349', '\u034D', '\u034E', '\u0353', '\u0354',
  '\u0355', '\u0356', '\u0359', '\u035A', '\u035C', '\u035D', '\u035E', '\u035F',
];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface ZalgoOptions {
  intensity: number; // 0-100
  above: boolean;
  middle: boolean;
  below: boolean;
}

const DEFAULT_OPTIONS: ZalgoOptions = {
  intensity: 50,
  above: true,
  middle: true,
  below: true,
};

export function addZalgo(text: string, options: Partial<ZalgoOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const count = Math.max(1, Math.ceil(opts.intensity / 10));

  return [...text]
    .map((char) => {
      // Skip if already a combining character
      if (isCombiningChar(char)) return char;

      let result = char;

      if (opts.above) {
        for (let i = 0; i < count; i++) {
          result += randomPick(COMBINING_ABOVE);
        }
      }
      if (opts.middle) {
        for (let i = 0; i < Math.ceil(count / 2); i++) {
          result += randomPick(COMBINING_MIDDLE);
        }
      }
      if (opts.below) {
        for (let i = 0; i < count; i++) {
          result += randomPick(COMBINING_BELOW);
        }
      }
      return result;
    })
    .join('');
}

export function removeZalgo(text: string): string {
  // Remove all combining diacritical marks (U+0300-U+036F and U+0340-U+036F)
  return text.replace(/[\u0300-\u036F\u0340-\u036F]/g, '');
}

function isCombiningChar(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 0x0300 && code <= 0x036f;
}

export function countCombiningChars(text: string): number {
  const matches = text.match(/[\u0300-\u036F]/g);
  return matches ? matches.length : 0;
}
