import type { ValidationError } from './imageValidator';
import { validateImageDimensions } from './imageValidator';

/**
 * 画像読み込み結果の型
 */
export interface ImageLoadResult {
  src: string;
  width: number;
  height: number;
}

/**
 * 画像読み込みエラーの型
 */
export interface ImageLoadError {
  type: 'file-read' | 'image-load' | 'validation';
  message: string;
  validationError?: ValidationError;
}

/**
 * FileオブジェクトからData URLを読み込む
 * @param file 読み込むファイル
 * @returns Data URLのPromise
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;

      if (typeof result !== 'string') {
        reject(new Error('ファイルの読み込みに失敗しました'));
        return;
      }

      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Data URLから画像を読み込み、サイズを取得する
 * @param src Data URL
 * @returns 画像サイズのPromise
 */
function loadImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('画像の読み込みに失敗しました'));
    };

    img.src = src;
  });
}

/**
 * ファイルから画像を読み込み、バリデーションを行う
 * @param file 読み込むファイル
 * @returns 画像読み込み結果のPromise
 */
export async function loadImage(file: File): Promise<ImageLoadResult> {
  try {
    // ファイルをData URLとして読み込む
    const src = await readFileAsDataURL(file);

    // 画像のサイズを取得
    const { width, height } = await loadImageDimensions(src);

    // 画像サイズのバリデーション
    const dimensionError = validateImageDimensions(width, height);
    if (dimensionError) {
      const error: ImageLoadError = {
        type: 'validation',
        message: dimensionError.message,
        validationError: dimensionError,
      };
      throw error;
    }

    return { src, width, height };
  } catch (error) {
    // エラーが既にImageLoadError形式の場合はそのまま投げる
    if (error && typeof error === 'object' && 'type' in error) {
      throw error;
    }

    // その他のエラーは変換
    const loadError: ImageLoadError = {
      type:
        error instanceof Error && error.message.includes('ファイル') ? 'file-read' : 'image-load',
      message: error instanceof Error ? error.message : '画像の読み込みに失敗しました',
    };
    throw loadError;
  }
}
