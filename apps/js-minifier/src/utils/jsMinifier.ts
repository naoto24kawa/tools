export interface JsMinifyOptions {
  removeComments: boolean;
  removeWhitespace: boolean;
  removeConsoleLog: boolean;
}

export const DEFAULT_OPTIONS: JsMinifyOptions = {
  removeComments: true,
  removeWhitespace: true,
  removeConsoleLog: false,
};

export function minifyJs(code: string, options: JsMinifyOptions = DEFAULT_OPTIONS): string {
  let result = code;

  if (options.removeComments) {
    // Remove single-line comments (but not URLs with //)
    result = result.replace(/(?<![:"'])\/\/.*$/gm, '');
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  if (options.removeConsoleLog) {
    result = result.replace(/console\.(log|debug|info|warn)\([^)]*\);?/g, '');
  }

  if (options.removeWhitespace) {
    result = result
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}()[\];,=+\-*/<>!&|?:])\s*/g, '$1')
      .replace(/\s*\n\s*/g, '');
  }

  return result.trim();
}

export function getStats(original: string, minified: string) {
  const origSize = new TextEncoder().encode(original).length;
  const minSize = new TextEncoder().encode(minified).length;
  return {
    original: origSize,
    minified: minSize,
    saved: origSize - minSize,
    percent: origSize > 0 ? Math.round(((origSize - minSize) / origSize) * 100) : 0,
  };
}
