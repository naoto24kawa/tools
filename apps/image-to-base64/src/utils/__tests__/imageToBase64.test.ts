import { describe, expect, test } from 'bun:test';
import { formatDataUri } from '../imageToBase64';

describe('formatDataUri', () => {
  test('parses data URI', () => {
    const r = formatDataUri('data:image/png;base64,iVBORw0KGgo=');
    expect(r.mimeType).toBe('image/png');
    expect(r.base64Only).toBe('iVBORw0KGgo=');
    expect(r.dataUri).toBe('data:image/png;base64,iVBORw0KGgo=');
  });

  test('calculates size', () => {
    const r = formatDataUri('data:image/png;base64,iVBORw0KGgo=');
    expect(r.sizeKB).toBeGreaterThan(0);
  });

  test('handles non-data-uri string', () => {
    const r = formatDataUri('not-a-data-uri');
    expect(r.base64Only).toBe('not-a-data-uri');
    expect(r.mimeType).toBe('');
  });

  test('handles jpeg', () => {
    const r = formatDataUri('data:image/jpeg;base64,/9j/4AAQ=');
    expect(r.mimeType).toBe('image/jpeg');
  });
});
