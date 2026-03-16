import { describe, expect, test } from 'bun:test';
import {
  convertCodeCase,
  toCamelCase,
  toConstantCase,
  toDotCase,
  toKebabCase,
  toPascalCase,
  toPathCase,
  toSnakeCase,
  toTrainCase,
} from '../codeCase';

describe('codeCase', () => {
  describe('toCamelCase', () => {
    test('from space-separated', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    test('from snake_case', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    test('from kebab-case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    test('from PascalCase', () => {
      expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    });

    test('from CONSTANT_CASE', () => {
      expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
    });

    test('handles empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    test('handles single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
    });

    test('handles multiple consecutive separators', () => {
      expect(toCamelCase('hello__world')).toBe('helloWorld');
    });
  });

  describe('toPascalCase', () => {
    test('from space-separated', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });

    test('from camelCase', () => {
      expect(toPascalCase('helloWorld')).toBe('HelloWorld');
    });

    test('from snake_case', () => {
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
    });

    test('handles empty string', () => {
      expect(toPascalCase('')).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    test('from space-separated', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });

    test('from camelCase', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    test('from PascalCase', () => {
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
    });

    test('handles empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });

    test('handles acronyms', () => {
      expect(toSnakeCase('parseHTTPResponse')).toBe('parse_http_response');
    });
  });

  describe('toKebabCase', () => {
    test('from camelCase', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    test('from snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    test('handles empty string', () => {
      expect(toKebabCase('')).toBe('');
    });
  });

  describe('toConstantCase', () => {
    test('from camelCase', () => {
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
    });

    test('from kebab-case', () => {
      expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
    });

    test('handles empty string', () => {
      expect(toConstantCase('')).toBe('');
    });
  });

  describe('toDotCase', () => {
    test('from camelCase', () => {
      expect(toDotCase('helloWorld')).toBe('hello.world');
    });

    test('handles empty string', () => {
      expect(toDotCase('')).toBe('');
    });
  });

  describe('toPathCase', () => {
    test('from camelCase', () => {
      expect(toPathCase('helloWorld')).toBe('hello/world');
    });

    test('handles empty string', () => {
      expect(toPathCase('')).toBe('');
    });
  });

  describe('toTrainCase', () => {
    test('from camelCase', () => {
      expect(toTrainCase('helloWorld')).toBe('Hello-World');
    });

    test('from snake_case', () => {
      expect(toTrainCase('hello_world')).toBe('Hello-World');
    });

    test('handles empty string', () => {
      expect(toTrainCase('')).toBe('');
    });
  });

  describe('convertCodeCase', () => {
    test('dispatches to each case type correctly', () => {
      const input = 'helloWorld';
      expect(convertCodeCase(input, 'camel')).toBe('helloWorld');
      expect(convertCodeCase(input, 'pascal')).toBe('HelloWorld');
      expect(convertCodeCase(input, 'snake')).toBe('hello_world');
      expect(convertCodeCase(input, 'kebab')).toBe('hello-world');
      expect(convertCodeCase(input, 'constant')).toBe('HELLO_WORLD');
      expect(convertCodeCase(input, 'dot')).toBe('hello.world');
      expect(convertCodeCase(input, 'path')).toBe('hello/world');
      expect(convertCodeCase(input, 'train')).toBe('Hello-World');
    });
  });
});
