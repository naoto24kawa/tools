import { describe, expect, it } from "vitest";
import { SENSOR_SIZES, calcDepthOfField } from "../depthOfField";

describe("depthOfField", () => {
  describe("calcDepthOfField", () => {
    it("フルサイズ 50mm f/8 3m → DoF を算出", () => {
      const result = calcDepthOfField({
        focalLength: 50,
        fNumber: 8,
        subjectDistance: 3000, // mm
        sensorId: "ff",
      });
      // hyperfocal ≈ 50²/(8*0.029) = 2500/0.232 ≈ 10776mm
      expect(result.hyperfocalDistance).toBeCloseTo(10776, -2);
      expect(result.dof).toBeGreaterThan(0);
      expect(result.nearLimit).toBeLessThan(3000);
      expect(result.farLimit).toBeGreaterThan(3000);
    });

    it("超焦点距離以遠のとき farLimit は Infinity", () => {
      const result = calcDepthOfField({
        focalLength: 50,
        fNumber: 16,
        subjectDistance: 20000,
        sensorId: "ff",
      });
      expect(result.farLimit).toBe(Infinity);
    });

    it("フォーカルレングス0は例外を投げる", () => {
      expect(() =>
        calcDepthOfField({
          focalLength: 0,
          fNumber: 8,
          subjectDistance: 3000,
          sensorId: "ff",
        }),
      ).toThrow("Focal length must be positive");
    });

    it("被写体距離0は例外を投げる", () => {
      expect(() =>
        calcDepthOfField({
          focalLength: 50,
          fNumber: 8,
          subjectDistance: 0,
          sensorId: "ff",
        }),
      ).toThrow("Subject distance must be positive");
    });

    it("未知のセンサーIDは例外を投げる", () => {
      expect(() =>
        calcDepthOfField({
          focalLength: 50,
          fNumber: 8,
          subjectDistance: 3000,
          sensorId: "unknown",
        }),
      ).toThrow("Unknown sensor");
    });
  });

  describe("SENSOR_SIZES", () => {
    it("4種類以上のセンサーが定義されている", () => {
      expect(SENSOR_SIZES.length).toBeGreaterThanOrEqual(4);
    });

    it("各センサーに id, label, coc が存在する", () => {
      for (const s of SENSOR_SIZES) {
        expect(typeof s.id).toBe("string");
        expect(typeof s.label).toBe("string");
        expect(s.coc).toBeGreaterThan(0);
      }
    });
  });
});
