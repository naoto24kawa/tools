import { describe, expect, it } from 'bun:test';
import { DEFAULT_OPTIONS } from '../pdfWatermark';

describe('DEFAULT_OPTIONS', () => {
  it('should have a non-empty text', () => {
    expect(DEFAULT_OPTIONS.text).toBe('CONFIDENTIAL');
    expect(DEFAULT_OPTIONS.text.length).toBeGreaterThan(0);
  });

  it('should have a positive fontSize', () => {
    expect(DEFAULT_OPTIONS.fontSize).toBe(48);
    expect(DEFAULT_OPTIONS.fontSize).toBeGreaterThan(0);
  });

  it('should have opacity between 0 and 1', () => {
    expect(DEFAULT_OPTIONS.opacity).toBe(0.3);
    expect(DEFAULT_OPTIONS.opacity).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_OPTIONS.opacity).toBeLessThanOrEqual(1);
  });

  it('should have a valid rotation value', () => {
    expect(DEFAULT_OPTIONS.rotation).toBe(-45);
    expect(DEFAULT_OPTIONS.rotation).toBeGreaterThanOrEqual(-360);
    expect(DEFAULT_OPTIONS.rotation).toBeLessThanOrEqual(360);
  });

  it('should have color values between 0 and 1', () => {
    expect(DEFAULT_OPTIONS.color.r).toBe(0.5);
    expect(DEFAULT_OPTIONS.color.g).toBe(0.5);
    expect(DEFAULT_OPTIONS.color.b).toBe(0.5);

    expect(DEFAULT_OPTIONS.color.r).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_OPTIONS.color.r).toBeLessThanOrEqual(1);
    expect(DEFAULT_OPTIONS.color.g).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_OPTIONS.color.g).toBeLessThanOrEqual(1);
    expect(DEFAULT_OPTIONS.color.b).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_OPTIONS.color.b).toBeLessThanOrEqual(1);
  });
});
