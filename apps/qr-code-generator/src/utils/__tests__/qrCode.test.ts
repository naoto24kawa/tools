import { describe, expect, test } from 'bun:test';
import { DEFAULT_OPTIONS, generateQrDataUrl } from '../qrCode';

describe('qrCode', () => {
  test('generates data URL', async () => {
    const result = await generateQrDataUrl('Hello');
    expect(result).toContain('data:image/png;base64,');
  });

  test('default options are valid', () => {
    expect(DEFAULT_OPTIONS.width).toBeGreaterThan(0);
    expect(DEFAULT_OPTIONS.margin).toBeGreaterThanOrEqual(0);
  });

  test('different inputs produce different QR codes', async () => {
    const qr1 = await generateQrDataUrl('Hello');
    const qr2 = await generateQrDataUrl('World');
    expect(qr1).not.toBe(qr2);
  });
});
