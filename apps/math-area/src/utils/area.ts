export const SHAPES = [
  { value: 'circle', label: '円', fields: ['radius'] },
  { value: 'rectangle', label: '長方形', fields: ['width', 'height'] },
  { value: 'triangle', label: '三角形', fields: ['base', 'height'] },
  { value: 'trapezoid', label: '台形', fields: ['topBase', 'bottomBase', 'height'] },
  { value: 'ellipse', label: '楕円', fields: ['semiMajor', 'semiMinor'] },
  { value: 'square', label: '正方形', fields: ['side'] },
] as const;

export type ShapeType = (typeof SHAPES)[number]['value'];

export function calculateArea(shape: ShapeType, params: Record<string, number>): number {
  switch (shape) {
    case 'circle':
      return Math.PI * (params.radius ?? 0) ** 2;
    case 'rectangle':
      return (params.width ?? 0) * (params.height ?? 0);
    case 'triangle':
      return ((params.base ?? 0) * (params.height ?? 0)) / 2;
    case 'trapezoid':
      return (((params.topBase ?? 0) + (params.bottomBase ?? 0)) * (params.height ?? 0)) / 2;
    case 'ellipse':
      return Math.PI * (params.semiMajor ?? 0) * (params.semiMinor ?? 0);
    case 'square':
      return (params.side ?? 0) ** 2;
    default: {
      const _exhaustiveCheck: never = shape;
      throw new Error(`Unknown shape: ${_exhaustiveCheck}`);
    }
  }
}

export const FIELD_LABELS: Record<string, string> = {
  radius: '半径',
  width: '幅',
  height: '高さ',
  base: '底辺',
  topBase: '上底',
  bottomBase: '下底',
  semiMajor: '長半径',
  semiMinor: '短半径',
  side: '一辺',
};
