import { describe, it, expect } from 'vitest';
import {
  add,
  subtract,
  multiply,
  transpose,
  determinant,
  inverse,
  scalarMultiply,
  createMatrix,
  determinantSteps,
} from '../matrixCalc';

describe('matrixCalc', () => {
  describe('createMatrix', () => {
    it('creates a matrix filled with zeros', () => {
      expect(createMatrix(2, 3)).toEqual([
        [0, 0, 0],
        [0, 0, 0],
      ]);
    });

    it('creates a matrix filled with a custom value', () => {
      expect(createMatrix(2, 2, 5)).toEqual([
        [5, 5],
        [5, 5],
      ]);
    });
  });

  describe('add', () => {
    it('adds two matrices', () => {
      const a = [
        [1, 2],
        [3, 4],
      ];
      const b = [
        [5, 6],
        [7, 8],
      ];
      expect(add(a, b)).toEqual([
        [6, 8],
        [10, 12],
      ]);
    });

    it('throws on dimension mismatch', () => {
      const a = [[1, 2]];
      const b = [
        [1],
        [2],
      ];
      expect(() => add(a, b)).toThrow('same dimensions');
    });
  });

  describe('subtract', () => {
    it('subtracts two matrices', () => {
      const a = [
        [5, 6],
        [7, 8],
      ];
      const b = [
        [1, 2],
        [3, 4],
      ];
      expect(subtract(a, b)).toEqual([
        [4, 4],
        [4, 4],
      ]);
    });
  });

  describe('multiply', () => {
    it('multiplies two matrices', () => {
      const a = [
        [1, 2],
        [3, 4],
      ];
      const b = [
        [5, 6],
        [7, 8],
      ];
      expect(multiply(a, b)).toEqual([
        [19, 22],
        [43, 50],
      ]);
    });

    it('multiplies non-square matrices', () => {
      const a = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      const b = [
        [7, 8],
        [9, 10],
        [11, 12],
      ];
      expect(multiply(a, b)).toEqual([
        [58, 64],
        [139, 154],
      ]);
    });

    it('throws on incompatible dimensions', () => {
      const a = [[1, 2]];
      const b = [[1, 2]];
      expect(() => multiply(a, b)).toThrow('columns in first matrix');
    });
  });

  describe('scalarMultiply', () => {
    it('multiplies matrix by scalar', () => {
      const m = [
        [1, 2],
        [3, 4],
      ];
      expect(scalarMultiply(m, 3)).toEqual([
        [3, 6],
        [9, 12],
      ]);
    });
  });

  describe('transpose', () => {
    it('transposes a square matrix', () => {
      const m = [
        [1, 2],
        [3, 4],
      ];
      expect(transpose(m)).toEqual([
        [1, 3],
        [2, 4],
      ]);
    });

    it('transposes a non-square matrix', () => {
      const m = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      expect(transpose(m)).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
    });
  });

  describe('determinant', () => {
    it('computes 1x1 determinant', () => {
      expect(determinant([[5]])).toBe(5);
    });

    it('computes 2x2 determinant', () => {
      const m = [
        [1, 2],
        [3, 4],
      ];
      expect(determinant(m)).toBe(-2);
    });

    it('computes 3x3 determinant', () => {
      const m = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      expect(determinant(m)).toBe(0);
    });

    it('computes non-zero 3x3 determinant', () => {
      const m = [
        [6, 1, 1],
        [4, -2, 5],
        [2, 8, 7],
      ];
      expect(determinant(m)).toBe(-306);
    });

    it('throws on non-square matrix', () => {
      const m = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      expect(() => determinant(m)).toThrow('square');
    });
  });

  describe('inverse', () => {
    it('computes 1x1 inverse', () => {
      expect(inverse([[4]])).toEqual([[0.25]]);
    });

    it('computes 2x2 inverse', () => {
      const m = [
        [4, 7],
        [2, 6],
      ];
      const inv = inverse(m);
      expect(inv[0][0]).toBeCloseTo(0.6);
      expect(inv[0][1]).toBeCloseTo(-0.7);
      expect(inv[1][0]).toBeCloseTo(-0.2);
      expect(inv[1][1]).toBeCloseTo(0.4);
    });

    it('inverse times original gives identity', () => {
      const m = [
        [1, 2],
        [3, 4],
      ];
      const inv = inverse(m);
      const product = multiply(m, inv);
      expect(product[0][0]).toBeCloseTo(1);
      expect(product[0][1]).toBeCloseTo(0);
      expect(product[1][0]).toBeCloseTo(0);
      expect(product[1][1]).toBeCloseTo(1);
    });

    it('throws on singular matrix', () => {
      const m = [
        [1, 2],
        [2, 4],
      ];
      expect(() => inverse(m)).toThrow('singular');
    });
  });

  describe('determinantSteps', () => {
    it('returns steps for 2x2', () => {
      const steps = determinantSteps([
        [1, 2],
        [3, 4],
      ]);
      expect(steps.length).toBeGreaterThan(1);
      expect(steps[steps.length - 1]).toContain('-2');
    });
  });
});
