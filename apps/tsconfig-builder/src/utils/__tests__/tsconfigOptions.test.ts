import { describe, test, expect } from 'vitest';
import {
  buildConfig,
  getCategories,
  getOptionsByCategory,
  tsconfigOptions,
  type TsconfigState,
} from '../tsconfigOptions';

describe('buildConfig', () => {
  test('should return empty config for default state', () => {
    const state: TsconfigState = {
      compilerOptions: {},
      include: [],
      exclude: [],
    };
    const result = buildConfig(state);
    expect(result).toEqual({});
  });

  test('should include set compiler options', () => {
    const state: TsconfigState = {
      compilerOptions: { target: 'ES2022', strict: true },
      include: [],
      exclude: [],
    };
    const result = buildConfig(state);
    expect(result.compilerOptions).toBeDefined();
    const co = result.compilerOptions as Record<string, unknown>;
    expect(co.target).toBe('ES2022');
    expect(co.strict).toBe(true);
  });

  test('should exclude false boolean values', () => {
    const state: TsconfigState = {
      compilerOptions: { strict: false, noImplicitAny: false },
      include: [],
      exclude: [],
    };
    const result = buildConfig(state);
    expect(result.compilerOptions).toBeUndefined();
  });

  test('should exclude empty string values', () => {
    const state: TsconfigState = {
      compilerOptions: { outDir: '', rootDir: '' },
      include: [],
      exclude: [],
    };
    const result = buildConfig(state);
    expect(result.compilerOptions).toBeUndefined();
  });

  test('should include include/exclude arrays', () => {
    const state: TsconfigState = {
      compilerOptions: {},
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
    const result = buildConfig(state);
    expect(result.include).toEqual(['src']);
    expect(result.exclude).toEqual(['node_modules', 'dist']);
  });

  test('should filter empty include/exclude entries', () => {
    const state: TsconfigState = {
      compilerOptions: {},
      include: ['src', '', '  '],
      exclude: [''],
    };
    const result = buildConfig(state);
    expect(result.include).toEqual(['src']);
    expect(result.exclude).toBeUndefined();
  });

  test('should parse lib as comma-separated array', () => {
    const state: TsconfigState = {
      compilerOptions: { lib: 'ES2022, DOM, DOM.Iterable' },
      include: [],
      exclude: [],
    };
    const result = buildConfig(state);
    const co = result.compilerOptions as Record<string, unknown>;
    expect(co.lib).toEqual(['ES2022', 'DOM', 'DOM.Iterable']);
  });

  test('should handle full configuration', () => {
    const state: TsconfigState = {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        outDir: './dist',
        jsx: 'react-jsx',
      },
      include: ['src'],
      exclude: ['node_modules'],
    };
    const result = buildConfig(state);
    expect(result.compilerOptions).toBeDefined();
    expect(result.include).toEqual(['src']);
    expect(result.exclude).toEqual(['node_modules']);
  });
});

describe('getCategories', () => {
  test('should return unique categories', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });

  test('should include expected categories', () => {
    const categories = getCategories();
    expect(categories).toContain('Target & Module');
    expect(categories).toContain('Strict Options');
    expect(categories).toContain('Emit Options');
    expect(categories).toContain('Interop');
  });
});

describe('getOptionsByCategory', () => {
  test('should return options for a category', () => {
    const options = getOptionsByCategory('Strict Options');
    expect(options.length).toBeGreaterThan(0);
    expect(options.every((o) => o.category === 'Strict Options')).toBe(true);
  });

  test('should return empty array for unknown category', () => {
    const options = getOptionsByCategory('NonExistent');
    expect(options.length).toBe(0);
  });
});

describe('tsconfigOptions', () => {
  test('should have unique keys', () => {
    const keys = tsconfigOptions.map((o) => o.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('each option should have required fields', () => {
    for (const opt of tsconfigOptions) {
      expect(opt.key).toBeTruthy();
      expect(opt.label).toBeTruthy();
      expect(opt.description).toBeTruthy();
      expect(opt.category).toBeTruthy();
      expect(['boolean', 'select', 'text', 'array']).toContain(opt.type);
    }
  });
});
