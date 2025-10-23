import { useState, useCallback } from 'react';
import type { ImageItem, ImageStatus } from '@types';

/**
 * 画像読み込み専用フック
 * 責任: ファイルからImageItemへの変換とエラーハンドリング
 */
export function useImageLoader() {
  const [image, setImage] = useState<ImageItem | null>(null);
  const [status, setStatus] = useState<ImageStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleImageLoad = useCallback((file: File) => {
    setStatus('loading');
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const imageItem: ImageItem = {
          id: Math.random().toString(36).substring(7),
          file,
          src: e.target?.result as string,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        };
        setImage(imageItem);
        setStatus('loaded');
      };
      img.onerror = () => {
        setError('画像の読み込みに失敗しました。ファイル形式を確認してください。');
        setStatus('error');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました。ファイルが破損していないか確認してください。');
      setStatus('error');
    };
    reader.readAsDataURL(file);
  }, []);

  const resetImage = useCallback(() => {
    setImage(null);
    setStatus('idle');
    setError(null);
  }, []);

  return {
    image,
    status,
    error,
    handleImageLoad,
    resetImage,
  };
}
