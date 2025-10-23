import { useState, useCallback } from 'react';
import type { ImageItem, ResizeSettings, ExportSettings, ResizeResult, ImageStatus } from '@types';
import { resizeImage, resizeByFileSize } from '@utils/imageResize';

/**
 * 画像リサイズ処理専用フック
 * 責任: リサイズ処理の実行とエラーハンドリング
 */
export function useImageResizer() {
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const [status, setStatus] = useState<ImageStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleResize = useCallback(
    async (
      image: ImageItem,
      resizeSettings: ResizeSettings,
      exportSettings: ExportSettings
    ): Promise<void> => {
      setStatus('processing');
      setError(null);

      try {
        let result: ResizeResult;

        if (resizeSettings.method === 'filesize') {
          result = await resizeByFileSize(
            image.src,
            resizeSettings.targetFileSize,
            image.naturalWidth,
            image.naturalHeight,
            exportSettings.format,
            exportSettings.quality
          );
        } else {
          result = await resizeImage(
            image.src,
            resizeSettings,
            image.naturalWidth,
            image.naturalHeight,
            exportSettings.format,
            exportSettings.quality
          );
        }

        setResizeResult(result);
        setStatus('loaded');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'リサイズ処理中に予期しないエラーが発生しました。';
        setError(errorMessage);
        setStatus('error');
        console.error('Resize error:', err);
      }
    },
    []
  );

  const resetResult = useCallback(() => {
    setResizeResult(null);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    resizeResult,
    status,
    error,
    handleResize,
    resetResult,
  };
}
