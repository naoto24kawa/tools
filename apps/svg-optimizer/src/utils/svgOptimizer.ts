export interface OptimizeOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  removeEmptyGroups: boolean;
  collapseGroups: boolean;
  shortenIds: boolean;
  roundNumbers: boolean;
  removeDefaultAttrs: boolean;
}

export interface OptimizeResult {
  optimized: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
}

const DEFAULT_ATTRS: Record<string, Record<string, string>> = {
  svg: {
    xmlns: 'http://www.w3.org/2000/svg',
  },
  path: {
    fill: 'none',
    'fill-rule': 'nonzero',
    'clip-rule': 'nonzero',
    stroke: 'none',
    'stroke-width': '1',
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'miter',
    'stroke-miterlimit': '4',
    'stroke-dasharray': 'none',
    'stroke-dashoffset': '0',
    'stroke-opacity': '1',
    'fill-opacity': '1',
    opacity: '1',
  },
  rect: {
    rx: '0',
    ry: '0',
    x: '0',
    y: '0',
  },
  circle: {
    cx: '0',
    cy: '0',
  },
  ellipse: {
    cx: '0',
    cy: '0',
  },
  line: {
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '0',
  },
};

function removeComments(svg: string): string {
  return svg.replace(/<!--[\s\S]*?-->/g, '');
}

function removeMetadata(svg: string): string {
  return svg
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
    .replace(/<desc[\s\S]*?<\/desc>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '');
}

function removeEmptyGroups(svg: string): string {
  let result = svg;
  let prev = '';
  while (prev !== result) {
    prev = result;
    result = result.replace(/<g[^>]*>\s*<\/g>/g, '');
  }
  return result;
}

function collapseGroups(svg: string): string {
  return svg.replace(/<g>\s*([\s\S]*?)\s*<\/g>/g, '$1');
}

function shortenIds(svg: string): string {
  const idMap = new Map<string, string>();
  let counter = 0;

  const generateId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let id = '';
    let n = counter++;
    do {
      id = chars[n % 26] + id;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return id;
  };

  let result = svg.replace(/\bid="([^"]+)"/g, (_match, id) => {
    const newId = generateId();
    idMap.set(id, newId);
    return `id="${newId}"`;
  });

  idMap.forEach((newId, oldId) => {
    const escapedOldId = oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`#${escapedOldId}\\b`, 'g'), `#${newId}`);
    result = result.replace(
      new RegExp(`url\\(#${escapedOldId}\\)`, 'g'),
      `url(#${newId})`
    );
  });

  return result;
}

function roundNumbers(svg: string): string {
  return svg.replace(/(\d+\.\d{3,})/g, (match) => {
    return parseFloat(match).toFixed(2).replace(/\.?0+$/, '');
  });
}

function removeDefaultAttrs(svg: string): string {
  let result = svg;

  for (const [tag, attrs] of Object.entries(DEFAULT_ATTRS)) {
    for (const [attr, defaultValue] of Object.entries(attrs)) {
      const escapedAttr = attr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedValue = defaultValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (tag === 'svg' || tag === 'path') {
        const regex = new RegExp(
          `(<${tag}\\b[^>]*?)\\s+${escapedAttr}="${escapedValue}"`,
          'g'
        );
        result = result.replace(regex, '$1');
      }
    }
  }

  return result;
}

function cleanWhitespace(svg: string): string {
  return svg
    .replace(/\n\s*\n/g, '\n')
    .replace(/>\s+</g, '>\n<')
    .trim();
}

export function optimize(
  svgInput: string,
  options: OptimizeOptions
): OptimizeResult {
  const originalSize = new Blob([svgInput]).size;

  let result = svgInput;

  if (options.removeComments) {
    result = removeComments(result);
  }

  if (options.removeMetadata) {
    result = removeMetadata(result);
  }

  if (options.removeEmptyGroups) {
    result = removeEmptyGroups(result);
  }

  if (options.collapseGroups) {
    result = collapseGroups(result);
  }

  if (options.shortenIds) {
    result = shortenIds(result);
  }

  if (options.roundNumbers) {
    result = roundNumbers(result);
  }

  if (options.removeDefaultAttrs) {
    result = removeDefaultAttrs(result);
  }

  result = cleanWhitespace(result);

  const optimizedSize = new Blob([result]).size;

  return {
    optimized: result,
    originalSize,
    optimizedSize,
    savings: originalSize - optimizedSize,
    savingsPercent:
      originalSize > 0
        ? Math.round(((originalSize - optimizedSize) / originalSize) * 10000) / 100
        : 0,
  };
}

export const defaultOptions: OptimizeOptions = {
  removeComments: true,
  removeMetadata: true,
  removeEmptyGroups: true,
  collapseGroups: true,
  shortenIds: true,
  roundNumbers: true,
  removeDefaultAttrs: true,
};
