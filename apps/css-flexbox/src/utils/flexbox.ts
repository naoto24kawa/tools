export interface FlexConfig {
  direction: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  gap: number;
  itemCount: number;
}

export const DEFAULT_CONFIG: FlexConfig = {
  direction: 'row',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  flexWrap: 'nowrap',
  gap: 8,
  itemCount: 5,
};

export const OPTIONS = {
  direction: ['row', 'row-reverse', 'column', 'column-reverse'],
  justifyContent: [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ],
  alignItems: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
  flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
} as const;

export function generateCSS(config: FlexConfig): string {
  return `display: flex;
flex-direction: ${config.direction};
justify-content: ${config.justifyContent};
align-items: ${config.alignItems};
flex-wrap: ${config.flexWrap};
gap: ${config.gap}px;`;
}
