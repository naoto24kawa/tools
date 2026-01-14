import { DEFAULT_EXPORT_SETTINGS, DEFAULT_TRIM_SETTINGS } from '@config/constants';
import type { ExportSettings, ImageInfo, ImageState, TrimResult, TrimSettings } from '@types';
import { trimImage } from '@utils/imageTrimmer';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useTrimState() {
  // 画像状態
  const [imageState, setImageState] = useState<ImageState>({ status: 'idle' });

  // トリミング設定
  const [trimSettings, setTrimSettings] = useState<TrimSettings>(DEFAULT_TRIM_SETTINGS);

  // トリミング結果
  const [trimResult, setTrimResult] = useState<TrimResult | null>(null);

  // エクスポート設定
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);

  // 画像参照を保持
  const imageRef = useRef<ImageInfo | null>(null);

  // 画像読み込み
  const handleImageLoad = useCallback((file: File, src: string, width: number, height: number) => {
    const imageInfo: ImageInfo = {
      file,
      src,
      naturalWidth: width,
      naturalHeight: height,
    };
    imageRef.current = imageInfo;
    setImageState({
      status: 'loaded',
      image: imageInfo,
    });

    // ファイル名を設定
    const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
    setExportSettings((prev) => ({
      ...prev,
      filename: `${nameWithoutExt}-trimmed.png`,
    }));
  }, []);

  // 設定変更時に自動トリミング
  useEffect(() => {
    const currentImage = imageRef.current;
    if (!currentImage) return;

    const runTrim = async () => {
      try {
        const img = new Image();
        img.src = currentImage.src;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
        });

        const result = await trimImage(img, trimSettings);
        setTrimResult(result);
      } catch (error) {
        setTrimResult(null);
      }
    };

    runTrim();
  }, [trimSettings, imageState.status]);

  // 画像リセット
  const resetImage = useCallback(() => {
    imageRef.current = null;
    setImageState({ status: 'idle' });
    setTrimResult(null);
    setTrimSettings(DEFAULT_TRIM_SETTINGS);
    setExportSettings(DEFAULT_EXPORT_SETTINGS);
  }, []);

  // トリミング設定の部分更新
  const updateTrimSettings = useCallback((updates: Partial<TrimSettings>) => {
    setTrimSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // エクスポート設定の部分更新
  const updateExportSettings = useCallback((updates: Partial<ExportSettings>) => {
    setExportSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    imageState,
    trimSettings,
    trimResult,
    exportSettings,
    handleImageLoad,
    updateTrimSettings,
    updateExportSettings,
    resetImage,
  };
}
