export type OutputFormat = 'react-jsx' | 'react-tsx' | 'vue-sfc';

export interface ConvertOptions {
  componentName: string;
  addSizeProps: boolean;
  addColorProp: boolean;
}

const SVG_ATTR_MAP: Record<string, string> = {
  'class': 'className',
  'for': 'htmlFor',
  'tabindex': 'tabIndex',
  'clip-path': 'clipPath',
  'clip-rule': 'clipRule',
  'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-style': 'fontStyle',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'marker-end': 'markerEnd',
  'marker-mid': 'markerMid',
  'marker-start': 'markerStart',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-opacity': 'strokeOpacity',
  'stroke-width': 'strokeWidth',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  'baseline-shift': 'baselineShift',
  'color-interpolation': 'colorInterpolation',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'enable-background': 'enableBackground',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  'pointer-events': 'pointerEvents',
  'shape-rendering': 'shapeRendering',
  'image-rendering': 'imageRendering',
  'word-spacing': 'wordSpacing',
  'writing-mode': 'writingMode',
  'xmlns:xlink': 'xmlnsXlink',
  'xml:space': 'xmlSpace',
  'xlink:href': 'xlinkHref',
};

function convertAttributesToReact(svgContent: string): string {
  let result = svgContent;

  for (const [htmlAttr, reactAttr] of Object.entries(SVG_ATTR_MAP)) {
    const regex = new RegExp(`\\b${htmlAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=`, 'g');
    result = result.replace(regex, `${reactAttr}=`);
  }

  return result;
}

function injectSizeProps(svgContent: string): string {
  let result = svgContent;

  result = result.replace(
    /width="[^"]*"/,
    'width={width}'
  );
  result = result.replace(
    /height="[^"]*"/,
    'height={height}'
  );

  if (!result.includes('width={width}')) {
    result = result.replace('<svg', '<svg width={width}');
  }
  if (!result.includes('height={height}')) {
    result = result.replace('<svg', '<svg height={height}');
  }

  return result;
}

function injectColorProp(svgContent: string): string {
  let result = svgContent;

  result = result.replace(/fill="currentColor"/g, 'fill={color}');
  result = result.replace(/stroke="currentColor"/g, 'stroke={color}');

  if (!result.includes('{color}')) {
    result = result.replace('<svg', '<svg fill={color}');
  }

  return result;
}

function injectSizePropsVue(svgContent: string): string {
  let result = svgContent;

  result = result.replace(
    /width="[^"]*"/,
    ':width="width"'
  );
  result = result.replace(
    /height="[^"]*"/,
    ':height="height"'
  );

  if (!result.includes(':width="width"')) {
    result = result.replace('<svg', '<svg :width="width"');
  }
  if (!result.includes(':height="height"')) {
    result = result.replace('<svg', '<svg :height="height"');
  }

  return result;
}

function injectColorPropVue(svgContent: string): string {
  let result = svgContent;

  result = result.replace(/fill="currentColor"/g, ':fill="color"');
  result = result.replace(/stroke="currentColor"/g, ':stroke="color"');

  if (!result.includes(':fill="color"') && !result.includes(':stroke="color"')) {
    result = result.replace('<svg', '<svg :fill="color"');
  }

  return result;
}

function formatSvgForReact(svg: string, options: ConvertOptions): string {
  let content = convertAttributesToReact(svg);

  if (options.addSizeProps) {
    content = injectSizeProps(content);
  }
  if (options.addColorProp) {
    content = injectColorProp(content);
  }

  return content;
}

export function convertToReact(svg: string, options: ConvertOptions, tsx: boolean): string {
  const content = formatSvgForReact(svg, options);
  const name = options.componentName || 'SvgIcon';

  const propsEntries: string[] = [];
  const propsTypes: string[] = [];
  const defaultValues: string[] = [];

  if (options.addSizeProps) {
    if (tsx) {
      propsTypes.push('  width?: number | string;');
      propsTypes.push('  height?: number | string;');
    }
    propsEntries.push('width = 24');
    propsEntries.push('height = 24');
  }

  if (options.addColorProp) {
    if (tsx) {
      propsTypes.push('  color?: string;');
    }
    propsEntries.push("color = 'currentColor'");
  }

  const propsParam = propsEntries.length > 0
    ? `{ ${propsEntries.join(', ')} }`
    : '';

  const propsInterface = tsx && propsTypes.length > 0
    ? `\ninterface ${name}Props {\n${propsTypes.join('\n')}\n}\n`
    : '';

  const propsAnnotation = tsx && propsTypes.length > 0
    ? `: ${name}Props`
    : '';

  const funcParam = propsParam
    ? `${propsParam}${propsAnnotation}`
    : tsx ? '' : '';

  const indented = content
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

  if (tsx) {
    return `import React from 'react';
${propsInterface}
const ${name} = (${funcParam ? `{ ${propsEntries.join(', ')} }${propsAnnotation}` : ''}) => {
  return (
${indented}
  );
};

export default ${name};
`;
  }

  return `const ${name} = (${funcParam}) => {
  return (
${indented}
  );
};

export default ${name};
`;
}

export function convertToVue(svg: string, options: ConvertOptions): string {
  let content = svg;
  const name = options.componentName || 'SvgIcon';

  const propsEntries: string[] = [];

  if (options.addSizeProps) {
    content = injectSizePropsVue(content);
    propsEntries.push("    width: { type: [Number, String], default: 24 }");
    propsEntries.push("    height: { type: [Number, String], default: 24 }");
  }

  if (options.addColorProp) {
    content = injectColorPropVue(content);
    propsEntries.push("    color: { type: String, default: 'currentColor' }");
  }

  const indented = content
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

  const propsBlock = propsEntries.length > 0
    ? `  props: {\n${propsEntries.join(',\n')}\n  },`
    : '';

  return `<template>
${indented}
</template>

<script>
export default {
  name: '${name}',
${propsBlock}
};
</script>
`;
}

export function cleanSvg(svg: string): string {
  let cleaned = svg.trim();
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  cleaned = cleaned.replace(/<\?xml[^?]*\?>/g, '');
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  return cleaned.trim();
}

export function isValidSvg(svg: string): boolean {
  const trimmed = svg.trim();
  return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>');
}
