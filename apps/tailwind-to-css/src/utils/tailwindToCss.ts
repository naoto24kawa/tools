export interface ConversionResult {
  className: string;
  css: string;
  found: boolean;
}

export interface ConvertOutput {
  results: ConversionResult[];
  combinedCss: string;
}

const SPACING_SCALE: Record<string, string> = {
  '0': '0px',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '1.5': '0.375rem',
  '2': '0.5rem',
  '2.5': '0.625rem',
  '3': '0.75rem',
  '3.5': '0.875rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '7': '1.75rem',
  '8': '2rem',
  '9': '2.25rem',
  '10': '2.5rem',
  '11': '2.75rem',
  '12': '3rem',
  '14': '3.5rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '28': '7rem',
  '32': '8rem',
  '36': '9rem',
  '40': '10rem',
  '44': '11rem',
  '48': '12rem',
  '52': '13rem',
  '56': '14rem',
  '60': '15rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
};

const COLORS: Record<string, string> = {
  'black': '#000000',
  'white': '#ffffff',
  'transparent': 'transparent',
  'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1', 'slate-400': '#94a3b8', 'slate-500': '#64748b',
  'slate-600': '#475569', 'slate-700': '#334155', 'slate-800': '#1e293b', 'slate-900': '#0f172a',
  'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db', 'gray-400': '#9ca3af', 'gray-500': '#6b7280',
  'gray-600': '#4b5563', 'gray-700': '#374151', 'gray-800': '#1f2937', 'gray-900': '#111827',
  'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca',
  'red-300': '#fca5a5', 'red-400': '#f87171', 'red-500': '#ef4444',
  'red-600': '#dc2626', 'red-700': '#b91c1c', 'red-800': '#991b1b', 'red-900': '#7f1d1d',
  'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa',
  'orange-300': '#fdba74', 'orange-400': '#fb923c', 'orange-500': '#f97316',
  'orange-600': '#ea580c', 'orange-700': '#c2410c', 'orange-800': '#9a3412', 'orange-900': '#7c2d12',
  'yellow-50': '#fefce8', 'yellow-100': '#fef9c3', 'yellow-200': '#fef08a',
  'yellow-300': '#fde047', 'yellow-400': '#facc15', 'yellow-500': '#eab308',
  'yellow-600': '#ca8a04', 'yellow-700': '#a16207', 'yellow-800': '#854d0e', 'yellow-900': '#713f12',
  'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-200': '#bbf7d0',
  'green-300': '#86efac', 'green-400': '#4ade80', 'green-500': '#22c55e',
  'green-600': '#16a34a', 'green-700': '#15803d', 'green-800': '#166534', 'green-900': '#14532d',
  'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe',
  'blue-300': '#93c5fd', 'blue-400': '#60a5fa', 'blue-500': '#3b82f6',
  'blue-600': '#2563eb', 'blue-700': '#1d4ed8', 'blue-800': '#1e40af', 'blue-900': '#1e3a8a',
  'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe',
  'indigo-300': '#a5b4fc', 'indigo-400': '#818cf8', 'indigo-500': '#6366f1',
  'indigo-600': '#4f46e5', 'indigo-700': '#4338ca', 'indigo-800': '#3730a3', 'indigo-900': '#312e81',
  'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff',
  'purple-300': '#d8b4fe', 'purple-400': '#c084fc', 'purple-500': '#a855f7',
  'purple-600': '#9333ea', 'purple-700': '#7e22ce', 'purple-800': '#6b21a8', 'purple-900': '#581c87',
  'pink-50': '#fdf2f8', 'pink-100': '#fce7f3', 'pink-200': '#fbcfe8',
  'pink-300': '#f9a8d4', 'pink-400': '#f472b6', 'pink-500': '#ec4899',
  'pink-600': '#db2777', 'pink-700': '#be185d', 'pink-800': '#9d174d', 'pink-900': '#831843',
};

function spacingValue(val: string): string | null {
  return SPACING_SCALE[val] || null;
}

function colorValue(val: string): string | null {
  return COLORS[val] || null;
}

