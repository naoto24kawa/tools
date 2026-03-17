export const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/webp', label: 'WebP', ext: 'webp' },
] as const;

export type ImageFormat = (typeof FORMATS)[number]['value'];

export function convertImage(
  image: HTMLImageElement,
  format: ImageFormat,
  quality: number
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    ctx.drawImage(image, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Conversion failed'));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ blob, dataUrl: reader.result as string });
        reader.readAsDataURL(blob);
      },
      format,
      quality / 100
    );
  });
}
