export interface CompressResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

export function compressImage(
  image: HTMLImageElement,
  quality: number,
  maxWidth: number,
  format: 'image/jpeg' | 'image/webp'
): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      let { naturalWidth: w, naturalHeight: h } = image;

      if (maxWidth > 0 && w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      ctx.drawImage(image, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              originalSize: 0,
              compressedSize: blob.size,
              ratio: 0,
            });
          };
          reader.readAsDataURL(blob);
        },
        format,
        quality / 100
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
