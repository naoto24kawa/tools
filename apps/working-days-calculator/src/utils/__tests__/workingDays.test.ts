import { describe, it, expect } from 'vitest';
import {
  calculateWorkingDays,
  addWorkingDays,
  isJapaneseHoliday,
  JAPANESE_HOLIDAYS,
} from '../workingDays';

describe('workingDays', () => {
  describe('calculateWorkingDays', () => {
    it('should calculate working days for a simple week (Mon-Fri)', () => {
      // 2025-03-03 is a Monday, 2025-03-07 is a Friday
      const result = calculateWorkingDays('2025-03-03', '2025-03-07');
      expect(result.totalDays).toBe(5);
      expect(result.workingDays).toBe(5);
      expect(result.weekendDays).toBe(0);
      expect(result.holidayDays).toBe(0);
    });

    it('should count weekends correctly', () => {
      // Mon to Sun = 7 days, 5 working + 2 weekend
      const result = calculateWorkingDays('2025-03-03', '2025-03-09');
      expect(result.totalDays).toBe(7);
      expect(result.workingDays).toBe(5);
      expect(result.weekendDays).toBe(2);
    });

    it('should count Japanese holidays', () => {
      // 2025-02-23 (Sun) is Emperor's Birthday, 2025-02-24 (Mon) is substitute
      const result = calculateWorkingDays('2025-02-24', '2025-02-24');
      expect(result.totalDays).toBe(1);
      expect(result.holidayDays).toBe(1);
      expect(result.workingDays).toBe(0);
    });

    it('should handle single day (working day)', () => {
      // 2025-03-03 is Monday
      const result = calculateWorkingDays('2025-03-03', '2025-03-03');
      expect(result.totalDays).toBe(1);
      expect(result.workingDays).toBe(1);
    });

    it('should handle single day (weekend)', () => {
      // 2025-03-01 is Saturday
      const result = calculateWorkingDays('2025-03-01', '2025-03-01');
      expect(result.totalDays).toBe(1);
      expect(result.weekendDays).toBe(1);
      expect(result.workingDays).toBe(0);
    });

    it('should handle custom holidays', () => {
      // 2025-03-04 is a Tuesday - make it a custom holiday
      const result = calculateWorkingDays('2025-03-03', '2025-03-07', ['2025-03-04']);
      expect(result.workingDays).toBe(4);
      expect(result.holidayDays).toBe(1);
    });

    it('should throw if end before start', () => {
      expect(() => calculateWorkingDays('2025-03-07', '2025-03-03')).toThrow(
        'End date must be on or after start date',
      );
    });

    it('should handle a full month', () => {
      // March 2025: 31 days
      const result = calculateWorkingDays('2025-03-01', '2025-03-31');
      expect(result.totalDays).toBe(31);
      // March 2025 has 4 Saturdays, 4+1 Sundays (starts on Sat) = 10 weekend days
      // 2025-03-20 is Vernal Equinox Day
      expect(result.weekendDays).toBe(10);
      expect(result.holidayDays).toBe(1); // 3/20
      expect(result.workingDays).toBe(20);
    });

    it('should not double-count holidays on weekends', () => {
      // 2025-02-23 is Sunday and Emperor's Birthday
      const result = calculateWorkingDays('2025-02-23', '2025-02-23');
      // Should be counted as weekend, not holiday
      expect(result.weekendDays).toBe(1);
      expect(result.holidayDays).toBe(0);
    });
  });

  describe('addWorkingDays', () => {
    it('should add 5 working days to a Monday', () => {
      // 2025-03-03 (Mon) + 5 working days = 2025-03-10 (Mon)
      const result = addWorkingDays('2025-03-03', 5);
      expect(result).toBe('2025-03-10');
    });

    it('should skip weekends', () => {
      // 2025-03-07 (Fri) + 1 working day = 2025-03-10 (Mon)
      const result = addWorkingDays('2025-03-07', 1);
      expect(result).toBe('2025-03-10');
    });

    it('should skip holidays', () => {
      // 2025-03-19 (Wed) + 1 working day should skip 3/20 (holiday) = 3/21 (Fri)
      const result = addWorkingDays('2025-03-19', 1);
      expect(result).toBe('2025-03-21');
    });

    it('should skip custom holidays', () => {
      // 2025-03-03 (Mon) + 1 working day, with 3/4 as custom holiday = 3/5
      const result = addWorkingDays('2025-03-03', 1, ['2025-03-04']);
      expect(result).toBe('2025-03-05');
    });

    it('should throw for non-positive working days', () => {
      expect(() => addWorkingDays('2025-03-03', 0)).toThrow(
        'Number of working days must be positive',
      );
      expect(() => addWorkingDays('2025-03-03', -5)).toThrow(
        'Number of working days must be positive',
      );
    });

    it('should handle 10 working days', () => {
      // 2025-03-03 (Mon) + 10 working days = 2 weeks = 2025-03-17 (Mon)
      const result = addWorkingDays('2025-03-03', 10);
      expect(result).toBe('2025-03-17');
    });
  });

  describe('isJapaneseHoliday', () => {
    it('should return true for New Year', () => {
      expect(isJapaneseHoliday('2025-01-01')).toBe(true);
    });

    it('should return false for a regular day', () => {
      expect(isJapaneseHoliday('2025-03-03')).toBe(false);
    });
  });

  describe('JAPANESE_HOLIDAYS', () => {
    it('should have holidays for 2024-2027', () => {
      const years = JAPANESE_HOLIDAYS.map((d) => d.substring(0, 4));
      expect(years).toContain('2024');
      expect(years).toContain('2025');
      expect(years).toContain('2026');
      expect(years).toContain('2027');
    });

    it('should have reasonable number of holidays per year', () => {
      for (const year of ['2024', '2025', '2026', '2027']) {
        const count = JAPANESE_HOLIDAYS.filter((d) => d.startsWith(year)).length;
        expect(count).toBeGreaterThanOrEqual(15);
        expect(count).toBeLessThanOrEqual(25);
      }
    });
  });
});
