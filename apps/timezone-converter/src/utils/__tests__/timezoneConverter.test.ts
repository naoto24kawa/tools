import { describe, it, expect } from 'vitest';
import {
  TIMEZONES,
  formatInTimezone,
  getCurrentTimeInTimezone,
  convertTimezone,
} from '../timezoneConverter';

describe('TIMEZONES', () => {
  it('should contain UTC', () => {
    expect(TIMEZONES.find((tz) => tz.id === 'UTC')).toBeDefined();
  });

  it('should contain JST', () => {
    expect(TIMEZONES.find((tz) => tz.id === 'Asia/Tokyo')).toBeDefined();
  });

  it('should contain at least 10 timezones', () => {
    expect(TIMEZONES.length).toBeGreaterThanOrEqual(10);
  });
});

describe('formatInTimezone', () => {
  it('should format a date in UTC', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatInTimezone(date, 'UTC');
    expect(result).toContain('2024');
    expect(result).toContain('12:00:00');
  });

  it('should format a date in JST', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatInTimezone(date, 'Asia/Tokyo');
    expect(result).toContain('2024');
    // JST is UTC+9, so 12:00 UTC = 21:00 JST
    expect(result).toContain('9:00:00');
  });
});

describe('getCurrentTimeInTimezone', () => {
  it('should return a formatted string for UTC', () => {
    const result = getCurrentTimeInTimezone('UTC');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('convertTimezone', () => {
  it('should convert between timezones', () => {
    const result = convertTimezone('2024-01-15T12:00:00Z', 'UTC', 'Asia/Tokyo');
    expect(result).toContain('2024');
    expect(result).toContain('21:00:00');
  });

  it('should throw on invalid date', () => {
    expect(() => convertTimezone('invalid', 'UTC', 'Asia/Tokyo')).toThrow('Invalid date');
  });
});
