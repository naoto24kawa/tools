export interface RatioDef {
  id: string;
  label: string;
  ratio: number;
  description: string;
}

export const RATIOS: RatioDef[] = [
  {
    id: 'golden',
    label: '黄金比 (φ)',
    ratio: 1.6180339887498948,
    description: '1 : 1.618 — 自然界や芸術に現れる美の比率',
  },
  {
    id: 'silver',
    label: '白銀比 (√2)',
    ratio: Math.SQRT2,
    description: '1 : 1.414 — A4用紙などに使われる比率',
  },
  {
    id: 'bronze',
    label: '青銅比',
    ratio: 3.302775637731995,
    description: '1 : 3.303',
  },
  {
    id: 'third',
    label: '三分割',
    ratio: 3,
    description: '1 : 0.333 — 写真の構図で使われる比率',
  },
  {
    id: 'sixteen9',
    label: '16:9',
    ratio: 16 / 9,
    description: 'ワイドスクリーン標準比率',
  },
  {
    id: 'four3',
    label: '4:3',
    ratio: 4 / 3,
    description: '従来のモニター・TV比率',
  },
  {
    id: 'three2',
    label: '3:2',
    ratio: 3 / 2,
    description: '一眼レフカメラの標準比率',
  },
];

/**
 * 入力値と側面指定から比率に基づくもう一方の辺を算出する。
 * side='width' の場合: height = width / ratio
 * side='height' の場合: width = height * ratio
 */
export function calcRatio(input: number, side: 'width' | 'height', ratio: number): number {
  if (input < 0) throw new Error('Input must be non-negative');
  if (ratio <= 0) throw new Error('Ratio must be positive');
  if (input === 0) return 0;
  return side === 'width' ? input / ratio : input * ratio;
}
