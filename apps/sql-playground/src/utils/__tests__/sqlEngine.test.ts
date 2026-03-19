import { describe, it, expect } from 'vitest';
import { createDatabase, executeSQL, getTableSchemas } from '../sqlEngine';

describe('sqlEngine', () => {
  it('creates a table', () => {
    const db = createDatabase();
    const result = executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR, age INT)');
    expect(result.error).toBeUndefined();
    expect(result.message).toContain('created');
    expect(getTableSchemas(db).length).toBe(1);
  });

  it('inserts rows', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR)');
    const result = executeSQL(db, "INSERT INTO users VALUES (1, 'Alice')");
    expect(result.error).toBeUndefined();
    expect(result.message).toContain('Inserted');
  });

  it('selects all rows', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR)');
    executeSQL(db, "INSERT INTO users VALUES (1, 'Alice')");
    executeSQL(db, "INSERT INTO users VALUES (2, 'Bob')");

    const result = executeSQL(db, 'SELECT * FROM users');
    expect(result.error).toBeUndefined();
    expect(result.columns).toEqual(['id', 'name']);
    expect(result.rows.length).toBe(2);
  });

  it('selects with WHERE clause', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR, age INT)');
    executeSQL(db, "INSERT INTO users VALUES (1, 'Alice', 30)");
    executeSQL(db, "INSERT INTO users VALUES (2, 'Bob', 25)");

    const result = executeSQL(db, 'SELECT * FROM users WHERE age > 28');
    expect(result.rows.length).toBe(1);
    expect(result.rows[0][1]).toBe('Alice');
  });

  it('handles COUNT(*)', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE items (id INT)');
    executeSQL(db, 'INSERT INTO items VALUES (1)');
    executeSQL(db, 'INSERT INTO items VALUES (2)');
    executeSQL(db, 'INSERT INTO items VALUES (3)');

    const result = executeSQL(db, 'SELECT COUNT(*) FROM items');
    expect(result.rows[0][0]).toBe('3');
  });

  it('supports ORDER BY', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE nums (val INT)');
    executeSQL(db, 'INSERT INTO nums VALUES (3)');
    executeSQL(db, 'INSERT INTO nums VALUES (1)');
    executeSQL(db, 'INSERT INTO nums VALUES (2)');

    const result = executeSQL(db, 'SELECT * FROM nums ORDER BY val');
    expect(result.rows.map((r) => r[0])).toEqual(['1', '2', '3']);
  });

  it('supports LIMIT', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE nums (val INT)');
    executeSQL(db, 'INSERT INTO nums VALUES (1)');
    executeSQL(db, 'INSERT INTO nums VALUES (2)');
    executeSQL(db, 'INSERT INTO nums VALUES (3)');

    const result = executeSQL(db, 'SELECT * FROM nums LIMIT 2');
    expect(result.rows.length).toBe(2);
  });

  it('deletes rows', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR)');
    executeSQL(db, "INSERT INTO users VALUES (1, 'Alice')");
    executeSQL(db, "INSERT INTO users VALUES (2, 'Bob')");

    executeSQL(db, "DELETE FROM users WHERE name = 'Alice'");
    const result = executeSQL(db, 'SELECT * FROM users');
    expect(result.rows.length).toBe(1);
  });

  it('updates rows', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT, name VARCHAR)');
    executeSQL(db, "INSERT INTO users VALUES (1, 'Alice')");

    executeSQL(db, "UPDATE users SET name = 'Bob' WHERE id = 1");
    const result = executeSQL(db, 'SELECT * FROM users');
    expect(result.rows[0][1]).toBe('Bob');
  });

  it('drops a table', () => {
    const db = createDatabase();
    executeSQL(db, 'CREATE TABLE users (id INT)');
    executeSQL(db, 'DROP TABLE users');
    expect(getTableSchemas(db).length).toBe(0);
  });

  it('returns error for missing table', () => {
    const db = createDatabase();
    const result = executeSQL(db, 'SELECT * FROM nonexistent');
    expect(result.error).toBeDefined();
  });

  it('handles empty query', () => {
    const db = createDatabase();
    const result = executeSQL(db, '');
    expect(result.message).toBe('Empty query');
  });
});
