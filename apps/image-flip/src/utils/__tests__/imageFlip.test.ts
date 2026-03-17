import { describe, expect, test } from 'vitest';

// Canvas-based functions can't be fully tested in Node/Bun without DOM
// These are basic type/export verification tests

describe('imageFlip', () => {
  test('module exports flipImageOnCanvas', async () => {
    const mod = await import('../imageFlip');
    expect(typeof mod.flipImageOnCanvas).toBe('function');
  });

  test('FlipDirection type is correct', async () => {
    const _: import('../imageFlip').FlipDirection = 'horizontal';
    expect(_).toBe('horizontal');
  });
});
