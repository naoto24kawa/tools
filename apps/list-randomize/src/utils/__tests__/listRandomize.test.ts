import { describe, expect, test } from 'bun:test';
import { pickRandom, shuffleArray, shuffleLines } from '../listRandomize';

describe('listRandomize', () => {
  describe('shuffleArray', () => {
    test('returns same length', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(shuffleArray(arr).length).toBe(5);
    });

    test('contains all elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      expect(shuffled.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
    });

    test('does not mutate original', () => {
      const arr = [1, 2, 3];
      shuffleArray(arr);
      expect(arr).toEqual([1, 2, 3]);
    });

    test('handles empty array', () => {
      expect(shuffleArray([])).toEqual([]);
    });

    test('handles single element', () => {
      expect(shuffleArray([1])).toEqual([1]);
    });

    test('actually shuffles (statistical)', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      let sameCount = 0;
      for (let i = 0; i < 10; i++) {
        if (shuffleArray(arr).join(',') === arr.join(',')) sameCount++;
      }
      expect(sameCount).toBeLessThan(10);
    });
  });

  describe('shuffleLines', () => {
    test('shuffles lines', () => {
      const input = 'a\nb\nc\nd\ne';
      const lines = shuffleLines(input).split('\n');
      expect(lines.length).toBe(5);
      expect(lines.sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    test('handles empty string', () => {
      expect(shuffleLines('')).toBe('');
    });
  });

  describe('pickRandom', () => {
    test('picks specified count', () => {
      const input = 'a\nb\nc\nd\ne';
      const picked = pickRandom(input, 3).split('\n');
      expect(picked.length).toBe(3);
    });

    test('picks at most available items', () => {
      const input = 'a\nb';
      const picked = pickRandom(input, 10).split('\n');
      expect(picked.length).toBe(2);
    });

    test('handles empty string', () => {
      expect(pickRandom('', 5)).toBe('');
    });

    test('skips empty lines in input', () => {
      const input = 'a\n\nb\n\nc';
      const picked = pickRandom(input, 10).split('\n');
      expect(picked.length).toBe(3);
    });
  });
});
