import { describe, expect, it } from "vitest";
import { RATIOS, split, scale, formatNumber, getRatio } from "../ratio";

describe("ratio", () => {
  describe("RATIOS", () => {
    it("has 4 ratios in golden/silver/platinum/bronze order", () => {
      expect(RATIOS.map((r) => r.key)).toEqual(["golden", "silver", "platinum", "bronze"]);
    });
    it("golden ratio value is (1+√5)/2", () => {
      expect(getRatio("golden").value).toBeCloseTo(1.618034, 5);
    });
    it("silver ratio value is 1+√2", () => {
      expect(getRatio("silver").value).toBeCloseTo(2.414214, 5);
    });
    it("platinum ratio value is √3", () => {
      expect(getRatio("platinum").value).toBeCloseTo(1.732051, 5);
    });
    it("bronze ratio value is (3+√13)/2", () => {
      expect(getRatio("bronze").value).toBeCloseTo(3.302776, 5);
    });
    it("every ratio has a Japanese label", () => {
      expect(getRatio("golden").label).toBe("黄金比");
      expect(getRatio("silver").label).toBe("白銀比");
      expect(getRatio("platinum").label).toBe("白金比");
      expect(getRatio("bronze").label).toBe("青銅比");
    });
  });

  describe("split", () => {
    it("splits 1000 by golden ratio into long/short", () => {
      const r = split(1000, getRatio("golden").value);
      expect(r.long).toBeCloseTo(618.033989, 4);
      expect(r.short).toBeCloseTo(381.966011, 4);
    });
    it("long + short equals total (conservation)", () => {
      const r = split(1000, getRatio("golden").value);
      expect(r.long + r.short).toBeCloseTo(1000, 6);
    });
    it("returns zeros for non-positive total", () => {
      expect(split(0, 1.618)).toEqual({ long: 0, short: 0 });
      expect(split(-5, 1.618)).toEqual({ long: 0, short: 0 });
    });
    it("returns zeros for non-finite total", () => {
      expect(split(NaN, 1.618)).toEqual({ long: 0, short: 0 });
    });
    it("returns zeros for non-positive ratio", () => {
      expect(split(1000, 0)).toEqual({ long: 0, short: 0 });
    });
  });

  describe("scale", () => {
    it("scales 100 by golden ratio into larger/smaller", () => {
      const r = scale(100, getRatio("golden").value);
      expect(r.larger).toBeCloseTo(161.803399, 4);
      expect(r.smaller).toBeCloseTo(61.803399, 4);
    });
    it("returns zeros for non-positive value", () => {
      expect(scale(0, 1.618)).toEqual({ larger: 0, smaller: 0 });
      expect(scale(-1, 1.618)).toEqual({ larger: 0, smaller: 0 });
    });
    it("returns zeros for non-finite value", () => {
      expect(scale(Infinity, 1.618)).toEqual({ larger: 0, smaller: 0 });
    });
  });

  describe("formatNumber", () => {
    it("formats to at most 3 decimals", () => {
      expect(formatNumber(618.0339887)).toBe("618.034");
    });
    it("adds thousand separators", () => {
      expect(formatNumber(1000)).toBe("1,000");
    });
    it("trims trailing zeros", () => {
      expect(formatNumber(500)).toBe("500");
    });
    it("returns dash for non-finite", () => {
      expect(formatNumber(NaN)).toBe("-");
      expect(formatNumber(Infinity)).toBe("-");
    });
  });
});
