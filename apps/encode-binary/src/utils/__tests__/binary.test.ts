import { describe, expect, test } from 'bun:test';
import {
  binaryToText,
  decimalToText,
  hexToText,
  textToBinary,
  textToDecimal,
  textToHex,
} from '../binary';

describe('binary', () => {
  test('textToBinary', () => {
    expect(textToBinary('AB')).toBe('01000001 01000010');
  });

  test('binaryToText', () => {
    expect(binaryToText('01000001 01000010')).toBe('AB');
  });

  test('textToHex', () => {
    expect(textToHex('AB')).toBe('41 42');
  });

  test('hexToText', () => {
    expect(hexToText('41 42')).toBe('AB');
  });

  test('textToDecimal', () => {
    expect(textToDecimal('AB')).toBe('65 66');
  });

  test('decimalToText', () => {
    expect(decimalToText('65 66')).toBe('AB');
  });

  test('empty string', () => {
    expect(textToBinary('')).toBe('');
    expect(binaryToText('')).toBe('');
  });

  test('round-trip binary', () => {
    expect(binaryToText(textToBinary('Hello World!'))).toBe('Hello World!');
  });

  test('round-trip hex', () => {
    expect(hexToText(textToHex('Hello!'))).toBe('Hello!');
  });

  test('round-trip decimal', () => {
    expect(decimalToText(textToDecimal('Test'))).toBe('Test');
  });
});
