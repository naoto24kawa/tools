import { describe, expect, it } from 'bun:test';
import { DEFAULT_OPTIONS } from '../handwriting';

describe('HandwritingOptions', () => {
  it('DEFAULT_OPTIONS has valid fontSize', () => {
    expect(DEFAULT_OPTIONS.fontSize).toBeGreaterThan(0);
    expect(typeof DEFAULT_OPTIONS.fontSize).toBe('number');
  });

  it('DEFAULT_OPTIONS has valid color (hex string)', () => {
    expect(DEFAULT_OPTIONS.color).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('DEFAULT_OPTIONS has valid backgroundColor (hex string)', () => {
    expect(DEFAULT_OPTIONS.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it('DEFAULT_OPTIONS has valid lineHeight', () => {
    expect(DEFAULT_OPTIONS.lineHeight).toBeGreaterThan(0);
    expect(typeof DEFAULT_OPTIONS.lineHeight).toBe('number');
  });

  it('DEFAULT_OPTIONS has wobble in range 0-10', () => {
    expect(DEFAULT_OPTIONS.wobble).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_OPTIONS.wobble).toBeLessThanOrEqual(10);
  });

  it('DEFAULT_OPTIONS has non-empty fontFamily', () => {
    expect(DEFAULT_OPTIONS.fontFamily).toBeTruthy();
    expect(typeof DEFAULT_OPTIONS.fontFamily).toBe('string');
  });

  it('DEFAULT_OPTIONS has all required fields', () => {
    const requiredKeys = [
      'fontSize',
      'color',
      'backgroundColor',
      'lineHeight',
      'wobble',
      'fontFamily',
    ];
    for (const key of requiredKeys) {
      expect(DEFAULT_OPTIONS).toHaveProperty(key);
    }
  });
});
