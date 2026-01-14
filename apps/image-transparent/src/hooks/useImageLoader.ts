import type { ImageState } from '@types';
import { useCallback, useState } from 'react';

const initialImageState: ImageState = {
  status: 'idle',
  src: '',
  naturalWidth: 0,
  naturalHeight: 0,
};

export function useImageLoader() {
  const [image, setImage] = useState<ImageState>(initialImageState);

  const loadImage = useCallback((file: File) => {
    setImage({ ...initialImageState, status: 'loading' });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          status: 'loaded',
          src: e.target?.result as string,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };
      img.onerror = () => {
        setImage({
          ...initialImageState,
          status: 'error',
          error: '画像の読み込みに失敗しました',
        });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setImage({
        ...initialImageState,
        status: 'error',
        error: 'ファイルの読み込みに失敗しました',
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const resetImage = useCallback(() => {
    setImage(initialImageState);
  }, []);

  return {
    image,
    loadImage,
    resetImage,
  };
}
