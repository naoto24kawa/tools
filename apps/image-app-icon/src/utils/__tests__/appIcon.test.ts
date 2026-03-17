import { describe, expect, test } from 'vitest';
import { ICON_SIZES } from '../appIcon';

describe('appIcon', () => {
  test('has iOS sizes', () => {
    expect(ICON_SIZES.some((s) => s.platform === 'iOS')).toBe(true);
  });
  test('has Android sizes', () => {
    expect(ICON_SIZES.some((s) => s.platform === 'Android')).toBe(true);
  });
  test('has 8 sizes', () => {
    expect(ICON_SIZES.length).toBe(8);
  });
  test('includes 512', () => {
    expect(ICON_SIZES.some((s) => s.size === 512)).toBe(true);
  });
});
