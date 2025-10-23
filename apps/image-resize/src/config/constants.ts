import type { ExportSettings, ResizeSettings } from '@types';

/**
 * 最大ファイルサイズ (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * サポートする画像フォーマット
 */
export const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/**
 * リサイズ方法のオプション
 */
export const RESIZE_METHODS = [
  {
    value: 'percent' as const,
    label: 'パーセント指定',
    description: '元画像のサイズに対する割合で指定',
  },
  { value: 'pixel' as const, label: 'ピクセル指定', description: '幅と高さを直接指定' },
  {
    value: 'filesize' as const,
    label: 'ファイルサイズ指定',
    description: '目標ファイルサイズを指定',
  },
] as const;

/**
 * デフォルトのリサイズ設定
 */
export const DEFAULT_RESIZE_SETTINGS: ResizeSettings = {
  method: 'percent',
  percent: 50,
  width: 800,
  height: 600,
  targetFileSize: 100 * 1024, // 100KB
  maintainAspectRatio: true,
};

/**
 * デフォルトのエクスポート設定
 */
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  quality: 0.92,
  filenamePattern: '{name}_resized',
};

/**
 * パーセント指定の範囲
 */
export const PERCENT_RANGE = {
  min: 1,
  max: 1000,
  step: 1,
} as const;

/**
 * ピクセル指定の範囲
 */
export const PIXEL_RANGE = {
  min: 1,
  max: 10000,
  step: 1,
} as const;

/**
 * ファイルサイズプリセット (KB単位)
 */
export const FILE_SIZE_PRESETS = [
  { label: '50KB', value: 50 * 1024 },
  { label: '100KB', value: 100 * 1024 },
  { label: '200KB', value: 200 * 1024 },
  { label: '500KB', value: 500 * 1024 },
  { label: '1MB', value: 1024 * 1024 },
  { label: '2MB', value: 2 * 1024 * 1024 },
] as const;

/**
 * 画質のプリセット
 */
export const QUALITY_PRESETS = [
  { label: '低品質', value: 0.5 },
  { label: '標準', value: 0.75 },
  { label: '高品質', value: 0.92 },
  { label: '最高品質', value: 1.0 },
] as const;
