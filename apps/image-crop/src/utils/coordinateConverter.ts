import type { Crop, PixelCrop } from '@types';

/**
 * 座標変換関数のコレクション
 * 画像の表示サイズと実際のサイズ、パーセント/ピクセル単位の変換を行う
 */

/**
 * パーセント単位のCropをピクセル単位のCropに変換
 * @param percentCrop パーセント単位のCrop領域
 * @param displayWidth 表示幅（px）
 * @param displayHeight 表示高さ（px）
 * @param actualWidth 実際の画像幅（px）
 * @param actualHeight 実際の画像高さ（px）
 * @returns ピクセル単位のCrop領域（実際の画像サイズに対する座標）
 */
export function convertPercentToPixelCrop(
  percentCrop: Crop,
  displayWidth: number,
  displayHeight: number,
  actualWidth: number,
  actualHeight: number
): Crop {
  if (displayWidth === 0 || displayHeight === 0) {
    return {
      unit: 'px',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  const scaleX = actualWidth / displayWidth;
  const scaleY = actualHeight / displayHeight;

  return {
    unit: 'px',
    x: (percentCrop.x / 100) * displayWidth * scaleX,
    y: (percentCrop.y / 100) * displayHeight * scaleY,
    width: (percentCrop.width / 100) * displayWidth * scaleX,
    height: (percentCrop.height / 100) * displayHeight * scaleY,
  };
}

/**
 * 表示座標を実際の画像座標に変換
 * @param cropData Crop領域（パーセントまたはピクセル単位）
 * @param displayWidth 表示幅（px）
 * @param displayHeight 表示高さ（px）
 * @param actualWidth 実際の画像幅（px）
 * @param actualHeight 実際の画像高さ（px）
 * @returns 実際の画像サイズに対するピクセル座標
 */
export function convertToActualPixels(
  cropData: Crop,
  displayWidth: number,
  displayHeight: number,
  actualWidth: number,
  actualHeight: number
): PixelCrop {
  if (displayWidth === 0 || displayHeight === 0) {
    return {
      unit: 'px' as const,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  let pixelX: number, pixelY: number, pixelWidth: number, pixelHeight: number;

  // パーセント単位の場合は、まず表示サイズのピクセルに変換
  if (cropData.unit === '%') {
    pixelX = (cropData.x / 100) * displayWidth;
    pixelY = (cropData.y / 100) * displayHeight;
    pixelWidth = (cropData.width / 100) * displayWidth;
    pixelHeight = (cropData.height / 100) * displayHeight;
  } else {
    pixelX = cropData.x;
    pixelY = cropData.y;
    pixelWidth = cropData.width;
    pixelHeight = cropData.height;
  }

  // 実際のサイズとの比率を計算
  const scaleX = actualWidth / displayWidth;
  const scaleY = actualHeight / displayHeight;

  // 実際の画像サイズのピクセル座標に変換
  return {
    unit: 'px' as const,
    x: pixelX * scaleX,
    y: pixelY * scaleY,
    width: pixelWidth * scaleX,
    height: pixelHeight * scaleY,
  };
}

/**
 * ピクセル座標をパーセント座標に変換
 * @param pixelCrop ピクセル単位のCrop領域
 * @param imageWidth 画像幅（px）
 * @param imageHeight 画像高さ（px）
 * @returns パーセント単位のCrop領域
 */
export function convertPixelToPercentCrop(
  pixelCrop: Crop,
  imageWidth: number,
  imageHeight: number
): Crop {
  if (imageWidth === 0 || imageHeight === 0) {
    return {
      unit: '%',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  return {
    unit: '%',
    x: (pixelCrop.x / imageWidth) * 100,
    y: (pixelCrop.y / imageHeight) * 100,
    width: (pixelCrop.width / imageWidth) * 100,
    height: (pixelCrop.height / imageHeight) * 100,
  };
}
