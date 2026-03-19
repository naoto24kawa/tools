import { describe, it, expect } from 'vitest';
import { convert, categories } from '../unitConverter';

describe('unitConverter', () => {
  describe('Temperature', () => {
    it('converts Celsius to Fahrenheit', () => {
      const result = convert(100, 'celsius', 'fahrenheit', 'Temperature');
      expect(result.value).toBeCloseTo(212);
    });

    it('converts Fahrenheit to Celsius', () => {
      const result = convert(32, 'fahrenheit', 'celsius', 'Temperature');
      expect(result.value).toBeCloseTo(0);
    });

    it('converts Celsius to Kelvin', () => {
      const result = convert(0, 'celsius', 'kelvin', 'Temperature');
      expect(result.value).toBeCloseTo(273.15);
    });

    it('converts Kelvin to Celsius', () => {
      const result = convert(373.15, 'kelvin', 'celsius', 'Temperature');
      expect(result.value).toBeCloseTo(100);
    });

    it('converts same unit (identity)', () => {
      const result = convert(42, 'celsius', 'celsius', 'Temperature');
      expect(result.value).toBe(42);
    });

    it('converts Fahrenheit to Kelvin', () => {
      const result = convert(212, 'fahrenheit', 'kelvin', 'Temperature');
      expect(result.value).toBeCloseTo(373.15);
    });
  });

  describe('Pressure', () => {
    it('converts atm to Pascal', () => {
      const result = convert(1, 'atmosphere', 'pascal', 'Pressure');
      expect(result.value).toBeCloseTo(101325);
    });

    it('converts bar to Pascal', () => {
      const result = convert(1, 'bar', 'pascal', 'Pressure');
      expect(result.value).toBeCloseTo(100000);
    });

    it('converts psi to atm', () => {
      const result = convert(14.696, 'psi', 'atmosphere', 'Pressure');
      expect(result.value).toBeCloseTo(1, 1);
    });
  });

  describe('Energy', () => {
    it('converts calorie to joule', () => {
      const result = convert(1, 'calorie', 'joule', 'Energy');
      expect(result.value).toBeCloseTo(4.184);
    });

    it('converts kWh to joule', () => {
      const result = convert(1, 'kwh', 'joule', 'Energy');
      expect(result.value).toBeCloseTo(3600000);
    });

    it('converts BTU to joule', () => {
      const result = convert(1, 'btu', 'joule', 'Energy');
      expect(result.value).toBeCloseTo(1055.06);
    });
  });

  describe('Force', () => {
    it('converts kgf to newton', () => {
      const result = convert(1, 'kgf', 'newton', 'Force');
      expect(result.value).toBeCloseTo(9.80665);
    });

    it('converts lbf to newton', () => {
      const result = convert(1, 'lbf', 'newton', 'Force');
      expect(result.value).toBeCloseTo(4.44822);
    });
  });

  describe('Speed', () => {
    it('converts km/h to m/s', () => {
      const result = convert(3.6, 'km-per-hour', 'meter-per-second', 'Speed');
      expect(result.value).toBeCloseTo(1);
    });

    it('converts mph to km/h', () => {
      const result = convert(60, 'mph', 'km-per-hour', 'Speed');
      expect(result.value).toBeCloseTo(96.56, 1);
    });

    it('converts knots to m/s', () => {
      const result = convert(1, 'knots', 'meter-per-second', 'Speed');
      expect(result.value).toBeCloseTo(0.514444);
    });
  });

  describe('Power', () => {
    it('converts hp to watts', () => {
      const result = convert(1, 'horsepower', 'watt', 'Power');
      expect(result.value).toBeCloseTo(745.7);
    });

    it('converts kW to W', () => {
      const result = convert(1, 'kilowatt', 'watt', 'Power');
      expect(result.value).toBeCloseTo(1000);
    });
  });

  describe('Data (SI / 1000)', () => {
    it('converts byte to bit', () => {
      const result = convert(1, 'byte', 'bit', 'Data (SI / 1000)');
      expect(result.value).toBe(8);
    });

    it('converts KB to byte', () => {
      const result = convert(1, 'kilobyte', 'byte', 'Data (SI / 1000)');
      expect(result.value).toBe(1000);
    });

    it('converts GB to MB', () => {
      const result = convert(1, 'gigabyte', 'megabyte', 'Data (SI / 1000)');
      expect(result.value).toBe(1000);
    });
  });

  describe('Data (Binary / 1024)', () => {
    it('converts KiB to byte', () => {
      const result = convert(1, 'kibibyte', 'byte', 'Data (Binary / 1024)');
      expect(result.value).toBe(1024);
    });

    it('converts GiB to MiB', () => {
      const result = convert(1, 'gibibyte', 'mebibyte', 'Data (Binary / 1024)');
      expect(result.value).toBe(1024);
    });
  });

  describe('edge cases', () => {
    it('identity conversion returns same value', () => {
      const result = convert(42, 'pascal', 'pascal', 'Pressure');
      expect(result.value).toBe(42);
    });

    it('returns formula string', () => {
      const result = convert(1, 'atmosphere', 'pascal', 'Pressure');
      expect(result.formula).toBeTruthy();
    });
  });

  describe('categories', () => {
    it('has all required categories', () => {
      const names = categories.map((c) => c.name);
      expect(names).toContain('Temperature');
      expect(names).toContain('Pressure');
      expect(names).toContain('Energy');
      expect(names).toContain('Force');
      expect(names).toContain('Speed');
      expect(names).toContain('Power');
      expect(names).toContain('Data (SI / 1000)');
      expect(names).toContain('Data (Binary / 1024)');
    });
  });
});
