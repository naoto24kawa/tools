export interface GifFrame {
  dataUrl: string;
  index: number;
  width: number;
  height: number;
}

export async function extractGifFrames(file: File): Promise<GifFrame[]> {
  const arrayBuffer = await file.arrayBuffer();

  // Try using ImageDecoder API (Chrome 94+)
  if ('ImageDecoder' in window) {
    return extractWithImageDecoder(arrayBuffer);
  }

  // Fallback: load as image and capture single frame
  return extractWithCanvas(file);
}

async function extractWithImageDecoder(buffer: ArrayBuffer): Promise<GifFrame[]> {
  // biome-ignore lint/suspicious/noExplicitAny: ImageDecoder API is not yet in TypeScript's lib
  const ImageDecoderClass = (window as Record<string, any>).ImageDecoder;
  const decoder = new ImageDecoderClass({
    data: buffer,
    type: 'image/gif',
  });

  await decoder.tracks.ready;
  const frameCount = decoder.tracks.selectedTrack?.frameCount ?? 1;
  const frames: GifFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    const result = await decoder.decode({ frameIndex: i });
    const canvas = document.createElement('canvas');
    canvas.width = result.image.displayWidth;
    canvas.height = result.image.displayHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    ctx.drawImage(result.image, 0, 0);
    result.image.close();

    frames.push({
      dataUrl: canvas.toDataURL('image/png'),
      index: i,
      width: canvas.width,
      height: canvas.height,
    });
  }

  decoder.close();
  return frames;
}

async function extractWithCanvas(file: File): Promise<GifFrame[]> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve([
        {
          dataUrl: canvas.toDataURL('image/png'),
          index: 0,
          width: img.width,
          height: img.height,
        },
      ]);
    };
    img.src = url;
  });
}

export function downloadFrame(frame: GifFrame, filename: string): void {
  const a = document.createElement('a');
  a.href = frame.dataUrl;
  a.download = filename;
  a.click();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
