import { describe, expect, test } from 'vitest';
import { validateXML } from '../xmlValidator';

describe('xmlValidator', () => {
  test('empty returns not valid no error', () => {
    const r = validateXML('');
    expect(r.valid).toBe(false);
    expect(r.error).toBeNull();
  });

  test('valid XML', () => {
    const r = validateXML('<root><item>hello</item></root>');
    expect(r.valid).toBe(true);
    expect(r.error).toBeNull();
  });

  test('invalid XML returns error', () => {
    const r = validateXML('<root><unclosed>');
    expect(r.valid).toBe(false);
    expect(r.error).not.toBeNull();
  });

  test('formatted output for valid XML', () => {
    const r = validateXML('<root><a>1</a></root>');
    expect(r.formatted).toContain('<root>');
  });
});
