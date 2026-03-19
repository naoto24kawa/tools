import { describe, test, expect } from 'vitest';
import { callTool } from './test-helpers';

describe('crypto tools', () => {
  test('caesar encrypt/decrypt round trip', async () => {
    const encrypted = await callTool('cipher_caesar_encrypt', { text: 'Hello', shift: 3 });
    const encText = (encrypted.content as Array<{ type: string; text: string }>)[0].text;
    expect(encText).toBe('Khoor');
    const decrypted = await callTool('cipher_caesar_decrypt', { text: encText, shift: 3 });
    expect(decrypted.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('caesar bruteforce returns valid JSON with 26 entries', async () => {
    const result = await callTool('cipher_caesar_bruteforce', { text: 'Khoor' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const parsed = JSON.parse(text);
    expect(parsed).toHaveLength(26);
    expect(parsed[0]).toHaveProperty('shift');
    expect(parsed[0]).toHaveProperty('result');
  });

  test('rot13 HELLO -> URYYB', async () => {
    const result = await callTool('cipher_rot', { text: 'HELLO', variant: 'rot13' });
    expect(result.content).toEqual([{ type: 'text', text: 'URYYB' }]);
  });

  test('rot18 includes digit rotation', async () => {
    const result = await callTool('cipher_rot', { text: 'ABC123', variant: 'rot18' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toBe('NOP678');
  });

  test('rot47', async () => {
    const result = await callTool('cipher_rot', { text: 'Hello!', variant: 'rot47' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text.length).toBe(6);
    expect(text).not.toBe('Hello!');
  });

  test('vigenere encrypt/decrypt round trip', async () => {
    const encrypted = await callTool('cipher_vigenere_encrypt', { text: 'HELLO', key: 'KEY' });
    const encText = (encrypted.content as Array<{ type: string; text: string }>)[0].text;
    const decrypted = await callTool('cipher_vigenere_decrypt', { text: encText, key: 'KEY' });
    expect(decrypted.content).toEqual([{ type: 'text', text: 'HELLO' }]);
  });

  test('atbash ABC -> ZYX', async () => {
    const result = await callTool('cipher_atbash', { text: 'ABC' });
    expect(result.content).toEqual([{ type: 'text', text: 'ZYX' }]);
  });

  test('atbash is symmetric', async () => {
    const first = await callTool('cipher_atbash', { text: 'Hello' });
    const firstText = (first.content as Array<{ type: string; text: string }>)[0].text;
    const second = await callTool('cipher_atbash', { text: firstText });
    expect(second.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('affine encrypt with invalid a returns isError', async () => {
    const result = await callTool('cipher_affine_encrypt', { text: 'Hello', a: 2, b: 3 });
    expect(result.isError).toBe(true);
  });

  test('affine encrypt/decrypt round trip', async () => {
    const encrypted = await callTool('cipher_affine_encrypt', { text: 'Hello', a: 5, b: 8 });
    const encText = (encrypted.content as Array<{ type: string; text: string }>)[0].text;
    expect(encrypted.isError).toBeUndefined();
    const decrypted = await callTool('cipher_affine_decrypt', { text: encText, a: 5, b: 8 });
    expect(decrypted.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('affine decrypt with invalid a returns isError', async () => {
    const result = await callTool('cipher_affine_decrypt', { text: 'Hello', a: 4, b: 3 });
    expect(result.isError).toBe(true);
  });

  test('rail fence encrypt/decrypt round trip', async () => {
    const encrypted = await callTool('cipher_rail_fence_encrypt', {
      text: 'HELLO WORLD',
      rails: 3,
    });
    const encText = (encrypted.content as Array<{ type: string; text: string }>)[0].text;
    expect(encText).not.toBe('HELLO WORLD');
    const decrypted = await callTool('cipher_rail_fence_decrypt', { text: encText, rails: 3 });
    expect(decrypted.content).toEqual([{ type: 'text', text: 'HELLO WORLD' }]);
  });

  test('enigma with defaults produces output different from input', async () => {
    const result = await callTool('cipher_enigma', { text: 'HELLO' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toHaveLength(5);
    expect(text).not.toBe('HELLO');
    // Output should be uppercase letters
    expect(text).toMatch(/^[A-Z]+$/);
  });

  test('enigma with custom rotors and positions', async () => {
    const result = await callTool('cipher_enigma', {
      text: 'ABC',
      rotors: ['III', 'II', 'I'],
      positions: [1, 2, 3],
    });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toHaveLength(3);
    expect(text).toMatch(/^[A-Z]+$/);
  });
});
