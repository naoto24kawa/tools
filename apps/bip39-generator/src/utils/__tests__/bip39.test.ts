import { describe, expect, test } from 'bun:test';
import { generateMnemonic, validateMnemonic, WORDLIST } from '../bip39';

describe('bip39', () => {
  test('wordlist has 2048 words', () => {
    expect(WORDLIST.length).toBe(2048);
  });

  test('generates 12-word mnemonic', async () => {
    const mnemonic = await generateMnemonic(12);
    expect(mnemonic.split(' ').length).toBe(12);
  });

  test('generates 24-word mnemonic', async () => {
    const mnemonic = await generateMnemonic(24);
    expect(mnemonic.split(' ').length).toBe(24);
  });

  test('generated mnemonic uses valid words', async () => {
    const mnemonic = await generateMnemonic(12);
    const words = mnemonic.split(' ');
    for (const word of words) {
      expect(WORDLIST).toContain(word);
    }
  });

  test('validates invalid mnemonic', () => {
    expect(validateMnemonic('not a valid mnemonic phrase at all here now')).toBe(false);
  });
});
