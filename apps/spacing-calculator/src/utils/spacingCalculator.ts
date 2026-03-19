export interface SpacingValue {
  multiplier: number;
  label: string;
  px: number;
  rem: string;
  em: string;
  tailwindClass: string;
}

export const SCALE_MULTIPLIERS = [
  { multiplier: 0.25, label: '0.25x' },
  { multiplier: 0.5, label: '0.5x' },
  { multiplier: 1, label: '1x' },
  { multiplier: 1.5, label: '1.5x' },
  { multiplier: 2, label: '2x' },
  { multiplier: 3, label: '3x' },
  { multiplier: 4, label: '4x' },
  { multiplier: 5, label: '5x' },
  { multiplier: 6, label: '6x' },
  { multiplier: 8, label: '8x' },
  { multiplier: 10, label: '10x' },
  { multiplier: 12, label: '12x' },
];

const TAILWIND_SPACING_MAP: Record<number, string> = {
  0: '0',
  1: '0.5',
  2: '1',
  4: '1',
  6: '1.5',
  8: '2',
  10: '2.5',
  12: '3',
  14: '3.5',
  16: '4',
  20: '5',
  24: '6',
  28: '7',
  32: '8',
  36: '9',
  40: '10',
  44: '11',
  48: '12',
  56: '14',
  64: '16',
  72: '18',
  80: '20',
  96: '24',
  112: '28',
  128: '32',
  144: '36',
  160: '40',
  176: '44',
  192: '48',
  208: '52',
  224: '56',
  240: '60',
  256: '64',
  288: '72',
  320: '80',
  384: '96',
};

export function pxToRem(px: number, baseFontSize: number): string {
  if (baseFontSize <= 0) return '0rem';
  const rem = px / baseFontSize;
  return `${Number(rem.toFixed(4))}rem`;
}

export function pxToEm(px: number, baseFontSize: number): string {
  if (baseFontSize <= 0) return '0em';
  const em = px / baseFontSize;
  return `${Number(em.toFixed(4))}em`;
}

export function getTailwindClass(px: number): string {
  if (px in TAILWIND_SPACING_MAP) {
    return TAILWIND_SPACING_MAP[px];
  }

  if (px > 0 && px % 4 === 0) {
    return `[${px}px]`;
  }

  return `[${px}px]`;
}

export function calculateSpacingScale(
  baseUnit: number,
  baseFontSize: number
): SpacingValue[] {
  return SCALE_MULTIPLIERS.map(({ multiplier, label }) => {
    const px = Math.round(baseUnit * multiplier * 100) / 100;
    const roundedPx = Math.round(px);
    return {
      multiplier,
      label,
      px: roundedPx,
      rem: pxToRem(roundedPx, baseFontSize),
      em: pxToEm(roundedPx, baseFontSize),
      tailwindClass: getTailwindClass(roundedPx),
    };
  });
}

export function formatSpacingTable(values: SpacingValue[]): string {
  const header = 'Scale | px | rem | em | Tailwind';
  const separator = '------|-----|------|------|--------';
  const rows = values.map(
    (v) => `${v.label} | ${v.px}px | ${v.rem} | ${v.em} | ${v.tailwindClass}`
  );
  return [header, separator, ...rows].join('\n');
}
