import type { AspectRatioOption } from '../types';

/**
 * アスペクト比のプリセット
 */
export const ASPECT_RATIOS: readonly AspectRatioOption[] = [
  { label: '自由', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
] as const;

/**
 * 画像アップロードの設定
 */
export const IMAGE_UPLOAD_CONFIG = {
  /** サポートする画像形式 */
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  /** 最大ファイルサイズ（10MB） - ブラウザメモリ制約を考慮 */
  maxFileSize: 10 * 1024 * 1024,
  /** 最大画像サイズ（8000px） - Canvas API の一般的な制限値 */
  maxDimension: 8000,
} as const;

/**
 * バイト単位の定数
 */
export const BYTES_PER_KB = 1024;
export const BYTES_PER_MB = 1024 * 1024;
