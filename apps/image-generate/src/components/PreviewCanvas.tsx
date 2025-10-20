import { useRef, useEffect } from 'react';
import type { ImageGeneratorSettings } from '@types';
import { generateCanvas } from '@utils/canvasGenerator';
import { CANVAS_CONSTANTS } from '@config/canvas';

interface PreviewCanvasProps {
  /** 画像生成設定 */
  settings: ImageGeneratorSettings;
}

/**
 * 画像のプレビューを表示するコンポーネント
 *
 * settings が変更されるたびに、プレビュー用にスケーリングされた
 * Canvas を自動的に再描画します。
 */
export function PreviewCanvas({ settings }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = generateCanvas(settings);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // プレビュー用にスケーリング
    const scale = calculatePreviewScale(canvas.width, canvas.height);

    canvasRef.current.width = canvas.width * scale;
    canvasRef.current.height = canvas.height * scale;

    ctx.scale(scale, scale);
    ctx.drawImage(canvas, 0, 0);
  }, [settings]);

  return (
    <div className="preview-container">
      <canvas ref={canvasRef} className="preview-canvas" />
      <div className="preview-info">
        {settings.width} × {settings.height} px
      </div>
    </div>
  );
}

/**
 * プレビュー表示のためのスケール係数を計算
 */
function calculatePreviewScale(width: number, height: number): number {
  return Math.min(
    CANVAS_CONSTANTS.PREVIEW_MAX_WIDTH / width,
    CANVAS_CONSTANTS.PREVIEW_MAX_HEIGHT / height,
    1
  );
}
