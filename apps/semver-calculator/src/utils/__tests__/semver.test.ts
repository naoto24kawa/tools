import { describe, expect, it } from 'vitest';
import { parse, format, compare, bump, satisfiesRange, isValid, compareStrings } from '../semver';

describe('parse', () => {
  it('parses basic version', () => {
    expect(parse('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('parses version with v prefix', () => {
    expect(parse('v1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it('parses pre-release version', () => {
    expect(parse('1.2.3-alpha.1')).toEqual({
      major: 1, minor: 2, patch: 3, prerelease: 'alpha.1',
    });
  });

  it('parses version with build metadata', () => {
    expect(parse('1.2.3+build.123')).toEqual({
      major: 1, minor: 2, patch: 3, build: 'build.123',
    });
  });

  it('returns null for invalid version', () => {
    expect(parse('not.a.version')).toBeNull();
    expect(parse('1.2')).toBeNull();
    expect(parse('')).toBeNull();
  });
});

describe('format', () => {
  it('formats basic version', () => {
    expect(format({ major: 1, minor: 2, patch: 3 })).toBe('1.2.3');
  });

  it('formats pre-release version', () => {
    expect(format({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.1' })).toBe('1.2.3-alpha.1');
  });

  it('formats version with build', () => {
    expect(format({ major: 1, minor: 2, patch: 3, build: 'abc' })).toBe('1.2.3+abc');
  });
});

describe('compare', () => {
  it('compares major versions', () => {
    expect(compare(parse('2.0.0')!, parse('1.0.0')!)).toBe(1);
    expect(compare(parse('1.0.0')!, parse('2.0.0')!)).toBe(-1);
  });

  it('compares minor versions', () => {
    expect(compare(parse('1.2.0')!, parse('1.1.0')!)).toBe(1);
  });

  it('compares patch versions', () => {
    expect(compare(parse('1.0.2')!, parse('1.0.1')!)).toBe(1);
  });

  it('returns 0 for equal versions', () => {
    expect(compare(parse('1.2.3')!, parse('1.2.3')!)).toBe(0);
  });

  it('pre-release has lower precedence', () => {
    expect(compare(parse('1.0.0-alpha')!, parse('1.0.0')!)).toBe(-1);
  });

  it('compares pre-release numerically', () => {
    expect(compare(parse('1.0.0-alpha.2')!, parse('1.0.0-alpha.1')!)).toBe(1);
  });
});

describe('compareStrings', () => {
  it('returns null for invalid input', () => {
    expect(compareStrings('invalid', '1.0.0')).toBeNull();
  });

  it('compares valid versions', () => {
    expect(compareStrings('1.0.0', '2.0.0')).toBe(-1);
  });
});

describe('isValid', () => {
  it('returns true for valid version', () => {
    expect(isValid('1.2.3')).toBe(true);
  });

  it('returns false for invalid version', () => {
    expect(isValid('abc')).toBe(false);
  });
});

describe('bump', () => {
  it('bumps major', () => {
    const result = bump(parse('1.2.3')!, 'major');
    expect(format(result)).toBe('2.0.0');
  });

  it('bumps minor', () => {
    const result = bump(parse('1.2.3')!, 'minor');
    expect(format(result)).toBe('1.3.0');
  });

  it('bumps patch', () => {
    const result = bump(parse('1.2.3')!, 'patch');
    expect(format(result)).toBe('1.2.4');
  });

  it('bumps patch from pre-release releases the version', () => {
    const result = bump(parse('1.2.3-alpha.1')!, 'patch');
    expect(format(result)).toBe('1.2.3');
  });

  it('bumps prerelease', () => {
    const result = bump(parse('1.2.3')!, 'prerelease');
    expect(format(result)).toBe('1.2.4-alpha.0');
  });

  it('increments prerelease number', () => {
    const result = bump(parse('1.2.3-alpha.0')!, 'prerelease');
    expect(format(result)).toBe('1.2.3-alpha.1');
  });
});

describe('satisfiesRange', () => {
  it('matches exact version', () => {
    expect(satisfiesRange('1.2.3', '1.2.3')).toBe(true);
    expect(satisfiesRange('1.2.4', '1.2.3')).toBe(false);
  });

  it('matches caret range', () => {
    expect(satisfiesRange('1.3.0', '^1.2.3')).toBe(true);
    expect(satisfiesRange('2.0.0', '^1.2.3')).toBe(false);
    expect(satisfiesRange('1.2.2', '^1.2.3')).toBe(false);
  });

  it('matches tilde range', () => {
    expect(satisfiesRange('1.2.5', '~1.2.3')).toBe(true);
    expect(satisfiesRange('1.3.0', '~1.2.3')).toBe(false);
  });

  it('matches >= operator', () => {
    expect(satisfiesRange('1.2.3', '>=1.0.0')).toBe(true);
    expect(satisfiesRange('0.9.0', '>=1.0.0')).toBe(false);
  });

  it('matches > operator', () => {
    expect(satisfiesRange('1.0.1', '>1.0.0')).toBe(true);
    expect(satisfiesRange('1.0.0', '>1.0.0')).toBe(false);
  });

  it('matches < operator', () => {
    expect(satisfiesRange('0.9.0', '<1.0.0')).toBe(true);
    expect(satisfiesRange('1.0.0', '<1.0.0')).toBe(false);
  });

  it('returns null for invalid version', () => {
    expect(satisfiesRange('invalid', '^1.0.0')).toBeNull();
  });

  it('returns null for unparseable range', () => {
    expect(satisfiesRange('1.0.0', '||invalid||')).toBeNull();
  });
});
