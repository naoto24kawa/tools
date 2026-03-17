export interface CsvToSqlOptions {
  tableName: string;
  delimiter: string;
  quoteStrings: boolean;
}

export const DEFAULT_OPTIONS: CsvToSqlOptions = {
  tableName: 'table_name',
  delimiter: ',',
  quoteStrings: true,
};

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function escapeSQL(value: string): string {
  return value.replace(/'/g, "''");
}

function formatValue(value: string, quoteStrings: boolean): string {
  if (value === '' || value.toLowerCase() === 'null') return 'NULL';
  const num = Number(value);
  if (!Number.isNaN(num) && value.trim() !== '') return value;
  if (!quoteStrings) return value;
  return `'${escapeSQL(value)}'`;
}

export function convertCsvToSql(csv: string, options: CsvToSqlOptions): string {
  const { tableName, delimiter, quoteStrings } = options;
  const lines = csv.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return '';

  const headers = parseCSVLine(lines[0], delimiter);
  const columnsStr = headers.map((h) => `\`${h}\``).join(', ');

  const inserts = lines.slice(1).map((line) => {
    const values = parseCSVLine(line, delimiter);
    const valuesStr = values.map((v) => formatValue(v, quoteStrings)).join(', ');
    return `INSERT INTO \`${tableName}\` (${columnsStr}) VALUES (${valuesStr});`;
  });

  return inserts.join('\n');
}
