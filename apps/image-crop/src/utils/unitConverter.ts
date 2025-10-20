import type { Crop, PixelCrop } from '@types';

/**
 * 単位変換専用ユーティリティ
 */

/**
 * パーセントをピクセルに変換
 */
export function percentToPixels(percent: number, dimension: number): number {
  return (percent / 100) * dimension;
}

/**
 * ピクセルをパーセントに変換
 */
export function pixelsToPercent(pixels: number, dimension: number): number {
  return (pixels / dimension) * 100;
}

/**
 * Cropオブジェクトをピクセル単位に変換
 */
export function calculateCropPixels(
  crop: Crop,
  imageSize: { width: number; height: number }
): PixelCrop {
  if (crop.unit === 'px') {
    return crop as PixelCrop;
  }

  return {
    x: percentToPixels(crop.x, imageSize.width),
    y: percentToPixels(crop.y, imageSize.height),
    width: percentToPixels(crop.width, imageSize.width),
    height: percentToPixels(crop.height, imageSize.height),
    unit: 'px',
  };
}
