import { describe, it, expect } from 'vitest';
import { inspectText, inspectCharacter } from '../unicodeInspector';

describe('inspectCharacter', () => {
  it('inspects ASCII character', () => {
    const info = inspectCharacter('A');
    expect(info.char).toBe('A');
    expect(info.codePoint).toBe('U+0041');
    expect(info.utf8Bytes).toBe('41');
    expect(info.category).toContain('Letter');
    expect(info.name).toBe('LATIN CAPITAL LETTER A');
    expect(info.block).toBe('Basic Latin');
  });

  it('inspects space', () => {
    const info = inspectCharacter(' ');
    expect(info.codePoint).toBe('U+0020');
    expect(info.name).toBe('SPACE');
  });

  it('inspects multi-byte character', () => {
    const info = inspectCharacter('\u3042');
    expect(info.codePoint).toBe('U+3042');
    expect(info.block).toBe('Hiragana');
  });

  it('inspects digit', () => {
    const info = inspectCharacter('5');
    expect(info.codePoint).toBe('U+0035');
    expect(info.name).toBe('DIGIT 5');
    expect(info.category).toContain('Decimal');
  });
});

describe('inspectText', () => {
  it('handles empty string', () => {
    expect(inspectText('')).toHaveLength(0);
  });

  it('inspects multiple characters', () => {
    const results = inspectText('Hi');
    expect(results).toHaveLength(2);
    expect(results[0].char).toBe('H');
    expect(results[1].char).toBe('i');
  });

  it('handles surrogate pairs', () => {
    const results = inspectText('\u{1F600}');
    expect(results).toHaveLength(1);
    expect(results[0].codePoint).toBe('U+1F600');
  });

  it('handles mixed content', () => {
    const results = inspectText('A\u3042');
    expect(results).toHaveLength(2);
    expect(results[0].block).toBe('Basic Latin');
    expect(results[1].block).toBe('Hiragana');
  });
});
