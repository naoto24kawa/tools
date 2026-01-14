import type { GrayscaleMethod } from '@utils/grayscaleConverter';

/**
 * グレースケール変換方式の選択肢
 */
export const GRAYSCALE_METHODS: readonly {
  label: string;
  value: GrayscaleMethod;
  description: string;
}[] = [
  {
    label: '輝度法（推奨）',
    value: 'luminosity',
    description: '人間の目の感度を考慮した最も自然な変換',
  },
  {
    label: '平均法',
    value: 'average',
    description: 'RGB値の平均を使用',
  },
  {
    label: '脱色法',
    value: 'desaturation',
    description: '最大値と最小値の平均を使用',
  },
  {
    label: '最大値',
    value: 'max',
    description: 'RGB値の最大値を使用（明るめ）',
  },
  {
    label: '最小値',
    value: 'min',
    description: 'RGB値の最小値を使用（暗め）',
  },
  {
    label: '赤チャンネル',
    value: 'red',
    description: '赤チャンネルのみ使用',
  },
  {
    label: '緑チャンネル',
    value: 'green',
    description: '緑チャンネルのみ使用',
  },
  {
    label: '青チャンネル',
    value: 'blue',
    description: '青チャンネルのみ使用',
  },
] as const;

/**
 * エクスポートフォーマット
 */
export const EXPORT_FORMATS = [
  { label: 'PNG', value: 'image/png' },
  { label: 'JPEG', value: 'image/jpeg' },
  { label: 'WebP', value: 'image/webp' },
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
 * デフォルトエクスポート設定
 */
export const DEFAULT_EXPORT_SETTINGS = {
  format: 'image/png' as const,
  quality: 92,
  filename: 'grayscale-image',
} as const;
