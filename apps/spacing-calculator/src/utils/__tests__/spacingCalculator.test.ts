import { describe, expect, it } from 'vitest';
import {
  pxToRem,
  pxToEm,
  getTailwindClass,
  calculateSpacingScale,
  formatSpacingTable,
} from '../spacingCalculator';

describe('spacingCalculator', () => {
  describe('pxToRem', () => {
    it('converts 16px to 1rem with base 16', () => {
      expect(pxToRem(16, 16)).toBe('1rem');
    });

    it('converts 8px to 0.5rem with base 16', () => {
      expect(pxToRem(8, 16)).toBe('0.5rem');
    });

    it('converts 24px to 1.5rem with base 16', () => {
      expect(pxToRem(24, 16)).toBe('1.5rem');
    });

    it('handles base font size of 0', () => {
      expect(pxToRem(16, 0)).toBe('0rem');
    });

    it('converts with custom base', () => {
      expect(pxToRem(14, 14)).toBe('1rem');
    });
  });

  describe('pxToEm', () => {
    it('converts 16px to 1em with base 16', () => {
      expect(pxToEm(16, 16)).toBe('1em');
    });

    it('converts 8px to 0.5em with base 16', () => {
      expect(pxToEm(8, 16)).toBe('0.5em');
    });

    it('handles base font size of 0', () => {
      expect(pxToEm(16, 0)).toBe('0em');
    });
  });

  describe('getTailwindClass', () => {
    it('returns known Tailwind class for 8px', () => {
      expect(getTailwindClass(8)).toBe('2');
    });

    it('returns known Tailwind class for 16px', () => {
      expect(getTailwindClass(16)).toBe('4');
    });

    it('returns known Tailwind class for 32px', () => {
      expect(getTailwindClass(32)).toBe('8');
    });

    it('returns arbitrary value for unknown px', () => {
      expect(getTailwindClass(13)).toBe('[13px]');
    });

    it('returns known value for 0px', () => {
      expect(getTailwindClass(0)).toBe('0');
    });
  });

  describe('calculateSpacingScale', () => {
    it('returns correct number of scale entries', () => {
      const result = calculateSpacingScale(8, 16);
      expect(result).toHaveLength(12);
    });

    it('calculates 1x correctly for base 8', () => {
      const result = calculateSpacingScale(8, 16);
      const oneX = result.find((v) => v.multiplier === 1);
      expect(oneX).toBeDefined();
      expect(oneX!.px).toBe(8);
      expect(oneX!.rem).toBe('0.5rem');
    });

    it('calculates 2x correctly for base 8', () => {
      const result = calculateSpacingScale(8, 16);
      const twoX = result.find((v) => v.multiplier === 2);
      expect(twoX).toBeDefined();
      expect(twoX!.px).toBe(16);
    });

    it('calculates 0.5x correctly', () => {
      const result = calculateSpacingScale(8, 16);
      const halfX = result.find((v) => v.multiplier === 0.5);
      expect(halfX).toBeDefined();
      expect(halfX!.px).toBe(4);
    });

    it('handles different base unit', () => {
      const result = calculateSpacingScale(4, 16);
      const oneX = result.find((v) => v.multiplier === 1);
      expect(oneX!.px).toBe(4);
    });
  });

  describe('formatSpacingTable', () => {
    it('generates a table with header and rows', () => {
      const values = calculateSpacingScale(8, 16);
      const table = formatSpacingTable(values);
      expect(table).toContain('Scale');
      expect(table).toContain('px');
      expect(table).toContain('rem');
      expect(table).toContain('Tailwind');
      expect(table.split('\n').length).toBe(14); // header + separator + 12 rows
    });
  });
});
