import { describe, test, expect } from 'vitest';
import { validate } from '../packageJsonValidator';

describe('validate', () => {
  test('should return error for empty input', () => {
    const issues = validate('');
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
    expect(issues[0].message).toContain('empty');
  });

  test('should return error for invalid JSON', () => {
    const issues = validate('{invalid}');
    expect(issues.length).toBe(1);
    expect(issues[0].severity).toBe('error');
    expect(issues[0].message).toContain('Invalid JSON');
  });

  test('should return error for non-object root', () => {
    const issues = validate('"string"');
    expect(issues.length).toBe(1);
    expect(issues[0].message).toContain('JSON object');
  });

  test('should return error for missing name', () => {
    const issues = validate('{"version": "1.0.0"}');
    expect(issues.some((i) => i.field === 'name' && i.severity === 'error')).toBe(true);
  });

  test('should return error for missing version', () => {
    const issues = validate('{"name": "test"}');
    expect(issues.some((i) => i.field === 'version' && i.severity === 'error')).toBe(true);
  });

  test('should return error for invalid semver version', () => {
    const issues = validate('{"name": "test", "version": "abc"}');
    expect(issues.some((i) => i.field === 'version' && i.message.includes('semver'))).toBe(true);
  });

  test('should accept valid semver', () => {
    const issues = validate('{"name": "test", "version": "1.2.3"}');
    expect(issues.some((i) => i.field === 'version' && i.severity === 'error')).toBe(false);
  });

  test('should warn about uppercase package name', () => {
    const issues = validate('{"name": "MyPackage", "version": "1.0.0"}');
    expect(
      issues.some((i) => i.field === 'name' && i.message.includes('lowercase')),
    ).toBe(true);
  });

  test('should error on name with spaces', () => {
    const issues = validate('{"name": "my package", "version": "1.0.0"}');
    expect(
      issues.some((i) => i.field === 'name' && i.message.includes('spaces')),
    ).toBe(true);
  });

  test('should warn about missing license', () => {
    const issues = validate('{"name": "test", "version": "1.0.0"}');
    expect(
      issues.some((i) => i.field === 'license'),
    ).toBe(true);
  });

  test('should accept valid SPDX license', () => {
    const issues = validate('{"name": "test", "version": "1.0.0", "license": "MIT"}');
    expect(
      issues.some((i) => i.field === 'license' && i.severity === 'warning'),
    ).toBe(false);
  });

  test('should validate scripts format', () => {
    const issues = validate('{"name": "test", "version": "1.0.0", "scripts": {"build": 123}}');
    expect(
      issues.some((i) => i.field === 'scripts.build' && i.severity === 'error'),
    ).toBe(true);
  });

  test('should validate dependencies format', () => {
    const issues = validate(
      '{"name": "test", "version": "1.0.0", "dependencies": {"react": "^18.0.0"}}',
    );
    expect(
      issues.some((i) => i.field.startsWith('dependencies') && i.severity === 'error'),
    ).toBe(false);
  });

  test('should warn about invalid dependency version', () => {
    const issues = validate(
      '{"name": "test", "version": "1.0.0", "dependencies": {"react": "not-valid"}}',
    );
    expect(
      issues.some((i) => i.field === 'dependencies.react' && i.severity === 'warning'),
    ).toBe(true);
  });

  test('should accept workspace: protocol', () => {
    const issues = validate(
      '{"name": "test", "version": "1.0.0", "dependencies": {"my-lib": "workspace:*"}}',
    );
    expect(
      issues.some((i) => i.field === 'dependencies.my-lib' && i.severity === 'warning'),
    ).toBe(false);
  });

  test('should suggest best practice fields', () => {
    const issues = validate('{"name": "test", "version": "1.0.0"}');
    expect(issues.some((i) => i.field === 'description' && i.severity === 'info')).toBe(true);
    expect(issues.some((i) => i.field === 'keywords' && i.severity === 'info')).toBe(true);
    expect(issues.some((i) => i.field === 'repository' && i.severity === 'info')).toBe(true);
  });

  test('should validate a complete valid package.json', () => {
    const pkg = JSON.stringify({
      name: 'my-package',
      version: '1.0.0',
      description: 'A test package',
      license: 'MIT',
      main: 'index.js',
      keywords: ['test'],
      repository: { type: 'git', url: 'https://github.com/test/test' },
      scripts: { test: 'vitest' },
      dependencies: { react: '^18.0.0' },
    });
    const issues = validate(pkg);
    const errors = issues.filter((i) => i.severity === 'error');
    expect(errors.length).toBe(0);
  });
});
