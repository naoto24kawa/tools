import { describe, it, expect, beforeEach } from 'vitest';
import { createDatabase, executeSQL, getTableSchemas, type Database } from '../sqlEngine';

describe('sqlEngine', () => {
  let db: Database;

  beforeEach(() => {
    db = createDatabase();
  });

  describe('CREATE TABLE', () => {
    it('creates a table', () => {
      const result = executeSQL(db, 'CREATE TABLE users (id INT, name TEXT, age INT)');
      expect(result.error).toBeUndefined();
      expect(result.message).toContain('created');
    });

    it('returns error for duplicate table', () => {
      executeSQL(db, 'CREATE TABLE users (id INT)');
      const result = executeSQL(db, 'CREATE TABLE users (id INT)');
      expect(result.error).toContain('already exists');
    });

    it('returns error for invalid syntax', () => {
      const result = executeSQL(db, 'CREATE TABLE');
      expect(result.error).toBeDefined();
    });
  });

  describe('INSERT INTO', () => {
    beforeEach(() => {
      executeSQL(db, 'CREATE TABLE users (id INT, name TEXT, age INT)');
    });

    it('inserts a row', () => {
      const result = executeSQL(db, "INSERT INTO users VALUES (1, 'Alice', 30)");
      expect(result.error).toBeUndefined();
      expect(result.message).toContain('Inserted');
    });

    it('returns error for non-existent table', () => {
      const result = executeSQL(db, "INSERT INTO missing VALUES (1, 'test')");
      expect(result.error).toContain('not found');
    });

    it('handles multiple value tuples', () => {
      const result = executeSQL(
        db,
        "INSERT INTO users VALUES (1, 'Alice', 30), (2, 'Bob', 25)"
      );
      expect(result.error).toBeUndefined();
      expect(result.message).toContain('2');
    });
  });

  describe('SELECT', () => {
    beforeEach(() => {
      executeSQL(db, 'CREATE TABLE users (id INT, name TEXT, age INT, city TEXT)');
      executeSQL(db, "INSERT INTO users VALUES (1, 'Alice', 30, 'Tokyo')");
      executeSQL(db, "INSERT INTO users VALUES (2, 'Bob', 25, 'Osaka')");
      executeSQL(db, "INSERT INTO users VALUES (3, 'Charlie', 35, 'Tokyo')");
    });

    it('selects all columns with *', () => {
      const result = executeSQL(db, 'SELECT * FROM users');
      expect(result.columns).toEqual(['id', 'name', 'age', 'city']);
      expect(result.rows.length).toBe(3);
    });

    it('selects specific columns', () => {
      const result = executeSQL(db, 'SELECT name, age FROM users');
      expect(result.columns).toEqual(['name', 'age']);
      expect(result.rows.length).toBe(3);
    });

    it('filters with WHERE clause', () => {
      const result = executeSQL(db, "SELECT * FROM users WHERE city = 'Tokyo'");
      expect(result.rows.length).toBe(2);
    });

    it('supports WHERE with numeric comparison', () => {
      const result = executeSQL(db, 'SELECT * FROM users WHERE age > 27');
      expect(result.rows.length).toBe(2);
    });

    it('supports ORDER BY ASC', () => {
      const result = executeSQL(db, 'SELECT * FROM users ORDER BY age');
      expect(result.rows[0][1]).toBe('Bob');
      expect(result.rows[2][1]).toBe('Charlie');
    });

    it('supports ORDER BY DESC', () => {
      const result = executeSQL(db, 'SELECT * FROM users ORDER BY age DESC');
      expect(result.rows[0][1]).toBe('Charlie');
      expect(result.rows[2][1]).toBe('Bob');
    });

    it('supports LIMIT', () => {
      const result = executeSQL(db, 'SELECT * FROM users LIMIT 2');
      expect(result.rows.length).toBe(2);
    });

    it('supports COUNT(*)', () => {
      const result = executeSQL(db, 'SELECT COUNT(*) FROM users');
      expect(result.rows[0][0]).toBe('3');
    });

    it('returns error for non-existent table', () => {
      const result = executeSQL(db, 'SELECT * FROM missing');
      expect(result.error).toContain('not found');
    });

    it('returns error for non-existent column', () => {
      const result = executeSQL(db, 'SELECT missing FROM users');
      expect(result.error).toContain('not found');
    });

    it('supports WHERE with LIKE', () => {
      const result = executeSQL(db, "SELECT * FROM users WHERE name LIKE 'A%'");
      expect(result.rows.length).toBe(1);
      expect(result.rows[0][1]).toBe('Alice');
    });

    it('supports WHERE with != operator', () => {
      const result = executeSQL(db, "SELECT * FROM users WHERE city != 'Tokyo'");
      expect(result.rows.length).toBe(1);
    });
  });

  describe('DELETE', () => {
    beforeEach(() => {
      executeSQL(db, 'CREATE TABLE users (id INT, name TEXT)');
      executeSQL(db, "INSERT INTO users VALUES (1, 'Alice')");
      executeSQL(db, "INSERT INTO users VALUES (2, 'Bob')");
    });

    it('deletes all rows without WHERE', () => {
      const result = executeSQL(db, 'DELETE FROM users');
      expect(result.message).toContain('2');
      const select = executeSQL(db, 'SELECT * FROM users');
      expect(select.rows.length).toBe(0);
    });

    it('deletes rows matching WHERE', () => {
      const result = executeSQL(db, "DELETE FROM users WHERE name = 'Alice'");
      expect(result.message).toContain('1');
      const select = executeSQL(db, 'SELECT * FROM users');
      expect(select.rows.length).toBe(1);
    });
  });

  describe('UPDATE', () => {
    beforeEach(() => {
      executeSQL(db, 'CREATE TABLE users (id INT, name TEXT, age INT)');
      executeSQL(db, "INSERT INTO users VALUES (1, 'Alice', 30)");
      executeSQL(db, "INSERT INTO users VALUES (2, 'Bob', 25)");
    });

    it('updates rows matching WHERE', () => {
      const result = executeSQL(db, "UPDATE users SET age = 31 WHERE name = 'Alice'");
      expect(result.message).toContain('1');
      const select = executeSQL(db, "SELECT age FROM users WHERE name = 'Alice'");
      expect(select.rows[0][0]).toBe('31');
    });

    it('updates all rows without WHERE', () => {
      const result = executeSQL(db, 'UPDATE users SET age = 99');
      expect(result.message).toContain('2');
    });
  });

  describe('DROP TABLE', () => {
    it('drops an existing table', () => {
      executeSQL(db, 'CREATE TABLE users (id INT)');
      const result = executeSQL(db, 'DROP TABLE users');
      expect(result.message).toContain('dropped');
    });

    it('returns error for non-existent table', () => {
      const result = executeSQL(db, 'DROP TABLE missing');
      expect(result.error).toContain('not found');
    });
  });

  describe('SHOW TABLES', () => {
    it('lists all tables', () => {
      executeSQL(db, 'CREATE TABLE users (id INT)');
      executeSQL(db, 'CREATE TABLE orders (id INT)');
      const result = executeSQL(db, 'SHOW TABLES');
      expect(result.rows.length).toBe(2);
    });

    it('returns empty for no tables', () => {
      const result = executeSQL(db, 'SHOW TABLES');
      expect(result.rows.length).toBe(0);
    });
  });

  describe('getTableSchemas', () => {
    it('returns schemas for all tables', () => {
      executeSQL(db, 'CREATE TABLE users (id INT, name TEXT)');
      const schemas = getTableSchemas(db);
      expect(schemas.length).toBe(1);
      expect(schemas[0].name).toBe('USERS');
      expect(schemas[0].columns).toEqual(['id', 'name']);
    });
  });

  describe('edge cases', () => {
    it('handles empty query', () => {
      const result = executeSQL(db, '');
      expect(result.message).toBe('Empty query');
    });

    it('returns error for unsupported statements', () => {
      const result = executeSQL(db, 'ALTER TABLE users ADD COLUMN age INT');
      expect(result.error).toContain('Unsupported');
    });

    it('handles trailing semicolons', () => {
      const result = executeSQL(db, 'CREATE TABLE test (id INT);');
      expect(result.error).toBeUndefined();
    });
  });
});
