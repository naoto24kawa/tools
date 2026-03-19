import { describe, it, expect } from 'vitest';
import { parseUrl, extractQueryParams, buildUrl } from '../urlParser';

describe('parseUrl', () => {
  it('parses a full URL correctly', () => {
    const result = parseUrl('https://user:pass@example.com:8080/path?q=1#hash');
    expect(result).not.toBeNull();
    expect(result!.protocol).toBe('https:');
    expect(result!.username).toBe('user');
    expect(result!.password).toBe('pass');
    expect(result!.hostname).toBe('example.com');
    expect(result!.port).toBe('8080');
    expect(result!.pathname).toBe('/path');
    expect(result!.search).toBe('?q=1');
    expect(result!.hash).toBe('#hash');
  });

  it('parses a simple URL', () => {
    const result = parseUrl('https://example.com');
    expect(result).not.toBeNull();
    expect(result!.protocol).toBe('https:');
    expect(result!.hostname).toBe('example.com');
    expect(result!.port).toBe('');
    expect(result!.pathname).toBe('/');
  });

  it('returns null for invalid URLs', () => {
    expect(parseUrl('not a url')).toBeNull();
    expect(parseUrl('')).toBeNull();
  });
});

describe('extractQueryParams', () => {
  it('extracts query parameters', () => {
    const params = extractQueryParams('?foo=bar&baz=qux');
    expect(params).toEqual([
      { key: 'foo', value: 'bar' },
      { key: 'baz', value: 'qux' },
    ]);
  });

  it('handles empty search', () => {
    expect(extractQueryParams('')).toEqual([]);
    expect(extractQueryParams('?')).toEqual([]);
  });

  it('handles params with no value', () => {
    const params = extractQueryParams('?key=');
    expect(params).toEqual([{ key: 'key', value: '' }]);
  });
});

describe('buildUrl', () => {
  it('builds a complete URL', () => {
    const url = buildUrl({
      protocol: 'https:',
      username: '',
      password: '',
      hostname: 'example.com',
      port: '8080',
      pathname: '/path',
      queryParams: [{ key: 'q', value: '1' }],
      hash: '#section',
    });
    expect(url).toBe('https://example.com:8080/path?q=1#section');
  });

  it('builds a minimal URL', () => {
    const url = buildUrl({
      protocol: 'https:',
      username: '',
      password: '',
      hostname: 'example.com',
      port: '',
      pathname: '',
      queryParams: [],
      hash: '',
    });
    expect(url).toBe('https://example.com/');
  });

  it('returns empty string for no hostname', () => {
    const url = buildUrl({
      protocol: 'https:',
      username: '',
      password: '',
      hostname: '',
      port: '',
      pathname: '',
      queryParams: [],
      hash: '',
    });
    expect(url).toBe('');
  });

  it('includes credentials when provided', () => {
    const url = buildUrl({
      protocol: 'https:',
      username: 'user',
      password: 'pass',
      hostname: 'example.com',
      port: '',
      pathname: '/',
      queryParams: [],
      hash: '',
    });
    expect(url).toBe('https://user:pass@example.com/');
  });
});
