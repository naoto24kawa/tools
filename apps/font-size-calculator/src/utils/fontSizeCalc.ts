export type Unit = 'px' | 'rem' | 'em' | 'pt';

export interface ConversionResult {
  px: number;
  rem: number;
  em: number;
  pt: number;
}

/**
 * Convert a font size value to all supported units.
 */
export function convert(value: number, fromUnit: Unit, basePx: number = 16): ConversionResult {
  let px: number;

  switch (fromUnit) {
    case 'px':
      px = value;
      break;
    case 'rem':
      px = value * basePx;
      break;
    case 'em':
      px = value * basePx;
      break;
    case 'pt':
      px = value * (96 / 72);
      break;
    default:
      px = value;
  }

  return {
    px: Math.round(px * 10000) / 10000,
    rem: Math.round((px / basePx) * 10000) / 10000,
    em: Math.round((px / basePx) * 10000) / 10000,
    pt: Math.round((px * 72 / 96) * 10000) / 10000,
  };
}

/**
 * Check WCAG minimum font size recommendation.
 * AA recommends at least 12px for body text.
 */
export function checkWcagMinSize(px: number): { passes: boolean; message: string } {
  if (px >= 16) {
    return { passes: true, message: 'Meets WCAG recommended body text size (16px+)' };
  }
  if (px >= 12) {
    return { passes: true, message: 'Meets minimum readable size (12px+), but 16px is recommended for body' };
  }
  return { passes: false, message: 'Below minimum readable size (12px). May cause accessibility issues.' };
}

/**
 * Generate a modular scale based on a ratio.
 * Returns an array of font sizes in px.
 */
export function modularScale(
  basePx: number,
  ratio: number,
  steps: number = 6,
): { step: number; px: number; rem: number }[] {
  const result: { step: number; px: number; rem: number }[] = [];
  for (let i = -2; i <= steps; i++) {
    const px = basePx * Math.pow(ratio, i);
    result.push({
      step: i,
      px: Math.round(px * 100) / 100,
      rem: Math.round((px / basePx) * 10000) / 10000,
    });
  }
  return result;
}

export const COMMON_RATIOS = [
  { name: 'Minor Second', value: 1.067 },
  { name: 'Major Second', value: 1.125 },
  { name: 'Minor Third', value: 1.2 },
  { name: 'Major Third', value: 1.25 },
  { name: 'Perfect Fourth', value: 1.333 },
  { name: 'Augmented Fourth', value: 1.414 },
  { name: 'Perfect Fifth', value: 1.5 },
  { name: 'Golden Ratio', value: 1.618 },
];

/**
 * Generate a conversion table for common px values.
 */
export function conversionTable(basePx: number = 16): ConversionResult[] {
  const commonPx = [8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96];
  return commonPx.map((px) => convert(px, 'px', basePx));
}
