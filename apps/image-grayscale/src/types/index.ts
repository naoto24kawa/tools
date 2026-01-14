import type { Crop, PixelCrop } from 'react-image-crop';

/**
 * 画像の読み込み状態を表す型（Discriminated Union）
 */
export type ImageState =
  | { status: 'idle' }
  | {
      status: 'loaded';
      file: File;
      src: string;
      naturalWidth: number;
      naturalHeight: number;
    };

export interface AspectRatioOption {
  label: string;
  value: number | null;
}

export interface ExportSettings {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  filename: string;
}

export interface PreviewInfo {
  originalSize: { width: number; height: number };
  croppedSize: { width: number; height: number };
  fileSize: string;
  aspectRatio: string;
}

/**
 * ユーザーが手動で設定した設定を保持する型
 */
export interface UserPreferences {
  manualSize?: {
    width: number;
    height: number;
    unit: 'px' | '%';
  };
  manualAspectRatio?: number | null; // nullは「自由」
}

export type { Crop, PixelCrop };
