export type AvatarStyle = 'geometric' | 'pixel' | 'identicon';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateGeometric(
  ctx: CanvasRenderingContext2D,
  size: number,
  seed: string,
  bgColor: string
): void {
  const hash = hashCode(seed);
  const rand = seededRandom(hash);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const shapes = 5 + Math.floor(rand() * 6);
  for (let i = 0; i < shapes; i++) {
    const hue = Math.floor(rand() * 360);
    ctx.fillStyle = hslToHex(hue, 60 + rand() * 30, 40 + rand() * 30);
    ctx.globalAlpha = 0.6 + rand() * 0.4;
    const type = Math.floor(rand() * 3);
    const x = rand() * size;
    const y = rand() * size;
    const s = size * 0.15 + rand() * size * 0.35;

    if (type === 0) {
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    } else if (type === 1) {
      ctx.beginPath();
      ctx.arc(x, y, s / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y - s / 2);
      ctx.lineTo(x + s / 2, y + s / 2);
      ctx.lineTo(x - s / 2, y + s / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function generatePixel(
  ctx: CanvasRenderingContext2D,
  size: number,
  seed: string,
  bgColor: string
): void {
  const hash = hashCode(seed);
  const rand = seededRandom(hash);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const grid = 8;
  const cellSize = size / grid;
  const hue = Math.floor(rand() * 360);

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < Math.ceil(grid / 2); x++) {
      if (rand() > 0.5) {
        const lightness = 30 + Math.floor(rand() * 40);
        ctx.fillStyle = hslToHex(hue, 70, lightness);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.fillRect((grid - 1 - x) * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function generateIdenticon(
  ctx: CanvasRenderingContext2D,
  size: number,
  seed: string,
  bgColor: string
): void {
  const hash = hashCode(seed);
  const rand = seededRandom(hash);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  const grid = 5;
  const cellSize = size / (grid + 2);
  const offset = cellSize;
  const hue = hash % 360;
  ctx.fillStyle = hslToHex(hue, 65, 50);

  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < Math.ceil(grid / 2); x++) {
      if (rand() > 0.4) {
        ctx.fillRect(offset + x * cellSize, offset + y * cellSize, cellSize, cellSize);
        ctx.fillRect(
          offset + (grid - 1 - x) * cellSize,
          offset + y * cellSize,
          cellSize,
          cellSize
        );
      }
    }
    // Center column
    if (grid % 2 === 1 && rand() > 0.4) {
      const cx = Math.floor(grid / 2);
      ctx.fillRect(offset + cx * cellSize, offset + y * cellSize, cellSize, cellSize);
    }
  }
}

export function generate(
  canvas: HTMLCanvasElement,
  style: AvatarStyle,
  seed: string,
  size: number,
  bgColor: string
): void {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const actualSeed = seed || 'default';

  switch (style) {
    case 'geometric':
      generateGeometric(ctx, size, actualSeed, bgColor);
      break;
    case 'pixel':
      generatePixel(ctx, size, actualSeed, bgColor);
      break;
    case 'identicon':
      generateIdenticon(ctx, size, actualSeed, bgColor);
      break;
  }
}

export function downloadPng(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
