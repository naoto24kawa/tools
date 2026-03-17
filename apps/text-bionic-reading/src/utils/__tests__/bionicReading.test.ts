import { describe, expect, test } from 'vitest';
import { toBionicHTML, toBionicMarkdown, toBionicWord } from '../bionicReading';

describe('bionicReading', () => {
  describe('toBionicWord', () => {
    test('bolds first half of word at 0.5 ratio', () => {
      expect(toBionicWord('hello', 0.5)).toBe('<b>hel</b>lo');
    });

    test('bolds at least 1 character', () => {
      expect(toBionicWord('a', 0.5)).toBe('<b>a</b>');
    });

    test('handles empty string', () => {
      expect(toBionicWord('', 0.5)).toBe('');
    });

    test('respects ratio parameter', () => {
      expect(toBionicWord('hello', 0.8)).toBe('<b>hell</b>o');
    });

    test('escapes HTML in input', () => {
      expect(toBionicWord('<script>', 0.5)).toBe('<b>&lt;scr</b>ipt&gt;');
    });
  });

  describe('toBionicHTML', () => {
    test('converts sentence', () => {
      const result = toBionicHTML('hello world', { fixationRatio: 0.5 });
      expect(result).toBe('<b>hel</b>lo <b>wor</b>ld');
    });

    test('handles multiline', () => {
      const result = toBionicHTML('hello\nworld', { fixationRatio: 0.5 });
      expect(result).toBe('<b>hel</b>lo<br><b>wor</b>ld');
    });

    test('handles empty string', () => {
      expect(toBionicHTML('', { fixationRatio: 0.5 })).toBe('');
    });

    test('escapes HTML entities in user input', () => {
      const result = toBionicHTML('<b>bold</b>', { fixationRatio: 0.5 });
      expect(result).not.toContain('<b>bold</b>');
      expect(result).toContain('&lt;b&gt;');
    });
  });

  describe('toBionicMarkdown', () => {
    test('converts sentence', () => {
      const result = toBionicMarkdown('hello world', { fixationRatio: 0.5 });
      expect(result).toBe('**hel**lo **wor**ld');
    });

    test('handles multiline', () => {
      const result = toBionicMarkdown('hello\nworld', { fixationRatio: 0.5 });
      expect(result).toBe('**hel**lo\n**wor**ld');
    });

    test('handles empty string', () => {
      expect(toBionicMarkdown('', { fixationRatio: 0.5 })).toBe('');
    });
  });
});
