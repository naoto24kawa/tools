import { describe, expect, test } from 'bun:test';
import { jsonToYaml } from '../jsonToYaml';

describe('jsonToYaml', () => {
  test('simple object', () => {
    const result = jsonToYaml('{"name":"Alice","age":30}');
    expect(result.error).toBeNull();
    expect(result.yaml).toContain('name: Alice');
    expect(result.yaml).toContain('age: 30');
  });

  test('nested object', () => {
    const result = jsonToYaml('{"a":{"b":1}}');
    expect(result.yaml).toContain('a:');
    expect(result.yaml).toContain('  b: 1');
  });

  test('array', () => {
    const result = jsonToYaml('[1,2,3]');
    expect(result.yaml).toContain('- 1');
    expect(result.yaml).toContain('- 2');
  });

  test('null value', () => {
    const result = jsonToYaml('{"a":null}');
    expect(result.yaml).toContain('a: null');
  });

  test('boolean values', () => {
    const result = jsonToYaml('{"a":true,"b":false}');
    expect(result.yaml).toContain('a: true');
    expect(result.yaml).toContain('b: false');
  });

  test('string with special chars is quoted', () => {
    const result = jsonToYaml('{"a":"hello: world"}');
    expect(result.yaml).toContain("'hello: world'");
  });

  test('empty object', () => {
    expect(jsonToYaml('{}').yaml).toBe('{}');
  });

  test('empty array', () => {
    expect(jsonToYaml('[]').yaml).toBe('[]');
  });

  test('invalid JSON', () => {
    expect(jsonToYaml('{invalid}').error).not.toBeNull();
  });

  test('empty input', () => {
    expect(jsonToYaml('').yaml).toBe('');
  });
});
