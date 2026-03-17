import { describe, expect, test } from 'vitest';
import { generateULID, generateUUIDv4, parseUUID } from '../uuidGenerator';

describe('UUID/ULID Generator', () => {
  test('generateUUIDv4 returns valid UUID v4 format', () => {
    const uuid = generateUUIDv4();
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(pattern);
  });

  test('generateUUIDv4 returns unique values', () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(generateUUIDv4());
    }
    expect(uuids.size).toBe(100);
  });

  test('generateULID returns 26-character Crockford Base32 string', () => {
    const ulid = generateULID();
    expect(ulid).toHaveLength(26);
    const crockfordPattern = /^[0-9A-HJKMNP-TV-Z]{26}$/;
    expect(ulid).toMatch(crockfordPattern);
  });

  test('generateULID is sortable by timestamp', () => {
    const ulid1 = generateULID();
    // Wait a tiny bit to ensure different timestamp
    const start = Date.now();
    while (Date.now() === start) {
      // busy-wait for next ms
    }
    const ulid2 = generateULID();
    // Timestamp portion (first 10 chars) of ulid2 should be >= ulid1
    expect(ulid2.slice(0, 10) >= ulid1.slice(0, 10)).toBe(true);
  });

  test('parseUUID correctly parses UUID v4', () => {
    const uuid = generateUUIDv4();
    const result = parseUUID(uuid);
    expect(result.valid).toBe(true);
    expect(result.version).toBe('v4');
    expect(result.variant).toBe('RFC 4122');
  });

  test('parseUUID returns invalid for non-UUID strings', () => {
    const result = parseUUID('not-a-uuid');
    expect(result.valid).toBe(false);
    expect(result.version).toBe('N/A');
    expect(result.variant).toBe('N/A');
  });
});
