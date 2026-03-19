/**
 * Parse a hex color string to RGB values.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, '');
  const fullHex =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate the relative luminance of a color per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate the contrast ratio between two colors.
 * Returns a value between 1 and 21.
 */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

/**
 * Check whether a contrast ratio meets WCAG 2.1 requirements.
 *
 * - AA normal text: >= 4.5
 * - AA large text: >= 3
 * - AAA normal text: >= 7
 * - AAA large text: >= 4.5
 */
export function meetsWCAG(
  ratio: number,
  level: WCAGLevel,
  textSize: TextSize
): boolean {
  if (level === 'AA') {
    return textSize === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
  // AAA
  return textSize === 'large' ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Validate hex color string.
 */
export function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

/**
 * Convert RGB to hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Suggest a foreground color adjustment to meet a target ratio against a background.
 * Darkens the foreground first, then tries lightening.
 */
export function suggestPassingColor(
  fgHex: string,
  bgHex: string,
  targetRatio: number = 4.5,
): string | null {
  const fg = hexToRgb(fgHex);

  // Try darkening
  for (let factor = 1; factor >= 0; factor -= 0.01) {
    const candidate = rgbToHex(
      Math.round(fg.r * factor),
      Math.round(fg.g * factor),
      Math.round(fg.b * factor),
    );
    if (contrastRatio(candidate, bgHex) >= targetRatio) return candidate;
  }

  // Try lightening
  for (let factor = 1; factor <= 3; factor += 0.01) {
    const candidate = rgbToHex(
      Math.min(255, Math.round(fg.r * factor)),
      Math.min(255, Math.round(fg.g * factor)),
      Math.min(255, Math.round(fg.b * factor)),
    );
    if (contrastRatio(candidate, bgHex) >= targetRatio) return candidate;
  }

  // Fallback: black or white
  const blackRatio = contrastRatio('#000000', bgHex);
  const whiteRatio = contrastRatio('#ffffff', bgHex);
  return blackRatio > whiteRatio ? '#000000' : '#ffffff';
}
