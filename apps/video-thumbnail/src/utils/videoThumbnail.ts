export type ImageFormat = 'png' | 'jpeg';

export interface Thumbnail {
  id: string;
  dataUrl: string;
  timestamp: number;
  width: number;
  height: number;
  format: ImageFormat;
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 100);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export function generateId(): string {
  return `thumb_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function getMimeType(format: ImageFormat): string {
  return format === 'png' ? 'image/png' : 'image/jpeg';
}

export function getFileExtension(format: ImageFormat): string {
  return format === 'png' ? '.png' : '.jpg';
}

export function getDownloadFileName(
  videoName: string,
  timestamp: number,
  format: ImageFormat
): string {
  const dotIndex = videoName.lastIndexOf('.');
  const baseName = dotIndex === -1 ? videoName : videoName.substring(0, dotIndex);
  const timeStr = formatTime(timestamp).replace(/[:.]/g, '-');
  return `${baseName}_${timeStr}${getFileExtension(format)}`;
}

export function captureFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'png',
  quality: number = 0.92
): string {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL(getMimeType(format), quality);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}
