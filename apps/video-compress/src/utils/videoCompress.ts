export type QualityPreset = 'low' | 'medium' | 'high';

export type ResolutionOption = 'original' | '720p' | '480p' | '360p';

export interface CompressOptions {
  quality: QualityPreset;
  resolution: ResolutionOption;
}

export function getVideoBitsPerSecond(quality: QualityPreset): number {
  switch (quality) {
    case 'low':
      return 500_000;
    case 'medium':
      return 1_500_000;
    case 'high':
      return 3_000_000;
  }
}

export function getTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  resolution: ResolutionOption
): { width: number; height: number } {
  if (resolution === 'original') {
    return { width: originalWidth, height: originalHeight };
  }

  const targetHeights: Record<string, number> = {
    '720p': 720,
    '480p': 480,
    '360p': 360,
  };

  const targetHeight = targetHeights[resolution] || originalHeight;

  if (originalHeight <= targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;
  const width = Math.round(targetHeight * aspectRatio);
  // Ensure even dimensions for video encoding
  return {
    width: width % 2 === 0 ? width : width + 1,
    height: targetHeight % 2 === 0 ? targetHeight : targetHeight + 1,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function calculateCompressionRatio(originalSize: number, compressedSize: number): string {
  if (originalSize === 0) return '0%';
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
  return `${ratio}%`;
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
    return `${originalName}_compressed`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_compressed.webm`;
}

export function getQualityLabel(quality: QualityPreset): string {
  switch (quality) {
    case 'low':
      return 'Low (500 kbps)';
    case 'medium':
      return 'Medium (1.5 Mbps)';
    case 'high':
      return 'High (3 Mbps)';
  }
}
