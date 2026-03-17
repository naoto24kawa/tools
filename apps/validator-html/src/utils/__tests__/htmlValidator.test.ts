import { describe, expect, test } from 'vitest';
import { validateHTML } from '../htmlValidator';

describe('htmlValidator', () => {
  test('empty returns no issues', () => {
    expect(validateHTML('')).toEqual([]);
  });
  test('valid HTML', () => {
    const issues = validateHTML('<!DOCTYPE html><html><body><p>Hello</p></body></html>');
    expect(issues.filter((i) => i.type === 'error').length).toBe(0);
  });
  test('missing DOCTYPE warning', () => {
    const issues = validateHTML('<html><body></body></html>');
    expect(issues.some((i) => i.message.includes('DOCTYPE'))).toBe(true);
  });
  test('unclosed tag', () => {
    const issues = validateHTML('<div><p>test</div>');
    expect(issues.some((i) => i.type === 'error')).toBe(true);
  });
  test('img without alt warning', () => {
    const issues = validateHTML('<img src="test.png">');
    expect(issues.some((i) => i.message.includes('alt'))).toBe(true);
  });
});
