export interface ShadowLayer {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export const DEFAULT_SHADOW: ShadowLayer = {
  x: 4,
  y: 4,
  blur: 10,
  spread: 0,
  color: '#000000',
  opacity: 25,
  inset: false,
};

function hexToRgba(hex: string, opacity: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export function layerToCSS(layer: ShadowLayer): string {
  const inset = layer.inset ? 'inset ' : '';
  return `${inset}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${hexToRgba(layer.color, layer.opacity)}`;
}

export function generateCSS(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers.map(layerToCSS).join(', ');
}

export function generateFullCSS(layers: ShadowLayer[]): string {
  return `box-shadow: ${generateCSS(layers)};`;
}
