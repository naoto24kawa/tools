/**
 * ファイルサイズから推定サイズを計算
 */
export function estimateSizeFromFileSize(
  targetFileSize: number,
  originalWidth: number,
  originalHeight: number,
  format: 'png' | 'jpeg' | 'webp'
): { width: number; height: number } {
  const bytesPerPixel = format === 'png' ? 4 : 3;
  const estimatedPixels = targetFileSize / bytesPerPixel;
  const scale = Math.sqrt(estimatedPixels / (originalWidth * originalHeight));

  return {
    width: Math.round(originalWidth * Math.min(scale, 1)),
    height: Math.round(originalHeight * Math.min(scale, 1)),
  };
}

/**
 * KB単位の値をバイト単位に変換
 */
export function kbToBytes(kb: number): number {
  return kb * 1024;
}

/**
 * MB単位の値をバイト単位に変換
 */
export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}

/**
 * バイト単位の値をKB単位に変換
 */
export function bytesToKb(bytes: number): number {
  return bytes / 1024;
}

/**
 * バイト単位の値をMB単位に変換
 */
export function bytesToMb(bytes: number): number {
  return bytes / (1024 * 1024);
}
