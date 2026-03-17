export interface GlassConfig {
  blur: number;
  transparency: number;
  saturation: number;
  borderRadius: number;
  border: boolean;
  color: string;
}

export const DEFAULT_CONFIG: GlassConfig = {
  blur: 16,
  transparency: 25,
  saturation: 180,
  borderRadius: 16,
  border: true,
  color: '#ffffff',
};

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function generateCSS(config: GlassConfig): string {
  const lines: string[] = [];
  lines.push(`background: ${hexToRgba(config.color, config.transparency / 100)};`);
  lines.push(`backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);`);
  lines.push(`-webkit-backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);`);
  lines.push(`border-radius: ${config.borderRadius}px;`);
  if (config.border) {
    lines.push(`border: 1px solid ${hexToRgba(config.color, 0.3)};`);
  }
  return lines.join('\n');
}
