import { describe, expect, test } from 'vitest';
import { seirekiToWareki, warekiToSeireki } from '../wareki';

describe('wareki', () => {
  test('2024 is Reiwa 6', () => {
    expect(seirekiToWareki(2024, 1, 1)).toBe('令和6年1月1日');
  });

  test('2019-05-01 is Reiwa 元年', () => {
    expect(seirekiToWareki(2019, 5, 1)).toBe('令和元年5月1日');
  });

  test('2019-04-30 is Heisei 31', () => {
    expect(seirekiToWareki(2019, 4, 30)).toBe('平成31年4月30日');
  });

  test('1989-01-08 is Heisei 元年', () => {
    expect(seirekiToWareki(1989, 1, 8)).toBe('平成元年1月8日');
  });

  test('1926-12-25 is Showa 元年', () => {
    expect(seirekiToWareki(1926, 12, 25)).toBe('昭和元年12月25日');
  });

  test('1945-08-15 is Showa 20', () => {
    expect(seirekiToWareki(1945, 8, 15)).toBe('昭和20年8月15日');
  });

  test('warekiToSeireki: Reiwa 6 = 2024', () => {
    expect(warekiToSeireki('令和', 6)).toBe(2024);
  });

  test('warekiToSeireki: Heisei 1 = 1989', () => {
    expect(warekiToSeireki('平成', 1)).toBe(1989);
  });

  test('warekiToSeireki: invalid era', () => {
    expect(warekiToSeireki('不明', 1)).toBeNull();
  });

  test('round-trip', () => {
    const year = warekiToSeireki('令和', 6);
    expect(year).toBe(2024);
  });
});
