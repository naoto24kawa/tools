export type RotationAngle = 0 | 90 | 180 | 270;

export interface Transform {
  rotation: RotationAngle;
  flipH: boolean;
  flipV: boolean;
}

export function createDefaultTransform(): Transform {
  return { rotation: 0, flipH: false, flipV: false };
}

export function rotateClockwise(current: RotationAngle): RotationAngle {
  return ((current + 90) % 360) as RotationAngle;
}

export function rotateCounterClockwise(current: RotationAngle): RotationAngle {
  return ((current + 270) % 360) as RotationAngle;
}

export function rotate180(current: RotationAngle): RotationAngle {
  return ((current + 180) % 360) as RotationAngle;
}

export function getTransformLabel(transform: Transform): string {
  const parts: string[] = [];
  if (transform.rotation !== 0) {
    parts.push(`Rotated ${transform.rotation} deg`);
  }
  if (transform.flipH) {
    parts.push('Flipped H');
  }
  if (transform.flipV) {
    parts.push('Flipped V');
  }
  return parts.length > 0 ? parts.join(', ') : 'No transform';
}

export function getOutputDimensions(
  width: number,
  height: number,
  rotation: RotationAngle
): { width: number; height: number } {
  if (rotation === 90 || rotation === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

export function applyTransformToContext(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  transform: Transform
): void {
  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);

  const angleRad = (transform.rotation * Math.PI) / 180;
  ctx.rotate(angleRad);

  const scaleX = transform.flipH ? -1 : 1;
  const scaleY = transform.flipV ? -1 : 1;
  ctx.scale(scaleX, scaleY);
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

export function getOutputFileName(originalName: string, transform: Transform): string {
  const dotIndex = originalName.lastIndexOf('.');
  const parts: string[] = [];
  if (transform.rotation !== 0) parts.push(`r${transform.rotation}`);
  if (transform.flipH) parts.push('fh');
  if (transform.flipV) parts.push('fv');
  const suffix = parts.length > 0 ? parts.join('_') : 'transformed';
  if (dotIndex === -1) {
    return `${originalName}_${suffix}`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_${suffix}.webm`;
}
