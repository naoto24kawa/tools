import { describe, expect, test } from 'vitest';
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

    test('from dot.case', () => {
      expect(toCamelCase('com.example.app')).toBe('comExampleApp');
    });

    test('from path/case', () => {
      expect(toCamelCase('path/to/file')).toBe('pathToFile');
    });

    test('from backslash separated', () => {
      expect(toCamelCase('back\\slash\\case')).toBe('backSlashCase');
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

    test('handles numbers in identifier', () => {
      expect(toCamelCase('base64_encode')).toBe('base64Encode');
    });

    test('handles digit-letter boundary', () => {
      expect(toCamelCase('version2Update')).toBe('version2Update');
    });

    test('handles leading/trailing whitespace', () => {
      expect(toCamelCase('  hello world  ')).toBe('helloWorld');
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

    test('from kebab-case with acronym', () => {
      expect(toPascalCase('http-response')).toBe('HttpResponse');
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

    test('from dot.case', () => {
      expect(toSnakeCase('com.example.app')).toBe('com_example_app');
    });

    test('handles numbers', () => {
      expect(toSnakeCase('base64Encode')).toBe('base_64_encode');
    });
  });

  describe('toKebabCase', () => {
    test('from camelCase', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    test('from snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    test('from path/case', () => {
      expect(toKebabCase('path/to/file')).toBe('path-to-file');
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

    test('from snake_case', () => {
      expect(toDotCase('hello_world')).toBe('hello.world');
    });

    test('from Train-Case', () => {
      expect(toDotCase('Hello-World')).toBe('hello.world');
    });

    test('handles empty string', () => {
      expect(toDotCase('')).toBe('');
    });
  });

  describe('toPathCase', () => {
    test('from camelCase', () => {
      expect(toPathCase('helloWorld')).toBe('hello/world');
    });

    test('from kebab-case', () => {
      expect(toPathCase('hello-world')).toBe('hello/world');
    });

    test('from snake_case', () => {
      expect(toPathCase('hello_world')).toBe('hello/world');
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
    const input = 'helloWorld';

    test('dispatches to camel', () => {
      expect(convertCodeCase(input, 'camel')).toBe('helloWorld');
    });

    test('dispatches to pascal', () => {
      expect(convertCodeCase(input, 'pascal')).toBe('HelloWorld');
    });

    test('dispatches to snake', () => {
      expect(convertCodeCase(input, 'snake')).toBe('hello_world');
    });

    test('dispatches to kebab', () => {
      expect(convertCodeCase(input, 'kebab')).toBe('hello-world');
    });

    test('dispatches to constant', () => {
      expect(convertCodeCase(input, 'constant')).toBe('HELLO_WORLD');
    });

    test('dispatches to dot', () => {
      expect(convertCodeCase(input, 'dot')).toBe('hello.world');
    });

    test('dispatches to path', () => {
      expect(convertCodeCase(input, 'path')).toBe('hello/world');
    });

    test('dispatches to train', () => {
      expect(convertCodeCase(input, 'train')).toBe('Hello-World');
    });
  });

  describe('round-trip consistency', () => {
    test('camel -> snake -> camel preserves value', () => {
      expect(toCamelCase(toSnakeCase('myVariableName'))).toBe('myVariableName');
    });

    test('pascal -> kebab -> pascal preserves value', () => {
      expect(toPascalCase(toKebabCase('HelloWorld'))).toBe('HelloWorld');
    });
  });
});
