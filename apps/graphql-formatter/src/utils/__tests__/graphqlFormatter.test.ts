import { describe, expect, test } from 'bun:test';
import { formatGraphql, minifyGraphql } from '../graphqlFormatter';

describe('formatGraphql', () => {
  test('formats a basic GraphQL query with proper indentation', () => {
    const input = '{ user { name age } }';
    const expected = ['{', '  user {', '    name', '    age', '  }', '}'].join('\n');
    expect(formatGraphql(input)).toBe(expected);
  });

  test('formats a query with arguments', () => {
    const input = 'query { user(id: 1) { name email } }';
    const expected = ['query {', '  user(id: 1) {', '    name', '    email', '  }', '}'].join('\n');
    expect(formatGraphql(input)).toBe(expected);
  });

  test('returns empty string for empty input', () => {
    expect(formatGraphql('')).toBe('');
    expect(formatGraphql('   ')).toBe('');
  });

  test('preserves string literals', () => {
    const input = '{ user(name: "John Doe") { id } }';
    const expected = ['{', '  user(name: "John Doe") {', '    id', '  }', '}'].join('\n');
    expect(formatGraphql(input)).toBe(expected);
  });
});

describe('minifyGraphql', () => {
  test('minifies a formatted GraphQL query', () => {
    const input = ['query {', '  user {', '    name', '    age', '  }', '}'].join('\n');
    expect(minifyGraphql(input)).toBe('query{user{name age}}');
  });

  test('removes comments from GraphQL', () => {
    const input = [
      '# This is a comment',
      'query {',
      '  # Another comment',
      '  user {',
      '    name',
      '  }',
      '}',
    ].join('\n');
    expect(minifyGraphql(input)).toBe('query{user{name}}');
  });

  test('returns empty string for empty input', () => {
    expect(minifyGraphql('')).toBe('');
    expect(minifyGraphql('   ')).toBe('');
  });

  test('preserves strings during minification', () => {
    const input = '{ user(name: "John Doe") { id } }';
    expect(minifyGraphql(input)).toBe('{user(name:"John Doe"){id}}');
  });
});
