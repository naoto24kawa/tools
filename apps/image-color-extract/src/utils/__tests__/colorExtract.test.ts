import { describe, expect, test } from 'bun:test';

describe('colorExtract', () => {
  test('module exports extractColors', async () => {
    const mod = await import('../colorExtract');
    expect(typeof mod.extractColors).toBe('function');
  });
});
