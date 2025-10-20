/**
 * Canvas描画に関する定数定義
 */
export const CANVAS_CONSTANTS = {
  /** パターン描画のグリッド・チェッカーボードのサイズ (px) */
  PATTERN_SIZE: 50,

  /** パターンの透明度 */
  PATTERN_ALPHA: 0.1,

  /** チェッカーボードの濃い部分の透明度 */
  CHECKERBOARD_ALPHA: 0.05,

  /** テキスト行間の係数 (fontSize * LINE_HEIGHT_RATIO) */
  LINE_HEIGHT_RATIO: 1.2,

  /** テキストの左右マージン (px) */
  TEXT_HORIZONTAL_MARGIN: 20,

  /** Blob URL解放までの遅延時間 (ms) */
  URL_REVOKE_DELAY: 100,

  /** プレビュー表示の最大幅 (px) */
  PREVIEW_MAX_WIDTH: 400,

  /** プレビュー表示の最大高さ (px) */
  PREVIEW_MAX_HEIGHT: 300,
} as const;
