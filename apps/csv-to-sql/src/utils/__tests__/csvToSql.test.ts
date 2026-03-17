import { describe, expect, test } from 'bun:test';
import { convertCsvToSql, DEFAULT_OPTIONS } from '../csvToSql';

describe('convertCsvToSql', () => {
  test('basic conversion', () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain('INSERT INTO `table_name`');
    expect(result).toContain("'Alice'");
    expect(result).toContain('30');
  });

  test('numeric values are not quoted', () => {
    const csv = 'id,name\n1,Alice';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain('(1,');
  });

  test('NULL handling', () => {
    const csv = 'name,value\nAlice,null';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain('NULL');
  });

  test('empty values become NULL', () => {
    const csv = 'name,value\nAlice,';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain('NULL');
  });

  test('SQL injection prevention (single quotes escaped)', () => {
    const csv = "name\nO'Brien";
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain("O''Brien");
  });

  test('custom table name', () => {
    const csv = 'name\nAlice';
    const result = convertCsvToSql(csv, { ...DEFAULT_OPTIONS, tableName: 'users' });
    expect(result).toContain('`users`');
  });

  test('custom delimiter', () => {
    const csv = 'name\tage\nAlice\t30';
    const result = convertCsvToSql(csv, { ...DEFAULT_OPTIONS, delimiter: '\t' });
    expect(result).toContain("'Alice'");
    expect(result).toContain('30');
  });

  test('handles quoted CSV fields', () => {
    const csv = 'name,desc\n"Alice","Hello, World"';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    expect(result).toContain("'Hello, World'");
  });

  test('empty input returns empty', () => {
    expect(convertCsvToSql('', DEFAULT_OPTIONS)).toBe('');
  });

  test('header only returns empty', () => {
    expect(convertCsvToSql('name,age', DEFAULT_OPTIONS)).toBe('');
  });

  test('multiple rows', () => {
    const csv = 'name\nA\nB\nC';
    const result = convertCsvToSql(csv, DEFAULT_OPTIONS);
    const lines = result.split('\n');
    expect(lines.length).toBe(3);
  });
});
