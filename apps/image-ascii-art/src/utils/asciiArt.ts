const ASCII_CHARS = '@%#*+=-:. ';

export function imageToAscii(image: HTMLImageElement, width: number): string {
  const canvas = document.createElement('canvas');
  const aspectRatio = image.naturalHeight / image.naturalWidth;
  const height = Math.round(width * aspectRatio * 0.5);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(image, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;

  let ascii = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const charIdx = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
      ascii += ASCII_CHARS[ASCII_CHARS.length - 1 - charIdx];
    }
    ascii += '\n';
  }
  return ascii;
}
