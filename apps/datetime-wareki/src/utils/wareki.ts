export interface Era {
  name: string;
  kanji: string;
  startYear: number;
  startMonth: number;
  startDay: number;
}

export const ERAS: Era[] = [
  { name: 'Reiwa', kanji: '令和', startYear: 2019, startMonth: 5, startDay: 1 },
  { name: 'Heisei', kanji: '平成', startYear: 1989, startMonth: 1, startDay: 8 },
  { name: 'Showa', kanji: '昭和', startYear: 1926, startMonth: 12, startDay: 25 },
  { name: 'Taisho', kanji: '大正', startYear: 1912, startMonth: 7, startDay: 30 },
  { name: 'Meiji', kanji: '明治', startYear: 1868, startMonth: 1, startDay: 25 },
];

export function getEra(year: number, month: number, day: number): Era | null {
  for (const era of ERAS) {
    const eraStart = new Date(era.startYear, era.startMonth - 1, era.startDay);
    const target = new Date(year, month - 1, day);
    if (target >= eraStart) return era;
  }
  return null;
}

export function seirekiToWareki(year: number, month: number, day: number): string {
  const era = getEra(year, month, day);
  if (!era) return `${year}年${month}月${day}日`;
  const eraYear = year - era.startYear + 1;
  const yearStr = eraYear === 1 ? '元' : String(eraYear);
  return `${era.kanji}${yearStr}年${month}月${day}日`;
}

export function warekiToSeireki(eraKanji: string, eraYear: number): number | null {
  const era = ERAS.find((e) => e.kanji === eraKanji);
  if (!era) return null;
  return era.startYear + eraYear - 1;
}

export function getCurrentWareki(): string {
  const now = new Date();
  return seirekiToWareki(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
