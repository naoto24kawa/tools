import { describe, it, expect } from 'vitest';
import { calcEV, calcShutterSpeed, calcFNumber, calcISO } from '../exposure';

describe('exposure', () => {
  describe('calcEV', () => {
    it('f/8, 1/125s, ISO100 → EV13', () => {
      // EV = log2(f²/t) + log2(ISO/100)
      // = log2(64 * 125) + 0 = log2(8000) ≈ 12.97
      const ev = calcEV(8, 1 / 125, 100);
      expect(ev).toBeCloseTo(13, 0);
    });

    it('f/1.4, 1/60s, ISO200 → EV約8', () => {
      // EV = log2(1.4² × 200 / (100 × 1/60)) = log2(1.96 × 200 / (100/60)) ≈ 7.88
      const ev = calcEV(1.4, 1 / 60, 200);
      expect(ev).toBeCloseTo(8, 0);
    });

    it('f値0は例外を投げる', () => {
      expect(() => calcEV(0, 1 / 125, 100)).toThrow('f-number must be positive');
    });

    it('シャッタースピード0は例外を投げる', () => {
      expect(() => calcEV(8, 0, 100)).toThrow('Shutter speed must be positive');
    });

    it('ISO 0は例外を投げる', () => {
      expect(() => calcEV(8, 1 / 125, 0)).toThrow('ISO must be positive');
    });
  });

  describe('calcShutterSpeed', () => {
    it('EV13, f/8, ISO100 → 1/128s (理論値)', () => {
      // t = f²×ISO / (100×2^EV) = 64×100 / (100×8192) = 1/128 ≈ 0.00781
      const ss = calcShutterSpeed(13, 8, 100);
      expect(ss).toBeCloseTo(1 / 128, 4);
    });

    it('f値0は例外を投げる', () => {
      expect(() => calcShutterSpeed(13, 0, 100)).toThrow('f-number must be positive');
    });

    it('ISO 0は例外を投げる', () => {
      expect(() => calcShutterSpeed(13, 8, 0)).toThrow('ISO must be positive');
    });
  });

  describe('calcFNumber', () => {
    it('EV13, 1/125s, ISO100 → f/8', () => {
      const f = calcFNumber(13, 1 / 125, 100);
      expect(f).toBeCloseTo(8, 0);
    });

    it('シャッタースピード0は例外を投げる', () => {
      expect(() => calcFNumber(13, 0, 100)).toThrow('Shutter speed must be positive');
    });

    it('ISO 0は例外を投げる', () => {
      expect(() => calcFNumber(13, 1 / 125, 0)).toThrow('ISO must be positive');
    });
  });

  describe('calcISO', () => {
    it('EV13, f/8, 1/125s → ISO約102', () => {
      // ISO = 100 × 2^13 × (1/125) / 8² = 100 × 8192 / (125 × 64) ≈ 102.4
      const iso = calcISO(13, 8, 1 / 125);
      expect(iso).toBeCloseTo(102, 0);
    });

    it('f値0は例外を投げる', () => {
      expect(() => calcISO(13, 0, 1 / 125)).toThrow('f-number must be positive');
    });

    it('シャッタースピード0は例外を投げる', () => {
      expect(() => calcISO(13, 8, 0)).toThrow('Shutter speed must be positive');
    });
  });
});
