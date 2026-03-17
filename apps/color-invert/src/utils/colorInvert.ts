export function invertColor(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return hex;
  const r = 255 - Number.parseInt(cleaned.slice(0, 2), 16);
  const g = 255 - Number.parseInt(cleaned.slice(2, 4), 16);
  const b = 255 - Number.parseInt(cleaned.slice(4, 6), 16);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function complementaryColor(hex: string): string {
  return invertColor(hex);
}
