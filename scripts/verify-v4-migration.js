#!/usr/bin/env node
/**
 * Tailwind v4 移行の検証ゲート（spec の G2〜G5 を機械化）
 *
 * ビルドが成功したことを完了の根拠にしない。v4 のコンテンツ検出が外れると
 * CSS は生成されるがユーティリティが空になり、ビルド成功のまま画面が崩れる。
 * この静かな失敗を検出することがこのスクリプトの主目的。
 *
 * 使用方法:
 *   node scripts/verify-v4-migration.js --app=url-encoder
 *   node scripts/verify-v4-migration.js            # 移行済み全アプリ
 */

const fs = require("node:fs");
const path = require("node:path");

const APPS_DIR = path.join(__dirname, "..", "apps");
const filterApp = process.argv
  .slice(2)
  .find((arg) => arg.startsWith("--app="))
  ?.split("=")[1];

/** 移行済みの目印: index.css が design-tokens を import している */
function isMigrated(appDir) {
  const indexCss = path.join(appDir, "src", "index.css");
  if (!fs.existsSync(indexCss)) return false;
  return fs.readFileSync(indexCss, "utf8").includes("@tools/design-tokens");
}

function readBuiltCss(appDir) {
  const assetsDir = path.join(appDir, "dist", "assets");
  if (!fs.existsSync(assetsDir)) return null;
  const cssFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith(".css"));
  if (cssFiles.length === 0) return null;
  return cssFiles.map((file) => fs.readFileSync(path.join(assetsDir, file), "utf8")).join("\n");
}

/** src 配下の tsx から実際に使われている Tailwind ユーティリティを拾う */
function sampleUtilityClasses(appDir) {
  const appTsx = path.join(appDir, "src", "App.tsx");
  if (!fs.existsSync(appTsx)) return [];
  const content = fs.readFileSync(appTsx, "utf8");
  const candidates = [
    "max-w-7xl",
    "max-w-6xl",
    "max-w-5xl",
    "min-h-screen",
    "mx-auto",
    "space-y-4",
  ];
  return candidates.filter((candidate) => content.includes(candidate));
}

function parsePrimary(value) {
  const components = value.match(/^oklch\(\s*(\S+)\s+(\S+)\s+(\S+)\s*\)$/);
  if (!components) return null;

  const rawLightness = components[1];
  const hasPercent = rawLightness.endsWith("%");
  const numericLightness = hasPercent ? rawLightness.slice(0, -1) : rawLightness;
  const lightness = Number(numericLightness) / (hasPercent ? 100 : 1);
  const chroma = Number(components[2]);
  const hue = Number(components[3]);
  return [lightness, chroma, hue].every(Number.isFinite) ? { lightness, chroma, hue } : null;
}

const CHECKS = {
  /** G2: コンテンツ検出が効いている（v4 移行最大の静かな失敗点） */
  G2: ({ builtCss, appDir }) => {
    const used = sampleUtilityClasses(appDir);
    if (used.length === 0) return ["App.tsx に既知のユーティリティが見つからず G2 を判定できない"];
    const missing = used.filter(
      (className) => !builtCss.includes(`.${className.replace(/([:.])/g, "\\$1")}`),
    );
    return missing.length > 0
      ? [`生成 CSS に定義がないユーティリティ: ${missing.join(", ")}（コンテンツ検出が外れている）`]
      : [];
  },

  /** G3: oklch へ移行済みで hsl 参照が残っていない */
  G3: ({ builtCss }) => {
    const errors = [];
    if (!builtCss.includes("oklch(")) errors.push("生成 CSS に oklch( が存在しない");
    if (builtCss.includes("hsl(var(--"))
      errors.push("生成 CSS に v3 形式の hsl(var(--) が残っている");
    return errors;
  },

  /** G4: ブランドノブの light 青が適用されている */
  G4: ({ builtCss }) => {
    const primaryValues = [...builtCss.matchAll(/--primary:\s*(oklch\([^)]*\))/g)].map(
      (match) => match[1],
    );
    if (primaryValues.length === 0) return ["生成 CSS から --primary:oklch(...) を抽出できない"];

    const errors = [];
    const primaryColors = primaryValues.map((value) => {
      const parsed = parsePrimary(value);
      if (!parsed) errors.push(`--primary の oklch 値を数値抽出できない: ${value}`);
      return parsed;
    });
    if (errors.length > 0) return errors;

    const expectedPrimaryExists = primaryColors.some(
      ({ lightness, chroma, hue }) =>
        Math.abs(lightness - 0.55) < 1e-6 &&
        Math.abs(chroma - 0.18) < 1e-6 &&
        Math.abs(hue - 255) < 1e-6,
    );
    return expectedPrimaryExists
      ? []
      : ["生成 CSS に数値として --primary oklch(0.55 0.18 255) が現れない"];
  },

  /** G5 補強: base: './' が維持されている（白画面事故の直撃点） */
  G5: ({ appDir }) => {
    const viteConfig = path.join(appDir, "vite.config.ts");
    if (!fs.existsSync(viteConfig)) return ["vite.config.ts が存在しない"];
    const content = fs.readFileSync(viteConfig, "utf8");
    const declaration = content.match(/^\s*base\s*:\s*(.+?)\s*,?\s*$/m);
    if (!declaration) return ["vite.config.ts に base 宣言がない"];

    const rawValue = declaration[1].replace(/,$/, "").trim();
    const base = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    return base === "./" ? [] : ["vite.config.ts の base が './' でない"];
  },

  /** v3 の設定ファイルが残っていない */
  V3: ({ appDir }) => {
    const leftovers = ["tailwind.config.js", "postcss.config.js"].filter((file) =>
      fs.existsSync(path.join(appDir, file)),
    );
    return leftovers.length > 0 ? [`v3 の設定ファイルが残っている: ${leftovers.join(", ")}`] : [];
  },
};

const appNames = filterApp ? [filterApp] : fs.readdirSync(APPS_DIR);
const targets = appNames
  .map((name) => ({ name, appDir: path.join(APPS_DIR, name) }))
  .filter(
    ({ appDir }) =>
      fs.existsSync(appDir) && fs.statSync(appDir).isDirectory() && isMigrated(appDir),
  );

if (targets.length === 0) {
  console.error(
    filterApp ? `${filterApp} は未移行、または存在しない` : "移行済みアプリが 1 つもない",
  );
  process.exit(1);
}

let failed = 0;
for (const { name, appDir } of targets) {
  const builtCss = readBuiltCss(appDir);
  if (builtCss === null) {
    console.error(`❌ ${name}: dist/assets に CSS がない（先にビルドすること）`);
    failed++;
    continue;
  }

  const errors = Object.entries(CHECKS).flatMap(([id, check]) =>
    check({ builtCss, appDir }).map((message) => `${id}  ${message}`),
  );

  if (errors.length > 0) {
    console.error(`❌ ${name} (${errors.length}件)`);
    for (const error of errors) console.error(`   ${error}`);
    failed++;
  } else {
    console.log(`✅ ${name}`);
  }
}

console.log(`\n検証: ${targets.length - failed} / ${targets.length} PASS`);
process.exit(failed > 0 ? 1 : 0);
