export function extractColors(image: HTMLImageElement, count: number): string[] {
  const canvas = document.createElement('canvas');
  const size = 100;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  ctx.drawImage(image, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const colorMap = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const hex = rgbToHex(r, g, b);
    colorMap.set(hex, (colorMap.get(hex) ?? 0) + 1);
  }

  return [...colorMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([hex]) => hex);
}

function rgbToHex(r: number, g: number, b: number): string {
  const cl = (n: number) => Math.max(0, Math.min(255, n));
  return `#${cl(r).toString(16).padStart(2, '0')}${cl(g).toString(16).padStart(2, '0')}${cl(b).toString(16).padStart(2, '0')}`;
}
