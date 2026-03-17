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

// Simplified color blindness simulation matrices
const MATRICES: Record<string, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export const TYPES = [
  { id: 'normal', name: '通常', description: '通常の色覚' },
  { id: 'protanopia', name: '1型 (P型)', description: '赤色覚異常' },
  { id: 'deuteranopia', name: '2型 (D型)', description: '緑色覚異常' },
  { id: 'tritanopia', name: '3型 (T型)', description: '青色覚異常' },
  { id: 'achromatopsia', name: '全色盲', description: '色を識別できない' },
] as const;

export type ColorBlindType = (typeof TYPES)[number]['id'];

export function simulateColorBlind(hex: string, type: ColorBlindType): string {
  if (type === 'normal') return hex;
  const [r, g, b] = hexToRgb(hex);
  const matrix = MATRICES[type];
  if (!matrix) return hex;
  return rgbToHex(
    matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b,
    matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b,
    matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b
  );
}
