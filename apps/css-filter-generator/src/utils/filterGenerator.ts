export interface FilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

export const DEFAULT_FILTER_VALUES: FilterValues = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
};

export interface FilterConfig {
  key: keyof FilterValues;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

export const FILTER_CONFIGS: FilterConfig[] = [
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.1, unit: 'px', defaultValue: 0 },
  { key: 'brightness', label: 'Brightness', min: 0, max: 300, step: 1, unit: '%', defaultValue: 100 },
  { key: 'contrast', label: 'Contrast', min: 0, max: 300, step: 1, unit: '%', defaultValue: 100 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },
  { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, step: 1, unit: 'deg', defaultValue: 0 },
  { key: 'invert', label: 'Invert', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 1, unit: '%', defaultValue: 100 },
  { key: 'saturate', label: 'Saturate', min: 0, max: 300, step: 1, unit: '%', defaultValue: 100 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 1, unit: '%', defaultValue: 0 },
];

export function generateFilterCss(values: FilterValues): string {
  const filters: string[] = [];

  if (values.blur !== 0) filters.push(`blur(${values.blur}px)`);
  if (values.brightness !== 100) filters.push(`brightness(${values.brightness}%)`);
  if (values.contrast !== 100) filters.push(`contrast(${values.contrast}%)`);
  if (values.grayscale !== 0) filters.push(`grayscale(${values.grayscale}%)`);
  if (values.hueRotate !== 0) filters.push(`hue-rotate(${values.hueRotate}deg)`);
  if (values.invert !== 0) filters.push(`invert(${values.invert}%)`);
  if (values.opacity !== 100) filters.push(`opacity(${values.opacity}%)`);
  if (values.saturate !== 100) filters.push(`saturate(${values.saturate}%)`);
  if (values.sepia !== 0) filters.push(`sepia(${values.sepia}%)`);

  if (filters.length === 0) return 'filter: none;';

  return `filter: ${filters.join(' ')};`;
}

export function generateFilterStyleValue(values: FilterValues): string {
  const filters: string[] = [];

  if (values.blur !== 0) filters.push(`blur(${values.blur}px)`);
  if (values.brightness !== 100) filters.push(`brightness(${values.brightness}%)`);
  if (values.contrast !== 100) filters.push(`contrast(${values.contrast}%)`);
  if (values.grayscale !== 0) filters.push(`grayscale(${values.grayscale}%)`);
  if (values.hueRotate !== 0) filters.push(`hue-rotate(${values.hueRotate}deg)`);
  if (values.invert !== 0) filters.push(`invert(${values.invert}%)`);
  if (values.opacity !== 100) filters.push(`opacity(${values.opacity}%)`);
  if (values.saturate !== 100) filters.push(`saturate(${values.saturate}%)`);
  if (values.sepia !== 0) filters.push(`sepia(${values.sepia}%)`);

  if (filters.length === 0) return 'none';

  return filters.join(' ');
}

export function isDefault(values: FilterValues): boolean {
  return (
    values.blur === 0 &&
    values.brightness === 100 &&
    values.contrast === 100 &&
    values.grayscale === 0 &&
    values.hueRotate === 0 &&
    values.invert === 0 &&
    values.opacity === 100 &&
    values.saturate === 100 &&
    values.sepia === 0
  );
}
