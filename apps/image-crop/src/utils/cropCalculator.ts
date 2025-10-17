import type { Crop, PixelCrop } from '../types';

export function percentToPixels(percent: number, dimension: number): number {
  return (percent / 100) * dimension;
}

export function pixelsToPercent(pixels: number, dimension: number): number {
  return (pixels / dimension) * 100;
}

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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}
