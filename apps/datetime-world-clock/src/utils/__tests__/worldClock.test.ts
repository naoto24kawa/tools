import { describe, expect, test } from 'bun:test';
import { getAllCityTimes, getCityTime } from '../worldClock';

describe('worldClock', () => {
  test('getCityTime returns all fields', () => {
    const ct = getCityTime('Asia/Tokyo', 'Tokyo', new Date());
    expect(ct.city).toBe('Tokyo');
    expect(ct.timezone).toBe('Asia/Tokyo');
    expect(ct.time).toBeDefined();
    expect(ct.date).toBeDefined();
  });

  test('getAllCityTimes returns 12 cities', () => {
    expect(getAllCityTimes(new Date()).length).toBe(12);
  });

  test('time format includes colons', () => {
    const ct = getCityTime('UTC', 'UTC', new Date());
    expect(ct.time).toContain(':');
  });
});
