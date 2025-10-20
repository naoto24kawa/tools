import { IMAGE_UPLOAD_CONFIG } from '@config/constants';

const { allowedTypes, maxFileSize, maxDimension } = IMAGE_UPLOAD_CONFIG;

/**
 * 画像バリデーションエラーの型
 */
export interface ValidationError {
  type: 'file-type' | 'file-size' | 'image-dimension';
  message: string;
}

/**
 * ファイルタイプの検証
 * @param file 検証するファイル
 * @returns エラーメッセージ、問題なければnull
 */
export function validateFileType(file: File): ValidationError | null {
  if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
    return {
      type: 'file-type',
      message: 'サポートされていないファイル形式です。JPEG、PNG、WebP、GIFのみ対応しています。',
    };
  }
  return null;
}

/**
 * ファイルサイズの検証
 * @param file 検証するファイル
 * @returns エラーメッセージ、問題なければnull
 */
export function validateFileSize(file: File): ValidationError | null {
  if (file.size > maxFileSize) {
    return {
      type: 'file-size',
      message: `ファイルサイズは${maxFileSize / (1024 * 1024)}MB以下にしてください。`,
    };
  }
  return null;
}

/**
 * 画像サイズ（寸法）の検証
 * @param width 画像の幅（px）
 * @param height 画像の高さ（px）
 * @returns エラーメッセージ、問題なければnull
 */
export function validateImageDimensions(width: number, height: number): ValidationError | null {
  if (width > maxDimension || height > maxDimension) {
    return {
      type: 'image-dimension',
      message: `画像サイズは${maxDimension}x${maxDimension}px以下にしてください。`,
    };
  }
  return null;
}

/**
 * ファイルの包括的な検証
 * @param file 検証するファイル
 * @returns エラーメッセージ、問題なければnull
 */
export function validateFile(file: File): ValidationError | null {
  // ファイルタイプの検証
  const typeError = validateFileType(file);
  if (typeError) return typeError;

  // ファイルサイズの検証
  const sizeError = validateFileSize(file);
  if (sizeError) return sizeError;

  return null;
}
