export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PaletteColor {
  hex: string;
  rgb: RGB;
  hsl: HSL;
}

export type PaletteType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic';

export function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace(/^#/, '');
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function createColor(hsl: HSL): PaletteColor {
  const normalized: HSL = {
    h: normalizeHue(hsl.h),
    s: Math.max(0, Math.min(100, hsl.s)),
    l: Math.max(0, Math.min(100, hsl.l)),
  };
  const rgb = hslToRgb(normalized);
  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: normalized,
  };
}

export function generatePalette(baseHex: string, type: PaletteType): PaletteColor[] {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb);
  const base = createColor(hsl);

  switch (type) {
    case 'complementary':
      return [base, createColor({ ...hsl, h: hsl.h + 180 })];

    case 'analogous':
      return [
        createColor({ ...hsl, h: hsl.h - 30 }),
        base,
        createColor({ ...hsl, h: hsl.h + 30 }),
      ];

    case 'triadic':
      return [
        base,
        createColor({ ...hsl, h: hsl.h + 120 }),
        createColor({ ...hsl, h: hsl.h + 240 }),
      ];

    case 'split-complementary':
      return [
        base,
        createColor({ ...hsl, h: hsl.h + 150 }),
        createColor({ ...hsl, h: hsl.h + 210 }),
      ];

    case 'tetradic':
      return [
        base,
        createColor({ ...hsl, h: hsl.h + 90 }),
        createColor({ ...hsl, h: hsl.h + 180 }),
        createColor({ ...hsl, h: hsl.h + 270 }),
      ];

    default:
      return [base];
  }
}

export function exportAsCssVariables(
  colors: PaletteColor[],
  prefix: string = 'palette'
): string {
  const lines = colors.map(
    (c, i) => `  --${prefix}-${i + 1}: ${c.hex};`
  );
  return `:root {\n${lines.join('\n')}\n}`;
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}
