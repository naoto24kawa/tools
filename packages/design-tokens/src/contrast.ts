/**
 * oklch トークンの WCAG コントラスト比を計算する。
 * standards DESIGN.md §3 ブランドノブの「4.5:1 を実計算で確認する（MUST）」を
 * 自動テストで担保するために使う。oklch の L 値は WCAG 輝度と一致しないため、
 * 目視や L 値の比較では判定できない。
 */
export type OklchColor = { L: number; C: number; H: number };

/** oklch(L C H) / oklch(L C H / A) を解析する。oklch でなければ null */
export function parseOklch(value: string): OklchColor | null {
  const match = value.trim().match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return null;
  return { L: Number(match[1]), C: Number(match[2]), H: Number(match[3]) };
}

/** oklch を linear-light sRGB へ変換する（ガンマ補正前） */
function toLinearSrgb({ L, C, H }: OklchColor): [number, number, number] {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** WCAG 相対輝度。sRGB 色域外の値は色域内へクランプする */
function relativeLuminance(color: OklchColor): number {
  const [red, green, blue] = toLinearSrgb(color);
  const r = Math.min(1, Math.max(0, red));
  const g = Math.min(1, Math.max(0, green));
  const b = Math.min(1, Math.max(0, blue));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG コントラスト比。引数の順序に依存しない */
export function contrastRatio(a: OklchColor, b: OklchColor): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** CSS から指定セレクタのブロックを取り出し、カスタムプロパティを辞書にする */
export function extractTokens(css: string, selector: ":root" | ".dark"): Record<string, string> {
  const escaped = selector.replace(".", "\\.");
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!block) throw new Error(`selector ${selector} not found in css`);
  const contents = block[1];
  if (contents === undefined) throw new Error(`selector ${selector} has no css block`);

  const tokens: Record<string, string> = {};
  for (const line of contents.split("\n")) {
    const declaration = line.split("/*")[0];
    if (declaration === undefined) continue;
    const match = declaration.match(/^\s*(--[\w-]+)\s*:\s*(.+?)\s*;/);
    if (match) {
      const name = match[1];
      const value = match[2];
      if (name !== undefined && value !== undefined) tokens[name] = value;
    }
  }
  return tokens;
}
