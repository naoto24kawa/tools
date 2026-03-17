import { describe, expect, test } from 'bun:test';
import {
  addFractions,
  decimalToFraction,
  formatFraction,
  fractionToDecimal,
  multiplyFractions,
  simplify,
} from '../fraction';

describe('fraction', () => {
  test('simplify 2/4 = 1/2', () => {
    expect(simplify(2, 4)).toEqual({ numerator: 1, denominator: 2 });
  });
  test('simplify 6/8 = 3/4', () => {
    expect(simplify(6, 8)).toEqual({ numerator: 3, denominator: 4 });
  });
  test('simplify negative', () => {
    expect(simplify(-2, 4)).toEqual({ numerator: -1, denominator: 2 });
  });

  test('decimalToFraction 0.5', () => {
    expect(decimalToFraction(0.5)).toEqual({ numerator: 1, denominator: 2 });
  });
  test('decimalToFraction 0.75', () => {
    expect(decimalToFraction(0.75)).toEqual({ numerator: 3, denominator: 4 });
  });
  test('decimalToFraction integer', () => {
    expect(decimalToFraction(5)).toEqual({ numerator: 5, denominator: 1 });
  });

  test('fractionToDecimal', () => {
    expect(fractionToDecimal(1, 4)).toBe(0.25);
  });
  test('fractionToDecimal zero denominator', () => {
    expect(fractionToDecimal(1, 0)).toBeNaN();
  });

  test('addFractions 1/2 + 1/3 = 5/6', () => {
    const result = addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 3 });
    expect(result).toEqual({ numerator: 5, denominator: 6 });
  });

  test('multiplyFractions 1/2 * 2/3 = 1/3', () => {
    const result = multiplyFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 2, denominator: 3 }
    );
    expect(result).toEqual({ numerator: 1, denominator: 3 });
  });

  test('formatFraction', () => {
    expect(formatFraction({ numerator: 3, denominator: 4 })).toBe('3/4');
  });
  test('formatFraction whole', () => {
    expect(formatFraction({ numerator: 5, denominator: 1 })).toBe('5');
  });
});
