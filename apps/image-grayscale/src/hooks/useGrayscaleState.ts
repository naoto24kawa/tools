import { DEFAULT_EXPORT_SETTINGS } from '@config/constants';
import type { GrayscaleMethod } from '@utils/grayscaleConverter';
import { useCallback, useState } from 'react';

/**
 * 画像状態の型定義
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

/**
 * エクスポート設定の型定義
 */
export interface ExportSettings {
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
  filename: string;
}

/**
 * グレースケール状態管理フック
 *
 * ## 責務
 * - 画像状態の管理
 * - グレースケール変換方式の管理
 * - エクスポート設定の管理
 *
 * ## Single Responsibility Principle
 * このフックはグレースケール変換に関連する状態の管理のみに責任を持ちます。
 * UI表示やエクスポート処理などは呼び出し側が担当します。
 */
export function useGrayscaleState() {
  // ========================================
  // 状態管理
  // ========================================

  const [image, setImage] = useState<ImageState>({ status: 'idle' });
  const [method, setMethod] = useState<GrayscaleMethod>('luminosity');
  const [exportSettings, setExportSettings] = useState<ExportSettings>(() => ({
    format: DEFAULT_EXPORT_SETTINGS.format,
    quality: DEFAULT_EXPORT_SETTINGS.quality,
    filename: DEFAULT_EXPORT_SETTINGS.filename,
  }));

  // ========================================
  // イベントハンドラー
  // ========================================

  /**
   * 画像読み込み時の処理
   */
  const handleImageLoad = useCallback((file: File, src: string, width: number, height: number) => {
    setImage({
      status: 'loaded',
      file,
      src,
      naturalWidth: width,
      naturalHeight: height,
    });

    // ファイル名に基づいてエクスポート設定を更新
    const nameWithoutExt = file.name.split('.')[0];
    setExportSettings((prev) => ({
      ...prev,
      filename: `grayscale-${nameWithoutExt}`,
    }));
  }, []);

  /**
   * グレースケール変換方式変更時の処理
   */
  const handleMethodChange = useCallback((newMethod: GrayscaleMethod) => {
    setMethod(newMethod);
  }, []);

  /**
   * エクスポート設定変更時の処理
   */
  const handleExportSettingsChange = useCallback((settings: Partial<ExportSettings>) => {
    setExportSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  /**
   * 画像リセット
   */
  const resetImage = useCallback(() => {
    setImage({ status: 'idle' });
    setMethod('luminosity');
  }, []);

  // ========================================
  // 戻り値
  // ========================================

  return {
    // 状態
    image,
    method,
    exportSettings,

    // ハンドラー
    handleImageLoad,
    handleMethodChange,
    handleExportSettingsChange,
    resetImage,
  };
}

/**
 * フックの戻り値型
 */
export type UseGrayscaleStateReturn = ReturnType<typeof useGrayscaleState>;
