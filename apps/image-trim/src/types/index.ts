/**
 * 画像情報
 */
export interface ImageInfo {
  file: File;
  src: string;
  naturalWidth: number;
  naturalHeight: number;
}

/**
 * 画像の状態 (Discriminated Union)
 */
export type ImageState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; image: ImageInfo }
  | { status: 'processing'; image: ImageInfo }
  | { status: 'error'; error: string };

/**
 * トリミング境界 (Bounding Box)
 */
export interface TrimBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * トリミング結果
 */
export interface TrimResult {
  /** トリミング後の幅 */
  width: number;
  /** トリミング後の高さ */
  height: number;
  /** 元画像からのオフセット X */
  offsetX: number;
  /** 元画像からのオフセット Y */
  offsetY: number;
  /** トリミングされた画像のData URL */
  dataUrl: string;
  /** トリミングされた画像のBlob */
  blob: Blob;
  /** 除去された余白の情報 */
  removedMargins: TrimBounds;
}

/**
 * トリミング設定
 */
export interface TrimSettings {
  /** アルファ閾値 (0-255): この値以下のアルファ値を透明とみなす */
  alphaThreshold: number;
  /** マージン追加 (px): トリミング後に追加する余白 */
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  /** 均等マージン: すべての辺に同じマージンを適用 */
  uniformMargin: boolean;
}

/**
 * エクスポート設定
 */
export interface ExportSettings {
  format: 'png' | 'webp';
  filename: string;
}

/**
 * プレビュー情報
 */
export interface PreviewInfo {
  originalSize: { width: number; height: number };
  trimmedSize: { width: number; height: number };
  removedPixels: TrimBounds;
  reductionPercent: number;
}
