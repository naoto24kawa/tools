import type { ExportSettings, TrimSettings } from '@types';

/**
 * デフォルトトリミング設定
 */
export const DEFAULT_TRIM_SETTINGS: TrimSettings = {
  alphaThreshold: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  uniformMargin: true,
};

/**
 * デフォルトエクスポート設定
 */
export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  format: 'png',
  filename: 'trimmed.png',
};

/**
 * アルファ閾値のプリセット
 */
export const ALPHA_THRESHOLD_PRESETS = [
  { label: '完全透過のみ', value: 0 },
  { label: 'ほぼ透過 (10)', value: 10 },
  { label: '半透過 (128)', value: 128 },
] as const;

/**
 * 画像アップロード設定
 */
export const IMAGE_UPLOAD_CONFIG = {
  allowedTypes: ['image/png', 'image/webp'] as readonly string[],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxDimension: 8000,
};

/**
 * ファイルサイズをフォーマット
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
