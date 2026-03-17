import { describe, expect, test } from 'vitest';
import { railFenceDecrypt, railFenceEncrypt } from '../railFence';

describe('railFence', () => {
  test('encrypt 3 rails', () => {
    expect(railFenceEncrypt('WEAREDISCOVERED', 3)).toBe('WECRLTEERDSOIAE');
  });
  test('decrypt 3 rails', () => {
    expect(railFenceDecrypt('WECRLTEERDSOIAE', 3)).toBe('WEAREDISCOVERED');
  });
  test('round-trip', () => {
    expect(railFenceDecrypt(railFenceEncrypt('Hello World', 4), 4)).toBe('Hello World');
  });
  test('1 rail returns same', () => {
    expect(railFenceEncrypt('ABC', 1)).toBe('ABC');
  });
  test('2 rails', () => {
    expect(railFenceEncrypt('ABCDEF', 2)).toBe('ACEBDF');
  });
  test('empty string', () => {
    expect(railFenceEncrypt('', 3)).toBe('');
  });
  test('single char', () => {
    expect(railFenceEncrypt('A', 3)).toBe('A');
  });
});
