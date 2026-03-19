export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type BodyType = 'none' | 'json' | 'form-data' | 'text';

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  bodyType: BodyType;
  body: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function createEmptyHeader(): KeyValuePair {
  return { id: generateId(), key: '', value: '', enabled: true };
}

export function buildHeaders(headers: KeyValuePair[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const h of headers) {
    if (h.enabled && h.key.trim()) {
      result[h.key.trim()] = h.value;
    }
  }
  return result;
}

export function buildFetchOptions(config: RequestConfig): RequestInit {
  const options: RequestInit = {
    method: config.method,
    headers: buildHeaders(config.headers),
  };

  if (config.method !== 'GET' && config.method !== 'HEAD' && config.bodyType !== 'none') {
    if (config.bodyType === 'json') {
      options.body = config.body;
      const headers = options.headers as Record<string, string>;
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    } else if (config.bodyType === 'text') {
      options.body = config.body;
      const headers = options.headers as Record<string, string>;
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'text/plain';
      }
    } else if (config.bodyType === 'form-data') {
      options.body = config.body;
      const headers = options.headers as Record<string, string>;
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
    }
  }

  return options;
}

export async function sendRequest(config: RequestConfig): Promise<ResponseData> {
  if (!config.url.trim()) {
    throw new Error('URL is required');
  }

  const options = buildFetchOptions(config);
  const startTime = performance.now();

  const response = await fetch(config.url, options);
  const endTime = performance.now();

  const bodyText = await response.text();
  const time = Math.round(endTime - startTime);
  const size = new Blob([bodyText]).size;

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    body: bodyText,
    time,
    size,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function tryFormatJson(text: string): string {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
}

export function isJsonResponse(headers: Record<string, string>): boolean {
  const contentType = headers['content-type'] || '';
  return contentType.includes('application/json') || contentType.includes('+json');
}
