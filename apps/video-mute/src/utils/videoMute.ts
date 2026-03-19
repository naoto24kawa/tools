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
    return `${originalName}_muted`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_muted.webm`;
}

export function calculateSizeReduction(originalSize: number, newSize: number): string {
  if (originalSize === 0) return '0%';
  const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
  return `${reduction}%`;
}
