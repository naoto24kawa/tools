/** RGB色情報 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/** 画像の状態 */
export interface ImageState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  error?: string;
}

/** 透過設定 */
export interface TransparentSettings {
  /** 透過にする色 (RGB) */
  targetColor: RgbColor;
  /** 許容範囲 (0-255) */
  tolerance: number;
}

/** 透過処理の状態 */
export interface TransparentState {
  /** 元画像 */
  originalImage: ImageState;
  /** 透過設定 */
  settings: TransparentSettings;
  /** スポイトモードかどうか */
  isEyedropperMode: boolean;
  /** 処理中かどうか */
  isProcessing: boolean;
}
