export const CLIP_PRESETS = [
  { name: 'Triangle', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { name: 'Diamond', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  { name: 'Pentagon', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  { name: 'Hexagon', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  {
    name: 'Star',
    value:
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  },
  { name: 'Circle', value: 'circle(50% at 50% 50%)' },
  { name: 'Ellipse', value: 'ellipse(50% 35% at 50% 50%)' },
  { name: 'Inset', value: 'inset(10% 10% 10% 10% round 10px)' },
  {
    name: 'Arrow Right',
    value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  },
  {
    name: 'Cross',
    value:
      'polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)',
  },
] as const;

export function generateCSS(clipPath: string): string {
  return `clip-path: ${clipPath};\n-webkit-clip-path: ${clipPath};`;
}
