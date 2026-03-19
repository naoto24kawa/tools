export interface ConversionResult {
  property: string;
  value: string;
  tailwindClass: string;
  exact: boolean;
}

export interface ConvertOutput {
  results: ConversionResult[];
  classes: string;
}

const SPACING_VALUES: Record<string, string> = {
  '0px': '0',
  '1px': 'px',
  '0.125rem': '0.5',
  '0.25rem': '1',
  '0.375rem': '1.5',
  '0.5rem': '2',
  '0.625rem': '2.5',
  '0.75rem': '3',
  '0.875rem': '3.5',
  '1rem': '4',
  '1.25rem': '5',
  '1.5rem': '6',
  '1.75rem': '7',
  '2rem': '8',
  '2.25rem': '9',
  '2.5rem': '10',
  '2.75rem': '11',
  '3rem': '12',
  '3.5rem': '14',
  '4rem': '16',
  '5rem': '20',
  '6rem': '24',
  '7rem': '28',
  '8rem': '32',
  '9rem': '36',
  '10rem': '40',
  '11rem': '44',
  '12rem': '48',
  '13rem': '52',
  '14rem': '56',
  '15rem': '60',
  '16rem': '64',
  '18rem': '72',
  '20rem': '80',
  '24rem': '96',
};

const COLOR_MAP: Record<string, string> = {
  '#000000': 'black', '#000': 'black',
  '#ffffff': 'white', '#fff': 'white',
  'transparent': 'transparent',
  '#f8fafc': 'slate-50', '#f1f5f9': 'slate-100', '#e2e8f0': 'slate-200',
  '#cbd5e1': 'slate-300', '#94a3b8': 'slate-400', '#64748b': 'slate-500',
  '#475569': 'slate-600', '#334155': 'slate-700', '#1e293b': 'slate-800', '#0f172a': 'slate-900',
  '#f9fafb': 'gray-50', '#f3f4f6': 'gray-100', '#e5e7eb': 'gray-200',
  '#d1d5db': 'gray-300', '#9ca3af': 'gray-400', '#6b7280': 'gray-500',
  '#4b5563': 'gray-600', '#374151': 'gray-700', '#1f2937': 'gray-800', '#111827': 'gray-900',
  '#fef2f2': 'red-50', '#fee2e2': 'red-100', '#fecaca': 'red-200',
  '#fca5a5': 'red-300', '#f87171': 'red-400', '#ef4444': 'red-500',
  '#dc2626': 'red-600', '#b91c1c': 'red-700', '#991b1b': 'red-800', '#7f1d1d': 'red-900',
  '#eff6ff': 'blue-50', '#dbeafe': 'blue-100', '#bfdbfe': 'blue-200',
  '#93c5fd': 'blue-300', '#60a5fa': 'blue-400', '#3b82f6': 'blue-500',
  '#2563eb': 'blue-600', '#1d4ed8': 'blue-700', '#1e40af': 'blue-800', '#1e3a8a': 'blue-900',
  '#f0fdf4': 'green-50', '#dcfce7': 'green-100', '#bbf7d0': 'green-200',
  '#86efac': 'green-300', '#4ade80': 'green-400', '#22c55e': 'green-500',
  '#16a34a': 'green-600', '#15803d': 'green-700', '#166534': 'green-800', '#14532d': 'green-900',
  '#fefce8': 'yellow-50', '#fef9c3': 'yellow-100', '#fef08a': 'yellow-200',
  '#fde047': 'yellow-300', '#facc15': 'yellow-400', '#eab308': 'yellow-500',
  '#ca8a04': 'yellow-600', '#a16207': 'yellow-700', '#854d0e': 'yellow-800', '#713f12': 'yellow-900',
  '#faf5ff': 'purple-50', '#f3e8ff': 'purple-100', '#e9d5ff': 'purple-200',
  '#d8b4fe': 'purple-300', '#c084fc': 'purple-400', '#a855f7': 'purple-500',
  '#9333ea': 'purple-600', '#7e22ce': 'purple-700', '#6b21a8': 'purple-800', '#581c87': 'purple-900',
  '#fdf2f8': 'pink-50', '#fce7f3': 'pink-100', '#fbcfe8': 'pink-200',
  '#f9a8d4': 'pink-300', '#f472b6': 'pink-400', '#ec4899': 'pink-500',
  '#db2777': 'pink-600', '#be185d': 'pink-700', '#9d174d': 'pink-800', '#831843': 'pink-900',
};

