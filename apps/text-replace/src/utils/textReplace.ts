export interface ReplaceOptions {
  searchText: string;
  replaceText: string;
  useRegex: boolean;
  caseSensitive: boolean;
  global: boolean;
}

export interface ReplaceResult {
  text: string;
  matchCount: number;
}

export function replaceText(input: string, options: ReplaceOptions): ReplaceResult {
  const { searchText, replaceText: replacement, useRegex, caseSensitive, global } = options;

  if (!searchText) {
    return { text: input, matchCount: 0 };
  }

  const flags = `${global ? 'g' : ''}${caseSensitive ? '' : 'i'}`;

  let regex: RegExp;
  if (useRegex) {
    regex = new RegExp(searchText, flags);
  } else {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    regex = new RegExp(escaped, flags);
  }

  const matches = input.match(regex);
  const matchCount = matches ? matches.length : 0;
  const text = matchCount > 0 ? input.replace(regex, replacement) : input;

  return { text, matchCount };
}