const STATIC_MAP: Record<string, string> = {
  // Display
  'block': 'display: block;',
  'inline-block': 'display: inline-block;',
  'inline': 'display: inline;',
  'flex': 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  'grid': 'display: grid;',
  'inline-grid': 'display: inline-grid;',
  'hidden': 'display: none;',
  'table': 'display: table;',
  // Position
  'static': 'position: static;',
  'fixed': 'position: fixed;',
  'absolute': 'position: absolute;',
  'relative': 'position: relative;',
  'sticky': 'position: sticky;',
  // Flexbox
  'flex-row': 'flex-direction: row;',
  'flex-row-reverse': 'flex-direction: row-reverse;',
  'flex-col': 'flex-direction: column;',
  'flex-col-reverse': 'flex-direction: column-reverse;',
  'flex-wrap': 'flex-wrap: wrap;',
  'flex-nowrap': 'flex-wrap: nowrap;',
  'flex-wrap-reverse': 'flex-wrap: wrap-reverse;',
  'flex-1': 'flex: 1 1 0%;',
  'flex-auto': 'flex: 1 1 auto;',
  'flex-initial': 'flex: 0 1 auto;',
  'flex-none': 'flex: none;',
  'flex-grow': 'flex-grow: 1;',
  'flex-grow-0': 'flex-grow: 0;',
  'flex-shrink': 'flex-shrink: 1;',
  'flex-shrink-0': 'flex-shrink: 0;',
  // Justify
  'justify-start': 'justify-content: flex-start;',
  'justify-end': 'justify-content: flex-end;',
  'justify-center': 'justify-content: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-around': 'justify-content: space-around;',
  'justify-evenly': 'justify-content: space-evenly;',
  // Align Items
  'items-start': 'align-items: flex-start;',
  'items-end': 'align-items: flex-end;',
  'items-center': 'align-items: center;',
  'items-baseline': 'align-items: baseline;',
  'items-stretch': 'align-items: stretch;',
  // Align Self
  'self-auto': 'align-self: auto;',
  'self-start': 'align-self: flex-start;',
  'self-end': 'align-self: flex-end;',
  'self-center': 'align-self: center;',
  'self-stretch': 'align-self: stretch;',
  // Grid
  'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr));',
  'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr));',
  'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr));',
  'grid-cols-6': 'grid-template-columns: repeat(6, minmax(0, 1fr));',
  'grid-cols-12': 'grid-template-columns: repeat(12, minmax(0, 1fr));',
  'col-span-1': 'grid-column: span 1 / span 1;',
  'col-span-2': 'grid-column: span 2 / span 2;',
  'col-span-3': 'grid-column: span 3 / span 3;',
  'col-span-full': 'grid-column: 1 / -1;',
  // Width/Height
  'w-full': 'width: 100%;',
  'w-screen': 'width: 100vw;',
  'w-auto': 'width: auto;',
  'w-min': 'width: min-content;',
  'w-max': 'width: max-content;',
  'w-fit': 'width: fit-content;',
  'h-full': 'height: 100%;',
  'h-screen': 'height: 100vh;',
  'h-auto': 'height: auto;',
  'h-min': 'height: min-content;',
  'h-max': 'height: max-content;',
  'h-fit': 'height: fit-content;',
  'min-h-screen': 'min-height: 100vh;',
  'min-h-full': 'min-height: 100%;',
  'min-h-0': 'min-height: 0px;',
  'min-w-0': 'min-width: 0px;',
  'min-w-full': 'min-width: 100%;',
  'max-w-none': 'max-width: none;',
  'max-w-xs': 'max-width: 20rem;',
  'max-w-sm': 'max-width: 24rem;',
  'max-w-md': 'max-width: 28rem;',
  'max-w-lg': 'max-width: 32rem;',
  'max-w-xl': 'max-width: 36rem;',
  'max-w-2xl': 'max-width: 42rem;',
  'max-w-3xl': 'max-width: 48rem;',
  'max-w-4xl': 'max-width: 56rem;',
  'max-w-5xl': 'max-width: 64rem;',
  'max-w-6xl': 'max-width: 72rem;',
  'max-w-7xl': 'max-width: 80rem;',
  'max-w-full': 'max-width: 100%;',
  'max-w-screen-sm': 'max-width: 640px;',
  'max-w-screen-md': 'max-width: 768px;',
  'max-w-screen-lg': 'max-width: 1024px;',
  'max-w-screen-xl': 'max-width: 1280px;',
  // Typography
  'text-xs': 'font-size: 0.75rem; line-height: 1rem;',
  'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
  'text-base': 'font-size: 1rem; line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
  'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
  'text-5xl': 'font-size: 3rem; line-height: 1;',
  'text-left': 'text-align: left;',
  'text-center': 'text-align: center;',
  'text-right': 'text-align: right;',
  'text-justify': 'text-align: justify;',
  'font-thin': 'font-weight: 100;',
  'font-extralight': 'font-weight: 200;',
  'font-light': 'font-weight: 300;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-black': 'font-weight: 900;',
  'italic': 'font-style: italic;',
  'not-italic': 'font-style: normal;',
  'uppercase': 'text-transform: uppercase;',
  'lowercase': 'text-transform: lowercase;',
  'capitalize': 'text-transform: capitalize;',
  'normal-case': 'text-transform: none;',
  'underline': 'text-decoration-line: underline;',
  'overline': 'text-decoration-line: overline;',
  'line-through': 'text-decoration-line: line-through;',
  'no-underline': 'text-decoration-line: none;',
  'truncate': 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  'leading-none': 'line-height: 1;',
  'leading-tight': 'line-height: 1.25;',
  'leading-snug': 'line-height: 1.375;',
  'leading-normal': 'line-height: 1.5;',
  'leading-relaxed': 'line-height: 1.625;',
  'leading-loose': 'line-height: 2;',
  'tracking-tighter': 'letter-spacing: -0.05em;',
  'tracking-tight': 'letter-spacing: -0.025em;',
  'tracking-normal': 'letter-spacing: 0em;',
  'tracking-wide': 'letter-spacing: 0.025em;',
  'tracking-wider': 'letter-spacing: 0.05em;',
  'tracking-widest': 'letter-spacing: 0.1em;',
  'whitespace-normal': 'white-space: normal;',
  'whitespace-nowrap': 'white-space: nowrap;',
  'whitespace-pre': 'white-space: pre;',
  'whitespace-pre-line': 'white-space: pre-line;',
  'whitespace-pre-wrap': 'white-space: pre-wrap;',
  'break-normal': 'overflow-wrap: normal; word-break: normal;',
  'break-words': 'overflow-wrap: break-word;',
  'break-all': 'word-break: break-all;',
  // Border
  'border': 'border-width: 1px;',
  'border-0': 'border-width: 0px;',
  'border-2': 'border-width: 2px;',
  'border-4': 'border-width: 4px;',
  'border-8': 'border-width: 8px;',
  'border-t': 'border-top-width: 1px;',
  'border-r': 'border-right-width: 1px;',
  'border-b': 'border-bottom-width: 1px;',
  'border-l': 'border-left-width: 1px;',
  'border-solid': 'border-style: solid;',
  'border-dashed': 'border-style: dashed;',
  'border-dotted': 'border-style: dotted;',
  'border-double': 'border-style: double;',
  'border-none': 'border-style: none;',
  // Border Radius
  'rounded-none': 'border-radius: 0px;',
  'rounded-sm': 'border-radius: 0.125rem;',
  'rounded': 'border-radius: 0.25rem;',
  'rounded-md': 'border-radius: 0.375rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-3xl': 'border-radius: 1.5rem;',
  'rounded-full': 'border-radius: 9999px;',
  // Overflow
  'overflow-auto': 'overflow: auto;',
  'overflow-hidden': 'overflow: hidden;',
  'overflow-visible': 'overflow: visible;',
  'overflow-scroll': 'overflow: scroll;',
  'overflow-x-auto': 'overflow-x: auto;',
  'overflow-y-auto': 'overflow-y: auto;',
  'overflow-x-hidden': 'overflow-x: hidden;',
  'overflow-y-hidden': 'overflow-y: hidden;',
  // Shadow
  'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
  'shadow': 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
  'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
  'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
  'shadow-inner': 'box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);',
  'shadow-none': 'box-shadow: 0 0 #0000;',
  // Opacity
  'opacity-0': 'opacity: 0;',
  'opacity-5': 'opacity: 0.05;',
  'opacity-10': 'opacity: 0.1;',
  'opacity-20': 'opacity: 0.2;',
  'opacity-25': 'opacity: 0.25;',
  'opacity-30': 'opacity: 0.3;',
  'opacity-40': 'opacity: 0.4;',
  'opacity-50': 'opacity: 0.5;',
  'opacity-60': 'opacity: 0.6;',
  'opacity-70': 'opacity: 0.7;',
  'opacity-75': 'opacity: 0.75;',
  'opacity-80': 'opacity: 0.8;',
  'opacity-90': 'opacity: 0.9;',
  'opacity-95': 'opacity: 0.95;',
  'opacity-100': 'opacity: 1;',
  // Cursor
  'cursor-auto': 'cursor: auto;',
  'cursor-default': 'cursor: default;',
  'cursor-pointer': 'cursor: pointer;',
  'cursor-wait': 'cursor: wait;',
  'cursor-text': 'cursor: text;',
  'cursor-move': 'cursor: move;',
  'cursor-not-allowed': 'cursor: not-allowed;',
  // Pointer events
  'pointer-events-none': 'pointer-events: none;',
  'pointer-events-auto': 'pointer-events: auto;',
  // User select
  'select-none': 'user-select: none;',
  'select-text': 'user-select: text;',
  'select-all': 'user-select: all;',
  'select-auto': 'user-select: auto;',
  // Misc
  'sr-only': 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;',
  'not-sr-only': 'position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; white-space: normal;',
  'resize-none': 'resize: none;',
  'resize': 'resize: both;',
  'resize-x': 'resize: horizontal;',
  'resize-y': 'resize: vertical;',
  'appearance-none': 'appearance: none;',
  'outline-none': 'outline: 2px solid transparent; outline-offset: 2px;',
  // Z-index
  'z-0': 'z-index: 0;',
  'z-10': 'z-index: 10;',
  'z-20': 'z-index: 20;',
  'z-30': 'z-index: 30;',
  'z-40': 'z-index: 40;',
  'z-50': 'z-index: 50;',
  'z-auto': 'z-index: auto;',
  // Inset
  'inset-0': 'inset: 0px;',
  'top-0': 'top: 0px;',
  'right-0': 'right: 0px;',
  'bottom-0': 'bottom: 0px;',
  'left-0': 'left: 0px;',
  // Object fit
  'object-contain': 'object-fit: contain;',
  'object-cover': 'object-fit: cover;',
  'object-fill': 'object-fit: fill;',
  'object-none': 'object-fit: none;',
  'object-scale-down': 'object-fit: scale-down;',
  // Transition
  'transition': 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-all': 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-colors': 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-opacity': 'transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-shadow': 'transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-transform': 'transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-none': 'transition-property: none;',
  'duration-75': 'transition-duration: 75ms;',
  'duration-100': 'transition-duration: 100ms;',
  'duration-150': 'transition-duration: 150ms;',
  'duration-200': 'transition-duration: 200ms;',
  'duration-300': 'transition-duration: 300ms;',
  'duration-500': 'transition-duration: 500ms;',
  'duration-700': 'transition-duration: 700ms;',
  'duration-1000': 'transition-duration: 1000ms;',
  'ease-linear': 'transition-timing-function: linear;',
  'ease-in': 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1);',
  'ease-out': 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1);',
  'ease-in-out': 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);',
  // Transform
  'transform': 'transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));',
  'transform-none': 'transform: none;',
  // Gap
  'gap-0': 'gap: 0px;',
  'gap-1': 'gap: 0.25rem;',
  'gap-2': 'gap: 0.5rem;',
  'gap-3': 'gap: 0.75rem;',
  'gap-4': 'gap: 1rem;',
  'gap-5': 'gap: 1.25rem;',
  'gap-6': 'gap: 1.5rem;',
  'gap-8': 'gap: 2rem;',
  'gap-10': 'gap: 2.5rem;',
  'gap-12': 'gap: 3rem;',
  'gap-16': 'gap: 4rem;',
  // Place
  'place-items-center': 'place-items: center;',
  'place-content-center': 'place-content: center;',
  'content-center': 'align-content: center;',
};

