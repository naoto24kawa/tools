import { describe, expect, test } from 'bun:test';
import { ROTATION_ANGLES } from '../pdfRotate';

describe('pdfRotate', () => {
  test('rotation angles are valid', () => {
    expect(ROTATION_ANGLES).toEqual([0, 90, 180, 270]);
  });
  test('has 4 angles', () => {
    expect(ROTATION_ANGLES.length).toBe(4);
  });
});
