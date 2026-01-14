import type { PixelCrop } from '@types';

/**
 * 画像クロップ処理専用
 */

/**
 * 画像をクロップしてBlobとして返す
 *
 * @param image クロップ対象の画像要素
 * @param crop クロップ領域（ピクセル単位）
 * @param format 出力画像フォーマット
 * @param quality JPEG/WebP品質（0.0-1.0）
 * @returns クロップされた画像のBlob
 *
 * @example
 * ```typescript
 * const blob = await getCroppedImg(imgElement, crop, 'jpeg', 0.95);
 * if (blob) {
 *   // Blobを使用
 * }
 * ```
 */
export function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality: number = 0.95
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(null);
      return;
    }

    // すべての値を整数に丸める（スケーリングを防ぐため）
    const roundedCrop = {
      x: Math.round(crop.x),
      y: Math.round(crop.y),
      width: Math.round(crop.width),
      height: Math.round(crop.height),
    };

    canvas.width = roundedCrop.width;
    canvas.height = roundedCrop.height;

    ctx.drawImage(
      image,
      roundedCrop.x,
      roundedCrop.y,
      roundedCrop.width,
      roundedCrop.height,
      0,
      0,
      roundedCrop.width,
      roundedCrop.height
    );

    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      `image/${format}`,
      quality
    );
  });
}
