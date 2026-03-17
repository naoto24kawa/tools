import { describe, expect, test } from 'vitest';
import { formatYaml, jsonToYaml, yamlToJson } from '../yamlFormatter';

describe('yamlFormatter', () => {
  test('converts simple YAML to JSON', () => {
    const result = yamlToJson('name: test\nvalue: 42');
    const parsed = JSON.parse(result);
    expect(parsed.name).toBe('test');
    expect(parsed.value).toBe(42);
  });

  test('converts JSON to YAML', () => {
    const result = jsonToYaml('{"name":"test","active":true}');
    expect(result).toContain('name: test');
    expect(result).toContain('active: true');
  });

  test('handles lists', () => {
    const yaml = '- one\n- two\n- three';
    const json = yamlToJson(yaml);
    expect(JSON.parse(json)).toEqual(['one', 'two', 'three']);
  });

  test('formats YAML', () => {
    const result = formatYaml('name: test\nvalue: 42');
    expect(result).toContain('name: test');
  });
});
