import { describe, it, expect } from 'vitest';
import {
  analyzeCorsHeaders,
  getCorsStatusSummary,
  formatHeaderName,
  CORS_HEADER_NAMES,
} from '../corsChecker';

describe('analyzeCorsHeaders', () => {
  it('detects present CORS headers', () => {
    const headers = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST',
      'access-control-allow-headers': 'Content-Type',
    };
    const result = analyzeCorsHeaders(headers);

    const originHeader = result.find((h) => h.name === 'access-control-allow-origin');
    expect(originHeader?.value).toBe('*');
    expect(originHeader?.pass).toBe(true);

    const methodsHeader = result.find((h) => h.name === 'access-control-allow-methods');
    expect(methodsHeader?.value).toBe('GET, POST');
    expect(methodsHeader?.pass).toBe(true);
  });

  it('marks missing headers', () => {
    const result = analyzeCorsHeaders({});

    const originHeader = result.find((h) => h.name === 'access-control-allow-origin');
    expect(originHeader?.value).toBeNull();
    expect(originHeader?.pass).toBe(false);
  });

  it('returns entries for all CORS headers', () => {
    const result = analyzeCorsHeaders({});
    expect(result.length).toBe(CORS_HEADER_NAMES.length);
  });
});

describe('getCorsStatusSummary', () => {
  it('reports wildcard origin', () => {
    const headers = analyzeCorsHeaders({ 'access-control-allow-origin': '*' });
    const summary = getCorsStatusSummary(headers);
    expect(summary).toContain('wildcard');
  });

  it('reports specific origin', () => {
    const headers = analyzeCorsHeaders({
      'access-control-allow-origin': 'https://example.com',
    });
    const summary = getCorsStatusSummary(headers);
    expect(summary).toContain('https://example.com');
  });

  it('reports no CORS headers', () => {
    const headers = analyzeCorsHeaders({});
    const summary = getCorsStatusSummary(headers);
    expect(summary).toContain('No CORS headers');
  });
});

describe('formatHeaderName', () => {
  it('capitalizes header name parts', () => {
    expect(formatHeaderName('access-control-allow-origin')).toBe('Access-Control-Allow-Origin');
    expect(formatHeaderName('content-type')).toBe('Content-Type');
  });
});
