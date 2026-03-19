export interface CorsHeader {
  name: string;
  value: string | null;
  description: string;
  pass: boolean | null;
}

export interface CorsResult {
  url: string;
  success: boolean;
  error: string | null;
  headers: CorsHeader[];
  summary: string;
}

export const CORS_HEADER_DESCRIPTIONS: Record<string, string> = {
  'access-control-allow-origin':
    'Specifies which origins can access the resource. A wildcard (*) allows any origin.',
  'access-control-allow-methods':
    'Specifies the HTTP methods allowed when accessing the resource.',
  'access-control-allow-headers':
    'Specifies which HTTP headers can be used during the actual request.',
  'access-control-allow-credentials':
    'Indicates whether the response can be exposed when the credentials flag is true.',
  'access-control-expose-headers':
    'Specifies which headers can be exposed as part of the response by listing their names.',
  'access-control-max-age':
    'Indicates how long (in seconds) the results of a preflight request can be cached.',
};

export const CORS_HEADER_NAMES = [
  'access-control-allow-origin',
  'access-control-allow-methods',
  'access-control-allow-headers',
  'access-control-allow-credentials',
  'access-control-expose-headers',
  'access-control-max-age',
];

export function analyzeCorsHeaders(
  responseHeaders: Record<string, string>,
): CorsHeader[] {
  return CORS_HEADER_NAMES.map((name) => {
    const value = responseHeaders[name] || null;
    const description = CORS_HEADER_DESCRIPTIONS[name] || '';
    let pass: boolean | null = null;

    if (name === 'access-control-allow-origin') {
      pass = value !== null;
    } else if (name === 'access-control-allow-methods') {
      pass = value !== null ? value.length > 0 : null;
    } else if (name === 'access-control-allow-headers') {
      pass = value !== null ? value.length > 0 : null;
    } else {
      pass = value !== null ? true : null;
    }

    return { name, value, description, pass };
  });
}

export function getCorsStatusSummary(headers: CorsHeader[]): string {
  const originHeader = headers.find((h) => h.name === 'access-control-allow-origin');
  if (!originHeader || !originHeader.value) {
    return 'No CORS headers detected. The server may not support cross-origin requests.';
  }
  if (originHeader.value === '*') {
    return 'CORS is enabled with wildcard origin (*). Any origin can access this resource.';
  }
  return `CORS is enabled for origin: ${originHeader.value}`;
}

export async function checkCors(url: string): Promise<CorsResult> {
  if (!url.trim()) {
    throw new Error('URL is required');
  }

  try {
    // Try OPTIONS preflight first
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'OPTIONS',
        mode: 'cors',
      });
    } catch {
      // If OPTIONS fails, try GET
      response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
      });
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value;
    });

    const corsHeaders = analyzeCorsHeaders(responseHeaders);
    const summary = getCorsStatusSummary(corsHeaders);

    return {
      url,
      success: true,
      error: null,
      headers: corsHeaders,
      summary,
    };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Unknown error';
    return {
      url,
      success: false,
      error: `CORS request failed: ${errorMsg}. This typically means the server blocks cross-origin requests from this domain.`,
      headers: CORS_HEADER_NAMES.map((name) => ({
        name,
        value: null,
        description: CORS_HEADER_DESCRIPTIONS[name] || '',
        pass: false,
      })),
      summary: 'CORS request was blocked. The server does not allow cross-origin requests from this origin.',
    };
  }
}

export function formatHeaderName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}
