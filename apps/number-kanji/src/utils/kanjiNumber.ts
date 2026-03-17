const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const DAIJI = ['零', '壱', '弐', '参', '四', '五', '六', '七', '八', '九'];
const SMALL_UNITS = ['', '十', '百', '千'];
const LARGE_UNITS = ['', '万', '億', '兆', '京'];
const DAIJI_SMALL = ['', '拾', '百', '千'];
const DAIJI_LARGE = ['', '萬', '億', '兆', '京'];

function convertGroup(n: number, digits: string[], smallUnits: string[]): string {
  if (n === 0) return '';
  let result = '';
  const s = String(n).padStart(4, '0');
  for (let i = 0; i < 4; i++) {
    const d = Number(s[i]);
    if (d === 0) continue;
    const unit = smallUnits[3 - i];
    if (d === 1 && unit) {
      result += unit;
    } else {
      result += digits[d] + unit;
    }
  }
  return result;
}

export function numberToKanji(num: number, useDaiji = false): string {
  if (num === 0) return useDaiji ? DAIJI[0] : DIGITS[0];
  if (!Number.isFinite(num)) return '';

  const isNegative = num < 0;
  let n = Math.abs(Math.floor(num));

  const digits = useDaiji ? DAIJI : DIGITS;
  const smallUnits = useDaiji ? DAIJI_SMALL : SMALL_UNITS;
  const largeUnits = useDaiji ? DAIJI_LARGE : LARGE_UNITS;

  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 10000);
    n = Math.floor(n / 10000);
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupStr = convertGroup(groups[i], digits, smallUnits);
    if (groupStr) {
      result += groupStr + largeUnits[i];
    }
  }

  return (isNegative ? 'マイナス' : '') + result;
}

const KANJI_DIGIT_MAP: Record<string, number> = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  壱: 1,
  弐: 2,
  参: 3,
};

export function kanjiToNumber(kanji: string): number | null {
  let input = kanji.trim();
  const isNegative = input.startsWith('マイナス');
  if (isNegative) input = input.slice(4);

  if (KANJI_DIGIT_MAP[input] !== undefined)
    return isNegative ? -KANJI_DIGIT_MAP[input] : KANJI_DIGIT_MAP[input];

  let total = 0;
  let current = 0;
  let temp = 0;

  for (const char of input) {
    if (KANJI_DIGIT_MAP[char] !== undefined) {
      temp = KANJI_DIGIT_MAP[char];
    } else if (char === '十' || char === '拾') {
      current += (temp || 1) * 10;
      temp = 0;
    } else if (char === '百') {
      current += (temp || 1) * 100;
      temp = 0;
    } else if (char === '千') {
      current += (temp || 1) * 1000;
      temp = 0;
    } else if (char === '万' || char === '萬') {
      current += temp;
      total += (current || 1) * 10000;
      current = 0;
      temp = 0;
    } else if (char === '億') {
      current += temp;
      total += (current || 1) * 100000000;
      current = 0;
      temp = 0;
    } else if (char === '兆') {
      current += temp;
      total += (current || 1) * 1000000000000;
      current = 0;
      temp = 0;
    } else {
      return null;
    }
  }

  total += current + temp;
  return isNegative ? -total : total;
}
