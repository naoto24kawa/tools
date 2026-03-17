export interface HandwritingOptions {
  fontSize: number;
  color: string;
  backgroundColor: string;
  lineHeight: number;
  wobble: number; // 0-10, amount of randomness
  fontFamily: string;
}

export const DEFAULT_OPTIONS: HandwritingOptions = {
  fontSize: 24,
  color: '#1a1a2e',
  backgroundColor: '#fefae0',
  lineHeight: 1.8,
  wobble: 5,
  fontFamily: 'cursive',
};

export function renderHandwriting(
  canvas: HTMLCanvasElement,
  text: string,
  options: HandwritingOptions
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const lines = text.split('\n');
  const lineHeightPx = options.fontSize * options.lineHeight;
  const padding = 40;

  // Calculate canvas size
  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  const maxWidth = Math.max(400, ...lines.map((l) => ctx.measureText(l).width + padding * 2));
  canvas.width = maxWidth;
  canvas.height = lines.length * lineHeightPx + padding * 2;

  // Background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ruled lines
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= lines.length; i++) {
    const y = padding + i * lineHeightPx;
    ctx.beginPath();
    ctx.moveTo(padding / 2, y);
    ctx.lineTo(canvas.width - padding / 2, y);
    ctx.stroke();
  }

  // Draw text with wobble
  ctx.fillStyle = options.color;
  const wobbleScale = options.wobble / 10;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    let x = padding;
    const baseY = padding + (lineIdx + 0.8) * lineHeightPx;

    for (const char of lines[lineIdx]) {
      ctx.save();
      const offsetX = (Math.random() - 0.5) * 4 * wobbleScale;
      const offsetY = (Math.random() - 0.5) * 4 * wobbleScale;
      const rotation = (Math.random() - 0.5) * 0.1 * wobbleScale;
      const sizeVar = 1 + (Math.random() - 0.5) * 0.1 * wobbleScale;

      ctx.translate(x + offsetX, baseY + offsetY);
      ctx.rotate(rotation);
      ctx.font = `${options.fontSize * sizeVar}px ${options.fontFamily}`;
      ctx.fillText(char, 0, 0);
      x += ctx.measureText(char).width + 1;
      ctx.restore();
    }
  }
}
