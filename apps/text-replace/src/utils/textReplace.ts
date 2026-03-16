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
  const { searchText, replaceText, useRegex, caseSensitive, global } = options;

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

  let matchCount = 0;
  const text = input.replace(regex, (_match) => {
    matchCount++;
    return replaceText;
  });

  return { text, matchCount };
}
