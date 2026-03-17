import { describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG, generateLoaderCSS } from '../cssLoader';

describe('cssLoader', () => {
  test('spinner contains animation', () => {
    expect(generateLoaderCSS('spinner', DEFAULT_CONFIG)).toContain('@keyframes spin');
  });
  test('dots contains bounce', () => {
    expect(generateLoaderCSS('dots', DEFAULT_CONFIG)).toContain('@keyframes bounce');
  });
  test('pulse contains pulse', () => {
    expect(generateLoaderCSS('pulse', DEFAULT_CONFIG)).toContain('@keyframes pulse');
  });
  test('ring contains rotate', () => {
    expect(generateLoaderCSS('ring', DEFAULT_CONFIG)).toContain('rotate');
  });
  test('uses custom color', () => {
    expect(generateLoaderCSS('spinner', { ...DEFAULT_CONFIG, color: '#ff0000' })).toContain(
      '#ff0000'
    );
  });
  test('uses custom size', () => {
    expect(generateLoaderCSS('spinner', { ...DEFAULT_CONFIG, size: 64 })).toContain('64px');
  });
});
