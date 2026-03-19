export interface ColumnLayoutOptions {
  columnCount: number;
  columnGap: number;
  columnRuleWidth: number;
  columnRuleStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  columnRuleColor: string;
  fontSize: number;
  lineHeight: number;
}

export const DEFAULT_OPTIONS: ColumnLayoutOptions = {
  columnCount: 2,
  columnGap: 32,
  columnRuleWidth: 1,
  columnRuleStyle: 'solid',
  columnRuleColor: '#e5e7eb',
  fontSize: 16,
  lineHeight: 1.6,
};

/**
 * Generate CSS styles for multi-column layout.
 */
export function getColumnStyles(options: ColumnLayoutOptions): React.CSSProperties {
  return {
    columnCount: options.columnCount,
    columnGap: `${options.columnGap}px`,
    columnRuleWidth: options.columnRuleStyle !== 'none' ? `${options.columnRuleWidth}px` : '0',
    columnRuleStyle: options.columnRuleStyle,
    columnRuleColor: options.columnRuleColor,
    fontSize: `${options.fontSize}px`,
    lineHeight: options.lineHeight,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };
}

/**
 * Validate column count (2-6).
 */
export function clampColumnCount(count: number): number {
  return Math.max(2, Math.min(6, Math.round(count)));
}

/**
 * Validate column gap (0-100px).
 */
export function clampColumnGap(gap: number): number {
  return Math.max(0, Math.min(100, gap));
}
