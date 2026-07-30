import { describe, expect, it } from "vitest";
import { contrastRatio, parseOklch } from "../contrast";

describe("parseOklch", () => {
  it("oklch(L C H) 形式を解析する", () => {
    expect(parseOklch("oklch(0.55 0.18 255)")).toEqual({ L: 0.55, C: 0.18, H: 255 });
  });

  it("無彩色（H 省略なし・C=0）を解析する", () => {
    expect(parseOklch("oklch(0.985 0 0)")).toEqual({ L: 0.985, C: 0, H: 0 });
  });

  it.each(["oklch(1 0 0", "oklch(1 0 0)garbage", "oklch(1 0 0 / 10%)", "oklch(1 0 0 / nope)"])(
    "不完全・末尾付き・alpha付きの値を拒否する: %s",
    (value) => {
      expect(parseOklch(value)).toBeNull();
    },
  );

  it("oklch でない値には null を返す", () => {
    expect(parseOklch("0.625rem")).toBeNull();
  });
});

describe("contrastRatio", () => {
  it("白と黒は 21:1 になる", () => {
    const white = { L: 1, C: 0, H: 0 };
    const black = { L: 0, C: 0, H: 0 };
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
  });

  it("同じ色どうしは 1:1 になる", () => {
    const c = { L: 0.55, C: 0.18, H: 255 };
    expect(contrastRatio(c, c)).toBeCloseTo(1, 5);
  });

  it("引数の順序で結果が変わらない", () => {
    const a = { L: 0.55, C: 0.18, H: 255 };
    const b = { L: 0.985, C: 0, H: 0 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});
