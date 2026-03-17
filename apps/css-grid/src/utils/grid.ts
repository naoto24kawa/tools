export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  columnSizes: string;
  rowSizes: string;
  justifyItems: string;
  alignItems: string;
  itemCount: number;
}

export const DEFAULT_CONFIG: GridConfig = {
  columns: 3,
  rows: 2,
  gap: 8,
  columnSizes: '1fr 1fr 1fr',
  rowSizes: 'auto auto',
  justifyItems: 'stretch',
  alignItems: 'stretch',
  itemCount: 6,
};

export function generateCSS(config: GridConfig): string {
  return `display: grid;
grid-template-columns: ${config.columnSizes};
grid-template-rows: ${config.rowSizes};
gap: ${config.gap}px;
justify-items: ${config.justifyItems};
align-items: ${config.alignItems};`;
}
