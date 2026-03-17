export interface SortOptions {
  order: 'asc' | 'desc';
  numeric: boolean;
  caseSensitive: boolean;
  removeDuplicates: boolean;
  trimLines: boolean;
  removeEmpty: boolean;
}

export const DEFAULT_SORT_OPTIONS: SortOptions = {
  order: 'asc',
  numeric: false,
  caseSensitive: true,
  removeDuplicates: false,
  trimLines: false,
  removeEmpty: false,
};

export function sortText(input: string, options: SortOptions): string {
  let lines = input.split('\n');

  if (options.trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (options.removeEmpty) {
    lines = lines.filter((line) => line.length > 0);
  }

  if (options.removeDuplicates) {
    lines = [...new Set(lines)];
  }

  lines.sort((a, b) => {
    let compareA = a;
    let compareB = b;

    if (!options.caseSensitive) {
      compareA = a.toLowerCase();
      compareB = b.toLowerCase();
    }

    if (options.numeric) {
      const numA = Number.parseFloat(compareA);
      const numB = Number.parseFloat(compareB);
      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return options.order === 'asc' ? numA - numB : numB - numA;
      }
    }

    const result = compareA.localeCompare(compareB);
    return options.order === 'asc' ? result : -result;
  });

  return lines.join('\n');
}