function spacingToTw(value: string): string | null {
  return SPACING_VALUES[value.trim()] || null;
}

function colorToTw(value: string): string | null {
  return COLOR_MAP[value.trim().toLowerCase()] || null;
}

type Mapper = (prop: string, value: string) => ConversionResult | null;

const EXACT_MAP: Record<string, Record<string, string>> = {
  'display': {
    'block': 'block', 'inline-block': 'inline-block', 'inline': 'inline',
    'flex': 'flex', 'inline-flex': 'inline-flex', 'grid': 'grid',
    'inline-grid': 'inline-grid', 'none': 'hidden', 'table': 'table',
  },
  'position': {
    'static': 'static', 'fixed': 'fixed', 'absolute': 'absolute',
    'relative': 'relative', 'sticky': 'sticky',
  },
  'flex-direction': {
    'row': 'flex-row', 'row-reverse': 'flex-row-reverse',
    'column': 'flex-col', 'column-reverse': 'flex-col-reverse',
  },
  'flex-wrap': {
    'wrap': 'flex-wrap', 'nowrap': 'flex-nowrap', 'wrap-reverse': 'flex-wrap-reverse',
  },
  'flex': {
    '1 1 0%': 'flex-1', '1 1 auto': 'flex-auto',
    '0 1 auto': 'flex-initial', 'none': 'flex-none',
  },
  'justify-content': {
    'flex-start': 'justify-start', 'flex-end': 'justify-end',
    'center': 'justify-center', 'space-between': 'justify-between',
    'space-around': 'justify-around', 'space-evenly': 'justify-evenly',
  },
  'align-items': {
    'flex-start': 'items-start', 'flex-end': 'items-end',
    'center': 'items-center', 'baseline': 'items-baseline', 'stretch': 'items-stretch',
  },
  'align-self': {
    'auto': 'self-auto', 'flex-start': 'self-start', 'flex-end': 'self-end',
    'center': 'self-center', 'stretch': 'self-stretch',
  },
  'text-align': {
    'left': 'text-left', 'center': 'text-center', 'right': 'text-right', 'justify': 'text-justify',
  },
  'font-style': {
    'italic': 'italic', 'normal': 'not-italic',
  },
  'text-transform': {
    'uppercase': 'uppercase', 'lowercase': 'lowercase',
    'capitalize': 'capitalize', 'none': 'normal-case',
  },
  'text-decoration-line': {
    'underline': 'underline', 'overline': 'overline',
    'line-through': 'line-through', 'none': 'no-underline',
  },
  'font-weight': {
    '100': 'font-thin', '200': 'font-extralight', '300': 'font-light',
    '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold',
    '700': 'font-bold', '800': 'font-extrabold', '900': 'font-black',
  },
  'overflow': {
    'auto': 'overflow-auto', 'hidden': 'overflow-hidden',
    'visible': 'overflow-visible', 'scroll': 'overflow-scroll',
  },
  'overflow-x': {
    'auto': 'overflow-x-auto', 'hidden': 'overflow-x-hidden',
  },
  'overflow-y': {
    'auto': 'overflow-y-auto', 'hidden': 'overflow-y-hidden',
  },
  'cursor': {
    'auto': 'cursor-auto', 'default': 'cursor-default',
    'pointer': 'cursor-pointer', 'wait': 'cursor-wait',
    'text': 'cursor-text', 'move': 'cursor-move', 'not-allowed': 'cursor-not-allowed',
  },
  'pointer-events': {
    'none': 'pointer-events-none', 'auto': 'pointer-events-auto',
  },
  'user-select': {
    'none': 'select-none', 'text': 'select-text', 'all': 'select-all', 'auto': 'select-auto',
  },
  'resize': {
    'none': 'resize-none', 'both': 'resize', 'horizontal': 'resize-x', 'vertical': 'resize-y',
  },
  'object-fit': {
    'contain': 'object-contain', 'cover': 'object-cover',
    'fill': 'object-fill', 'none': 'object-none', 'scale-down': 'object-scale-down',
  },
  'border-style': {
    'solid': 'border-solid', 'dashed': 'border-dashed', 'dotted': 'border-dotted',
    'double': 'border-double', 'none': 'border-none',
  },
  'white-space': {
    'normal': 'whitespace-normal', 'nowrap': 'whitespace-nowrap', 'pre': 'whitespace-pre',
    'pre-line': 'whitespace-pre-line', 'pre-wrap': 'whitespace-pre-wrap',
  },
  'word-break': {
    'break-all': 'break-all',
  },
  'overflow-wrap': {
    'break-word': 'break-words',
  },
};

