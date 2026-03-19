export type OutputFormat = 'html' | 'markdown' | 'csv';
export type Delimiter = ',' | '\t' | '|' | ';' | ' ';

export function detectDelimiter(text: string): Delimiter {
  const firstLine = text.split('\n')[0] || '';
  const counts: [Delimiter, number][] = [
    ['\t', (firstLine.match(/\t/g) || []).length],
    [',', (firstLine.match(/,/g) || []).length],
    ['|', (firstLine.match(/\|/g) || []).length],
    [';', (firstLine.match(/;/g) || []).length],
    [' ', (firstLine.match(/ {2,}/g) || []).length],
  ];
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 0 ? counts[0][0] : ',';
}

export function parseList(text: string, delimiter: Delimiter): string[][] {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  return lines.map((line) => {
    if (delimiter === ' ') {
      return line.split(/ {2,}/).map((cell) => cell.trim());
    }
    return line.split(delimiter).map((cell) => cell.trim());
  });
}

export function toHTML(data: string[][], hasHeader: boolean): string {
  if (data.length === 0) return '';

  let html = '<table>\n';

  if (hasHeader && data.length > 0) {
    html += '  <thead>\n    <tr>\n';
    for (const cell of data[0]) {
      html += `      <th>${escapeHtml(cell)}</th>\n`;
    }
    html += '    </tr>\n  </thead>\n';
  }

  const startIndex = hasHeader ? 1 : 0;
  html += '  <tbody>\n';
  for (let i = startIndex; i < data.length; i++) {
    html += '    <tr>\n';
    for (const cell of data[i]) {
      html += `      <td>${escapeHtml(cell)}</td>\n`;
    }
    html += '    </tr>\n';
  }
  html += '  </tbody>\n</table>';

  return html;
}

export function toMarkdown(data: string[][], hasHeader: boolean): string {
  if (data.length === 0) return '';

  const colCount = Math.max(...data.map((row) => row.length));

  // Normalize rows to same column count
  const normalized = data.map((row) => {
    const padded = [...row];
    while (padded.length < colCount) padded.push('');
    return padded;
  });

  // Column widths
  const widths = Array.from({ length: colCount }, (_, col) =>
    Math.max(3, ...normalized.map((row) => row[col].length))
  );

  const lines: string[] = [];

  if (hasHeader) {
    const header = normalized[0].map((cell, i) => cell.padEnd(widths[i])).join(' | ');
    lines.push(`| ${header} |`);
    const sep = widths.map((w) => '-'.repeat(w)).join(' | ');
    lines.push(`| ${sep} |`);
    for (let r = 1; r < normalized.length; r++) {
      const row = normalized[r].map((cell, i) => cell.padEnd(widths[i])).join(' | ');
      lines.push(`| ${row} |`);
    }
  } else {
    // Create auto header
    const autoHeader = Array.from({ length: colCount }, (_, i) => `Col ${i + 1}`);
    const allRows = [autoHeader, ...normalized];
    const allWidths = Array.from({ length: colCount }, (_, col) =>
      Math.max(3, ...allRows.map((row) => row[col].length))
    );

    const header = allRows[0].map((cell, i) => cell.padEnd(allWidths[i])).join(' | ');
    lines.push(`| ${header} |`);
    const sep = allWidths.map((w) => '-'.repeat(w)).join(' | ');
    lines.push(`| ${sep} |`);
    for (let r = 1; r < allRows.length; r++) {
      const row = allRows[r].map((cell, i) => cell.padEnd(allWidths[i])).join(' | ');
      lines.push(`| ${row} |`);
    }
  }

  return lines.join('\n');
}

export function toCSV(data: string[][]): string {
  return data
    .map((row) =>
      row
        .map((cell) => {
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return '"' + cell.replace(/"/g, '""') + '"';
          }
          return cell;
        })
        .join(',')
    )
    .join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function convert(
  text: string,
  delimiter: Delimiter,
  format: OutputFormat,
  hasHeader: boolean
): string {
  const data = parseList(text, delimiter);
  if (data.length === 0) return '';

  switch (format) {
    case 'html':
      return toHTML(data, hasHeader);
    case 'markdown':
      return toMarkdown(data, hasHeader);
    case 'csv':
      return toCSV(data);
  }
}
