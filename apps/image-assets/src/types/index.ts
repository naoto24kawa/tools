/**
 * リサイズ方法
 */
export type ResizeMethod = 'percent' | 'pixel' | 'filesize';

/**
 * 画像アイテム
 */
export interface ImageItem {
  id: string;
  file: File;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

/**
 * リサイズ設定
 */
export interface ResizeSettings {
  method: ResizeMethod;
  percent: number; // パーセント指定 (1-1000)
  width: number; // ピクセル幅
  height: number; // ピクセル高さ
  targetFileSize: number; // 目標ファイルサイズ (bytes)
  maintainAspectRatio: boolean;
}

/**
 * エクスポート設定
 */
export interface ExportSettings {
  format: 'png' | 'jpeg' | 'webp';
  quality: number; // 0.0 - 1.0
  filenamePattern: string; // {name}, {width}, {height} のプレースホルダーに対応
}

/**
 * リサイズ結果
 */
export interface ResizeResult {
  blob: Blob;
  width: number;
  height: number;
  fileSize: number;
}

/**
 * 画像の状態
 */
export type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'processing';

/**
 * Result型パターン: 成功または失敗を表現
 */
export type Result<T, E = Error> = { success: true; value: T } | { success: false; error: E };

/**
 * Result型のヘルパー関数
 */
// eslint-disable-next-line no-redeclare
export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ success: true, value }),
  err: <E>(error: E): Result<never, E> => ({ success: false, error }),

  isOk: <T, E>(result: Result<T, E>): result is { success: true; value: T } => result.success,
  isErr: <T, E>(result: Result<T, E>): result is { success: false; error: E } => !result.success,

  map: <T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> =>
    result.success ? Result.ok(fn(result.value)) : result,

  mapErr: <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
    result.success ? result : Result.err(fn(result.error)),
};
