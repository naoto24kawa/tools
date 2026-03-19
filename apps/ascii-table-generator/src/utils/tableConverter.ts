export type Alignment = 'left' | 'center' | 'right';

export interface TableData {
  headers: string[];
  rows: string[][];
  alignments: Alignment[];
}

export function parseMarkdownTable(markdown: string): TableData | null {
  const lines = markdown
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return null;

  const parseLine = (line: string): string[] => {
    let trimmed = line;
    if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
    return trimmed.split('|').map((cell) => cell.trim());
  };

  const headers = parseLine(lines[0]);
  const separatorLine = lines[1];

  if (!/^[\s|:\-]+$/.test(separatorLine)) return null;

  const separatorCells = parseLine(separatorLine);
  const alignments: Alignment[] = separatorCells.map((cell) => {
    const trimmed = cell.trim();
    const startsColon = trimmed.startsWith(':');
    const endsColon = trimmed.endsWith(':');
    if (startsColon && endsColon) return 'center';
    if (endsColon) return 'right';
    return 'left';
  });

  while (alignments.length < headers.length) {
    alignments.push('left');
  }

  const rows: string[][] = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = parseLine(lines[i]);
    while (cells.length < headers.length) {
      cells.push('');
    }
    rows.push(cells.slice(0, headers.length));
  }

  return { headers, rows, alignments };
}

function padCell(text: string, width: number, alignment: Alignment): string {
  const textLen = text.length;
  const padding = Math.max(0, width - textLen);

  switch (alignment) {
    case 'right':
      return ' '.repeat(padding) + text;
    case 'center': {
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
    }
    default:
      return text + ' '.repeat(padding);
  }
}

export function markdownToAscii(markdown: string): string {
  const table = parseMarkdownTable(markdown);
  if (!table) return '';

  return tableDataToAscii(table);
}

export function tableDataToAscii(table: TableData): string {
  const { headers, rows, alignments } = table;

  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    for (const row of rows) {
      if (row[i] && row[i].length > maxLen) {
        maxLen = row[i].length;
      }
    }
    return Math.max(maxLen, 3);
  });

  const separator = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+';

  const formatRow = (cells: string[]): string => {
    const formatted = cells.map((cell, i) => {
      const align = alignments[i] || 'left';
      return ' ' + padCell(cell, colWidths[i], align) + ' ';
    });
    return '|' + formatted.join('|') + '|';
  };

  const lines: string[] = [];
  lines.push(separator);
  lines.push(formatRow(headers));
  lines.push(separator);
  for (const row of rows) {
    lines.push(formatRow(row));
  }
  lines.push(separator);

  return lines.join('\n');
}

export function asciiToMarkdown(ascii: string): string {
  const lines = ascii
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const dataLines = lines.filter((l) => !l.startsWith('+'));

  if (dataLines.length < 1) return '';

  const parseLine = (line: string): string[] => {
    let trimmed = line;
    if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
    if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
    return trimmed.split('|').map((cell) => cell.trim());
  };

  const headers = parseLine(dataLines[0]);
  const rows = dataLines.slice(1).map(parseLine);

  const separator = '| ' + headers.map(() => '---').join(' | ') + ' |';
  const headerLine = '| ' + headers.join(' | ') + ' |';
  const rowLines = rows.map((row) => '| ' + row.join(' | ') + ' |');

  return [headerLine, separator, ...rowLines].join('\n');
}

export function generateTable(
  numRows: number,
  numCols: number,
  data?: string[][],
  headerData?: string[],
  alignments?: Alignment[],
): TableData {
  const headers = headerData
    ? headerData.slice(0, numCols)
    : Array.from({ length: numCols }, (_, i) => `Header ${i + 1}`);

  while (headers.length < numCols) {
    headers.push(`Header ${headers.length + 1}`);
  }

  const aligns: Alignment[] = alignments
    ? alignments.slice(0, numCols)
    : Array.from({ length: numCols }, () => 'left' as Alignment);

  while (aligns.length < numCols) {
    aligns.push('left');
  }

  const rows: string[][] = [];
  for (let r = 0; r < numRows; r++) {
    const row: string[] = [];
    for (let c = 0; c < numCols; c++) {
      row.push(data && data[r] && data[r][c] ? data[r][c] : '');
    }
    rows.push(row);
  }

  return { headers, rows, alignments: aligns };
}
