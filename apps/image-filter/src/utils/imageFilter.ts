export const FILTER_PRESETS = [
  { name: 'None', filter: '' },
  { name: 'Grayscale', filter: 'grayscale(100%)' },
  { name: 'Sepia', filter: 'sepia(100%)' },
  { name: 'Blur', filter: 'blur(3px)' },
  { name: 'Invert', filter: 'invert(100%)' },
  { name: 'Hue Rotate', filter: 'hue-rotate(90deg)' },
  { name: 'Vintage', filter: 'sepia(50%) contrast(90%) brightness(110%)' },
  { name: 'Cool', filter: 'hue-rotate(180deg) saturate(150%)' },
  { name: 'Warm', filter: 'sepia(30%) saturate(140%) brightness(105%)' },
  { name: 'High Contrast', filter: 'contrast(200%)' },
] as const;

export function buildFilter(filters: Record<string, number>): string {
  const parts: string[] = [];
  if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
  if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
  if (filters.grayscale > 0) parts.push(`grayscale(${filters.grayscale}%)`);
  if (filters.sepia > 0) parts.push(`sepia(${filters.sepia}%)`);
  if (filters.blur > 0) parts.push(`blur(${filters.blur}px)`);
  if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.invert > 0) parts.push(`invert(${filters.invert}%)`);
  return parts.join(' ') || 'none';
}

export const DEFAULT_FILTERS: Record<string, number> = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hueRotate: 0,
  invert: 0,
};
