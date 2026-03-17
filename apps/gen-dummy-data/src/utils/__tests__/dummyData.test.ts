import { describe, expect, test } from 'bun:test';
import { generateDummyData, generateDummyRecord, toCSV, toJSON } from '../dummyData';

describe('dummyData', () => {
  test('generateDummyRecord has all fields', () => {
    const r = generateDummyRecord();
    expect(r.name).toBeDefined();
    expect(r.email).toContain('@');
    expect(r.age).toBeGreaterThanOrEqual(18);
    expect(r.age).toBeLessThanOrEqual(80);
    expect(r.city).toBeDefined();
    expect(r.phone).toMatch(/^0\d{2}-\d{4}-\d{4}$/);
  });

  test('generateDummyData returns correct count', () => {
    expect(generateDummyData(5).length).toBe(5);
  });

  test('toJSON returns valid JSON', () => {
    const data = generateDummyData(3);
    const json = toJSON(data);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  test('toCSV has header and rows', () => {
    const data = generateDummyData(3);
    const csv = toCSV(data);
    const lines = csv.split('\n');
    expect(lines.length).toBe(4);
    expect(lines[0]).toContain('name');
  });

  test('toCSV empty', () => {
    expect(toCSV([])).toBe('');
  });

  test('generates unique records', () => {
    const data = generateDummyData(10);
    const emails = data.map((r) => r.email);
    expect(new Set(emails).size).toBeGreaterThan(1);
  });
});
