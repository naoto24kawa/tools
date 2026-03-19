export const WHEEL_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#E7E9ED', '#7BC8A4',
  '#F67019', '#00A8C6', '#D2691E', '#8FBC8F',
];

export function getSliceColor(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length];
}

export function pickWinner(choices: string[], angle: number): string {
  const count = choices.length;
  if (count === 0) return '';
  const sliceAngle = (2 * Math.PI) / count;
  // Normalize angle: the pointer is at the top (3 o'clock position rotated by -90 deg)
  const normalizedAngle = ((2 * Math.PI - (angle % (2 * Math.PI))) + Math.PI / 2) % (2 * Math.PI);
  const index = Math.floor(normalizedAngle / sliceAngle) % count;
  return choices[index];
}

export function drawWheel(
  ctx: CanvasRenderingContext2D,
  choices: string[],
  rotation: number,
  size: number
): void {
  const center = size / 2;
  const radius = center - 10;
  const count = choices.length;

  ctx.clearRect(0, 0, size, size);

  if (count === 0) {
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add choices', center, center);
    return;
  }

  const sliceAngle = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const startAngle = rotation + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = getSliceColor(i);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    const textAngle = startAngle + sliceAngle / 2;
    const textRadius = radius * 0.65;
    ctx.save();
    ctx.translate(
      center + textRadius * Math.cos(textAngle),
      center + textRadius * Math.sin(textAngle)
    );
    ctx.rotate(textAngle);
    ctx.fillStyle = '#000';
    ctx.font = `${Math.max(10, Math.min(14, 200 / count))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = choices[i].length > 12 ? choices[i].slice(0, 11) + '...' : choices[i];
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  // Pointer
  ctx.beginPath();
  ctx.moveTo(size - 5, center - 10);
  ctx.lineTo(size - 5, center + 10);
  ctx.lineTo(size - 25, center);
  ctx.closePath();
  ctx.fillStyle = '#e11d48';
  ctx.fill();
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
