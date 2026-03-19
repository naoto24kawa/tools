import { describe, expect, it } from 'vitest';
import { clean, cleanByTypes, detect } from '../invisibleChars';

describe('detect', () => {
  it('detects zero-width space', () => {
    const text = 'Hello\u200BWorld';
    const result = detect(text);
    expect(result.totalCount).toBe(1);
    expect(result.invisibleChars[0].type).toBe('zero-width-space');
    expect(result.invisibleChars[0].name).toBe('Zero Width Space');
    expect(result.invisibleChars[0].codePoint).toBe('U+200B');
  });

  it('detects BOM', () => {
    const text = '\uFEFFHello';
    const result = detect(text);
    expect(result.totalCount).toBe(1);
    expect(result.countByType['bom']).toBe(1);
  });

  it('detects soft hyphen', () => {
    const text = 'soft\u00ADhyphen';
    const result = detect(text);
    expect(result.totalCount).toBe(1);
    expect(result.countByType['soft-hyphen']).toBe(1);
  });

  it('detects control characters', () => {
    const text = 'Hello\x01World';
    const result = detect(text);
    expect(result.totalCount).toBe(1);
    expect(result.countByType['control-char']).toBe(1);
  });

  it('detects multiple types', () => {
    const text = '\uFEFFHello\u200B\u200CWorld\u00AD';
    const result = detect(text);
    expect(result.totalCount).toBe(4);
  });

  it('returns zero for clean text', () => {
    const result = detect('Hello World');
    expect(result.totalCount).toBe(0);
  });

  it('counts by type correctly', () => {
    const text = '\u200B\u200B\u200C\uFEFF';
    const result = detect(text);
    expect(result.countByType['zero-width-space']).toBe(2);
    expect(result.countByType['zero-width-joiner']).toBe(1);
    expect(result.countByType['bom']).toBe(1);
  });
});

describe('clean', () => {
  it('removes all invisible characters', () => {
    const text = '\uFEFFHello\u200BWorld\u200C!';
    const cleaned = clean(text);
    expect(cleaned).toBe('HelloWorld!');
  });

  it('returns original text if no invisible chars', () => {
    const text = 'Hello World';
    expect(clean(text)).toBe(text);
  });

  it('handles empty string', () => {
    expect(clean('')).toBe('');
  });
});

describe('cleanByTypes', () => {
  it('removes only specified types', () => {
    const text = '\uFEFFHello\u200BWorld';
    const cleaned = cleanByTypes(text, ['bom']);
    expect(cleaned).toBe('Hello\u200BWorld');
  });

  it('removes multiple types', () => {
    const text = '\uFEFFHello\u200BWorld\u00AD!';
    const cleaned = cleanByTypes(text, ['bom', 'zero-width-space']);
    expect(cleaned).toBe('HelloWorld\u00AD!');
  });
});
