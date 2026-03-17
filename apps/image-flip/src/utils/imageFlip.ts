export type FlipDirection = 'horizontal' | 'vertical' | 'both';

export function flipImageOnCanvas(image: HTMLImageElement, direction: FlipDirection): string {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.save();

  if (direction === 'horizontal' || direction === 'both') {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  if (direction === 'vertical' || direction === 'both') {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(image, 0, 0);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
