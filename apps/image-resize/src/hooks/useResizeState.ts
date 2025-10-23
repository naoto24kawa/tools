import { useCallback } from 'react';
import { useImageLoader } from './useImageLoader';
import { useResizeSettings } from './useResizeSettings';
import { useImageResizer } from './useImageResizer';

/**
 * 画像リサイズ機能の統合フック
 *
 * このフックは3つの専門フックを組み合わせて使いやすいインターフェースを提供します:
 * - useImageLoader: 画像の読み込みとエラーハンドリング
 * - useResizeSettings: リサイズ・エクスポート設定の管理
 * - useImageResizer: リサイズ処理の実行
 */
export function useResizeState() {
  const imageLoader = useImageLoader();
  const settings = useResizeSettings();
  const resizer = useImageResizer();

  // 統合されたリサイズ実行関数
  const handleResize = useCallback(async () => {
    if (!imageLoader.image) {
      return;
    }

    await resizer.handleResize(imageLoader.image, settings.resizeSettings, settings.exportSettings);
  }, [imageLoader.image, settings.resizeSettings, settings.exportSettings, resizer]);

  // 統合されたリセット関数
  const resetImage = useCallback(() => {
    imageLoader.resetImage();
    resizer.resetResult();
  }, [imageLoader, resizer]);

  // 統合されたステータスとエラー
  const status =
    imageLoader.status === 'loading' || imageLoader.status === 'error'
      ? imageLoader.status
      : resizer.status;

  const error = imageLoader.error || resizer.error;

  return {
    // 画像関連
    image: imageLoader.image,
    handleImageLoad: imageLoader.handleImageLoad,
    resetImage,

    // 設定関連
    resizeSettings: settings.resizeSettings,
    exportSettings: settings.exportSettings,
    setResizeSettings: settings.setResizeSettings,
    setExportSettings: settings.setExportSettings,

    // リサイズ関連
    resizeResult: resizer.resizeResult,
    handleResize,

    // ステータスとエラー
    status,
    error,
  };
}