function tryDynamicMatch(cls: string): string | null {
  // Padding
  let match = cls.match(/^p-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding: ${v};`; }

  match = cls.match(/^px-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-left: ${v}; padding-right: ${v};`; }

  match = cls.match(/^py-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-top: ${v}; padding-bottom: ${v};`; }

  match = cls.match(/^pt-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-top: ${v};`; }

  match = cls.match(/^pr-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-right: ${v};`; }

  match = cls.match(/^pb-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-bottom: ${v};`; }

  match = cls.match(/^pl-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `padding-left: ${v};`; }

  // Margin
  match = cls.match(/^m-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin: ${v};`; }

  match = cls.match(/^mx-(\S+)$/);
  if (match) {
    if (match[1] === 'auto') return 'margin-left: auto; margin-right: auto;';
    const v = spacingValue(match[1]); if (v) return `margin-left: ${v}; margin-right: ${v};`;
  }

  match = cls.match(/^my-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin-top: ${v}; margin-bottom: ${v};`; }

  match = cls.match(/^mt-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin-top: ${v};`; }

  match = cls.match(/^mr-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin-right: ${v};`; }

  match = cls.match(/^mb-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin-bottom: ${v};`; }

  match = cls.match(/^ml-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `margin-left: ${v};`; }

  // Width/Height with spacing
  match = cls.match(/^w-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `width: ${v};`; }

  match = cls.match(/^h-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `height: ${v};`; }

  match = cls.match(/^min-h-\[(.+)\]$/);
  if (match) return `min-height: ${match[1]};`;

  match = cls.match(/^min-w-\[(.+)\]$/);
  if (match) return `min-width: ${match[1]};`;

  match = cls.match(/^max-w-\[(.+)\]$/);
  if (match) return `max-width: ${match[1]};`;

  // Space between
  match = cls.match(/^space-x-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `> * + * { margin-left: ${v}; }`; }

  match = cls.match(/^space-y-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `> * + * { margin-top: ${v}; }`; }

  // Background color
  match = cls.match(/^bg-(.+)$/);
  if (match) { const v = colorValue(match[1]); if (v) return `background-color: ${v};`; }

  // Text color
  match = cls.match(/^text-(.+)$/);
  if (match) { const v = colorValue(match[1]); if (v) return `color: ${v};`; }

  // Border color
  match = cls.match(/^border-(.+)$/);
  if (match) { const v = colorValue(match[1]); if (v) return `border-color: ${v};`; }

  // Arbitrary values
  match = cls.match(/^w-\[(.+)\]$/);
  if (match) return `width: ${match[1]};`;

  match = cls.match(/^h-\[(.+)\]$/);
  if (match) return `height: ${match[1]};`;

  match = cls.match(/^p-\[(.+)\]$/);
  if (match) return `padding: ${match[1]};`;

  match = cls.match(/^m-\[(.+)\]$/);
  if (match) return `margin: ${match[1]};`;

  match = cls.match(/^top-\[(.+)\]$/);
  if (match) return `top: ${match[1]};`;

  match = cls.match(/^right-\[(.+)\]$/);
  if (match) return `right: ${match[1]};`;

  match = cls.match(/^bottom-\[(.+)\]$/);
  if (match) return `bottom: ${match[1]};`;

  match = cls.match(/^left-\[(.+)\]$/);
  if (match) return `left: ${match[1]};`;

  match = cls.match(/^text-\[(.+)\]$/);
  if (match) return `font-size: ${match[1]};`;

  match = cls.match(/^bg-\[(.+)\]$/);
  if (match) return `background-color: ${match[1]};`;

  // Inset with spacing
  match = cls.match(/^top-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `top: ${v};`; }

  match = cls.match(/^right-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `right: ${v};`; }

  match = cls.match(/^bottom-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `bottom: ${v};`; }

  match = cls.match(/^left-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `left: ${v};`; }

  // Gap with spacing
  match = cls.match(/^gap-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `gap: ${v};`; }

  match = cls.match(/^gap-x-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `column-gap: ${v};`; }

  match = cls.match(/^gap-y-(\S+)$/);
  if (match) { const v = spacingValue(match[1]); if (v) return `row-gap: ${v};`; }

  return null;
}

export function convertClass(className: string): ConversionResult {
  const trimmed = className.trim();

  if (STATIC_MAP[trimmed]) {
    return { className: trimmed, css: STATIC_MAP[trimmed], found: true };
  }

  const dynamic = tryDynamicMatch(trimmed);
  if (dynamic) {
    return { className: trimmed, css: dynamic, found: true };
  }

  return { className: trimmed, css: `/* unknown: ${trimmed} */`, found: false };
}

export function convert(input: string): ConvertOutput {
  const classes = input
    .trim()
    .split(/\s+/)
    .filter((c) => c.length > 0);

  const results = classes.map(convertClass);

  const cssLines = results
    .filter((r) => r.found)
    .map((r) => `  ${r.css}`)
    .join('\n');

  const unknowns = results
    .filter((r) => !r.found)
    .map((r) => `  ${r.css}`)
    .join('\n');

  const combinedCss = `.element {\n${cssLines}${unknowns ? `\n${unknowns}` : ''}\n}`;

  return { results, combinedCss };
}
