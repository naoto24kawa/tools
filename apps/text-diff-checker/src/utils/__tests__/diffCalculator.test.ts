import { describe, test, expect } from 'bun:test';
import { calculateDiff } from '../diffCalculator';

describe('diffCalculator', () => {
  const defaultOptions = {
    ignoreWhitespace: false,
    ignoreCase: false,
    ignoreEmptyLines: false,
    ignoreAllWhitespace: false,
  };

  describe('calculateDiff', () => {
    test('should detect added lines', () => {
      const original = 'line1\nline2\n';
      const modified = 'line1\nline2\nline3\n';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.statistics.linesAdded).toBe(1);
      expect(result.changes.some(c => c.type === 'added')).toBe(true);
    });

    test('should detect removed lines', () => {
      const original = 'line1\nline2\nline3\n';
      const modified = 'line1\nline2\n';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.statistics.linesRemoved).toBe(1);
      expect(result.changes.some(c => c.type === 'removed')).toBe(true);
    });

    test('should detect unchanged lines', () => {
      const original = 'line1\nline2';
      const modified = 'line1\nline2';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.statistics.linesUnchanged).toBe(2);
      expect(result.changes.every(c => c.type === 'unchanged')).toBe(true);
    });

    test('should handle empty texts', () => {
      const result = calculateDiff('', '', defaultOptions);
      
      expect(result.changes.length).toBe(0);
      expect(result.statistics.linesAdded).toBe(0);
      expect(result.statistics.linesRemoved).toBe(0);
    });

    test('should calculate character counts', () => {
      const original = 'abc';
      const modified = 'abcdef';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.statistics.originalCharCount).toBe(3);
      expect(result.statistics.modifiedCharCount).toBe(6);
    });

    test('should handle complex changes', () => {
      const original = 'line1\nline2\nline3\nline4';
      const modified = 'line1\nmodified2\nline3\nline5';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.statistics.linesAdded).toBeGreaterThan(0);
      expect(result.statistics.linesRemoved).toBeGreaterThan(0);
      expect(result.statistics.linesUnchanged).toBeGreaterThan(0);
    });

    test('should separate original and modified lines', () => {
      const original = 'line1\nline2';
      const modified = 'line1\nline3';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      expect(result.originalLines).toBeDefined();
      expect(result.modifiedLines).toBeDefined();
      expect(result.originalLines.every(c => c.type !== 'added')).toBe(true);
      expect(result.modifiedLines.every(c => c.type !== 'removed')).toBe(true);
    });

    test('should include line numbers', () => {
      const original = 'line1\nline2';
      const modified = 'line1\nline2\nline3';
      
      const result = calculateDiff(original, modified, defaultOptions);
      
      result.changes.forEach(change => {
        expect(change.lineNumber).toBeGreaterThan(0);
      });
    });

    test('should handle ignore options', () => {
      const original = 'Line1';
      const modified = 'line1';
      
      const resultWithWhitespace = calculateDiff(original, modified, {
        ...defaultOptions,
        ignoreWhitespace: false,
      });
      
      const resultIgnoreWhitespace = calculateDiff(original, modified, {
        ...defaultOptions,
        ignoreWhitespace: true,
      });
      
      // Both should detect the case difference
      expect(resultWithWhitespace.statistics.linesAdded + resultWithWhitespace.statistics.linesRemoved).toBeGreaterThan(0);
      expect(resultIgnoreWhitespace.statistics.linesAdded + resultIgnoreWhitespace.statistics.linesRemoved).toBeGreaterThan(0);
    });
  });
});
