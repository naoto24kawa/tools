import { describe, it, expect } from 'vitest';
import {
  DEVICE_PRESETS,
  getDeviceById,
  rotateDevice,
  validateUrl,
} from '../devicePresets';

describe('devicePresets', () => {
  describe('DEVICE_PRESETS', () => {
    it('should have presets', () => {
      expect(DEVICE_PRESETS.length).toBeGreaterThan(0);
    });

    it('should have unique ids', () => {
      const ids = DEVICE_PRESETS.map((d) => d.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should include iPhone SE', () => {
      const iphoneSe = DEVICE_PRESETS.find((d) => d.id === 'iphone-se');
      expect(iphoneSe).toBeDefined();
      expect(iphoneSe?.width).toBe(375);
      expect(iphoneSe?.height).toBe(667);
    });

    it('should include 4K', () => {
      const fourK = DEVICE_PRESETS.find((d) => d.id === '4k');
      expect(fourK).toBeDefined();
      expect(fourK?.width).toBe(2560);
      expect(fourK?.height).toBe(1440);
    });
  });

  describe('getDeviceById', () => {
    it('should find a device by id', () => {
      const device = getDeviceById('ipad');
      expect(device).toBeDefined();
      expect(device?.name).toBe('iPad');
    });

    it('should return undefined for unknown id', () => {
      expect(getDeviceById('nonexistent')).toBeUndefined();
    });
  });

  describe('rotateDevice', () => {
    it('should swap width and height', () => {
      const device = { id: 'test', name: 'Test', width: 375, height: 667, category: 'mobile' as const };
      const rotated = rotateDevice(device);
      expect(rotated.width).toBe(667);
      expect(rotated.height).toBe(375);
      expect(rotated.name).toBe('Test');
    });
  });

  describe('validateUrl', () => {
    it('should return null for empty string', () => {
      expect(validateUrl('')).toBeNull();
      expect(validateUrl('   ')).toBeNull();
    });

    it('should add https:// if missing', () => {
      expect(validateUrl('example.com')).toBe('https://example.com');
    });

    it('should keep http://', () => {
      expect(validateUrl('http://example.com')).toBe('http://example.com');
    });

    it('should keep https://', () => {
      expect(validateUrl('https://example.com')).toBe('https://example.com');
    });

    it('should return null for invalid URLs', () => {
      expect(validateUrl('not a url at all :::')).toBeNull();
    });
  });
});
