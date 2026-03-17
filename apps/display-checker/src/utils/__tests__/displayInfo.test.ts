import { describe, expect, test } from 'bun:test';
import { getBreakpoint } from '../displayInfo';

describe('displayInfo', () => {
  describe('getBreakpoint', () => {
    test('xs for small width', () => {
      expect(getBreakpoint(320)).toContain('xs');
    });

    test('sm for 640px', () => {
      expect(getBreakpoint(640)).toContain('sm');
    });

    test('md for 768px', () => {
      expect(getBreakpoint(768)).toContain('md');
    });

    test('lg for 1024px', () => {
      expect(getBreakpoint(1024)).toContain('lg');
    });

    test('xl for 1280px', () => {
      expect(getBreakpoint(1280)).toContain('xl');
    });

    test('2xl for 1536px', () => {
      expect(getBreakpoint(1536)).toContain('2xl');
    });

    test('2xl for large width', () => {
      expect(getBreakpoint(2560)).toContain('2xl');
    });
  });
});
