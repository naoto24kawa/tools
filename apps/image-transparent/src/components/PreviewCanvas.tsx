import type { RgbColor, TransparentSettings } from '@types';
import {
  getColorAtPoint,
  getImageDataFromSrc,
  makeColorTransparent,
} from '@utils/transparentImage';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PreviewCanvasProps {
  imageSrc: string;
  width: number;
  height: number;
  settings: TransparentSettings;
  isEyedropperMode: boolean;
  onColorPick: (color: RgbColor) => void;
  onProcessedImageChange: (dataUrl: string | null) => void;
}

export function PreviewCanvas({
  imageSrc,
  width,
  height,
  settings,
  isEyedropperMode,
  onColorPick,
  onProcessedImageChange,
}: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 元画像を描画（スポイト用）
  useEffect(() => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = imageSrc;
  }, [imageSrc, width, height]);

  // 透過処理を適用
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);

    getImageDataFromSrc(imageSrc, width, height)
      .then((imageData) => {
        const processedData = makeColorTransparent(
          imageData,
          settings.targetColor,
          settings.tolerance
        );
        ctx.clearRect(0, 0, width, height);
        ctx.putImageData(processedData, 0, 0);

        // 処理済み画像のDataURLを親に通知
        const dataUrl = canvas.toDataURL('image/png');
        onProcessedImageChange(dataUrl);
      })
      .catch((error) => {
        console.error('Image processing failed:', error);
        onProcessedImageChange(null);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [imageSrc, width, height, settings, onProcessedImageChange]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isEyedropperMode) return;

      const displayCanvas = canvasRef.current;
      const originalCanvas = originalCanvasRef.current;
      if (!displayCanvas || !originalCanvas) return;

      // 表示キャンバスのクリック位置から元画像の座標を計算
      const rect = displayCanvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);

      // 元画像のキャンバスから色を取得
      const color = getColorAtPoint(originalCanvas, x, y);
      if (color) {
        onColorPick(color);
      }
    },
    [isEyedropperMode, onColorPick, width, height]
  );

  // スケールを計算（最大表示サイズに収める）
  const maxDisplayWidth = 600;
  const maxDisplayHeight = 500;
  const scale = Math.min(maxDisplayWidth / width, maxDisplayHeight / height, 1);
  const displayWidth = width * scale;
  const displayHeight = height * scale;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">プレビュー</h3>
        {isProcessing && <span className="text-sm text-muted-foreground">処理中...</span>}
      </div>

      <div className="relative">
        {/* 透過プレビュー用のチェッカーボード背景 */}
        <div
          className="checkerboard mx-auto overflow-hidden rounded-lg"
          style={{ width: displayWidth, height: displayHeight }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={`${isEyedropperMode ? 'cursor-crosshair' : ''}`}
            style={{
              width: displayWidth,
              height: displayHeight,
            }}
            onClick={handleCanvasClick}
          />
        </div>

        {/* スポイト用の非表示キャンバス */}
        <canvas ref={originalCanvasRef} width={width} height={height} className="hidden" />
      </div>

      <p className="text-sm text-muted-foreground">
        {width} x {height} px
      </p>
    </div>
  );
}
