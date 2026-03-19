export interface FontInfo {
  name: string;
  category: 'system' | 'google';
  fallback: string;
}

export const SYSTEM_FONTS: FontInfo[] = [
  { name: 'Arial', category: 'system', fallback: 'sans-serif' },
  { name: 'Helvetica', category: 'system', fallback: 'sans-serif' },
  { name: 'Verdana', category: 'system', fallback: 'sans-serif' },
  { name: 'Tahoma', category: 'system', fallback: 'sans-serif' },
  { name: 'Trebuchet MS', category: 'system', fallback: 'sans-serif' },
  { name: 'Georgia', category: 'system', fallback: 'serif' },
  { name: 'Times New Roman', category: 'system', fallback: 'serif' },
  { name: 'Palatino Linotype', category: 'system', fallback: 'serif' },
  { name: 'Courier New', category: 'system', fallback: 'monospace' },
  { name: 'Lucida Console', category: 'system', fallback: 'monospace' },
  { name: 'Impact', category: 'system', fallback: 'sans-serif' },
  { name: 'Comic Sans MS', category: 'system', fallback: 'cursive' },
  { name: 'system-ui', category: 'system', fallback: 'sans-serif' },
  { name: '-apple-system', category: 'system', fallback: 'sans-serif' },
  { name: 'Segoe UI', category: 'system', fallback: 'sans-serif' },
];

export const GOOGLE_FONTS: FontInfo[] = [
  { name: 'Inter', category: 'google', fallback: 'sans-serif' },
  { name: 'Roboto', category: 'google', fallback: 'sans-serif' },
  { name: 'Open Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'Lato', category: 'google', fallback: 'sans-serif' },
  { name: 'Montserrat', category: 'google', fallback: 'sans-serif' },
  { name: 'Poppins', category: 'google', fallback: 'sans-serif' },
  { name: 'Roboto Condensed', category: 'google', fallback: 'sans-serif' },
  { name: 'Source Sans 3', category: 'google', fallback: 'sans-serif' },
  { name: 'Oswald', category: 'google', fallback: 'sans-serif' },
  { name: 'Raleway', category: 'google', fallback: 'sans-serif' },
  { name: 'Nunito', category: 'google', fallback: 'sans-serif' },
  { name: 'Nunito Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'Ubuntu', category: 'google', fallback: 'sans-serif' },
  { name: 'Rubik', category: 'google', fallback: 'sans-serif' },
  { name: 'Playfair Display', category: 'google', fallback: 'serif' },
  { name: 'Merriweather', category: 'google', fallback: 'serif' },
  { name: 'PT Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'PT Serif', category: 'google', fallback: 'serif' },
  { name: 'Noto Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'Noto Serif', category: 'google', fallback: 'serif' },
  { name: 'Roboto Mono', category: 'google', fallback: 'monospace' },
  { name: 'Source Code Pro', category: 'google', fallback: 'monospace' },
  { name: 'Fira Code', category: 'google', fallback: 'monospace' },
  { name: 'JetBrains Mono', category: 'google', fallback: 'monospace' },
  { name: 'DM Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'Work Sans', category: 'google', fallback: 'sans-serif' },
  { name: 'Quicksand', category: 'google', fallback: 'sans-serif' },
  { name: 'Barlow', category: 'google', fallback: 'sans-serif' },
  { name: 'Mulish', category: 'google', fallback: 'sans-serif' },
  { name: 'Cabin', category: 'google', fallback: 'sans-serif' },
  { name: 'Karla', category: 'google', fallback: 'sans-serif' },
  { name: 'Libre Baskerville', category: 'google', fallback: 'serif' },
  { name: 'Inconsolata', category: 'google', fallback: 'monospace' },
  { name: 'Space Grotesk', category: 'google', fallback: 'sans-serif' },
  { name: 'Space Mono', category: 'google', fallback: 'monospace' },
  { name: 'Manrope', category: 'google', fallback: 'sans-serif' },
  { name: 'Archivo', category: 'google', fallback: 'sans-serif' },
  { name: 'Bitter', category: 'google', fallback: 'serif' },
  { name: 'Crimson Text', category: 'google', fallback: 'serif' },
  { name: 'EB Garamond', category: 'google', fallback: 'serif' },
];

export const ALL_FONTS: FontInfo[] = [...SYSTEM_FONTS, ...GOOGLE_FONTS];

export const FONT_WEIGHTS = [
  { label: 'Thin', value: 100 },
  { label: 'Extra Light', value: 200 },
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semi Bold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Extra Bold', value: 800 },
  { label: 'Black', value: 900 },
];

export function getGoogleFontUrl(fontName: string, weights?: number[]): string {
  const encodedName = fontName.replace(/ /g, '+');
  const weightStr = weights && weights.length > 0
    ? `:wght@${weights.join(';')}`
    : '';
  return `https://fonts.googleapis.com/css2?family=${encodedName}${weightStr}&display=swap`;
}

export function getGoogleFontImportCss(fontName: string): string {
  const url = getGoogleFontUrl(fontName, [100, 200, 300, 400, 500, 600, 700, 800, 900]);
  return `@import url('${url}');`;
}

export function getGoogleFontLinkTag(fontName: string): string {
  const url = getGoogleFontUrl(fontName, [100, 200, 300, 400, 500, 600, 700, 800, 900]);
  return `<link href="${url}" rel="stylesheet">`;
}

export function getFontFamilyCss(font: FontInfo): string {
  const needsQuotes = font.name.includes(' ');
  const name = needsQuotes ? `'${font.name}'` : font.name;
  return `font-family: ${name}, ${font.fallback};`;
}
