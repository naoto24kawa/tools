import { describe, it, expect } from 'vitest';
import { inspect, fromCodepoint } from '../unicodeInspector';

describe('unicodeInspector', () => {
  it('should inspect ASCII characters', () => {
    const result = inspect('A');
    expect(result).toHaveLength(1);
    expect(result[0].char).toBe('A');
    expect(result[0].codepoint).toBe('U+0041');
    expect(result[0].category).toContain('Uppercase');
    expect(result[0].block).toBe('Basic Latin');
  });

  it('should inspect multi-byte characters', () => {
    const result = inspect('\u3042'); // Hiragana A
    expect(result).toHaveLength(1);
    expect(result[0].codepoint).toBe('U+3042');
    expect(result[0].block).toBe('Hiragana');
  });

  it('should handle multiple characters', () => {
    const result = inspect('Hi');
    expect(result).toHaveLength(2);
    expect(result[0].char).toBe('H');
    expect(result[1].char).toBe('i');
  });

  it('should handle empty input', () => {
    const result = inspect('');
    expect(result).toHaveLength(0);
  });

  it('fromCodepoint should convert valid codepoint', () => {
    expect(fromCodepoint('U+0041')).toBe('A');
    expect(fromCodepoint('0041')).toBe('A');
    expect(fromCodepoint('3042')).toBe('\u3042');
  });

  it('fromCodepoint should handle invalid input', () => {
    expect(fromCodepoint('invalid')).toBe('');
    expect(fromCodepoint('FFFFFF')).toBe('');
  });
});
