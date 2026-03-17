import { describe, expect, test } from 'bun:test';
import { FAVICON_SIZES } from '../favicon';

describe('favicon', () => {
  test('has standard sizes', () => {
    expect(FAVICON_SIZES).toContain(16);
    expect(FAVICON_SIZES).toContain(32);
    expect(FAVICON_SIZES).toContain(256);
  });
  test('has 6 sizes', () => {
    expect(FAVICON_SIZES.length).toBe(6);
  });
});
