import { describe, expect, test } from 'bun:test';

describe('asciiArt', () => {
  test('module exports imageToAscii', async () => {
    const mod = await import('../asciiArt');
    expect(typeof mod.imageToAscii).toBe('function');
  });
});
