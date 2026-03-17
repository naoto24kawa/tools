import { describe, expect, test } from 'vitest';
import { generate, generateBulk, generateULID, generateUUIDv4 } from '../uuidGenerator';

describe('uuidGenerator', () => {
  describe('generateUUIDv4', () => {
    test('returns valid UUID v4 format', () => {
      const uuid = generateUUIDv4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('generates unique values', () => {
      const uuids = new Set(Array.from({ length: 10 }, () => generateUUIDv4()));
      expect(uuids.size).toBe(10);
    });
  });

  describe('generateULID', () => {
    test('returns 26 character string', () => {
      const ulid = generateULID();
      expect(ulid.length).toBe(26);
    });

    test('uses valid Crockford Base32 characters', () => {
      const ulid = generateULID();
      expect(ulid).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    });

    test('generates unique values', () => {
      const ulids = new Set(Array.from({ length: 10 }, () => generateULID()));
      expect(ulids.size).toBe(10);
    });

    test('is lexicographically sortable by time', () => {
      const ulid1 = generateULID();
      const ulid2 = generateULID();
      expect(ulid1.slice(0, 10) <= ulid2.slice(0, 10)).toBe(true);
    });
  });

  describe('generate', () => {
    test('dispatches to v4', () => {
      const result = generate('v4');
      expect(result).toMatch(/^[0-9a-f]{8}-/);
    });

    test('dispatches to ulid', () => {
      const result = generate('ulid');
      expect(result.length).toBe(26);
    });
  });

  describe('generateBulk', () => {
    test('generates correct count', () => {
      const results = generateBulk('v4', 10);
      expect(results.length).toBe(10);
    });

    test('all unique', () => {
      const results = generateBulk('v4', 20);
      expect(new Set(results).size).toBe(20);
    });
  });
});
