export type Template = 'minimal' | 'modern' | 'classic';

export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
}

// Standard business card: 91mm x 55mm ≈ 910x550 at 10px/mm
const CARD_WIDTH = 910;
const CARD_HEIGHT = 550;

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  data: BusinessCardData,
  template: Template
): void {
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  switch (template) {
    case 'minimal':
      renderMinimal(ctx, data);
      break;
    case 'modern':
      renderModern(ctx, data);
      break;
    case 'classic':
      renderClassic(ctx, data);
      break;
  }
}

function renderMinimal(ctx: CanvasRenderingContext2D, data: BusinessCardData): void {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  ctx.font = 'bold 36px sans-serif';
  ctx.fillText(data.name || 'Your Name', 60, 180);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(data.title || 'Job Title', 60, 225);

  ctx.fillText(data.company || 'Company', 60, 255);

  ctx.fillStyle = '#333333';
  ctx.font = '18px sans-serif';
  let y = 340;
  if (data.email) {
    ctx.fillText(data.email, 60, y);
    y += 30;
  }
  if (data.phone) {
    ctx.fillText(data.phone, 60, y);
    y += 30;
  }
  if (data.website) {
    ctx.fillText(data.website, 60, y);
  }
}

function renderModern(ctx: CanvasRenderingContext2D, data: BusinessCardData): void {
  // Dark background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Accent bar
  const grad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  grad.addColorStop(0, '#e94560');
  grad.addColorStop(1, '#0f3460');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 8, CARD_HEIGHT);

  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  ctx.font = 'bold 38px sans-serif';
  ctx.fillText(data.name || 'Your Name', 50, 160);

  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#e94560';
  ctx.fillText(data.title || 'Job Title', 50, 210);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '20px sans-serif';
  ctx.fillText(data.company || 'Company', 50, 245);

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '17px sans-serif';
  let y = 340;
  if (data.email) {
    ctx.fillText(data.email, 50, y);
    y += 28;
  }
  if (data.phone) {
    ctx.fillText(data.phone, 50, y);
    y += 28;
  }
  if (data.website) {
    ctx.fillText(data.website, 50, y);
  }
}

function renderClassic(ctx: CanvasRenderingContext2D, data: BusinessCardData): void {
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Border
  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, CARD_WIDTH - 40, CARD_HEIGHT - 40);

  ctx.fillStyle = '#2c1810';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const cx = CARD_WIDTH / 2;

  ctx.font = 'bold 34px serif';
  ctx.fillText(data.name || 'Your Name', cx, 140);

  ctx.font = '20px serif';
  ctx.fillStyle = '#5c4033';
  ctx.fillText(data.title || 'Job Title', cx, 185);

  ctx.font = 'italic 20px serif';
  ctx.fillText(data.company || 'Company', cx, 220);

  // Divider
  ctx.strokeStyle = '#8b7355';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 120, 270);
  ctx.lineTo(cx + 120, 270);
  ctx.stroke();

  ctx.fillStyle = '#2c1810';
  ctx.font = '17px serif';
  let y = 310;
  if (data.email) {
    ctx.fillText(data.email, cx, y);
    y += 30;
  }
  if (data.phone) {
    ctx.fillText(data.phone, cx, y);
    y += 30;
  }
  if (data.website) {
    ctx.fillText(data.website, cx, y);
  }
}

export function downloadPng(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = 'business-card.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function printCard(): void {
  window.print();
}
