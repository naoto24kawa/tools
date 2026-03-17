import { describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG, generateCSS } from '../flexbox';

describe('flexbox', () => {
  test('contains display flex', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('display: flex');
  });
  test('contains direction', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('flex-direction: row');
  });
  test('contains justify-content', () => {
    expect(generateCSS(DEFAULT_CONFIG)).toContain('justify-content: flex-start');
  });
  test('custom gap', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, gap: 16 })).toContain('gap: 16px');
  });
  test('column direction', () => {
    expect(generateCSS({ ...DEFAULT_CONFIG, direction: 'column' })).toContain(
      'flex-direction: column'
    );
  });
});
