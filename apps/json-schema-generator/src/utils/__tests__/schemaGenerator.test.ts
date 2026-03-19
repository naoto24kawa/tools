import { describe, it, expect } from 'vitest';
import { generate } from '../schemaGenerator';

describe('schemaGenerator', () => {
  it('generates schema for a simple object', () => {
    const json = '{"name": "Alice", "age": 30}';
    const schema = JSON.parse(generate(json));
    expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(schema.type).toBe('object');
    expect(schema.properties.name.type).toBe('string');
    expect(schema.properties.age.type).toBe('integer');
  });

  it('generates schema for an array', () => {
    const json = '[1, 2, 3]';
    const schema = JSON.parse(generate(json));
    expect(schema.type).toBe('array');
    expect(schema.items.type).toBe('integer');
  });

  it('generates schema for nested objects', () => {
    const json = '{"user": {"name": "Alice", "address": {"city": "Tokyo"}}}';
    const schema = JSON.parse(generate(json));
    expect(schema.properties.user.type).toBe('object');
    expect(schema.properties.user.properties.address.type).toBe('object');
    expect(schema.properties.user.properties.address.properties.city.type).toBe('string');
  });

  it('detects integer vs number', () => {
    const json = '{"integer": 42, "float": 3.14}';
    const schema = JSON.parse(generate(json));
    expect(schema.properties.integer.type).toBe('integer');
    expect(schema.properties.float.type).toBe('number');
  });

  it('includes required fields when requireAll is true', () => {
    const json = '{"name": "Alice", "age": 30}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: true, prettyPrint: false }));
    expect(schema.required).toContain('name');
    expect(schema.required).toContain('age');
  });

  it('excludes required fields when requireAll is false', () => {
    const json = '{"name": "Alice"}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.required).toBeUndefined();
  });

  it('includes examples when enabled', () => {
    const json = '{"name": "Alice"}';
    const schema = JSON.parse(generate(json, { includeExamples: true, requireAll: false, prettyPrint: false }));
    expect(schema.properties.name.examples).toEqual(['Alice']);
  });

  it('detects date format', () => {
    const json = '{"date": "2024-01-15"}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.properties.date.format).toBe('date');
  });

  it('detects email format', () => {
    const json = '{"email": "alice@example.com"}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.properties.email.format).toBe('email');
  });

  it('detects URI format', () => {
    const json = '{"url": "https://example.com"}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.properties.url.format).toBe('uri');
  });

  it('handles boolean type', () => {
    const json = '{"active": true}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.properties.active.type).toBe('boolean');
  });

  it('handles null type', () => {
    const json = '{"value": null}';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: false, prettyPrint: false }));
    expect(schema.properties.value.type).toBe('null');
  });

  it('handles array of objects', () => {
    const json = '[{"name": "Alice"}, {"name": "Bob"}]';
    const schema = JSON.parse(generate(json, { includeExamples: false, requireAll: true, prettyPrint: false }));
    expect(schema.type).toBe('array');
    expect(schema.items.type).toBe('object');
    expect(schema.items.properties.name.type).toBe('string');
  });

  it('throws on empty input', () => {
    expect(() => generate('')).toThrow('Input is empty');
  });

  it('throws on invalid JSON', () => {
    expect(() => generate('{invalid}')).toThrow('Invalid JSON');
  });
});
