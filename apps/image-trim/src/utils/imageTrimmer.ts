import type { TrimResult, TrimSettings } from '@types';
import { detectTransparentBounds, getImageData } from './transparencyDetector';

/**
 * 画像をトリミングしてBlobを生成
 *
 * @param image トリミング対象の画像
 * @param settings トリミング設定
 * @returns トリミング結果 (完全透過の場合はnull)
 */
export async function trimImage(
  image: HTMLImageElement,
  settings: TrimSettings
): Promise<TrimResult | null> {
  const { naturalWidth, naturalHeight } = image;

  // ImageDataを取得
  const imageData = getImageData(image);

  // 透過境界を検出
  const bounds = detectTransparentBounds(imageData, settings.alphaThreshold);

  if (!bounds) {
    // 完全透過な画像
    return null;
  }

  // マージンを適用
  const margin = settings.uniformMargin
    ? {
        top: settings.marginTop,
        right: settings.marginTop,
        bottom: settings.marginTop,
        left: settings.marginTop,
      }
    : {
        top: settings.marginTop,
        right: settings.marginRight,
        bottom: settings.marginBottom,
        left: settings.marginLeft,
      };

  // トリミング領域を計算
  const cropX = bounds.left;
  const cropY = bounds.top;
  const cropWidth = naturalWidth - bounds.left - bounds.right;
  const cropHeight = naturalHeight - bounds.top - bounds.bottom;

  // 出力サイズ (マージン込み)
  const outputWidth = cropWidth + margin.left + margin.right;
  const outputHeight = cropHeight + margin.top + margin.bottom;

  // Canvasでトリミング実行
  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available');
  }

  // 透過背景を維持
  ctx.clearRect(0, 0, outputWidth, outputHeight);

  // トリミングした画像を描画 (マージン分オフセット)
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight, // ソース領域
    margin.left,
    margin.top,
    cropWidth,
    cropHeight // 出力位置
  );

  // Blobを生成
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });

  return {
    width: outputWidth,
    height: outputHeight,
    offsetX: cropX,
    offsetY: cropY,
    dataUrl: canvas.toDataURL('image/png'),
    blob,
    removedMargins: bounds,
  };
}

/**
 * Blobをダウンロード
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
