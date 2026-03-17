export interface GradientStop {
  color: string;
  position: number;
}

export type GradientType = 'linear' | 'radial' | 'conic';

export interface GradientConfig {
  type: GradientType;
  angle: number;
  stops: GradientStop[];
}

export const DEFAULT_CONFIG: GradientConfig = {
  type: 'linear',
  angle: 135,
  stops: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ],
};

export function generateCSS(config: GradientConfig): string {
  const stopsStr = config.stops.map((s) => `${s.color} ${s.position}%`).join(', ');

  switch (config.type) {
    case 'linear':
      return `linear-gradient(${config.angle}deg, ${stopsStr})`;
    case 'radial':
      return `radial-gradient(circle, ${stopsStr})`;
    case 'conic':
      return `conic-gradient(from ${config.angle}deg, ${stopsStr})`;
    default:
      return '';
  }
}

export function generateFullCSS(config: GradientConfig): string {
  return `background: ${generateCSS(config)};`;
}

export const PRESETS: GradientConfig[] = [
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#f093fb', position: 0 },
      { color: '#f5576c', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#4facfe', position: 0 },
      { color: '#00f2fe', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#43e97b', position: 0 },
      { color: '#38f9d7', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#fa709a', position: 0 },
      { color: '#fee140', position: 100 },
    ],
  },
  {
    type: 'linear',
    angle: 0,
    stops: [
      { color: '#a18cd1', position: 0 },
      { color: '#fbc2eb', position: 100 },
    ],
  },
];
