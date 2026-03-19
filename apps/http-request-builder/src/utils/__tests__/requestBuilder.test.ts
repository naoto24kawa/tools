import { describe, it, expect } from 'vitest';
import {
  buildHeaders,
  buildFetchOptions,
  formatBytes,
  tryFormatJson,
  isJsonResponse,
  createEmptyHeader,
  type RequestConfig,
} from '../requestBuilder';

describe('buildHeaders', () => {
  it('builds headers from key-value pairs', () => {
    const headers = buildHeaders([
      { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
      { id: '2', key: 'Authorization', value: 'Bearer token', enabled: true },
    ]);
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer token',
    });
  });

  it('skips disabled headers', () => {
    const headers = buildHeaders([
      { id: '1', key: 'Content-Type', value: 'application/json', enabled: false },
      { id: '2', key: 'Accept', value: '*/*', enabled: true },
    ]);
    expect(headers).toEqual({ Accept: '*/*' });
  });

  it('skips empty keys', () => {
    const headers = buildHeaders([
      { id: '1', key: '', value: 'some-value', enabled: true },
    ]);
    expect(headers).toEqual({});
  });
});

describe('buildFetchOptions', () => {
  it('builds GET request without body', () => {
    const config: RequestConfig = {
      method: 'GET',
      url: 'https://example.com',
      headers: [],
      bodyType: 'none',
      body: '',
    };
    const options = buildFetchOptions(config);
    expect(options.method).toBe('GET');
    expect(options.body).toBeUndefined();
  });

  it('builds POST request with JSON body', () => {
    const config: RequestConfig = {
      method: 'POST',
      url: 'https://example.com',
      headers: [],
      bodyType: 'json',
      body: '{"key": "value"}',
    };
    const options = buildFetchOptions(config);
    expect(options.method).toBe('POST');
    expect(options.body).toBe('{"key": "value"}');
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('does not override existing Content-Type header', () => {
    const config: RequestConfig = {
      method: 'POST',
      url: 'https://example.com',
      headers: [{ id: '1', key: 'Content-Type', value: 'text/xml', enabled: true }],
      bodyType: 'json',
      body: '<xml/>',
    };
    const options = buildFetchOptions(config);
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('text/xml');
  });
});

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });
});

describe('tryFormatJson', () => {
  it('formats valid JSON', () => {
    expect(tryFormatJson('{"a":1}')).toBe('{\n  "a": 1\n}');
  });

  it('returns original string for invalid JSON', () => {
    expect(tryFormatJson('not json')).toBe('not json');
  });
});

describe('isJsonResponse', () => {
  it('detects JSON content type', () => {
    expect(isJsonResponse({ 'content-type': 'application/json' })).toBe(true);
    expect(isJsonResponse({ 'content-type': 'application/vnd.api+json' })).toBe(true);
    expect(isJsonResponse({ 'content-type': 'text/html' })).toBe(false);
  });
});

describe('createEmptyHeader', () => {
  it('creates a header with empty key/value and enabled', () => {
    const h = createEmptyHeader();
    expect(h.key).toBe('');
    expect(h.value).toBe('');
    expect(h.enabled).toBe(true);
    expect(h.id).toBeTruthy();
  });
});
