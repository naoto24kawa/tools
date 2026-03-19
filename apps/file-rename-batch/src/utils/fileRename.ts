export interface RenameRule {
  type: 'prefix' | 'suffix' | 'replace' | 'numbering' | 'date-prepend';
  prefix?: string;
  suffix?: string;
  find?: string;
  replaceWith?: string;
  startNumber?: number;
  padding?: number;
  dateFormat?: string;
}

export interface RenamePreview {
  original: string;
  renamed: string;
}

/**
 * Apply rename rules to a list of file names.
 */
export function applyRules(fileNames: string[], rules: RenameRule[]): RenamePreview[] {
  return fileNames.map((name, index) => {
    let renamed = name;
    for (const rule of rules) {
      renamed = applyRule(renamed, rule, index);
    }
    return { original: name, renamed };
  });
}

function applyRule(name: string, rule: RenameRule, index: number): string {
  const ext = getExtension(name);
  const base = getBaseName(name);

  switch (rule.type) {
    case 'prefix':
      return `${rule.prefix || ''}${name}`;

    case 'suffix':
      return `${base}${rule.suffix || ''}${ext ? '.' + ext : ''}`;

    case 'replace': {
      if (!rule.find) return name;
      const regex = new RegExp(escapeRegExp(rule.find), 'g');
      return name.replace(regex, rule.replaceWith || '');
    }

    case 'numbering': {
      const num = (rule.startNumber || 1) + index;
      const padded = num.toString().padStart(rule.padding || 3, '0');
      return `${padded}_${name}`;
    }

    case 'date-prepend': {
      const now = new Date();
      const dateStr = formatDate(now, rule.dateFormat || 'YYYY-MM-DD');
      return `${dateStr}_${name}`;
    }

    default:
      return name;
  }
}

/**
 * Get the file extension.
 */
export function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot < 1) return '';
  return filename.slice(lastDot + 1);
}

/**
 * Get the file name without extension.
 */
export function getBaseName(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot < 1) return filename;
  return filename.slice(0, lastDot);
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatDate(date: Date, format: string): string {
  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return format
    .replace('YYYY', y)
    .replace('MM', m)
    .replace('DD', d);
}
