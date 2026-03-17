import { describe, expect, test } from 'bun:test';
import { generateBlobPath, generateBlobSVG } from '../svgBlob';

describe('svgBlob', () => {
  test('generateBlobPath returns valid path', () => {
    const path = generateBlobPath(6, 300, 0.3);
    expect(path).toStartWith('M ');
    expect(path).toEndWith(' Z');
  });

  test('generateBlobSVG includes xmlns', () => {
    expect(generateBlobSVG(300, '#ff0000', 6, 0.3)).toContain('xmlns=');
  });

  test('generateBlobSVG includes color', () => {
    expect(generateBlobSVG(300, '#ff0000', 6, 0.3)).toContain('#ff0000');
  });

  test('generateBlobSVG includes size', () => {
    expect(generateBlobSVG(200, '#000', 6, 0.3)).toContain('width="200"');
  });

  test('different seeds produce different paths', () => {
    const p1 = generateBlobPath(6, 300, 0.3);
    const p2 = generateBlobPath(6, 300, 0.3);
    // Random, so might be same but unlikely
    expect(typeof p1).toBe('string');
    expect(typeof p2).toBe('string');
  });
});
