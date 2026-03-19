export interface GlobalSettings {
  root: boolean;
  charset: string;
  endOfLine: string;
  insertFinalNewline: boolean;
  trimTrailingWhitespace: boolean;
}

export interface ExtensionSettings {
  pattern: string;
  indentStyle: 'space' | 'tab';
  indentSize: number;
  trimTrailingWhitespace: boolean;
  insertFinalNewline: boolean;
}

export interface EditorConfigData {
  global: GlobalSettings;
  extensions: ExtensionSettings[];
}

export const defaultGlobal: GlobalSettings = {
  root: true,
  charset: 'utf-8',
  endOfLine: 'lf',
  insertFinalNewline: true,
  trimTrailingWhitespace: true,
};

export const defaultExtension: ExtensionSettings = {
  pattern: '*',
  indentStyle: 'space',
  indentSize: 2,
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
};

export const presets: Record<string, EditorConfigData> = {
  default: {
    global: { ...defaultGlobal },
    extensions: [
      { pattern: '*', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: '*.md', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: false, insertFinalNewline: true },
      { pattern: 'Makefile', indentStyle: 'tab', indentSize: 4, trimTrailingWhitespace: true, insertFinalNewline: true },
    ],
  },
  google: {
    global: { ...defaultGlobal, charset: 'utf-8', endOfLine: 'lf' },
    extensions: [
      { pattern: '*', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: '*.py', indentStyle: 'space', indentSize: 4, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: '*.java', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: '*.md', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: false, insertFinalNewline: true },
    ],
  },
  airbnb: {
    global: { ...defaultGlobal, charset: 'utf-8', endOfLine: 'lf' },
    extensions: [
      { pattern: '*', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: '*.md', indentStyle: 'space', indentSize: 2, trimTrailingWhitespace: false, insertFinalNewline: true },
      { pattern: '*.py', indentStyle: 'space', indentSize: 4, trimTrailingWhitespace: true, insertFinalNewline: true },
      { pattern: 'Makefile', indentStyle: 'tab', indentSize: 4, trimTrailingWhitespace: true, insertFinalNewline: true },
    ],
  },
};

export function generateEditorConfig(data: EditorConfigData): string {
  const lines: string[] = [];

  lines.push('# EditorConfig is awesome: https://editorconfig.org');
  lines.push('');

  if (data.global.root) {
    lines.push('root = true');
    lines.push('');
  }

  for (const ext of data.extensions) {
    lines.push(`[${ext.pattern}]`);
    if (data.global.charset) {
      lines.push(`charset = ${data.global.charset}`);
    }
    if (data.global.endOfLine) {
      lines.push(`end_of_line = ${data.global.endOfLine}`);
    }
    lines.push(`indent_style = ${ext.indentStyle}`);
    lines.push(`indent_size = ${ext.indentSize}`);
    if (ext.indentStyle === 'tab') {
      lines.push(`tab_width = ${ext.indentSize}`);
    }
    lines.push(`trim_trailing_whitespace = ${ext.trimTrailingWhitespace}`);
    lines.push(`insert_final_newline = ${ext.insertFinalNewline}`);
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}
