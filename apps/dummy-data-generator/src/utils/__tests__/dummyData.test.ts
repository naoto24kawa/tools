import { describe, expect, test } from 'bun:test';
import { generateData, toCsv, toJson } from '../dummyData';

describe('dummyData', () => {
  test('generates correct number of rows', () => {
    const data = generateData([{ name: 'id', type: 'number' }], 5);
    expect(data.length).toBe(5);
  });

  test('generates fields with correct names', () => {
    const data = generateData(
      [
        { name: 'email', type: 'email' },
        { name: 'name', type: 'name' },
      ],
      1
    );
    expect(data[0]).toHaveProperty('email');
    expect(data[0]).toHaveProperty('name');
  });

  test('toJson returns valid JSON', () => {
    const data = generateData([{ name: 'x', type: 'number' }], 2);
    const json = toJson(data);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  test('toCsv returns CSV with headers', () => {
    const data = generateData([{ name: 'a', type: 'name' }], 1);
    const csv = toCsv(data);
    expect(csv.split('\n')[0]).toBe('a');
  });

  test('handles empty data', () => {
    expect(toCsv([])).toBe('');
  });
});
