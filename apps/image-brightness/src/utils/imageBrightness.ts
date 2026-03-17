export function applyFilters(
  image: HTMLImageElement,
  brightness: number,
  contrast: number,
  saturate: number
): string {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL('image/png');
}

export function getCSSFilter(brightness: number, contrast: number, saturate: number): string {
  return `filter: brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%);`;
}
