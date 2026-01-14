import type { TrimBounds } from '@types';

/**
 * Canvas ImageDataから透過余白の境界を検出する
 *
 * アルゴリズム:
 * 1. ImageDataの各ピクセルをスキャン
 * 2. アルファ値が閾値を超えるピクセルの最小/最大座標を記録
 * 3. 不透明ピクセルを含む最小矩形 (Bounding Box) を返す
 *
 * @param imageData Canvas APIから取得したImageData
 * @param alphaThreshold アルファ閾値 (0-255)
 * @returns 不透明領域の境界情報、または完全透過の場合はnull
 */
export function detectTransparentBounds(
  imageData: ImageData,
  alphaThreshold: number = 0
): TrimBounds | null {
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  // 各ピクセルをスキャン (RGBA形式: 4バイト/ピクセル)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3]; // アルファチャンネル

      // アルファ値が閾値を超える場合は不透明とみなす
      if (alpha !== undefined && alpha > alphaThreshold) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // 完全に透過な画像の場合
  if (maxX < 0 || maxY < 0) {
    return null;
  }

  return {
    top: minY,
    right: width - 1 - maxX,
    bottom: height - 1 - maxY,
    left: minX,
  };
}

/**
 * 画像要素からImageDataを取得
 *
 * @param image HTML画像要素
 * @returns ImageData
 */
export function getImageData(image: HTMLImageElement): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * トリミング後のサイズを計算
 *
 * @param originalWidth 元画像の幅
 * @param originalHeight 元画像の高さ
 * @param bounds 透過境界
 * @returns トリミング後のサイズ
 */
export function calculateTrimmedSize(
  originalWidth: number,
  originalHeight: number,
  bounds: TrimBounds
): { width: number; height: number } {
  return {
    width: originalWidth - bounds.left - bounds.right,
    height: originalHeight - bounds.top - bounds.bottom,
  };
}
