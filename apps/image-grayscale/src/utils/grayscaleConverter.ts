/**
 * グレースケール変換方式の種類
 */
export type GrayscaleMethod =
  | 'average'
  | 'luminosity'
  | 'desaturation'
  | 'max'
  | 'min'
  | 'red'
  | 'green'
  | 'blue';

/**
 * 画像をグレースケールに変換する
 */
export function convertToGrayscale(
  imageElement: HTMLImageElement,
  method: GrayscaleMethod = 'luminosity'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context could not be created');
  }

  // 画像を描画
  ctx.drawImage(imageElement, 0, 0);

  // 画像データを取得
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // ピクセルごとにグレースケール変換
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;

    const gray = calculateGray(r, g, b, method);

    data[i] = gray; // R
    data[i + 1] = gray; // G
    data[i + 2] = gray; // B
    // data[i + 3] はアルファチャンネル（透明度）なので変更しない
  }

  // 変換したデータをキャンバスに戻す
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}

/**
 * RGB値からグレースケール値を計算
 */
function calculateGray(r: number, g: number, b: number, method: GrayscaleMethod): number {
  switch (method) {
    case 'average':
      // 平均法: (R + G + B) / 3
      return Math.round((r + g + b) / 3);

    case 'luminosity':
      // 輝度法（人間の目の感度を考慮）
      // ITU-R BT.601 標準
      return Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    case 'desaturation':
      // 脱色法: (max(R,G,B) + min(R,G,B)) / 2
      return Math.round((Math.max(r, g, b) + Math.min(r, g, b)) / 2);

    case 'max':
      // 最大値法
      return Math.max(r, g, b);

    case 'min':
      // 最小値法
      return Math.min(r, g, b);

    case 'red':
      // 赤チャンネルのみ
      return r;

    case 'green':
      // 緑チャンネルのみ
      return g;

    case 'blue':
      // 青チャンネルのみ
      return b;

    default:
      return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
}

/**
 * キャンバスからBlobを生成
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' | 'image/webp',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      format,
      quality
    );
  });
}
