export interface MinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeEmptyAttributes: boolean;
  removeOptionalTags: boolean;
}

export const DEFAULT_OPTIONS: MinifyOptions = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: true,
  removeOptionalTags: false,
};

export function minifyHtml(html: string, options: MinifyOptions = DEFAULT_OPTIONS): string {
  let result = html;
  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }
  if (options.collapseWhitespace) {
    result = result.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
  }
  if (options.removeEmptyAttributes) {
    result = result.replace(/\s+(class|id|style)=""/gi, '');
  }
  return result.trim();
}

export function getStats(
  original: string,
  minified: string
): { original: number; minified: number; saved: number; percent: number } {
  const origSize = new TextEncoder().encode(original).length;
  const minSize = new TextEncoder().encode(minified).length;
  return {
    original: origSize,
    minified: minSize,
    saved: origSize - minSize,
    percent: origSize > 0 ? Math.round(((origSize - minSize) / origSize) * 100) : 0,
  };
}
