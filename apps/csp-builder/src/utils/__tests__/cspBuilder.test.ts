import { describe, expect, test } from 'vitest';
import {
  buildCspString,
  addDirective,
  removeDirective,
  addValue,
  removeValue,
  parseCspString,
} from '../cspBuilder';
import type { CspDirective } from '../cspBuilder';

describe('buildCspString', () => {
  test('returns empty string for empty directives', () => {
    expect(buildCspString([])).toBe('');
  });

  test('builds single directive', () => {
    const directives: CspDirective[] = [{ name: 'default-src', values: ["'self'"] }];
    expect(buildCspString(directives)).toBe("default-src 'self'");
  });

  test('builds multiple directives', () => {
    const directives: CspDirective[] = [
      { name: 'default-src', values: ["'self'"] },
      { name: 'script-src', values: ["'self'", "'unsafe-inline'"] },
    ];
    expect(buildCspString(directives)).toBe(
      "default-src 'self'; script-src 'self' 'unsafe-inline'"
    );
  });

  test('skips directives with no values', () => {
    const directives: CspDirective[] = [
      { name: 'default-src', values: ["'self'"] },
      { name: 'script-src', values: [] },
    ];
    expect(buildCspString(directives)).toBe("default-src 'self'");
  });
});

describe('addDirective', () => {
  test('adds new directive', () => {
    const result = addDirective([], 'default-src');
    expect(result).toEqual([{ name: 'default-src', values: [] }]);
  });

  test('does not add duplicate directive', () => {
    const existing: CspDirective[] = [{ name: 'default-src', values: ["'self'"] }];
    const result = addDirective(existing, 'default-src');
    expect(result).toEqual(existing);
  });
});

describe('removeDirective', () => {
  test('removes existing directive', () => {
    const existing: CspDirective[] = [
      { name: 'default-src', values: ["'self'"] },
      { name: 'script-src', values: [] },
    ];
    const result = removeDirective(existing, 'script-src');
    expect(result).toEqual([{ name: 'default-src', values: ["'self'"] }]);
  });

  test('does nothing for non-existing directive', () => {
    const existing: CspDirective[] = [{ name: 'default-src', values: ["'self'"] }];
    const result = removeDirective(existing, 'script-src');
    expect(result).toEqual(existing);
  });
});

describe('addValue', () => {
  test('adds value to directive', () => {
    const directives: CspDirective[] = [{ name: 'default-src', values: [] }];
    const result = addValue(directives, 'default-src', "'self'");
    expect(result[0].values).toEqual(["'self'"]);
  });

  test('does not add duplicate value', () => {
    const directives: CspDirective[] = [{ name: 'default-src', values: ["'self'"] }];
    const result = addValue(directives, 'default-src', "'self'");
    expect(result[0].values).toEqual(["'self'"]);
  });
});

describe('removeValue', () => {
  test('removes value from directive', () => {
    const directives: CspDirective[] = [
      { name: 'default-src', values: ["'self'", 'https:'] },
    ];
    const result = removeValue(directives, 'default-src', 'https:');
    expect(result[0].values).toEqual(["'self'"]);
  });
});

describe('parseCspString', () => {
  test('parses empty string', () => {
    expect(parseCspString('')).toEqual([]);
  });

  test('parses single directive', () => {
    const result = parseCspString("default-src 'self'");
    expect(result).toEqual([{ name: 'default-src', values: ["'self'"] }]);
  });

  test('parses multiple directives', () => {
    const result = parseCspString("default-src 'self'; script-src 'self' 'unsafe-inline'");
    expect(result).toEqual([
      { name: 'default-src', values: ["'self'"] },
      { name: 'script-src', values: ["'self'", "'unsafe-inline'"] },
    ]);
  });

  test('roundtrips with buildCspString', () => {
    const original: CspDirective[] = [
      { name: 'default-src', values: ["'self'"] },
      { name: 'img-src', values: ["'self'", 'data:', 'https:'] },
    ];
    const csp = buildCspString(original);
    const parsed = parseCspString(csp);
    expect(parsed).toEqual(original);
  });
});
