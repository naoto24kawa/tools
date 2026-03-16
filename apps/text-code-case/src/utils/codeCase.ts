const CODE_CASE_OPTIONS = [
  { value: 'camel', label: 'camelCase', description: '先頭小文字、単語区切りを大文字に' },
  { value: 'pascal', label: 'PascalCase', description: '各単語の先頭を大文字に' },
  { value: 'snake', label: 'snake_case', description: '全て小文字、単語区切りをアンダースコアに' },
  { value: 'kebab', label: 'kebab-case', description: '全て小文字、単語区切りをハイフンに' },
  {
    value: 'constant',
    label: 'CONSTANT_CASE',
    description: '全て大文字、単語区切りをアンダースコアに',
  },
  { value: 'dot', label: 'dot.case', description: '全て小文字、単語区切りをドットに' },
  { value: 'path', label: 'path/case', description: '全て小文字、単語区切りをスラッシュに' },
  { value: 'train', label: 'Train-Case', description: '各単語の先頭を大文字、ハイフン区切り' },
] as const;

export { CODE_CASE_OPTIONS };

export type CodeCaseType = (typeof CODE_CASE_OPTIONS)[number]['value'];

function splitWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/[_\-./\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((w) => w.length > 0);
}

export function toCamelCase(text: string): string {
  const words = splitWords(text);
  if (words.length === 0) return '';
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');
}

export function toPascalCase(text: string): string {
  const words = splitWords(text);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toSnakeCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join('_');
}

export function toKebabCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join('-');
}

export function toConstantCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toUpperCase())
    .join('_');
}

export function toDotCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join('.');
}

export function toPathCase(text: string): string {
  return splitWords(text)
    .map((w) => w.toLowerCase())
    .join('/');
}

export function toTrainCase(text: string): string {
  return splitWords(text)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('-');
}

export function convertCodeCase(text: string, caseType: CodeCaseType): string {
  switch (caseType) {
    case 'camel':
      return toCamelCase(text);
    case 'pascal':
      return toPascalCase(text);
    case 'snake':
      return toSnakeCase(text);
    case 'kebab':
      return toKebabCase(text);
    case 'constant':
      return toConstantCase(text);
    case 'dot':
      return toDotCase(text);
    case 'path':
      return toPathCase(text);
    case 'train':
      return toTrainCase(text);
    default: {
      const _exhaustiveCheck: never = caseType;
      throw new Error(`Unsupported case type: ${_exhaustiveCheck}`);
    }
  }
}
