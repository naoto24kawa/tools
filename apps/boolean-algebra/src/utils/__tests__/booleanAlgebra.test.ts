import { describe, it, expect } from 'vitest';
import {
  evaluate,
  truthTable,
  extractVariables,
  simplify,
} from '../booleanAlgebra';

describe('booleanAlgebra', () => {
  describe('extractVariables', () => {
    it('extracts variables from expression', () => {
      expect(extractVariables('A & B')).toEqual(['A', 'B']);
    });

    it('extracts and sorts variables', () => {
      expect(extractVariables('C | A & B')).toEqual(['A', 'B', 'C']);
    });

    it('handles duplicates', () => {
      expect(extractVariables('A & A')).toEqual(['A']);
    });

    it('does not include operators as variables', () => {
      expect(extractVariables('A AND B OR C')).toEqual(['A', 'B', 'C']);
    });
  });

  describe('evaluate', () => {
    it('evaluates AND', () => {
      expect(evaluate('A & B', { A: true, B: true })).toBe(true);
      expect(evaluate('A & B', { A: true, B: false })).toBe(false);
      expect(evaluate('A AND B', { A: true, B: false })).toBe(false);
    });

    it('evaluates OR', () => {
      expect(evaluate('A | B', { A: false, B: false })).toBe(false);
      expect(evaluate('A | B', { A: true, B: false })).toBe(true);
      expect(evaluate('A OR B', { A: false, B: true })).toBe(true);
    });

    it('evaluates NOT', () => {
      expect(evaluate('!A', { A: true })).toBe(false);
      expect(evaluate('!A', { A: false })).toBe(true);
      expect(evaluate('NOT A', { A: true })).toBe(false);
    });

    it('evaluates XOR', () => {
      expect(evaluate('A ^ B', { A: true, B: true })).toBe(false);
      expect(evaluate('A ^ B', { A: true, B: false })).toBe(true);
      expect(evaluate('A XOR B', { A: false, B: false })).toBe(false);
    });

    it('evaluates complex expression', () => {
      expect(evaluate('(A & B) | !C', { A: true, B: false, C: false })).toBe(true);
    });

    it('respects precedence: NOT > AND > XOR > OR', () => {
      // !A & B should be (!A) & B
      expect(evaluate('!A & B', { A: false, B: true })).toBe(true);
      // A | B & C should be A | (B & C)
      expect(evaluate('A | B & C', { A: false, B: true, C: false })).toBe(false);
    });

    it('evaluates constants', () => {
      expect(evaluate('1', {})).toBe(true);
      expect(evaluate('0', {})).toBe(false);
    });

    it('throws on empty expression', () => {
      expect(() => evaluate('', {})).toThrow();
    });
  });

  describe('truthTable', () => {
    it('generates truth table for A & B', () => {
      const table = truthTable('A & B');
      expect(table.length).toBe(4);
      expect(table[0].output).toBe(false); // 0,0
      expect(table[1].output).toBe(false); // 0,1
      expect(table[2].output).toBe(false); // 1,0
      expect(table[3].output).toBe(true); // 1,1
    });

    it('generates truth table for A | B', () => {
      const table = truthTable('A | B');
      expect(table.length).toBe(4);
      expect(table[0].output).toBe(false);
      expect(table[1].output).toBe(true);
      expect(table[2].output).toBe(true);
      expect(table[3].output).toBe(true);
    });

    it('generates truth table for single variable', () => {
      const table = truthTable('A');
      expect(table.length).toBe(2);
    });

    it('generates truth table for 3 variables', () => {
      const table = truthTable('A & B & C');
      expect(table.length).toBe(8);
    });

    it('generates truth table for 4 variables', () => {
      const table = truthTable('A & B | C ^ D');
      expect(table.length).toBe(16);
    });
  });

  describe('simplify', () => {
    it('simplifies tautology', () => {
      expect(simplify('A | !A')).toBe('1 (TRUE)');
    });

    it('simplifies contradiction', () => {
      expect(simplify('A & !A')).toBe('0 (FALSE)');
    });

    it('simplifies identity', () => {
      const result = simplify('A');
      expect(result).toBe('A');
    });

    it('simplifies NOT A', () => {
      const result = simplify('!A');
      expect(result).toBe('NOT A');
    });

    it('returns a non-empty string for complex expressions', () => {
      const result = simplify('A & B | C');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
