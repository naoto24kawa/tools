function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  return [
    Number.parseInt(c.slice(0, 2), 16),
    Number.parseInt(c.slice(2, 4), 16),
    Number.parseInt(c.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const cl = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${cl(r).toString(16).padStart(2, '0')}${cl(g).toString(16).padStart(2, '0')}${cl(b).toString(16).padStart(2, '0')}`;
}

export function mixColors(colors: { hex: string; weight: number }[]): string {
  if (colors.length === 0) return '#000000';
  const totalWeight = colors.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return '#000000';
  let r = 0;
  let g = 0;
  let b = 0;
  for (const c of colors) {
    const [cr, cg, cb] = hexToRgb(c.hex);
    const w = c.weight / totalWeight;
    r += cr * w;
    g += cg * w;
    b += cb * w;
  }
  return rgbToHex(r, g, b);
}

export function mixTwo(color1: string, color2: string, ratio: number): string {
  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const t = ratio / 100;
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

export function generateMixSteps(color1: string, color2: string, steps: number): string[] {
  return Array.from({ length: steps }, (_, i) => mixTwo(color1, color2, (i / (steps - 1)) * 100));
}
