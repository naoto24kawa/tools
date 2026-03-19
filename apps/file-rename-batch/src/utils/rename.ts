export type RuleType = 'prefix' | 'suffix' | 'replace' | 'numbering';

export interface RenameRule {
  type: RuleType;
  value: string;
  replaceFrom?: string;
  startNumber?: number;
}

/**
 * Split a filename into base name and extension.
 */
export function splitFilename(name: string): { base: string; ext: string } {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex > 0) {
    return { base: name.substring(0, dotIndex), ext: name.substring(dotIndex) };
  }
  return { base: name, ext: '' };
}

/**
 * Apply a rename rule to a single filename.
 */
export function applyRename(
  name: string,
  index: number,
  rule: RuleType,
  ruleValue: string,
  replaceFrom: string,
  startNumber: number,
): string {
  const { base, ext } = splitFilename(name);

  switch (rule) {
    case 'prefix':
      return `${ruleValue}${base}${ext}`;
    case 'suffix':
      return `${base}${ruleValue}${ext}`;
    case 'replace':
      return `${base.replaceAll(replaceFrom, ruleValue)}${ext}`;
    case 'numbering': {
      const padLength = Math.max(ruleValue.length || 3, 1);
      const num = (startNumber + index).toString().padStart(padLength, '0');
      return `${ruleValue ? ruleValue : ''}${num}${ext}`;
    }
    default:
      return name;
  }
}

/**
 * Apply a rename rule to a batch of filenames.
 */
export function applyBatchRename(
  names: string[],
  rule: RuleType,
  ruleValue: string,
  replaceFrom: string = '',
  startNumber: number = 1,
): { original: string; renamed: string }[] {
  return names.map((name, index) => ({
    original: name,
    renamed: applyRename(name, index, rule, ruleValue, replaceFrom, startNumber),
  }));
}
