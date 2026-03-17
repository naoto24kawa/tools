export interface BorderRadiusConfig {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  linked: boolean;
  unit: 'px' | '%';
}

export const DEFAULT_CONFIG: BorderRadiusConfig = {
  topLeft: 16,
  topRight: 16,
  bottomRight: 16,
  bottomLeft: 16,
  linked: true,
  unit: 'px',
};

export function generateCSS(config: BorderRadiusConfig): string {
  const { topLeft, topRight, bottomRight, bottomLeft, unit } = config;
  if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
    return `border-radius: ${topLeft}${unit};`;
  }
  return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
}
