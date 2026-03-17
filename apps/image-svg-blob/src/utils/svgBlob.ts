function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateBlobPath(points: number, size: number, irregularity: number): string {
  const angleStep = (Math.PI * 2) / points;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;

  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const r = radius * (1 + randomBetween(-irregularity, irregularity));
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length; i++) {
    const next = pts[(i + 1) % pts.length];
    const cp1x = pts[i][0] + (next[0] - pts[i][0]) * 0.5 + randomBetween(-20, 20);
    const cp1y = pts[i][1] + (next[1] - pts[i][1]) * 0.5 + randomBetween(-20, 20);
    d += ` Q ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${next[0].toFixed(1)},${next[1].toFixed(1)}`;
  }
  d += ' Z';
  return d;
}

export function generateBlobSVG(
  size: number,
  color: string,
  points: number,
  irregularity: number
): string {
  const path = generateBlobPath(points, size, irregularity);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <path d="${path}" fill="${color}" />
</svg>`;
}
