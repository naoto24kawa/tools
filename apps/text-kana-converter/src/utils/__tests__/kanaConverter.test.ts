import { describe, expect, test } from 'bun:test';
import { convertKana, toHiragana, toKatakana } from '../kanaConverter';

describe('kanaConverter', () => {
  describe('toKatakana', () => {
    test('converts hiragana to katakana', () => {
      expect(toKatakana('あいうえお')).toBe('アイウエオ');
    });

    test('handles dakuten', () => {
      expect(toKatakana('がぎぐげご')).toBe('ガギグゲゴ');
    });

    test('handles handakuten', () => {
      expect(toKatakana('ぱぴぷぺぽ')).toBe('パピプペポ');
    });

    test('handles small kana', () => {
      expect(toKatakana('ぁぃぅぇぉっゃゅょ')).toBe('ァィゥェォッャュョ');
    });

    test('preserves non-hiragana characters', () => {
      expect(toKatakana('hello あいう world')).toBe('hello アイウ world');
    });

    test('handles empty string', () => {
      expect(toKatakana('')).toBe('');
    });

    test('preserves katakana as-is', () => {
      expect(toKatakana('アイウ')).toBe('アイウ');
    });

    test('preserves kanji', () => {
      expect(toKatakana('漢字')).toBe('漢字');
    });
  });

  describe('toHiragana', () => {
    test('converts katakana to hiragana', () => {
      expect(toHiragana('アイウエオ')).toBe('あいうえお');
    });

    test('handles dakuten', () => {
      expect(toHiragana('ガギグゲゴ')).toBe('がぎぐげご');
    });

    test('preserves non-katakana characters', () => {
      expect(toHiragana('hello アイウ world')).toBe('hello あいう world');
    });

    test('handles empty string', () => {
      expect(toHiragana('')).toBe('');
    });

    test('preserves hiragana as-is', () => {
      expect(toHiragana('あいう')).toBe('あいう');
    });
  });

  describe('convertKana dispatcher', () => {
    test('dispatches to toKatakana', () => {
      expect(convertKana('あいう', 'toKatakana')).toBe('アイウ');
    });

    test('dispatches to toHiragana', () => {
      expect(convertKana('アイウ', 'toHiragana')).toBe('あいう');
    });
  });

  describe('round-trip', () => {
    test('hiragana -> katakana -> hiragana preserves value', () => {
      const original = 'こんにちは';
      expect(toHiragana(toKatakana(original))).toBe(original);
    });

    test('katakana -> hiragana -> katakana preserves value', () => {
      const original = 'コンニチハ';
      expect(toKatakana(toHiragana(original))).toBe(original);
    });
  });
});