const BORDER_RADIUS_MAP: Record<string, string> = {
  '0px': 'rounded-none', '0.125rem': 'rounded-sm', '0.25rem': 'rounded',
  '0.375rem': 'rounded-md', '0.5rem': 'rounded-lg', '0.75rem': 'rounded-xl',
  '1rem': 'rounded-2xl', '1.5rem': 'rounded-3xl', '9999px': 'rounded-full',
};

const FONT_SIZE_MAP: Record<string, string> = {
  '0.75rem': 'text-xs', '0.875rem': 'text-sm', '1rem': 'text-base',
  '1.125rem': 'text-lg', '1.25rem': 'text-xl', '1.5rem': 'text-2xl',
  '1.875rem': 'text-3xl', '2.25rem': 'text-4xl', '3rem': 'text-5xl',
};

const LINE_HEIGHT_MAP: Record<string, string> = {
  '1': 'leading-none', '1.25': 'leading-tight', '1.375': 'leading-snug',
  '1.5': 'leading-normal', '1.625': 'leading-relaxed', '2': 'leading-loose',
};

const OPACITY_MAP: Record<string, string> = {
  '0': 'opacity-0', '0.05': 'opacity-5', '0.1': 'opacity-10',
  '0.2': 'opacity-20', '0.25': 'opacity-25', '0.3': 'opacity-30',
  '0.4': 'opacity-40', '0.5': 'opacity-50', '0.6': 'opacity-60',
  '0.7': 'opacity-70', '0.75': 'opacity-75', '0.8': 'opacity-80',
  '0.9': 'opacity-90', '0.95': 'opacity-95', '1': 'opacity-100',
};

const BORDER_WIDTH_MAP: Record<string, string> = {
  '0px': 'border-0', '1px': 'border', '2px': 'border-2', '4px': 'border-4', '8px': 'border-8',
};

const Z_INDEX_MAP: Record<string, string> = {
  '0': 'z-0', '10': 'z-10', '20': 'z-20', '30': 'z-30',
  '40': 'z-40', '50': 'z-50', 'auto': 'z-auto',
};

