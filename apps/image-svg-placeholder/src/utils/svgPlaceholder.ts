export interface PlaceholderConfig {
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
  text: string;
  fontSize: number;
}

export const DEFAULT_CONFIG: PlaceholderConfig = {
  width: 300,
  height: 200,
  bgColor: '#cccccc',
  textColor: '#666666',
  text: '',
  fontSize: 16,
};

export function generateSVG(config: PlaceholderConfig): string {
  const displayText = config.text || `${config.width} x ${config.height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">
  <rect width="100%" height="100%" fill="${config.bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${config.fontSize}" fill="${config.textColor}">${displayText}</text>
</svg>`;
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
