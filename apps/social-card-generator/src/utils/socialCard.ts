export type LayoutPreset = 'centered' | 'left-aligned' | 'split';
export type BackgroundType = 'solid' | 'gradient';

export interface SocialCardConfig {
  title: string;
  subtitle: string;
  author: string;
  bgType: BackgroundType;
  bgColor1: string;
  bgColor2: string;
  textColor: string;
  layout: LayoutPreset;
}

const OGP_WIDTH = 1200;
const OGP_HEIGHT = 630;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  const lines: string[] = [];
  const words = text.split('');
  let line = '';

  for (const char of words) {
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function render(canvas: HTMLCanvasElement, config: SocialCardConfig): void {
  canvas.width = OGP_WIDTH;
  canvas.height = OGP_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  if (config.bgType === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, OGP_WIDTH, OGP_HEIGHT);
    grad.addColorStop(0, config.bgColor1);
    grad.addColorStop(1, config.bgColor2);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = config.bgColor1;
  }
  ctx.fillRect(0, 0, OGP_WIDTH, OGP_HEIGHT);

  ctx.fillStyle = config.textColor;
  ctx.textBaseline = 'middle';

  const padding = 80;
  const maxTextWidth = OGP_WIDTH - padding * 2;

  if (config.layout === 'centered') {
    ctx.textAlign = 'center';
    const cx = OGP_WIDTH / 2;

    // Title
    ctx.font = 'bold 56px sans-serif';
    const titleLines = wrapText(ctx, config.title || 'Untitled', maxTextWidth, 56);
    let y = OGP_HEIGHT / 2 - (titleLines.length * 66) / 2 - 30;
    for (const line of titleLines) {
      ctx.fillText(line, cx, y);
      y += 66;
    }

    // Subtitle
    if (config.subtitle) {
      ctx.font = '32px sans-serif';
      ctx.globalAlpha = 0.8;
      ctx.fillText(config.subtitle, cx, y + 10);
      ctx.globalAlpha = 1;
      y += 50;
    }

    // Author
    if (config.author) {
      ctx.font = '28px sans-serif';
      ctx.globalAlpha = 0.7;
      ctx.fillText(config.author, cx, OGP_HEIGHT - 60);
      ctx.globalAlpha = 1;
    }
  } else if (config.layout === 'left-aligned') {
    ctx.textAlign = 'left';

    ctx.font = 'bold 56px sans-serif';
    const titleLines = wrapText(ctx, config.title || 'Untitled', maxTextWidth, 56);
    let y = padding + 60;
    for (const line of titleLines) {
      ctx.fillText(line, padding, y);
      y += 66;
    }

    if (config.subtitle) {
      ctx.font = '32px sans-serif';
      ctx.globalAlpha = 0.8;
      ctx.fillText(config.subtitle, padding, y + 20);
      ctx.globalAlpha = 1;
    }

    if (config.author) {
      ctx.font = '28px sans-serif';
      ctx.globalAlpha = 0.7;
      ctx.fillText(config.author, padding, OGP_HEIGHT - 60);
      ctx.globalAlpha = 1;
    }
  } else {
    // split layout
    // Left side: colored bar
    ctx.fillStyle = config.bgColor2;
    ctx.fillRect(0, 0, 20, OGP_HEIGHT);

    ctx.fillStyle = config.textColor;
    ctx.textAlign = 'left';

    ctx.font = 'bold 52px sans-serif';
    const titleLines = wrapText(ctx, config.title || 'Untitled', maxTextWidth - 40, 52);
    let y = OGP_HEIGHT / 2 - (titleLines.length * 62) / 2;
    for (const line of titleLines) {
      ctx.fillText(line, padding + 20, y);
      y += 62;
    }

    if (config.subtitle) {
      ctx.font = '30px sans-serif';
      ctx.globalAlpha = 0.8;
      ctx.fillText(config.subtitle, padding + 20, y + 20);
      ctx.globalAlpha = 1;
    }

    if (config.author) {
      ctx.font = '26px sans-serif';
      ctx.globalAlpha = 0.7;
      ctx.fillText(config.author, padding + 20, OGP_HEIGHT - 60);
      ctx.globalAlpha = 1;
    }
  }
}

export function downloadPng(canvas: HTMLCanvasElement, title: string): void {
  const link = document.createElement('a');
  const filename = (title || 'social-card').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  link.download = `${filename}-og.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
