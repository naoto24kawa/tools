export const ICON_SIZES = [
  { size: 180, label: 'iOS (180x180)', platform: 'iOS' },
  { size: 152, label: 'iPad (152x152)', platform: 'iOS' },
  { size: 120, label: 'iPhone (120x120)', platform: 'iOS' },
  { size: 192, label: 'Android (192x192)', platform: 'Android' },
  { size: 512, label: 'Android (512x512)', platform: 'Android' },
  { size: 48, label: 'Android (48x48)', platform: 'Android' },
  { size: 96, label: 'Web (96x96)', platform: 'Web' },
  { size: 256, label: 'Web (256x256)', platform: 'Web' },
] as const;

export function generateIcon(image: HTMLImageElement, size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(image, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
