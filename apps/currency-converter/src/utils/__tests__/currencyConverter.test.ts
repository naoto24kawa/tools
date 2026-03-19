import { describe, it, expect } from 'vitest';
import {
  convert,
  formatAmount,
  DEFAULT_RATES,
  CURRENCIES,
} from '../currencyConverter';

describe('currencyConverter', () => {
  describe('convert', () => {
    it('should convert USD to JPY', () => {
      const result = convert(100, 'USD', 'JPY', DEFAULT_RATES);
      expect(result.fromAmount).toBe(100);
      expect(result.toAmount).toBe(15000);
      expect(result.rate).toBe(150);
    });

    it('should convert JPY to USD', () => {
      const result = convert(15000, 'JPY', 'USD', DEFAULT_RATES);
      expect(result.toAmount).toBe(100);
    });

    it('should convert between non-JPY currencies', () => {
      const result = convert(100, 'USD', 'EUR', DEFAULT_RATES);
      // 100 USD -> 15000 JPY -> 15000/163 EUR
      expect(result.toAmount).toBeCloseTo(92.0245, 2);
    });

    it('should handle same currency conversion', () => {
      const result = convert(1000, 'JPY', 'JPY', DEFAULT_RATES);
      expect(result.toAmount).toBe(1000);
      expect(result.rate).toBe(1);
    });

    it('should handle zero amount', () => {
      const result = convert(0, 'USD', 'JPY', DEFAULT_RATES);
      expect(result.toAmount).toBe(0);
    });

    it('should throw for negative amount', () => {
      expect(() => convert(-100, 'USD', 'JPY', DEFAULT_RATES)).toThrow(
        'Amount must be non-negative',
      );
    });

    it('should throw for unknown currency', () => {
      expect(() => convert(100, 'XXX', 'JPY', DEFAULT_RATES)).toThrow(
        'Unknown currency: XXX',
      );
    });

    it('should throw for zero rate', () => {
      const rates = { ...DEFAULT_RATES, USD: 0 };
      expect(() => convert(100, 'USD', 'JPY', rates)).toThrow(
        'Rates must be positive',
      );
    });

    it('should work with custom rates', () => {
      const customRates = { JPY: 1, USD: 155.0 };
      const result = convert(100, 'USD', 'JPY', customRates);
      expect(result.toAmount).toBe(15500);
    });

    it('should calculate inverse rate correctly', () => {
      const result = convert(1, 'USD', 'JPY', DEFAULT_RATES);
      expect(result.rate).toBe(150);
      expect(result.inverseRate).toBeCloseTo(0.0067, 3);
    });
  });

  describe('formatAmount', () => {
    it('should format JPY without decimals', () => {
      expect(formatAmount(1234, 'JPY')).toBe('1,234');
    });

    it('should format USD with 2 decimals', () => {
      expect(formatAmount(1234.5, 'USD')).toBe('1,234.50');
    });

    it('should format EUR with 2 decimals', () => {
      expect(formatAmount(1234.56, 'EUR')).toBe('1,234.56');
    });

    it('should format KRW without decimals', () => {
      expect(formatAmount(50000, 'KRW')).toBe('50,000');
    });
  });

  describe('DEFAULT_RATES', () => {
    it('should have rates for all currencies', () => {
      for (const currency of CURRENCIES) {
        expect(DEFAULT_RATES[currency.code]).toBeDefined();
        expect(DEFAULT_RATES[currency.code]).toBeGreaterThan(0);
      }
    });

    it('should have JPY rate of 1', () => {
      expect(DEFAULT_RATES.JPY).toBe(1);
    });
  });
});
