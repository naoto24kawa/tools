import { describe, expect, test } from 'vitest';
import { calculate } from '../calculator';

describe('calculator', () => {
  test('addition', () => {
    expect(calculate('2+3').result).toBe(5);
  });
  test('subtraction', () => {
    expect(calculate('10-4').result).toBe(6);
  });
  test('multiplication', () => {
    expect(calculate('3*4').result).toBe(12);
  });
  test('division', () => {
    expect(calculate('10/4').result).toBe(2.5);
  });
  test('modulo', () => {
    expect(calculate('10%3').result).toBe(1);
  });
  test('power', () => {
    expect(calculate('2^3').result).toBe(8);
  });
  test('parentheses', () => {
    expect(calculate('(2+3)*4').result).toBe(20);
  });
  test('nested parentheses', () => {
    expect(calculate('((2+3)*4)+1').result).toBe(21);
  });
  test('negative number', () => {
    expect(calculate('-5+3').result).toBe(-2);
  });
  test('decimal', () => {
    expect(calculate('1.5+2.5').result).toBe(4);
  });
  test('order of operations', () => {
    expect(calculate('2+3*4').result).toBe(14);
  });
  test('empty string', () => {
    expect(calculate('').result).toBe(0);
  });
  test('invalid expression', () => {
    expect(calculate('abc').error).not.toBeNull();
  });
  test('division by zero', () => {
    expect(calculate('1/0').error).not.toBeNull();
  });
});
