import { describe, expect, test } from 'vitest';

describe('qrReader', () => {
  test('module exports exist', async () => {
    const mod = await import('../qrReader');
    expect(typeof mod.readQrFromImageData).toBe('function');
    expect(typeof mod.imageFileToImageData).toBe('function');
  });
});
