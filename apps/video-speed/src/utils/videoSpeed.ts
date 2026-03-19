export const SPEED_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4] as const;

export const SPEED_MIN = 0.25;
export const SPEED_MAX = 4;
export const SPEED_STEP = 0.25;

export function formatSpeed(speed: number): string {
  return `${speed}x`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function calculateOutputDuration(originalDuration: number, speed: number): number {
  if (speed <= 0) return originalDuration;
  return originalDuration / speed;
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

export function getOutputFileName(originalName: string, speed: number): string {
  const dotIndex = originalName.lastIndexOf('.');
  const speedStr = speed.toString().replace('.', '_');
  if (dotIndex === -1) {
    return `${originalName}_${speedStr}x`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_${speedStr}x.webm`;
}

export function clampSpeed(speed: number): number {
  return Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));
}
