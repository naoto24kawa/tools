import { Card } from '@components/ui/card';
import type { GrayscaleMethod } from '@utils/grayscaleConverter';
import { convertToGrayscale } from '@utils/grayscaleConverter';
import { useEffect, useRef } from 'react';

interface GrayscalePreviewProps {
  src: string;
  method: GrayscaleMethod;
  naturalWidth: number;
  naturalHeight: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function GrayscalePreview({
  src,
  method,
  naturalWidth,
  naturalHeight,
  onCanvasReady,
}: GrayscalePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;

    if (!image || !canvas) return undefined;

    const processImage = () => {
      try {
        const grayscaleCanvas = convertToGrayscale(image, method);

        // プレビュー用のキャンバスにコピー
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = grayscaleCanvas.width;
        canvas.height = grayscaleCanvas.height;
        ctx.drawImage(grayscaleCanvas, 0, 0);

        // 親コンポーネントにキャンバスを渡す
        onCanvasReady?.(grayscaleCanvas);
      } catch (error) {
        console.error('グレースケール変換エラー:', error);
      }
    };

    if (image.complete) {
      processImage();
      return undefined;
    }

    image.addEventListener('load', processImage);
    return () => {
      image.removeEventListener('load', processImage);
    };
  }, [method, onCanvasReady]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">プレビュー</h3>

        <div className="flex items-center justify-center bg-muted p-4">
          <canvas
            ref={canvasRef}
            className="max-h-[600px] max-w-full border"
            style={{ imageRendering: 'auto' }}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          サイズ: {naturalWidth} × {naturalHeight} px
        </div>

        {/* 非表示の画像要素（グレースケール変換のソース） */}
        <img ref={imageRef} src={src} alt="" className="hidden" crossOrigin="anonymous" />
      </div>
    </Card>
  );
}
