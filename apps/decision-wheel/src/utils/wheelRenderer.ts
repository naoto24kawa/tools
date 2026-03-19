export interface WheelSegment {
  text: string;
  color: string;
}

export const DEFAULT_COLORS: string[] = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f43f5e', '#a855f7', '#6366f1',
];

export function parseChoices(input: string): WheelSegment[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text, i) => ({
      text,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }));
}

export function drawWheel(
  ctx: CanvasRenderingContext2D,
  segments: WheelSegment[],
  rotation: number,
  size: number
): void {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;

  ctx.clearRect(0, 0, size, size);

  if (segments.length === 0) {
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add choices below', centerX, centerY);
    return;
  }

  const sliceAngle = (Math.PI * 2) / segments.length;

  segments.forEach((segment, i) => {
    const startAngle = rotation + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Draw segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(10, Math.min(16, 200 / segments.length))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textRadius = radius * 0.6;
    const displayText =
      segment.text.length > 12 ? segment.text.slice(0, 11) + '...' : segment.text;
    ctx.fillText(displayText, textRadius, 0);
    ctx.restore();
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw pointer (triangle at top)
  ctx.beginPath();
  ctx.moveTo(centerX, 5);
  ctx.lineTo(centerX - 12, 30);
  ctx.lineTo(centerX + 12, 30);
  ctx.closePath();
  ctx.fillStyle = '#1f2937';
  ctx.fill();
}

export function getWinningSegment(
  segments: WheelSegment[],
  finalRotation: number
): WheelSegment | null {
  if (segments.length === 0) return null;

  const sliceAngle = (Math.PI * 2) / segments.length;
  // Pointer is at top (angle = -PI/2 or 3PI/2)
  // Normalize rotation to 0..2PI
  const normalizedRotation = ((finalRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  // The pointer points at angle = -PI/2, so the segment at the pointer is:
  const pointerAngle = (Math.PI * 2 - normalizedRotation + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor(pointerAngle / sliceAngle) % segments.length;

  return segments[index];
}

export function playClickSound(): void {
  try {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 1200;
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } catch {
    // Web Audio API not available
  }
}

export function generateSpinAnimation(
  duration: number = 4000
): { totalRotation: number; easing: (t: number) => number } {
  // Random 5-10 full rotations + random offset
  const fullRotations = 5 + Math.random() * 5;
  const randomOffset = Math.random() * Math.PI * 2;
  const totalRotation = fullRotations * Math.PI * 2 + randomOffset;

  // Ease-out cubic
  const easing = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  return { totalRotation, easing };
}
