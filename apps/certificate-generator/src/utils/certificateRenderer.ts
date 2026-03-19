export type CertTemplate = 'formal' | 'modern';

export interface CertificateData {
  recipientName: string;
  certTitle: string;
  issuer: string;
  date: string;
  description: string;
}

const WIDTH = 1200;
const HEIGHT = 850;

function drawFormalBorder(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, WIDTH - 60, HEIGHT - 60);
  ctx.strokeStyle = '#c5a028';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);
  ctx.strokeRect(50, 50, WIDTH - 100, HEIGHT - 100);

  // Corner ornaments
  const corners = [
    [55, 55],
    [WIDTH - 55, 55],
    [55, HEIGHT - 55],
    [WIDTH - 55, HEIGHT - 55],
  ];
  ctx.fillStyle = '#c5a028';
  for (const [x, y] of corners) {
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawModernBorder(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, WIDTH, 0);
  grad.addColorStop(0, '#667eea');
  grad.addColorStop(1, '#764ba2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, 8);
  ctx.fillRect(0, HEIGHT - 8, WIDTH, 8);
  ctx.fillRect(0, 0, 8, HEIGHT);
  ctx.fillRect(WIDTH - 8, 0, 8, HEIGHT);
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  data: CertificateData,
  template: CertTemplate
): void {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = template === 'formal' ? '#fffdf5' : '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Border
  if (template === 'formal') {
    drawFormalBorder(ctx);
  } else {
    drawModernBorder(ctx);
  }

  const cx = WIDTH / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  if (template === 'formal') {
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = '#8b6914';
  } else {
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = '#667eea';
  }
  ctx.fillText(data.certTitle || 'Certificate of Achievement', cx, 160);

  // "Presented to"
  ctx.font = template === 'formal' ? 'italic 22px serif' : '20px sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('This certificate is presented to', cx, 260);

  // Recipient name
  if (template === 'formal') {
    ctx.font = 'bold 52px serif';
    ctx.fillStyle = '#1a1a1a';
  } else {
    ctx.font = 'bold 48px sans-serif';
    ctx.fillStyle = '#333333';
  }
  ctx.fillText(data.recipientName || 'Recipient Name', cx, 340);

  // Underline
  const nameWidth = ctx.measureText(data.recipientName || 'Recipient Name').width;
  ctx.strokeStyle = template === 'formal' ? '#c5a028' : '#667eea';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - nameWidth / 2, 370);
  ctx.lineTo(cx + nameWidth / 2, 370);
  ctx.stroke();

  // Description
  ctx.font = template === 'formal' ? '20px serif' : '18px sans-serif';
  ctx.fillStyle = '#555555';
  if (data.description) {
    const words = data.description.split(' ');
    let line = '';
    let y = 430;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > WIDTH - 200 && line) {
        ctx.fillText(line.trim(), cx, y);
        line = word + ' ';
        y += 30;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line.trim(), cx, y);
  }

  // Issuer and date
  ctx.font = template === 'formal' ? '22px serif' : '20px sans-serif';
  ctx.fillStyle = '#444444';
  ctx.fillText(data.issuer || 'Organization', cx - 200, HEIGHT - 140);
  ctx.fillText(data.date || new Date().toLocaleDateString(), cx + 200, HEIGHT - 140);

  // Labels
  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#888888';
  ctx.fillText('Issued by', cx - 200, HEIGHT - 110);
  ctx.fillText('Date', cx + 200, HEIGHT - 110);
}

export function downloadPng(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = 'certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function printCertificate(): void {
  window.print();
}
