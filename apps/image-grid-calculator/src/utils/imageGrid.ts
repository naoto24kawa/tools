export interface GridResult {
  columns: number;
  remainder: number;
  cssGridTemplate: string;
}

export function calcGridColumns(
  containerWidth: number,
  imageWidth: number,
  gap: number,
): GridResult {
  if (containerWidth <= 0) throw new Error('Container width must be positive');
  if (imageWidth <= 0) throw new Error('Image width must be positive');
  if (gap < 0) throw new Error('Gap must be non-negative');

  const columns = Math.max(1, Math.floor((containerWidth + gap) / (imageWidth + gap)));
  const usedWidth = columns * imageWidth + (columns - 1) * gap;
  const remainder = containerWidth - usedWidth;
  const cssGridTemplate = `grid-template-columns: repeat(${columns}, ${imageWidth}px);`;

  return { columns, remainder, cssGridTemplate };
}

export function calcImageWidthFromColumns(
  containerWidth: number,
  columns: number,
  gap: number,
): number {
  if (columns < 1) throw new Error('Columns must be at least 1');
  if (containerWidth <= 0) throw new Error('Container width must be positive');
  if (gap < 0) throw new Error('Gap must be non-negative');

  return (containerWidth - (columns - 1) * gap) / columns;
}
