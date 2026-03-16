export interface PrefixSuffixOptions {
  prefix: string;
  suffix: string;
  skipEmpty: boolean;
}

export function addPrefixSuffix(input: string, options: PrefixSuffixOptions): string {
  const { prefix, suffix, skipEmpty } = options;
  return input
    .split('\n')
    .map((line) => {
      if (skipEmpty && line.trim() === '') {
        return line;
      }
      return `${prefix}${line}${suffix}`;
    })
    .join('\n');
}
