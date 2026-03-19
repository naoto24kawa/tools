export interface WheelSlice {
  label: string;
  color: string;
}

const WHEEL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F1948A', '#82E0AA', '#F8C471', '#AED6F1',
  '#D7BDE2', '#A3E4D7', '#FAD7A0', '#AEB6BF',
];

export function getDefaultChoices(): string[] {
  return ['Option A', 'Option B', 'Option C'];
}

export function createSlices(choices: string[]): WheelSlice[] {
  return choices.map((label, i) => ({
    label,
    color: WHEEL_COLORS[i % WHEEL_COLORS.length],
  }));
}

export function drawWheel(
  ctx: CanvasRenderingContext2D,
  slices: WheelSlice[],
  size: number,
  rotation: number
): void {
  const center = size / 2;
  const radius = center - 10;

  ctx.clearRect(0, 0, size, size);

  if (slices.length === 0) {
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#999';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add choices', center, center);
    return;
  }

  const sliceAngle = (Math.PI * 2) / slices.length;

  for (let i = 0; i < slices.length; i++) {
    const startAngle = rotation + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = slices[i].color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    const midAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius * 0.65;
    const labelX = center + Math.cos(midAngle) * labelRadius;
    const labelY = center + Math.sin(midAngle) * labelRadius;

    ctx.save();
    ctx.translate(labelX, labelY);
    ctx.rotate(midAngle + Math.PI / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const maxLen = 12;
    const label =
      slices[i].label.length > maxLen
        ? slices[i].label.slice(0, maxLen - 1) + '...'
        : slices[i].label;
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }

  // Draw center circle
  ctx.beginPath();
  ctx.arc(center, center, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();

  // Draw pointer (triangle at top)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(center, 5);
  ctx.lineTo(center - 12, 30);
  ctx.lineTo(center + 12, 30);
  ctx.closePath();
  ctx.fill();
}

export function getWinner(
  slices: WheelSlice[],
  rotation: number
): string {
  if (slices.length === 0) return '';

  const sliceAngle = (Math.PI * 2) / slices.length;
  // The pointer is at the top (negative Y = angle -PI/2)
  // Normalize rotation
  const pointerAngle = -Math.PI / 2;
  const normalizedRotation = ((pointerAngle - rotation) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor(normalizedRotation / sliceAngle) % slices.length;

  return slices[index].label;
}

export function calculateSpinAnimation(duration: number = 5000): {
  totalRotation: number;
  duration: number;
} {
  // Random number of full rotations (5-10) plus partial
  const fullRotations = 5 + Math.floor(Math.random() * 6);
  const partial = Math.random() * Math.PI * 2;
  return {
    totalRotation: fullRotations * Math.PI * 2 + partial,
    duration,
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
