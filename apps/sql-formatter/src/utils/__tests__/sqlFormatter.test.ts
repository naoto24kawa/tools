import { describe, expect, test } from 'bun:test';
import { formatSql, minifySql } from '../sqlFormatter';

describe('formatSql', () => {
  test('formats a simple SELECT query', () => {
    const input = 'SELECT id, name FROM users WHERE active = 1';
    const result = formatSql(input);
    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('WHERE');
    // Each keyword should be on its own line
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  test('handles JOIN clauses', () => {
    const input =
      'SELECT u.id, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1';
    const result = formatSql(input);
    expect(result).toContain('LEFT JOIN');
    expect(result).toContain('ON');
    const lines = result.split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(4);
  });

  test('handles subqueries with parentheses', () => {
    const input = 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders)';
    const result = formatSql(input);
    expect(result).toContain('(');
    expect(result).toContain(')');
    expect(result).toContain('SELECT');
  });

  test('uppercases SQL keywords', () => {
    const input = "select id from users where name = 'test'";
    const result = formatSql(input);
    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('WHERE');
  });

  test('preserves string literals', () => {
    const input = "SELECT * FROM users WHERE name = 'hello world'";
    const result = formatSql(input);
    expect(result).toContain("'hello world'");
  });
});

describe('minifySql', () => {
  test('minifies multi-line SQL into single line', () => {
    const input = `SELECT id, name
FROM users
WHERE active = 1
AND role = 'admin'`;
    const result = minifySql(input);
    expect(result).not.toContain('\n');
    expect(result).toBe("SELECT id, name FROM users WHERE active = 1 AND role = 'admin'");
  });

  test('removes SQL comments', () => {
    const input = `SELECT id -- get the id
FROM users -- from users table
WHERE active = 1`;
    const result = minifySql(input);
    expect(result).not.toContain('--');
    expect(result).not.toContain('get the id');
    expect(result).toContain('SELECT id');
    expect(result).toContain('FROM users');
  });
});
