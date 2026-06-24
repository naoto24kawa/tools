export type YakudoshiType = 'pre' | 'main' | 'post' | 'ko';

export interface YakudoshiEntry {
  age: number;
  year: number;      // 西暦年（数え年ベース）
  waYear: string;    // 和暦表記
  type: YakudoshiType;
  label: string;
}

export interface YakudoshiResult {
  entries: YakudoshiEntry[];
  currentYear: number;
}

// 男性の本厄年齢（数え年）
const MALE_MAIN_AGES = [25, 42, 61];
// 女性の本厄年齢（数え年）
const FEMALE_MAIN_AGES = [19, 33, 37, 61];
// 小厄（男女共通）
const MALE_KO_AGES = [19, 28, 37, 46, 55];
const FEMALE_KO_AGES = [25, 34, 43, 52, 61];

function toWaYear(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年`;
  if (year >= 1989) return `平成${year - 1988}年`;
  if (year >= 1926) return `昭和${year - 1925}年`;
  return `${year}年`;
}

export function calcYakudoshi(
  birthYear: number,
  gender: 'male' | 'female',
): YakudoshiResult {
  const mainAges = gender === 'male' ? MALE_MAIN_AGES : FEMALE_MAIN_AGES;
  const koAges = gender === 'male' ? MALE_KO_AGES : FEMALE_KO_AGES;
  const currentYear = new Date().getFullYear();
  const entries: YakudoshiEntry[] = [];

  for (const mainAge of mainAges) {
    // 数え年 = 生まれ年 + 年齢 - 1
    const mainYear = birthYear + mainAge - 1;

    entries.push({ age: mainAge - 1, year: mainYear - 1, waYear: toWaYear(mainYear - 1), type: 'pre', label: '前厄' });
    entries.push({ age: mainAge, year: mainYear, waYear: toWaYear(mainYear), type: 'main', label: '本厄' });
    entries.push({ age: mainAge + 1, year: mainYear + 1, waYear: toWaYear(mainYear + 1), type: 'post', label: '後厄' });
  }

  for (const koAge of koAges) {
    const koYear = birthYear + koAge - 1;
    // 小厄は本厄と重複しない
    if (!entries.some((e) => e.year === koYear)) {
      entries.push({ age: koAge, year: koYear, waYear: toWaYear(koYear), type: 'ko', label: '小厄' });
    }
  }

  entries.sort((a, b) => a.year - b.year);

  return { entries, currentYear };
}
