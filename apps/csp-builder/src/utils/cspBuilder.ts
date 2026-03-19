export interface CspDirective {
  name: string;
  values: string[];
}

export interface DirectiveInfo {
  name: string;
  description: string;
  commonSources: string[];
}

export const DIRECTIVES: DirectiveInfo[] = [
  {
    name: 'default-src',
    description: 'Fallback for all resource types when a more specific directive is not defined.',
    commonSources: ["'self'", "'none'", 'https:', 'data:'],
  },
  {
    name: 'script-src',
    description: 'Specifies valid sources for JavaScript.',
    commonSources: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'strict-dynamic'", 'https:'],
  },
  {
    name: 'style-src',
    description: 'Specifies valid sources for stylesheets.',
    commonSources: ["'self'", "'unsafe-inline'", 'https:'],
  },
  {
    name: 'img-src',
    description: 'Specifies valid sources for images.',
    commonSources: ["'self'", 'data:', 'https:', 'blob:'],
  },
  {
    name: 'font-src',
    description: 'Specifies valid sources for fonts.',
    commonSources: ["'self'", 'data:', 'https:'],
  },
  {
    name: 'connect-src',
    description: 'Restricts URLs for fetch, XHR, WebSocket, and EventSource connections.',
    commonSources: ["'self'", 'https:', 'wss:'],
  },
  {
    name: 'media-src',
    description: 'Specifies valid sources for audio and video.',
    commonSources: ["'self'", 'https:', 'blob:'],
  },
  {
    name: 'object-src',
    description: 'Specifies valid sources for plugins (e.g., Flash).',
    commonSources: ["'self'", "'none'"],
  },
  {
    name: 'frame-src',
    description: 'Specifies valid sources for nested browsing contexts (iframes).',
    commonSources: ["'self'", "'none'", 'https:'],
  },
  {
    name: 'child-src',
    description: 'Specifies valid sources for web workers and nested browsing contexts.',
    commonSources: ["'self'", "'none'", 'blob:'],
  },
  {
    name: 'worker-src',
    description: 'Specifies valid sources for Worker, SharedWorker, and ServiceWorker.',
    commonSources: ["'self'", "'none'", 'blob:'],
  },
  {
    name: 'frame-ancestors',
    description: 'Specifies valid parents that may embed a page using iframe, object, etc.',
    commonSources: ["'self'", "'none'", 'https:'],
  },
  {
    name: 'form-action',
    description: 'Restricts the URLs which can be used as the target of form submissions.',
    commonSources: ["'self'", "'none'", 'https:'],
  },
  {
    name: 'base-uri',
    description: 'Restricts the URLs which can be used in a base element.',
    commonSources: ["'self'", "'none'"],
  },
  {
    name: 'manifest-src',
    description: 'Specifies valid sources for web app manifests.',
    commonSources: ["'self'", "'none'"],
  },
];

export function buildCspString(directives: CspDirective[]): string {
  if (directives.length === 0) return '';
  return directives
    .filter((d) => d.values.length > 0)
    .map((d) => `${d.name} ${d.values.join(' ')}`)
    .join('; ');
}

export function addDirective(
  directives: CspDirective[],
  name: string
): CspDirective[] {
  if (directives.some((d) => d.name === name)) return directives;
  return [...directives, { name, values: [] }];
}

export function removeDirective(
  directives: CspDirective[],
  name: string
): CspDirective[] {
  return directives.filter((d) => d.name !== name);
}

export function addValue(
  directives: CspDirective[],
  directiveName: string,
  value: string
): CspDirective[] {
  return directives.map((d) => {
    if (d.name !== directiveName) return d;
    if (d.values.includes(value)) return d;
    return { ...d, values: [...d.values, value] };
  });
}

export function removeValue(
  directives: CspDirective[],
  directiveName: string,
  value: string
): CspDirective[] {
  return directives.map((d) => {
    if (d.name !== directiveName) return d;
    return { ...d, values: d.values.filter((v) => v !== value) };
  });
}

export function parseCspString(csp: string): CspDirective[] {
  if (!csp.trim()) return [];
  return csp
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const tokens = part.split(/\s+/);
      return { name: tokens[0], values: tokens.slice(1) };
    });
}
