import { describe, expect, test } from 'bun:test';
import { brailleToText, textToBraille } from '../braille';

describe('braille', () => {
  test('converts simple text to braille', () => {
    const result = textToBraille('abc');
    expect(result).toBe('\u2801\u2803\u2809');
  });

  test('converts space', () => {
    const result = textToBraille('a b');
    expect(result).toContain('\u2800');
  });

  test('handles uppercase by lowercasing', () => {
    expect(textToBraille('ABC')).toBe(textToBraille('abc'));
  });

  test('roundtrip for letters', () => {
    const input = 'hello world';
    expect(brailleToText(textToBraille(input))).toBe(input);
  });

  test('converts numbers with number indicator', () => {
    const result = textToBraille('123');
    expect(result).toContain('\u283c'); // number indicator
  });
});
