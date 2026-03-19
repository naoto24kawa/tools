export interface CsvParseOptions {
  hasHeader: boolean;
  delimiter: string;
  quoteChar: string;
  prettyPrint: boolean;
}

export const defaultOptions: CsvParseOptions = {
  hasHeader: true,
  delimiter: ',',
  quoteChar: '"',
  prettyPrint: true,
};

function parseCsvLine(line: string, delimiter: string, quoteChar: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (inQuotes) {
      if (char === quoteChar) {
        if (i + 1 < line.length && line[i + 1] === quoteChar) {
          current += quoteChar;
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        current += char;
        i++;
      }
    } else {
      if (char === quoteChar) {
        inQuotes = true;
        i++;
      } else if (char === delimiter) {
        fields.push(current);
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
  }

  fields.push(current);
  return fields;
}

export function parse(csv: string, options: CsvParseOptions = defaultOptions): string {
  if (!csv.trim()) {
    throw new Error('Input is empty');
  }

  const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== '');

  if (lines.length === 0) {
    throw new Error('No data found');
  }

  const rows = lines.map((line) => parseCsvLine(line, options.delimiter, options.quoteChar));

  let result: unknown;

  if (options.hasHeader && rows.length > 1) {
    const headers = rows[0];
    const dataRows = rows.slice(1);
    result = dataRows.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = index < row.length ? row[index] : '';
      });
      return obj;
    });
  } else if (options.hasHeader && rows.length === 1) {
    result = [];
  } else {
    result = rows;
  }

  return JSON.stringify(result, null, options.prettyPrint ? 2 : undefined);
}
