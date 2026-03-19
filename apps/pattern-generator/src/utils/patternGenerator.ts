export type PatternType = 'stripes' | 'dots' | 'checkers' | 'diagonal' | 'zigzag' | 'waves';

export interface PatternConfig {
  type: PatternType;
  size: number;
  color1: string;
  color2: string;
  angle: number;
}

export function generateCSS(config: PatternConfig): string {
  const { type, size, color1, color2, angle } = config;

  switch (type) {
    case 'stripes':
      return `background: repeating-linear-gradient(
  ${angle}deg,
  ${color1},
  ${color1} ${size}px,
  ${color2} ${size}px,
  ${color2} ${size * 2}px
);`;

    case 'dots':
      return `background-color: ${color1};
background-image: radial-gradient(${color2} ${size / 4}px, transparent ${size / 4}px);
background-size: ${size}px ${size}px;`;

    case 'checkers':
      return `background-color: ${color1};
background-image:
  linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%),
  linear-gradient(45deg, ${color2} 25%, transparent 25%, transparent 75%, ${color2} 75%);
background-size: ${size * 2}px ${size * 2}px;
background-position: 0 0, ${size}px ${size}px;`;

    case 'diagonal':
      return `background: repeating-linear-gradient(
  ${angle}deg,
  ${color1},
  ${color1} ${size / 2}px,
  ${color2} ${size / 2}px,
  ${color2} ${size}px
);`;

    case 'zigzag':
      return `background-color: ${color1};
background-image:
  linear-gradient(135deg, ${color2} 25%, transparent 25%),
  linear-gradient(225deg, ${color2} 25%, transparent 25%),
  linear-gradient(315deg, ${color2} 25%, transparent 25%),
  linear-gradient(45deg, ${color2} 25%, transparent 25%);
background-size: ${size}px ${size}px;
background-position: 0 0, 0 0, ${size / 2}px -${size / 2}px, ${size / 2}px -${size / 2}px;`;

    case 'waves':
      return `background-color: ${color1};
background-image:
  radial-gradient(circle at 0% 50%, transparent ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size / 2 + 2}px, transparent ${size / 2 + 2}px),
  radial-gradient(circle at 100% 50%, transparent ${size / 2}px, ${color2} ${size / 2}px, ${color2} ${size / 2 + 2}px, transparent ${size / 2 + 2}px);
background-size: ${size}px ${size}px;`;

    default:
      return '';
  }
}

export function generateSVG(config: PatternConfig): string {
  const { type, size, color1, color2 } = config;
  const s = size;

  switch (type) {
    case 'stripes':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s * 2}" height="${s * 2}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <rect x="0" y="0" width="${s}" height="${s * 2}" fill="${color2}"/>
</svg>`;

    case 'dots':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <circle cx="${s / 2}" cy="${s / 2}" r="${s / 4}" fill="${color2}"/>
</svg>`;

    case 'checkers':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s * 2}" height="${s * 2}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <rect x="0" y="0" width="${s}" height="${s}" fill="${color2}"/>
  <rect x="${s}" y="${s}" width="${s}" height="${s}" fill="${color2}"/>
</svg>`;

    case 'diagonal':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <line x1="0" y1="0" x2="${s}" y2="${s}" stroke="${color2}" stroke-width="2"/>
  <line x1="${s}" y1="0" x2="0" y2="${s}" stroke="${color2}" stroke-width="2"/>
</svg>`;

    case 'zigzag':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <polyline points="0,${s} ${s / 2},0 ${s},${s}" fill="none" stroke="${color2}" stroke-width="2"/>
</svg>`;

    case 'waves':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
  <rect width="100%" height="100%" fill="${color1}"/>
  <path d="M0,${s / 2} Q${s / 4},0 ${s / 2},${s / 2} T${s},${s / 2}" fill="none" stroke="${color2}" stroke-width="2"/>
</svg>`;

    default:
      return '';
  }
}
