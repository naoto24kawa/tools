export interface VerticalTextOptions {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

export const DEFAULT_OPTIONS: VerticalTextOptions = {
  fontSize: 16,
  lineHeight: 1.8,
  fontFamily: 'serif',
};

/**
 * Generate CSS styles for vertical text rendering.
 */
export function getVerticalStyles(options: VerticalTextOptions): React.CSSProperties {
  return {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    fontSize: `${options.fontSize}px`,
    lineHeight: options.lineHeight,
    fontFamily: options.fontFamily,
    whiteSpace: 'pre-wrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '1.5rem',
    minHeight: '300px',
    maxHeight: '600px',
  };
}

/**
 * Convert text to an image using Canvas API for vertical text rendering.
 * Returns a Blob of the rendered image.
 */
export async function textToImageBlob(
  text: string,
  options: VerticalTextOptions
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  const padding = 40;
  const charHeight = options.fontSize * options.lineHeight;
  const columnWidth = options.fontSize * options.lineHeight;

  // Split text into lines
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map((l) => l.length), 1);

  // Canvas dimensions for vertical text (right to left)
  const canvasWidth = lines.length * columnWidth + padding * 2;
  const canvasHeight = maxLineLength * options.fontSize + padding * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Text
  ctx.fillStyle = '#000000';
  ctx.font = `${options.fontSize}px ${options.fontFamily}`;
  ctx.textBaseline = 'top';

  // Draw right-to-left columns
  for (let col = 0; col < lines.length; col++) {
    const x = canvasWidth - padding - (col + 1) * columnWidth + (columnWidth - options.fontSize) / 2;
    for (let row = 0; row < lines[col].length; row++) {
      const y = padding + row * charHeight;
      ctx.fillText(lines[col][row], x, y);
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create image blob'));
    }, 'image/png');
  });
}
