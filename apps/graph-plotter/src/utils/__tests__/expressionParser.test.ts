import { describe, it, expect } from 'vitest';
import { parse, evaluate, safeEvaluate } from '../expressionParser';

describe('expressionParser', () => {
  describe('parse and evaluate', () => {
    it('evaluates a simple number', () => {
      expect(evaluate(parse('42'))).toBe(42);
    });

    it('evaluates addition', () => {
      expect(evaluate(parse('2+3'))).toBe(5);
    });

    it('evaluates subtraction', () => {
      expect(evaluate(parse('10-4'))).toBe(6);
    });

    it('evaluates multiplication', () => {
      expect(evaluate(parse('3*4'))).toBe(12);
    });

    it('evaluates division', () => {
      expect(evaluate(parse('10/4'))).toBe(2.5);
    });

    it('evaluates power', () => {
      expect(evaluate(parse('2^3'))).toBe(8);
    });

    it('respects operator precedence', () => {
      expect(evaluate(parse('2+3*4'))).toBe(14);
    });

    it('evaluates parentheses', () => {
      expect(evaluate(parse('(2+3)*4'))).toBe(20);
    });

    it('evaluates negative numbers', () => {
      expect(evaluate(parse('-5'))).toBe(-5);
    });

    it('evaluates sin function', () => {
      expect(evaluate(parse('sin(0)'))).toBeCloseTo(0);
    });

    it('evaluates cos function', () => {
      expect(evaluate(parse('cos(0)'))).toBeCloseTo(1);
    });

    it('evaluates sqrt function', () => {
      expect(evaluate(parse('sqrt(9)'))).toBe(3);
    });

    it('evaluates abs function', () => {
      expect(evaluate(parse('abs(-5)'))).toBe(5);
    });

    it('evaluates log (base 10)', () => {
      expect(evaluate(parse('log(100)'))).toBeCloseTo(2);
    });

    it('evaluates ln (natural log)', () => {
      expect(evaluate(parse('ln(1)'))).toBeCloseTo(0);
    });

    it('evaluates pi constant', () => {
      expect(evaluate(parse('pi'))).toBeCloseTo(Math.PI);
    });

    it('evaluates e constant', () => {
      expect(evaluate(parse('e'))).toBeCloseTo(Math.E);
    });

    it('evaluates variable x', () => {
      expect(evaluate(parse('x^2'), { x: 3 })).toBe(9);
    });

    it('evaluates complex expression with x', () => {
      expect(evaluate(parse('2*x+1'), { x: 5 })).toBe(11);
    });

    it('evaluates implicit multiplication: 2x', () => {
      expect(evaluate(parse('2x'), { x: 3 })).toBe(6);
    });

    it('evaluates implicit multiplication: 2(3)', () => {
      expect(evaluate(parse('2(3)'))).toBe(6);
    });

    it('evaluates nested functions', () => {
      expect(evaluate(parse('abs(sin(0))'))).toBeCloseTo(0);
    });

    it('evaluates x^2 + 2x + 1', () => {
      expect(evaluate(parse('x^2+2x+1'), { x: 2 })).toBe(9);
    });

    it('evaluates right-associative power', () => {
      // 2^3^2 = 2^(3^2) = 2^9 = 512
      expect(evaluate(parse('2^3^2'))).toBe(512);
    });

    it('division by zero returns NaN', () => {
      expect(evaluate(parse('1/0'))).toBeNaN();
    });

    it('throws on unknown variable', () => {
      expect(() => evaluate(parse('y'), {})).toThrow('Unknown variable');
    });

    it('throws on empty expression', () => {
      expect(() => parse('')).toThrow();
    });
  });

  describe('safeEvaluate', () => {
    it('returns value for valid expression', () => {
      expect(safeEvaluate('x^2', 3)).toBe(9);
    });

    it('returns null for invalid expression', () => {
      expect(safeEvaluate('???', 0)).toBeNull();
    });

    it('returns null for division by zero', () => {
      expect(safeEvaluate('1/x', 0)).toBeNull();
    });

    it('returns null for sqrt of negative', () => {
      expect(safeEvaluate('sqrt(x)', -1)).toBeNull();
    });
  });
});
