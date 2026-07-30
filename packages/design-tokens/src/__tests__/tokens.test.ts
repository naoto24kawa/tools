import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, extractTokens, parseOklch, type OklchColor } from "../contrast";

/**
 * tokens.css はリポジトリルート基準で解決する。
 * import.meta.url は Vite+ の transform 下で file: スキームにならず
 * fileURLToPath が TypeError を投げるため使えない。
 */
const tokensPath = path.resolve(process.cwd(), "packages/design-tokens/tokens.css");

if (!existsSync(tokensPath)) {
  throw new Error(
    `tokens.css が見つからない: ${tokensPath}\n` +
      "このテストはリポジトリルートから実行すること: pnpm exec vp test packages/design-tokens/src",
  );
}

const css = readFileSync(tokensPath, "utf8");
const light = extractTokens(css, ":root");
const dark = extractTokens(css, ".dark");

function color(tokens: Record<string, string>, name: string): OklchColor {
  const value = tokens[name];
  if (value === undefined) throw new Error(`${name} is not an oklch value: ${value}`);
  const parsed = parseOklch(value);
  if (!parsed) throw new Error(`${name} is not an oklch value: ${value}`);
  return parsed;
}

describe("ブランドノブ（standards DESIGN.md §3 の MUST）", () => {
  it("light: --primary × --primary-foreground が 4.5:1 以上", () => {
    expect(
      contrastRatio(color(light, "--primary"), color(light, "--primary-foreground")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("dark: --primary × --primary-foreground が 4.5:1 以上", () => {
    expect(
      contrastRatio(color(dark, "--primary"), color(dark, "--primary-foreground")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("light: --primary をテキスト色として --background 上で 4.5:1 以上", () => {
    expect(
      contrastRatio(color(light, "--primary"), color(light, "--background")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("light: --primary をテキスト色として --muted 上で 4.5:1 以上（DS-002 のバックリンク用途）", () => {
    expect(
      contrastRatio(color(light, "--primary"), color(light, "--muted")),
    ).toBeGreaterThanOrEqual(4.5);
  });
});

describe("テキスト系トークン（standards DESIGN.md §8）", () => {
  it("light: --muted-foreground × --background が 4.5:1 以上", () => {
    expect(
      contrastRatio(color(light, "--muted-foreground"), color(light, "--background")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("light: --muted-foreground × --muted が 4.5:1 以上", () => {
    expect(
      contrastRatio(color(light, "--muted-foreground"), color(light, "--muted")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("dark: --muted-foreground × --background が 4.5:1 以上", () => {
    expect(
      contrastRatio(color(dark, "--muted-foreground"), color(dark, "--background")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("light: --ring × --background が 3:1 以上（WCAG 1.4.11 非テキストコントラスト）", () => {
    expect(
      contrastRatio(color(light, "--ring"), color(light, "--background")),
    ).toBeGreaterThanOrEqual(3);
  });
});

describe("ステータス色（standards DESIGN.md §5）", () => {
  for (const status of ["destructive", "success", "warning"] as const) {
    it(`light: --${status} × --${status}-foreground が 4.5:1 以上`, () => {
      expect(
        contrastRatio(color(light, `--${status}`), color(light, `--${status}-foreground`)),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it(`dark: --${status} × --${status}-foreground が 4.5:1 以上`, () => {
      expect(
        contrastRatio(color(dark, `--${status}`), color(dark, `--${status}-foreground`)),
      ).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe("トークンの網羅性", () => {
  it("standards の標準セマンティックトークンがすべて light に定義されている", () => {
    const required = [
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--popover",
      "--popover-foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--muted",
      "--muted-foreground",
      "--accent",
      "--accent-foreground",
      "--destructive",
      "--destructive-foreground",
      "--success",
      "--success-foreground",
      "--warning",
      "--warning-foreground",
      "--border",
      "--input",
      "--ring",
      "--radius",
    ];
    for (const token of required) {
      expect(light, `${token} が :root にない`).toHaveProperty(token);
    }
  });

  it("--radius が standards の 0.625rem である", () => {
    expect(light["--radius"]).toBe("0.625rem");
  });
});