const dynamicMappers: Mapper[] = [
  (prop, value) => {
    if (prop === 'padding') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `p-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `p-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'padding-top') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `pt-${tw}`, exact: true };
    }
    if (prop === 'padding-right') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `pr-${tw}`, exact: true };
    }
    if (prop === 'padding-bottom') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `pb-${tw}`, exact: true };
    }
    if (prop === 'padding-left') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `pl-${tw}`, exact: true };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'margin') {
      if (value === 'auto') return { property: prop, value, tailwindClass: 'm-auto', exact: true };
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `m-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `m-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'margin-top') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `mt-${tw}`, exact: true };
    }
    if (prop === 'margin-right') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `mr-${tw}`, exact: true };
    }
    if (prop === 'margin-bottom') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `mb-${tw}`, exact: true };
    }
    if (prop === 'margin-left') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `ml-${tw}`, exact: true };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'width') {
      if (value === '100%') return { property: prop, value, tailwindClass: 'w-full', exact: true };
      if (value === '100vw') return { property: prop, value, tailwindClass: 'w-screen', exact: true };
      if (value === 'auto') return { property: prop, value, tailwindClass: 'w-auto', exact: true };
      if (value === 'min-content') return { property: prop, value, tailwindClass: 'w-min', exact: true };
      if (value === 'max-content') return { property: prop, value, tailwindClass: 'w-max', exact: true };
      if (value === 'fit-content') return { property: prop, value, tailwindClass: 'w-fit', exact: true };
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `w-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `w-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'height') {
      if (value === '100%') return { property: prop, value, tailwindClass: 'h-full', exact: true };
      if (value === '100vh') return { property: prop, value, tailwindClass: 'h-screen', exact: true };
      if (value === 'auto') return { property: prop, value, tailwindClass: 'h-auto', exact: true };
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `h-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `h-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'background-color') {
      const tw = colorToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `bg-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `bg-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'color') {
      const tw = colorToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `text-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `text-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'border-color') {
      const tw = colorToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `border-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `border-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'border-radius') {
      const tw = BORDER_RADIUS_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
      return { property: prop, value, tailwindClass: `rounded-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'font-size') {
      const tw = FONT_SIZE_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
      return { property: prop, value, tailwindClass: `text-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'line-height') {
      const tw = LINE_HEIGHT_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
      return { property: prop, value, tailwindClass: `leading-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'opacity') {
      const tw = OPACITY_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'border-width') {
      const tw = BORDER_WIDTH_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'z-index') {
      const tw = Z_INDEX_MAP[value];
      if (tw) return { property: prop, value, tailwindClass: tw, exact: true };
      return { property: prop, value, tailwindClass: `z-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'gap') {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `gap-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `gap-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'min-height') {
      if (value === '100vh') return { property: prop, value, tailwindClass: 'min-h-screen', exact: true };
      if (value === '100%') return { property: prop, value, tailwindClass: 'min-h-full', exact: true };
      if (value === '0px') return { property: prop, value, tailwindClass: 'min-h-0', exact: true };
      return { property: prop, value, tailwindClass: `min-h-[${value}]`, exact: false };
    }
    return null;
  },
  (prop, value) => {
    if (prop === 'max-width') {
      const maxWMap: Record<string, string> = {
        'none': 'max-w-none', '20rem': 'max-w-xs', '24rem': 'max-w-sm', '28rem': 'max-w-md',
        '32rem': 'max-w-lg', '36rem': 'max-w-xl', '42rem': 'max-w-2xl', '48rem': 'max-w-3xl',
        '56rem': 'max-w-4xl', '64rem': 'max-w-5xl', '72rem': 'max-w-6xl', '80rem': 'max-w-7xl',
        '100%': 'max-w-full',
      };
      if (maxWMap[value]) return { property: prop, value, tailwindClass: maxWMap[value], exact: true };
      return { property: prop, value, tailwindClass: `max-w-[${value}]`, exact: false };
    }
    return null;
  },
  // Inset properties
  (prop, value) => {
    const insetProps: Record<string, string> = { 'top': 'top', 'right': 'right', 'bottom': 'bottom', 'left': 'left' };
    if (insetProps[prop]) {
      const tw = spacingToTw(value);
      if (tw) return { property: prop, value, tailwindClass: `${insetProps[prop]}-${tw}`, exact: true };
      return { property: prop, value, tailwindClass: `${insetProps[prop]}-[${value}]`, exact: false };
    }
    return null;
  },
];

export function parseCss(input: string): Array<{ property: string; value: string }> {
  const declarations: Array<{ property: string; value: string }> = [];

  // Remove selectors and braces, just get property: value pairs
  const cleaned = input
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/[^{}]*\{/g, '') // remove selectors
    .replace(/\}/g, '')
    .trim();

  const pairs = cleaned.split(';');
  for (const pair of pairs) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const property = trimmed.slice(0, colonIndex).trim().toLowerCase();
    const value = trimmed.slice(colonIndex + 1).trim();
    if (property && value) {
      declarations.push({ property, value });
    }
  }

  return declarations;
}

export function convertProperty(property: string, value: string): ConversionResult {
  // Check exact map
  if (EXACT_MAP[property] && EXACT_MAP[property][value]) {
    return {
      property,
      value,
      tailwindClass: EXACT_MAP[property][value],
      exact: true,
    };
  }

  // Check dynamic mappers
  for (const mapper of dynamicMappers) {
    const result = mapper(property, value);
    if (result) return result;
  }

  // Fallback: arbitrary value
  return {
    property,
    value,
    tailwindClass: `/* ${property}: ${value} */`,
    exact: false,
  };
}

export function convert(input: string): ConvertOutput {
  const declarations = parseCss(input);
  const results = declarations.map((d) => convertProperty(d.property, d.value));
  const classes = results
    .map((r) => r.tailwindClass)
    .filter((c) => !c.startsWith('/*'))
    .join(' ');

  return { results, classes };
}
