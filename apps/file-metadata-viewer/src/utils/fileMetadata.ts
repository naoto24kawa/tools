export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  extension: string;
  sizeFormatted: string;
}

export interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface MediaMetadata {
  duration: number;
  durationFormatted: string;
}

/**
 * Extract basic metadata from a file.
 */
export function extractMetadata(file: File): FileMetadata {
  const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || '' : '';
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'unknown',
    lastModified: new Date(file.lastModified).toLocaleString(),
    extension: ext,
    sizeFormatted: formatFileSize(file.size),
  };
}

/**
 * Get image dimensions by loading it into an Image element.
 */
export function getImageDimensions(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const gcd = greatestCommonDivisor(img.width, img.height);
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: `${img.width / gcd}:${img.height / gcd}`,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Get media duration for audio/video files.
 */
export function getMediaDuration(file: File): Promise<MediaMetadata> {
  return new Promise((resolve, reject) => {
    const isAudio = file.type.startsWith('audio/');
    const isVideo = file.type.startsWith('video/');
    if (!isAudio && !isVideo) {
      reject(new Error('Not a media file'));
      return;
    }
    const url = URL.createObjectURL(file);
    const el = document.createElement(isAudio ? 'audio' : 'video');
    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        duration: el.duration,
        durationFormatted: formatDuration(el.duration),
      });
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load media metadata'));
    };
    el.src = url;
  });
}

/**
 * Format file size in human-readable form.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}
