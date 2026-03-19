import { describe, it, expect } from 'vitest';
import {
  haversine,
  bearing,
  calculateDistance,
  bearingToCompass,
  isValidLatitude,
  isValidLongitude,
} from '../geoDistance';

describe('haversine', () => {
  it('should return 0 for same point', () => {
    expect(haversine(0, 0, 0, 0)).toBe(0);
  });

  it('should calculate distance between Tokyo and New York', () => {
    // Tokyo: 35.6762, 139.6503, New York: 40.7128, -74.0060
    const distance = haversine(35.6762, 139.6503, 40.7128, -74.006);
    expect(distance).toBeCloseTo(10838, -1); // ~10838 km
  });

  it('should calculate distance between London and Paris', () => {
    // London: 51.5074, -0.1278, Paris: 48.8566, 2.3522
    const distance = haversine(51.5074, -0.1278, 48.8566, 2.3522);
    expect(distance).toBeCloseTo(344, 0); // ~344 km
  });
});

describe('bearing', () => {
  it('should return 0 for due north', () => {
    const b = bearing(0, 0, 1, 0);
    expect(b).toBeCloseTo(0, 0);
  });

  it('should return 90 for due east at equator', () => {
    const b = bearing(0, 0, 0, 1);
    expect(b).toBeCloseTo(90, 0);
  });

  it('should return 180 for due south', () => {
    const b = bearing(1, 0, 0, 0);
    expect(b).toBeCloseTo(180, 0);
  });

  it('should return 270 for due west at equator', () => {
    const b = bearing(0, 0, 0, -1);
    expect(b).toBeCloseTo(270, 0);
  });
});

describe('calculateDistance', () => {
  it('should return km and miles', () => {
    const result = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    expect(result.km).toBeCloseTo(344, 0);
    expect(result.miles).toBeCloseTo(result.km * 0.621371, 1);
    expect(result.bearing).toBeGreaterThanOrEqual(0);
    expect(result.bearing).toBeLessThan(360);
  });
});

describe('bearingToCompass', () => {
  it('should return N for 0 degrees', () => {
    expect(bearingToCompass(0)).toBe('N');
  });

  it('should return E for 90 degrees', () => {
    expect(bearingToCompass(90)).toBe('E');
  });

  it('should return S for 180 degrees', () => {
    expect(bearingToCompass(180)).toBe('S');
  });

  it('should return W for 270 degrees', () => {
    expect(bearingToCompass(270)).toBe('W');
  });
});

describe('isValidLatitude', () => {
  it('should accept valid latitudes', () => {
    expect(isValidLatitude(0)).toBe(true);
    expect(isValidLatitude(90)).toBe(true);
    expect(isValidLatitude(-90)).toBe(true);
    expect(isValidLatitude(45.5)).toBe(true);
  });

  it('should reject invalid latitudes', () => {
    expect(isValidLatitude(91)).toBe(false);
    expect(isValidLatitude(-91)).toBe(false);
    expect(isValidLatitude(NaN)).toBe(false);
  });
});

describe('isValidLongitude', () => {
  it('should accept valid longitudes', () => {
    expect(isValidLongitude(0)).toBe(true);
    expect(isValidLongitude(180)).toBe(true);
    expect(isValidLongitude(-180)).toBe(true);
  });

  it('should reject invalid longitudes', () => {
    expect(isValidLongitude(181)).toBe(false);
    expect(isValidLongitude(-181)).toBe(false);
    expect(isValidLongitude(NaN)).toBe(false);
  });
});
