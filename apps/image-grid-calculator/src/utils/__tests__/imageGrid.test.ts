import { describe, it, expect } from 'vitest';
import { calcGridColumns, calcImageWidthFromColumns } from '../imageGrid';

describe('imageGrid', () => {
  describe('calcGridColumns', () => {
    it('1200px幅・300px画像・gap20 → 3列', () => {
      // (1200 + 20) / (300 + 20) = 1220 / 320 = 3.8125 → 3列
      const result = calcGridColumns(1200, 300, 20);
      expect(result.columns).toBe(3);
    });

    it('余白を正しく計算する', () => {
      // 3列: 使用幅 = 3*300 + 2*20 = 940, 余白 = 1200 - 940 = 260
      const result = calcGridColumns(1200, 300, 20);
      expect(result.remainder).toBe(260);
    });

    it('cssGridTemplateを出力する', () => {
      const result = calcGridColumns(1200, 300, 20);
      expect(result.cssGridTemplate).toContain('repeat(3');
    });

    it('gap=0のとき余白を正しく計算', () => {
      // 1200 / 300 = 4列
      const result = calcGridColumns(1200, 300, 0);
      expect(result.columns).toBe(4);
      expect(result.remainder).toBe(0);
    });

    it('画像幅 > コンテナ幅 → 1列', () => {
      const result = calcGridColumns(300, 400, 0);
      expect(result.columns).toBe(1);
    });

    it('コンテナ幅0は例外を投げる', () => {
      expect(() => calcGridColumns(0, 300, 20)).toThrow('Container width must be positive');
    });

    it('画像幅0は例外を投げる', () => {
      expect(() => calcGridColumns(1200, 0, 20)).toThrow('Image width must be positive');
    });

    it('gap負値は例外を投げる', () => {
      expect(() => calcGridColumns(1200, 300, -1)).toThrow('Gap must be non-negative');
    });
  });

  describe('calcImageWidthFromColumns', () => {
    it('3列・gap20 → 画像幅を逆算', () => {
      // (1200 - 2*20) / 3 = 1160/3 ≈ 386.67
      const result = calcImageWidthFromColumns(1200, 3, 20);
      expect(result).toBeCloseTo(386.67, 1);
    });

    it('gap=0のとき均等分割', () => {
      const result = calcImageWidthFromColumns(1200, 4, 0);
      expect(result).toBe(300);
    });

    it('列数0は例外を投げる', () => {
      expect(() => calcImageWidthFromColumns(1200, 0, 20)).toThrow('Columns must be at least 1');
    });
  });
});
