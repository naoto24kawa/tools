import { describe, it, expect } from 'vitest';
import { detectHomoglyphs, getSecurityLevel } from '../homoglyphDetector';

describe('detectHomoglyphs', () => {
  it('returns empty array for pure Latin text', () => {
    const results = detectHomoglyphs('Hello World');
    expect(results).toHaveLength(0);
  });

  it('detects Cyrillic confusables', () => {
    // \u0410 is Cyrillic А which looks like Latin A
    const results = detectHomoglyphs('\u0410BC');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].script).toBe('Cyrillic');
    expect(results[0].confusableWith).toBe('A');
  });

  it('detects multiple confusables', () => {
    // Mix of Cyrillic А (U+0410) and С (U+0421) with Latin
    const results = detectHomoglyphs('\u0410B\u0421');
    const confusables = results.filter((r) => r.risk === 'medium');
    expect(confusables.length).toBeGreaterThanOrEqual(2);
  });

  it('detects zero-width characters', () => {
    const results = detectHomoglyphs('hello\u200Bworld');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].risk).toBe('high');
  });

  it('handles empty string', () => {
    const results = detectHomoglyphs('');
    expect(results).toHaveLength(0);
  });

  it('returns correct indices', () => {
    const results = detectHomoglyphs('A\u0412C');
    const cyrillicB = results.find((r) => r.confusableWith === 'B');
    expect(cyrillicB).toBeDefined();
    expect(cyrillicB!.index).toBe(1);
  });
});

describe('getSecurityLevel', () => {
  it('returns safe for no findings', () => {
    const level = getSecurityLevel([]);
    expect(level.level).toBe('safe');
  });

  it('returns danger for high risk', () => {
    const results = detectHomoglyphs('test\u200Btest');
    const level = getSecurityLevel(results);
    expect(level.level).toBe('danger');
  });

  it('returns warning for medium risk', () => {
    const results = detectHomoglyphs('\u0410BC');
    const level = getSecurityLevel(results);
    expect(level.level).toBe('warning');
  });
});
