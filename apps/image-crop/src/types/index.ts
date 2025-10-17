import type { Crop, PixelCrop } from 'react-image-crop';

export interface ImageState {
  file: File | null;
  src: string | null;
  naturalWidth: number;
  naturalHeight: number;
}

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

export type { Crop, PixelCrop };
