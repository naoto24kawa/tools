import { describe, expect, test } from 'vitest';

describe('asciiArt', () => {
  test('module exports imageToAscii', async () => {
    const mod = await import('../asciiArt');
    expect(typeof mod.imageToAscii).toBe('function');
  });
});
