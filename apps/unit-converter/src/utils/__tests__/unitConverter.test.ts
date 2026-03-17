import { describe, expect, test } from 'vitest';
import { convert } from '../unitConverter';

describe('unitConverter', () => {
  test('meters to kilometers', () => {
    expect(convert(1000, 'm', 'km', '長さ')).toBeCloseTo(1);
  });

  test('kilometers to meters', () => {
    expect(convert(1, 'km', 'm', '長さ')).toBeCloseTo(1000);
  });

  test('inches to centimeters', () => {
    expect(convert(1, 'in', 'cm', '長さ')).toBeCloseTo(2.54);
  });

  test('celsius to fahrenheit', () => {
    expect(convert(100, 'c', 'f', '温度')).toBeCloseTo(212);
  });

  test('fahrenheit to celsius', () => {
    expect(convert(32, 'f', 'c', '温度')).toBeCloseTo(0);
  });

  test('celsius to kelvin', () => {
    expect(convert(0, 'c', 'k', '温度')).toBeCloseTo(273.15);
  });

  test('kilograms to pounds', () => {
    expect(convert(1, 'kg', 'lb', '重さ')).toBeCloseTo(2.20462, 3);
  });

  test('km/h to m/s', () => {
    expect(convert(3.6, 'kmh', 'mps', '速度')).toBeCloseTo(1);
  });

  test('bytes to megabytes', () => {
    expect(convert(1048576, 'b', 'mb', 'データ')).toBeCloseTo(1);
  });

  test('same unit returns same value', () => {
    expect(convert(42, 'm', 'm', '長さ')).toBe(42);
  });

  test('invalid category returns 0', () => {
    expect(convert(1, 'm', 'km', '不明')).toBe(0);
  });

  test('round-trip', () => {
    const original = 100;
    const converted = convert(original, 'km', 'mi', '長さ');
    expect(convert(converted, 'mi', 'km', '長さ')).toBeCloseTo(original);
  });
});
