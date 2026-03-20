import { describe, expect, test, beforeAll, afterEach } from 'vitest';
import { initDatabase, executeQuery, resetDatabase, getTableNames } from '../sqlEngine';

beforeAll(async () => {
  await initDatabase();
});

afterEach(() => {
  try {
    executeQuery('DROP TABLE IF EXISTS test_table');
  } catch {
    // ignore
  }
});

describe('sqlEngine (sql.js)', () => {
  test('CREATE TABLE + INSERT + SELECT', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER PRIMARY KEY, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    const results = executeQuery('SELECT * FROM test_table');
    expect(results[0].columns).toEqual(['id', 'name']);
    expect(results[0].values).toEqual([[1, 'Alice']]);
  });

  test('UPDATE', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    executeQuery("UPDATE test_table SET name = 'Bob' WHERE id = 1");
    const results = executeQuery('SELECT name FROM test_table WHERE id = 1');
    expect(results[0].values[0][0]).toBe('Bob');
  });

  test('DELETE', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER, name TEXT)');
    executeQuery("INSERT INTO test_table VALUES (1, 'Alice')");
    executeQuery('DELETE FROM test_table WHERE id = 1');
    const results = executeQuery('SELECT * FROM test_table');
    expect(results).toHaveLength(0);
  });

  test('invalid SQL throws', () => {
    expect(() => executeQuery('INVALID SQL')).toThrow();
  });

  test('getTableNames returns created tables', () => {
    executeQuery('CREATE TABLE test_table (id INTEGER)');
    const names = getTableNames();
    expect(names).toContain('test_table');
  });
});
