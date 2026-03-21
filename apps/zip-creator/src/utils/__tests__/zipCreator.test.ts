import { describe, expect, test } from 'vitest';
import { createZip, formatSize } from '../zipCreator';

describe('createZip', () => {
  test('createZip with compression produces smaller output', async () => {
    const content = new TextEncoder().encode('Hello '.repeat(100));
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const uncompressed = await createZip([file], false);
    const compressed = await createZip([file], true);
    expect(compressed.size).toBeLessThan(uncompressed.size);
  });

  test('createZip without compression works', async () => {
    const content = new TextEncoder().encode('test');
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const blob = await createZip([file], false);
    expect(blob.size).toBeGreaterThan(0);
  });

  test('createZip defaults to no compression for backward compat', async () => {
    const content = new TextEncoder().encode('test');
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const blob = await createZip([file]);
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('formatSize', () => {
  test('should format 0 bytes', () => {
    expect(formatSize(0)).toBe('0 B');
  });

  test('should format kilobytes', () => {
    expect(formatSize(1024)).toBe('1.0 KB');
  });

  test('should format megabytes', () => {
    expect(formatSize(1048576)).toBe('1.0 MB');
  });
});
