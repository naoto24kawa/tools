export type WatermarkPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: WatermarkPosition;
}

export function createDefaultWatermarkConfig(): WatermarkConfig {
  return {
    text: 'Watermark',
    fontSize: 24,
    color: '#ffffff',
    opacity: 0.5,
    position: 'bottom-right',
  };
}

export const POSITION_OPTIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'center', label: 'Center' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

export function getTextPosition(
  position: WatermarkPosition,
  canvasWidth: number,
  canvasHeight: number,
  textWidth: number,
  fontSize: number
): { x: number; y: number } {
  const padding = 20;

  switch (position) {
    case 'top-left':
      return { x: padding, y: padding + fontSize };
    case 'top-center':
      return { x: (canvasWidth - textWidth) / 2, y: padding + fontSize };
    case 'top-right':
      return { x: canvasWidth - textWidth - padding, y: padding + fontSize };
    case 'center':
      return { x: (canvasWidth - textWidth) / 2, y: (canvasHeight + fontSize) / 2 };
    case 'bottom-left':
      return { x: padding, y: canvasHeight - padding };
    case 'bottom-center':
      return { x: (canvasWidth - textWidth) / 2, y: canvasHeight - padding };
    case 'bottom-right':
      return { x: canvasWidth - textWidth - padding, y: canvasHeight - padding };
  }
}

export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: WatermarkConfig
): void {
  if (!config.text.trim()) return;

  ctx.save();
  ctx.globalAlpha = config.opacity;
  ctx.font = `${config.fontSize}px sans-serif`;
  ctx.fillStyle = config.color;

  const metrics = ctx.measureText(config.text);
  const { x, y } = getTextPosition(
    config.position,
    canvasWidth,
    canvasHeight,
    metrics.width,
    config.fontSize
  );

  // Draw text shadow for visibility
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  ctx.fillText(config.text, x, y);
  ctx.restore();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

export function getOutputFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${originalName}_watermarked`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_watermarked.webm`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
