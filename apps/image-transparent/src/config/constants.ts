import type { RgbColor } from '@types';

/** 最大ファイルサイズ (10MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** 対応するファイル形式 */
export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/** デフォルトの透過設定 */
export const DEFAULT_TARGET_COLOR: RgbColor = {
  r: 255,
  g: 255,
  b: 255,
};

/** デフォルトの許容範囲 */
export const DEFAULT_TOLERANCE = 30;

/** 許容範囲の最小値 */
export const MIN_TOLERANCE = 0;

/** 許容範囲の最大値 */
export const MAX_TOLERANCE = 255;

/** カラープリセット */
export const COLOR_PRESETS: { label: string; color: RgbColor }[] = [
  { label: '白', color: { r: 255, g: 255, b: 255 } },
  { label: '黒', color: { r: 0, g: 0, b: 0 } },
  { label: '赤', color: { r: 255, g: 0, b: 0 } },
  { label: '緑', color: { r: 0, g: 255, b: 0 } },
  { label: '青', color: { r: 0, g: 0, b: 255 } },
];
