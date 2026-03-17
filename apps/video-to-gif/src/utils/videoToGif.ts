export interface ConversionOptions {
  fps: number;
  width: number;
  quality: number; // 0-1
  startTime: number;
  duration: number;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  fps: 10,
  width: 320,
  quality: 0.8,
  startTime: 0,
  duration: 5,
};

export function extractFrames(
  video: HTMLVideoElement,
  options: ConversionOptions,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve([]);
      return;
    }

    const scale = options.width / video.videoWidth;
    canvas.width = options.width;
    canvas.height = Math.round(video.videoHeight * scale);

    const frames: string[] = [];
    const totalFrames = Math.ceil(options.duration * options.fps);
    const interval = 1 / options.fps;
    let frameIndex = 0;

    const captureFrame = () => {
      if (frameIndex >= totalFrames) {
        resolve(frames);
        return;
      }

      const targetTime = options.startTime + frameIndex * interval;
      if (targetTime > video.duration) {
        resolve(frames);
        return;
      }

      video.currentTime = targetTime;
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/png', options.quality));
        if (onProgress) onProgress((frameIndex + 1) / totalFrames);
        frameIndex++;
        captureFrame();
      };
    };

    captureFrame();
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}
