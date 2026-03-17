import { describe, expect, test } from 'bun:test';
import { queryJsonPath } from '../jsonpath';

describe('jsonpath', () => {
  const data = {
    store: { books: [{ title: 'A' }, { title: 'B' }], name: 'test' },
  };

  test('root query', () => {
    expect(queryJsonPath(data, '$')).toEqual([data]);
  });

  test('simple property access', () => {
    expect(queryJsonPath(data, '$.store.name')).toEqual(['test']);
  });

  test('array index', () => {
    expect(queryJsonPath(data, '$.store.books[0].title')).toEqual(['A']);
  });

  test('wildcard', () => {
    expect(queryJsonPath(data, '$.store.books.*')).toEqual([{ title: 'A' }, { title: 'B' }]);
  });

  test('invalid path throws', () => {
    expect(() => queryJsonPath(data, 'invalid')).toThrow();
  });
});
