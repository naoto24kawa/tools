export function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [Number.parseInt(m[1], 16), Number.parseInt(m[2], 16), Number.parseInt(m[3], 16)];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

export function generateShades(hex: string, count: number): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    const factor = i / (count - 1);
    shades.push(rgbToHex(rgb[0] * (1 - factor), rgb[1] * (1 - factor), rgb[2] * (1 - factor)));
  }
  return shades;
}

export function generateTints(hex: string, count: number): string[] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [];
  const tints: string[] = [];
  for (let i = 0; i < count; i++) {
    const factor = i / (count - 1);
    tints.push(
      rgbToHex(
        rgb[0] + (255 - rgb[0]) * factor,
        rgb[1] + (255 - rgb[1]) * factor,
        rgb[2] + (255 - rgb[2]) * factor
      )
    );
  }
  return tints;
}

export function generatePalette(hex: string, count: number): { shades: string[]; tints: string[] } {
  return { shades: generateShades(hex, count), tints: generateTints(hex, count) };
}
