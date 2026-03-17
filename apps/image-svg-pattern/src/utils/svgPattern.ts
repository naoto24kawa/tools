export const PATTERNS = [
  { name: 'Dots', id: 'dots' },
  { name: 'Lines', id: 'lines' },
  { name: 'Grid', id: 'grid' },
  { name: 'Diagonal', id: 'diagonal' },
  { name: 'Zigzag', id: 'zigzag' },
  { name: 'Circles', id: 'circles' },
] as const;

export type PatternType = (typeof PATTERNS)[number]['id'];

export interface PatternConfig {
  type: PatternType;
  size: number;
  color: string;
  bgColor: string;
  strokeWidth: number;
}

export const DEFAULT_CONFIG: PatternConfig = {
  type: 'dots',
  size: 20,
  color: '#3b82f6',
  bgColor: '#ffffff',
  strokeWidth: 2,
};

export function generatePatternSVG(config: PatternConfig): string {
  const { type, size, color, bgColor, strokeWidth } = config;
  let patternContent: string;

  switch (type) {
    case 'dots':
      patternContent = `<circle cx="${size / 2}" cy="${size / 2}" r="${strokeWidth}" fill="${color}" />`;
      break;
    case 'lines':
      patternContent = `<line x1="0" y1="${size / 2}" x2="${size}" y2="${size / 2}" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;
    case 'grid':
      patternContent = `<line x1="0" y1="${size}" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth / 2}" /><line x1="${size}" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth / 2}" />`;
      break;
    case 'diagonal':
      patternContent = `<line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;
    case 'zigzag':
      patternContent = `<polyline points="0,${size} ${size / 2},0 ${size},${size}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;
    case 'circles':
      patternContent = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`;
      break;
    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown pattern: ${_exhaustiveCheck}`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <pattern id="pattern" x="0" y="0" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
      ${patternContent}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}" />
  <rect width="100%" height="100%" fill="url(#pattern)" />
</svg>`;
}
