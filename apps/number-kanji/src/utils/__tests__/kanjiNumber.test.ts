import { describe, expect, test } from 'bun:test';
import { kanjiToNumber, numberToKanji } from '../kanjiNumber';

describe('numberToKanji', () => {
  test('zero', () => {
    expect(numberToKanji(0)).toBe('零');
  });
  test('single digit', () => {
    expect(numberToKanji(5)).toBe('五');
  });
  test('ten', () => {
    expect(numberToKanji(10)).toBe('十');
  });
  test('eleven', () => {
    expect(numberToKanji(11)).toBe('十一');
  });
  test('hundred', () => {
    expect(numberToKanji(100)).toBe('百');
  });
  test('1234', () => {
    expect(numberToKanji(1234)).toBe('千二百三十四');
  });
  test('10000', () => {
    expect(numberToKanji(10000)).toBe('一万');
  });
  test('12345', () => {
    expect(numberToKanji(12345)).toBe('一万二千三百四十五');
  });
  test('100000000 (1億)', () => {
    expect(numberToKanji(100000000)).toBe('一億');
  });
  test('negative', () => {
    expect(numberToKanji(-42)).toBe('マイナス四十二');
  });
  test('daiji mode', () => {
    expect(numberToKanji(123, true)).toBe('百弐拾参');
  });
});

describe('kanjiToNumber', () => {
  test('zero', () => {
    expect(kanjiToNumber('零')).toBe(0);
  });
  test('single digit', () => {
    expect(kanjiToNumber('五')).toBe(5);
  });
  test('ten', () => {
    expect(kanjiToNumber('十')).toBe(10);
  });
  test('hundred', () => {
    expect(kanjiToNumber('百')).toBe(100);
  });
  test('1234', () => {
    expect(kanjiToNumber('千二百三十四')).toBe(1234);
  });
  test('10000', () => {
    expect(kanjiToNumber('一万')).toBe(10000);
  });
  test('12345', () => {
    expect(kanjiToNumber('一万二千三百四十五')).toBe(12345);
  });
  test('invalid', () => {
    expect(kanjiToNumber('abc')).toBeNull();
  });
  test('negative', () => {
    expect(kanjiToNumber('マイナス四十二')).toBe(-42);
  });
});

describe('round-trip', () => {
  test('small numbers', () => {
    for (const n of [0, 1, 10, 42, 100, 999]) {
      expect(kanjiToNumber(numberToKanji(n))).toBe(n);
    }
  });

  test('large numbers', () => {
    expect(kanjiToNumber(numberToKanji(12345))).toBe(12345);
  });
});
