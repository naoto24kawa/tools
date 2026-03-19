import { describe, it, expect } from 'vitest';
import { parse, toJsonSchema } from '../sqlToSchema';

describe('sqlToSchema', () => {
  describe('parse', () => {
    it('parses a simple CREATE TABLE', () => {
      const sql = 'CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL);';
      const tables = parse(sql);
      expect(tables).toHaveLength(1);
      expect(tables[0].name).toBe('users');
      expect(tables[0].columns).toHaveLength(2);
    });

    it('parses column types correctly', () => {
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT NOT NULL, active BOOLEAN);';
      const tables = parse(sql);
      expect(tables[0].columns[0].type).toMatch(/INTEGER/i);
      expect(tables[0].columns[1].type).toMatch(/TEXT/i);
      expect(tables[0].columns[2].type).toMatch(/BOOLEAN/i);
    });

    it('detects NOT NULL constraint', () => {
      const sql = 'CREATE TABLE test (id INTEGER NOT NULL, name TEXT);';
      const tables = parse(sql);
      expect(tables[0].columns[0].nullable).toBe(false);
      expect(tables[0].columns[1].nullable).toBe(true);
    });

    it('detects PRIMARY KEY', () => {
      const sql = 'CREATE TABLE test (id INTEGER PRIMARY KEY);';
      const tables = parse(sql);
      expect(tables[0].columns[0].primaryKey).toBe(true);
      expect(tables[0].columns[0].nullable).toBe(false);
    });

    it('detects UNIQUE constraint', () => {
      const sql = 'CREATE TABLE test (email VARCHAR(255) UNIQUE NOT NULL);';
      const tables = parse(sql);
      expect(tables[0].columns[0].unique).toBe(true);
    });

    it('handles IF NOT EXISTS', () => {
      const sql = 'CREATE TABLE IF NOT EXISTS users (id INTEGER);';
      const tables = parse(sql);
      expect(tables[0].name).toBe('users');
    });

    it('parses multiple tables', () => {
      const sql = `
        CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER);
      `;
      const tables = parse(sql);
      expect(tables).toHaveLength(2);
    });

    it('skips table-level constraints', () => {
      const sql = 'CREATE TABLE test (id INTEGER, name TEXT, PRIMARY KEY (id));';
      const tables = parse(sql);
      expect(tables[0].columns).toHaveLength(2);
    });

    it('throws on empty input', () => {
      expect(() => parse('')).toThrow('Input is empty');
    });

    it('throws when no CREATE TABLE found', () => {
      expect(() => parse('SELECT * FROM users')).toThrow('No CREATE TABLE statements found');
    });
  });

  describe('toJsonSchema', () => {
    it('generates valid JSON Schema', () => {
      const tables = parse('CREATE TABLE users (id INTEGER PRIMARY KEY, name VARCHAR(255) NOT NULL);');
      const schemaStr = toJsonSchema(tables);
      const schema = JSON.parse(schemaStr);
      expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#');
      expect(schema.type).toBe('object');
      expect(schema.title).toBe('users');
    });

    it('maps NOT NULL to required', () => {
      const tables = parse('CREATE TABLE test (id INTEGER NOT NULL, name TEXT);');
      const schema = JSON.parse(toJsonSchema(tables));
      expect(schema.required).toContain('id');
      expect(schema.required).not.toContain('name');
    });

    it('maps SQL types to JSON Schema types', () => {
      const tables = parse('CREATE TABLE test (a INTEGER, b TEXT, c BOOLEAN, d TIMESTAMP);');
      const schema = JSON.parse(toJsonSchema(tables));
      expect(schema.properties.a.type).toContain('integer');
      expect(schema.properties.b.type).toContain('string');
      expect(schema.properties.c.type).toContain('boolean');
      expect(schema.properties.d.type).toContain('string');
      expect(schema.properties.d.format).toBe('date-time');
    });

    it('extracts maxLength from VARCHAR', () => {
      const tables = parse('CREATE TABLE test (name VARCHAR(100) NOT NULL);');
      const schema = JSON.parse(toJsonSchema(tables));
      expect(schema.properties.name.maxLength).toBe(100);
    });

    it('wraps multiple tables in an object', () => {
      const sql = `
        CREATE TABLE users (id INTEGER);
        CREATE TABLE posts (id INTEGER);
      `;
      const tables = parse(sql);
      const schema = JSON.parse(toJsonSchema(tables));
      expect(schema.users).toBeDefined();
      expect(schema.posts).toBeDefined();
    });
  });
});
