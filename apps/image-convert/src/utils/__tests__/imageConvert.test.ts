import { describe, expect, test } from 'vitest';
import { FORMATS } from '../imageConvert';

describe('imageConvert', () => {
  test('has 3 formats', () => {
    expect(FORMATS.length).toBe(3);
  });
  test('includes PNG', () => {
    expect(FORMATS.find((f) => f.label === 'PNG')).toBeDefined();
  });
  test('includes JPEG', () => {
    expect(FORMATS.find((f) => f.label === 'JPEG')).toBeDefined();
  });
  test('includes WebP', () => {
    expect(FORMATS.find((f) => f.label === 'WebP')).toBeDefined();
  });
});
