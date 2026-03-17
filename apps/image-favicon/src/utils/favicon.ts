export const FAVICON_SIZES = [16, 32, 48, 64, 128, 256] as const;

export function generateFavicon(image: HTMLImageElement, size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(image, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}

export function generateAllSizes(image: HTMLImageElement): { size: number; dataUrl: string }[] {
  return FAVICON_SIZES.map((size) => ({ size, dataUrl: generateFavicon(image, size) }));
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
