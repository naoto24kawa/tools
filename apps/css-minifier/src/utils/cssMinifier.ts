export interface CssMinifyOptions {
  removeComments: boolean;
  removeWhitespace: boolean;
  shortenColors: boolean;
  removeLastSemicolon: boolean;
}

export const DEFAULT_OPTIONS: CssMinifyOptions = {
  removeComments: true,
  removeWhitespace: true,
  shortenColors: true,
  removeLastSemicolon: true,
};

export function minifyCss(css: string, options: CssMinifyOptions = DEFAULT_OPTIONS): string {
  let result = css;
  if (options.removeComments) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  if (options.removeWhitespace) {
    result = result
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',');
  }
  if (options.shortenColors) {
    result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
  }
  if (options.removeLastSemicolon) {
    result = result.replace(/;}/g, '}');
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
