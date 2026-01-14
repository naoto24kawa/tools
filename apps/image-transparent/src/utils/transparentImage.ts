import type { RgbColor } from '@types';

/**
 * 2つの色の距離（差分）を計算する
 * RGB各成分の差の絶対値の最大値を返す
 */
export function colorDistance(color1: RgbColor, color2: RgbColor): number {
  return Math.max(
    Math.abs(color1.r - color2.r),
    Math.abs(color1.g - color2.g),
    Math.abs(color1.b - color2.b)
  );
}

/**
 * 指定した色を透過に変換したImageDataを返す
 */
export function makeColorTransparent(
  imageData: ImageData,
  targetColor: RgbColor,
  tolerance: number
): ImageData {
  const data = new Uint8ClampedArray(imageData.data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;

    const pixelColor: RgbColor = { r, g, b };
    const distance = colorDistance(pixelColor, targetColor);

    if (distance <= tolerance) {
      // 透過にする（アルファを0に）
      data[i + 3] = 0;
    }
  }

  return new ImageData(data, imageData.width, imageData.height);
}

/**
 * 画像をCanvasに描画してImageDataを取得する
 */
export function getImageDataFromSrc(
  src: string,
  width: number,
  height: number
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      resolve(imageData);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = src;
  });
}

/**
 * ImageDataをPNG形式のData URLに変換する
 */
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Data URLをダウンロードする
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 16進数カラーコードをRgbColorに変換する
 */
export function hexToRgb(hex: string): RgbColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result?.[1] || !result[2] || !result[3]) {
    return null;
  }
  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
}

/**
 * RgbColorを16進数カラーコードに変換する
 */
export function rgbToHex(color: RgbColor): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * キャンバスの座標からピクセルの色を取得する
 */
export function getColorAtPoint(canvas: HTMLCanvasElement, x: number, y: number): RgbColor | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  if (pixel[0] === undefined || pixel[1] === undefined || pixel[2] === undefined) {
    return null;
  }
  return {
    r: pixel[0],
    g: pixel[1],
    b: pixel[2],
  };
}
