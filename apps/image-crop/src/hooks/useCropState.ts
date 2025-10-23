import { useState, useCallback, useMemo } from 'react';
import type { ImageState, Crop, PixelCrop, ExportSettings, UserPreferences } from '@types';
import { CropPreferencesManager } from '@services/CropPreferencesManager';

/**
 * クロップ状態管理フック
 *
 * ## 責務
 * - 画像状態の管理
 * - クロップ領域の管理
 * - エクスポート設定の管理
 * - ユーザー設定の管理
 *
 * ## Single Responsibility Principle
 * このフックはクロップに関連する状態の管理のみに責任を持ちます。
 * UI表示やエクスポート処理などは呼び出し側が担当します。
 *
 * ## 使用例
 * ```typescript
 * const {
 *   image,
 *   crop,
 *   completedCrop,
 *   aspectRatio,
 *   exportSettings,
 *   handleImageLoad,
 *   handleCropChange,
 *   handleAspectRatioChange,
 *   // ...
 * } = useCropState();
 * ```
 */
export function useCropState() {
  // ========================================
  // 状態管理
  // ========================================

  const [image, setImage] = useState<ImageState>({ status: 'idle' });
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(() => ({
    format: 'png',
    quality: 0.95,
    filename: `cropped-${Date.now()}.png`,
  }));

  // ========================================
  // サービス
  // ========================================

  const preferencesManager = useMemo(() => new CropPreferencesManager(), []);

  // ========================================
  // イベントハンドラー
  // ========================================

  /**
   * 画像読み込み時の処理
   */
  const handleImageLoad = useCallback(
    (file: File, src: string, width: number, height: number) => {
      // 画像状態を更新
      setImage({
        status: 'loaded',
        file,
        src,
        naturalWidth: width,
        naturalHeight: height,
      });

      // ファイル名に基づいてエクスポート設定を更新
      setExportSettings((prev) => ({
        ...prev,
        filename: `cropped-${file.name.split('.')[0]}.${prev.format}`,
      }));

      // cropの初期化はImageCropperのonImageLoadに任せる
      // ここではcropをリセットしてImageCropperが初期化できるようにする
      setCrop({
        unit: '%',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    },
    []
  );

  /**
   * クロップ領域変更時の処理
   */
  const handleCropChange = useCallback((newCrop: Crop, pixelCrop: PixelCrop) => {
    setCrop(newCrop);
    setCompletedCrop(pixelCrop);
  }, []);

  /**
   * アスペクト比変更時の処理
   */
  const handleAspectRatioChange = useCallback((ratio: number | null) => {
    setAspectRatio(ratio || undefined);

    // ユーザー設定に保存
    setUserPreferences((prev) => ({
      ...prev,
      manualAspectRatio: ratio,
    }));
  }, []);

  /**
   * アスペクト比適用後のサイズをユーザー設定に保存
   */
  const handleAspectRatioApplied = useCallback((newCrop: Crop) => {
    setUserPreferences((prev) => ({
      ...prev,
      manualSize: {
        width: newCrop.width,
        height: newCrop.height,
        unit: newCrop.unit,
      },
    }));
  }, []);

  /**
   * 手動クロップ変更時の処理
   */
  const handleManualCropChange = useCallback((newCrop: Crop) => {
    // サイズと単位をユーザー設定に保存
    setUserPreferences((prev) => ({
      ...prev,
      manualSize: {
        width: newCrop.width,
        height: newCrop.height,
        unit: newCrop.unit,
      },
    }));
  }, []);

  /**
   * エクスポート設定変更時の処理
   */
  const handleExportSettingsChange = useCallback((settings: ExportSettings) => {
    setExportSettings(settings);
  }, []);

  /**
   * 画像リセット
   */
  const resetImage = useCallback(() => {
    setImage({ status: 'idle' });
  }, []);

  // ========================================
  // 戻り値
  // ========================================

  return {
    // 状態
    image,
    crop,
    completedCrop,
    aspectRatio,
    exportSettings,
    userPreferences,

    // ハンドラー
    handleImageLoad,
    handleCropChange,
    handleAspectRatioChange,
    handleAspectRatioApplied,
    handleManualCropChange,
    handleExportSettingsChange,
    resetImage,

    // 内部サービス（テスト用に公開）
    preferencesManager,
  };
}

/**
 * フックの戻り値型
 */
export type UseCropStateReturn = ReturnType<typeof useCropState>;
