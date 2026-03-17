import { describe, expect, test } from 'vitest';

describe('webcam', () => {
  test('module exports getWebcamStream', async () => {
    const mod = await import('../webcam');
    expect(typeof mod.getWebcamStream).toBe('function');
  });
});
