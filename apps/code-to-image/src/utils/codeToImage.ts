export interface CodeImageOptions {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  padding: number;
  fontFamily: string;
  lineHeight: number;
}

export const DEFAULT_OPTIONS: CodeImageOptions = {
  backgroundColor: '#1e1e1e',
  textColor: '#d4d4d4',
  fontSize: 14,
  padding: 32,
  fontFamily: 'monospace',
  lineHeight: 1.5,
};

export function generateCodeImage(
  code: string,
  options: CodeImageOptions = DEFAULT_OPTIONS
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const lines = code.split('\n');
  const lineHeightPx = options.fontSize * options.lineHeight;

  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));

  canvas.width = maxWidth + options.padding * 2;
  canvas.height = lines.length * lineHeightPx + options.padding * 2;

  // Background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rounded corners effect
  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  ctx.fillStyle = options.textColor;
  ctx.textBaseline = 'top';

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i]!, options.padding, options.padding + i * lineHeightPx);
  }

  return canvas.toDataURL('image/png');
}
