import { describe, expect, it } from 'vitest';
import {
  createDefaultTransform,
  rotateClockwise,
  rotateCounterClockwise,
  rotate180,
  getTransformLabel,
  getOutputDimensions,
  getOutputFileName,
  formatFileSize,
} from '../videoRotate';

describe('createDefaultTransform', () => {
  it('creates default transform with no rotation or flip', () => {
    const t = createDefaultTransform();
    expect(t.rotation).toBe(0);
    expect(t.flipH).toBe(false);
    expect(t.flipV).toBe(false);
  });
});

describe('rotateClockwise', () => {
  it('rotates 0 -> 90 -> 180 -> 270 -> 0', () => {
    expect(rotateClockwise(0)).toBe(90);
    expect(rotateClockwise(90)).toBe(180);
    expect(rotateClockwise(180)).toBe(270);
    expect(rotateClockwise(270)).toBe(0);
  });
});

describe('rotateCounterClockwise', () => {
  it('rotates 0 -> 270 -> 180 -> 90 -> 0', () => {
    expect(rotateCounterClockwise(0)).toBe(270);
    expect(rotateCounterClockwise(270)).toBe(180);
    expect(rotateCounterClockwise(180)).toBe(90);
    expect(rotateCounterClockwise(90)).toBe(0);
  });
});

describe('rotate180', () => {
  it('rotates by 180 degrees', () => {
    expect(rotate180(0)).toBe(180);
    expect(rotate180(90)).toBe(270);
    expect(rotate180(180)).toBe(0);
    expect(rotate180(270)).toBe(90);
  });
});

describe('getTransformLabel', () => {
  it('shows no transform for default', () => {
    expect(getTransformLabel(createDefaultTransform())).toBe('No transform');
  });

  it('shows rotation', () => {
    expect(getTransformLabel({ rotation: 90, flipH: false, flipV: false })).toBe(
      'Rotated 90 deg'
    );
  });

  it('shows flip', () => {
    expect(getTransformLabel({ rotation: 0, flipH: true, flipV: false })).toBe('Flipped H');
  });

  it('shows combined transforms', () => {
    expect(getTransformLabel({ rotation: 180, flipH: true, flipV: true })).toBe(
      'Rotated 180 deg, Flipped H, Flipped V'
    );
  });
});

describe('getOutputDimensions', () => {
  it('keeps dimensions for 0 and 180 rotation', () => {
    expect(getOutputDimensions(1920, 1080, 0)).toEqual({ width: 1920, height: 1080 });
    expect(getOutputDimensions(1920, 1080, 180)).toEqual({ width: 1920, height: 1080 });
  });

  it('swaps dimensions for 90 and 270 rotation', () => {
    expect(getOutputDimensions(1920, 1080, 90)).toEqual({ width: 1080, height: 1920 });
    expect(getOutputDimensions(1920, 1080, 270)).toEqual({ width: 1080, height: 1920 });
  });
});

describe('getOutputFileName', () => {
  it('includes rotation info', () => {
    expect(getOutputFileName('video.mp4', { rotation: 90, flipH: false, flipV: false })).toBe(
      'video_r90.webm'
    );
  });

  it('includes flip info', () => {
    expect(getOutputFileName('video.mp4', { rotation: 0, flipH: true, flipV: true })).toBe(
      'video_fh_fv.webm'
    );
  });

  it('includes combined info', () => {
    expect(getOutputFileName('video.mp4', { rotation: 180, flipH: true, flipV: false })).toBe(
      'video_r180_fh.webm'
    );
  });

  it('uses default suffix for no transform', () => {
    expect(getOutputFileName('video.mp4', createDefaultTransform())).toBe(
      'video_transformed.webm'
    );
  });
});

describe('formatFileSize', () => {
  it('formats various sizes', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});
