import { describe, expect, test } from 'bun:test';
import { LANGUAGES } from '../ocr';

describe('ocr', () => {
  test('has languages defined', () => {
    expect(LANGUAGES.length).toBeGreaterThan(0);
  });
  test('english is first language', () => {
    expect(LANGUAGES[0].value).toBe('eng');
  });
});
