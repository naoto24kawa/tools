export interface ShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export const DEFAULT_SHADOW_LAYER: Omit<ShadowLayer, 'id'> = {
  offsetX: 2,
  offsetY: 2,
  blur: 4,
  color: 'rgba(0, 0, 0, 0.5)',
};

export function generateTextShadowValue(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';

  return layers
    .map((layer) => `${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.color}`)
    .join(', ');
}

export function generateTextShadowCss(layers: ShadowLayer[]): string {
  const value = generateTextShadowValue(layers);
  return `text-shadow: ${value};`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function parseRgbaAlpha(rgba: string): number {
  const rgbaMatch = rgba.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*([0-9.]+)\s*\)/);
  if (rgbaMatch) return parseFloat(rgbaMatch[1]);
  if (rgba.startsWith('rgb(')) return 1;
  return 1;
}

export function parseRgbaHex(rgba: string): string {
  const match = rgba.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return '#000000';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

let idCounter = 0;
export function createShadowId(): string {
  idCounter += 1;
  return `shadow-${idCounter}-${Date.now()}`;
}
