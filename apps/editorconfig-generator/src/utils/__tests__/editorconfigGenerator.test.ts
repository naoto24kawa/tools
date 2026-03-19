import { describe, test, expect } from 'vitest';
import {
  generateEditorConfig,
  presets,
  defaultGlobal,
  type EditorConfigData,
} from '../editorconfigGenerator';

describe('generateEditorConfig', () => {
  test('should generate root = true', () => {
    const data: EditorConfigData = {
      global: { ...defaultGlobal, root: true },
      extensions: [
        {
          pattern: '*',
          indentStyle: 'space',
          indentSize: 2,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result).toContain('root = true');
  });

  test('should include charset and end_of_line', () => {
    const data: EditorConfigData = {
      global: { ...defaultGlobal, charset: 'utf-8', endOfLine: 'lf' },
      extensions: [
        {
          pattern: '*',
          indentStyle: 'space',
          indentSize: 2,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result).toContain('charset = utf-8');
    expect(result).toContain('end_of_line = lf');
  });

  test('should generate per-extension sections', () => {
    const data: EditorConfigData = {
      global: defaultGlobal,
      extensions: [
        {
          pattern: '*.js',
          indentStyle: 'space',
          indentSize: 2,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
        {
          pattern: '*.py',
          indentStyle: 'space',
          indentSize: 4,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result).toContain('[*.js]');
    expect(result).toContain('[*.py]');
    expect(result).toContain('indent_size = 2');
    expect(result).toContain('indent_size = 4');
  });

  test('should include tab_width for tab indent_style', () => {
    const data: EditorConfigData = {
      global: defaultGlobal,
      extensions: [
        {
          pattern: 'Makefile',
          indentStyle: 'tab',
          indentSize: 4,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result).toContain('indent_style = tab');
    expect(result).toContain('tab_width = 4');
  });

  test('should handle trim_trailing_whitespace = false', () => {
    const data: EditorConfigData = {
      global: defaultGlobal,
      extensions: [
        {
          pattern: '*.md',
          indentStyle: 'space',
          indentSize: 2,
          trimTrailingWhitespace: false,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result).toContain('trim_trailing_whitespace = false');
  });

  test('should end with newline', () => {
    const data: EditorConfigData = {
      global: defaultGlobal,
      extensions: [
        {
          pattern: '*',
          indentStyle: 'space',
          indentSize: 2,
          trimTrailingWhitespace: true,
          insertFinalNewline: true,
        },
      ],
    };
    const result = generateEditorConfig(data);
    expect(result.endsWith('\n')).toBe(true);
  });
});

describe('presets', () => {
  test('default preset should have 3 extension sections', () => {
    expect(presets.default.extensions.length).toBe(3);
  });

  test('google preset should have extensions', () => {
    expect(presets.google.extensions.length).toBeGreaterThan(0);
  });

  test('airbnb preset should have extensions', () => {
    expect(presets.airbnb.extensions.length).toBeGreaterThan(0);
  });

  test('all presets generate valid output', () => {
    for (const key of Object.keys(presets)) {
      const result = generateEditorConfig(presets[key]);
      expect(result).toContain('root = true');
      expect(result.length).toBeGreaterThan(0);
    }
  });
});
