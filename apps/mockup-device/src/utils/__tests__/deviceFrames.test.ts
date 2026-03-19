import { describe, it, expect } from 'vitest';
import {
  DEVICE_FRAMES,
  DEVICE_CATEGORIES,
  getDeviceById,
  getDevicesByCategory,
} from '../deviceFrames';

describe('deviceFrames', () => {
  describe('DEVICE_FRAMES', () => {
    it('should have devices', () => {
      expect(DEVICE_FRAMES.length).toBeGreaterThan(0);
    });

    it('should have unique ids', () => {
      const ids = DEVICE_FRAMES.map((d) => d.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every device should have valid screen dimensions within frame', () => {
      for (const device of DEVICE_FRAMES) {
        expect(device.screen.x + device.screen.width).toBeLessThanOrEqual(device.width);
        expect(device.screen.y + device.screen.height).toBeLessThanOrEqual(device.height);
        expect(device.screen.x).toBeGreaterThanOrEqual(0);
        expect(device.screen.y).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('DEVICE_CATEGORIES', () => {
    it('should have categories', () => {
      expect(DEVICE_CATEGORIES.length).toBeGreaterThan(0);
      expect(DEVICE_CATEGORIES).toContain('Phone');
      expect(DEVICE_CATEGORIES).toContain('Tablet');
      expect(DEVICE_CATEGORIES).toContain('Laptop');
    });
  });

  describe('getDeviceById', () => {
    it('should find a device by id', () => {
      const device = getDeviceById('iphone-14');
      expect(device).toBeDefined();
      expect(device?.name).toBe('iPhone 14');
    });

    it('should return undefined for unknown id', () => {
      expect(getDeviceById('nonexistent')).toBeUndefined();
    });
  });

  describe('getDevicesByCategory', () => {
    it('should filter by category', () => {
      const phones = getDevicesByCategory('Phone');
      expect(phones.length).toBeGreaterThan(0);
      expect(phones.every((d) => d.category === 'Phone')).toBe(true);
    });

    it('should return empty for unknown category', () => {
      expect(getDevicesByCategory('Unknown').length).toBe(0);
    });
  });
});
