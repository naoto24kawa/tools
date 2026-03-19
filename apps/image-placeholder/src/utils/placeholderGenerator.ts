export interface PlaceholderOptions {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  text: string;
  fontSize: number;
}

export interface Preset {
  label: string;
  width: number;
  height: number;
}

export const PRESETS: Preset[] = [
  { label: 'Avatar (150x150)', width: 150, height: 150 },
  { label: 'Thumbnail (320x180)', width: 320, height: 180 },
  { label: 'Banner (728x90)', width: 728, height: 90 },
  { label: 'OG Image (1200x630)', width: 1200, height: 630 },
  { label: 'HD (1920x1080)', width: 1920, height: 1080 },
  { label: 'Square (500x500)', width: 500, height: 500 },
  { label: 'Mobile (375x667)', width: 375, height: 667 },
  { label: 'Favicon (32x32)', width: 32, height: 32 },
];

export const DEFAULT_OPTIONS: PlaceholderOptions = {
  width: 640,
  height: 480,
  backgroundColor: '#cccccc',
  textColor: '#666666',
  text: '',
  fontSize: 24,
};

export function getDisplayText(options: PlaceholderOptions): string {
  return options.text || `${options.width} x ${options.height}`;
}

export function calculateFontSize(options: PlaceholderOptions): number {
  if (options.fontSize > 0) return options.fontSize;
  return Math.max(12, Math.min(options.width, options.height) / 8);
}

export function generatePng(
  canvas: HTMLCanvasElement,
  options: PlaceholderOptions
): string {
  canvas.width = options.width;
  canvas.height = options.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, options.width, options.height);

  const displayText = getDisplayText(options);
  const fontSize = calculateFontSize(options);

  ctx.fillStyle = options.textColor;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayText, options.width / 2, options.height / 2, options.width * 0.9);

  return canvas.toDataURL('image/png');
}

export function generateSvg(options: PlaceholderOptions): string {
  const displayText = getDisplayText(options);
  const fontSize = calculateFontSize(options);

  const escapedText = displayText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 ${options.width} ${options.height}">`,
    `  <rect width="100%" height="100%" fill="${options.backgroundColor}"/>`,
    `  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"`,
    `    font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"`,
    `    fill="${options.textColor}">${escapedText}</text>`,
    '</svg>',
  ].join('\n');
}

export function downloadBlob(data: string, filename: string, mimeType: string): void {
  let blob: Blob;

  if (data.startsWith('data:')) {
    const byteString = atob(data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    blob = new Blob([ab], { type: mimeType });
  } else {
    blob = new Blob([data], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
