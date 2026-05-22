#!/usr/bin/env node
/**
 * add-ogp-tags.js
 *
 * 全328ツールの index.html に OGP メタタグを追加する。
 * - og:title が既存なら スキップ (冪等性確保)
 * - og:title, og:description, og:type, og:url を </head> 直前に挿入
 * - meta description がテンプレート値のままなら apps.ts の description で上書き
 * - 未登録ツール(apps.ts に存在しないもの)は index.html の <title> / <meta name="description"> を代替ソースとして使用
 * Note: このスクリプトはシェルコマンドを一切使用しない (fs モジュールのみ)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT, 'apps');
const APPS_TS = path.join(ROOT, 'packages/router/src/config/apps.ts');

const TEMPLATE_DESCRIPTION = 'クライアントサイドで動作する画像トリミングアプリ';
const BASE_URL = 'https://tools.elchika.app';

// -----------------------------------------------------------------
// 1. apps.ts を正規表現で解析して Map を作成
// -----------------------------------------------------------------
function parseAppsTs(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // 各エントリは { path: '/xxx', ..., displayName: 'Yyy', description: 'Zzz', ... } の形式
  const entryRe = /\{\s*path:\s*'(\/[^']+)'[^}]*?displayName:\s*'([^']+)'[^}]*?description:\s*'([^']+)'[^}]*?\}/gs;

  const map = new Map(); // path -> { displayName, description }
  let m;
  while ((m = entryRe.exec(src)) !== null) {
    const toolPath = m[1].trim();
    const displayName = m[2].trim();
    const description = m[3].trim();
    map.set(toolPath, { displayName, description });
  }
  return map;
}

// -----------------------------------------------------------------
// 2. index.html からフォールバック情報を抽出
// -----------------------------------------------------------------
function extractFromHtml(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    description: descMatch ? descMatch[1].trim() : null,
  };
}

// -----------------------------------------------------------------
// 3. OGP タグを生成
// -----------------------------------------------------------------
function buildOgpBlock(ogTitle, ogDescription, ogUrl) {
  return [
    `    <meta property="og:title" content="${ogTitle}" />`,
    `    <meta property="og:description" content="${ogDescription}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:url" content="${ogUrl}" />`,
  ].join('\n');
}

// -----------------------------------------------------------------
// 4. HTML を変換
// -----------------------------------------------------------------
function transformHtml(html, toolDirName, appsMap) {
  // すでに OGP タグがあればスキップ
  if (/property="og:title"/.test(html)) {
    return { html: null, skipped: true, reason: 'already has og:title' };
  }

  const toolPath = `/${toolDirName}`;
  const appInfo = appsMap.get(toolPath);

  let ogTitle, ogDescription, ogUrl;

  if (appInfo) {
    // apps.ts に登録済み
    ogTitle = `${appInfo.displayName} - Elchika Tools`;
    ogDescription = appInfo.description;
    ogUrl = `${BASE_URL}${toolPath}`;
  } else {
    // 未登録: index.html から代替情報を取得
    const fallback = extractFromHtml(html);
    ogTitle = fallback.title || `${toolDirName} - Elchika Tools`;
    ogDescription = fallback.description || toolDirName;
    ogUrl = `${BASE_URL}${toolPath}`;
  }

  // meta description がテンプレート値なら上書き
  let updatedHtml = html;
  if (appInfo) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+name="description"\s+content="[^"]*クライアントサイドで動作する画像トリミングアプリ[^"]*"\s*\/>/i,
      `<meta name="description" content="${appInfo.description}" />`
    );
    // title もテンプレートのままなら上書き
    if (/画像トリミングアプリ/.test(updatedHtml)) {
      updatedHtml = updatedHtml.replace(
        /<title>[^<]*画像トリミングアプリ[^<]*<\/title>/i,
        `<title>${appInfo.displayName} - Elchika Tools</title>`
      );
    }
  }

  // OGP ブロックを </head> 直前に挿入
  const ogpBlock = buildOgpBlock(ogTitle, ogDescription, ogUrl);
  updatedHtml = updatedHtml.replace(/(\s*)<\/head>/, `\n${ogpBlock}\n  </head>`);

  return { html: updatedHtml, skipped: false };
}

// -----------------------------------------------------------------
// 5. メイン処理
// -----------------------------------------------------------------
function main() {
  console.log('Parsing apps.ts ...');
  const appsMap = parseAppsTs(APPS_TS);
  console.log(`  Found ${appsMap.size} apps in apps.ts`);

  const toolDirs = fs.readdirSync(APPS_DIR).filter((name) => {
    const dirPath = path.join(APPS_DIR, name);
    return fs.statSync(dirPath).isDirectory();
  });

  console.log(`  Found ${toolDirs.length} directories in apps/`);

  let processed = 0;
  let skipped = 0;
  let unregistered = 0;
  const errors = [];

  for (const toolDirName of toolDirs) {
    const htmlPath = path.join(APPS_DIR, toolDirName, 'index.html');

    if (!fs.existsSync(htmlPath)) {
      console.warn(`  WARN: ${toolDirName}/index.html not found, skipping`);
      continue;
    }

    const originalHtml = fs.readFileSync(htmlPath, 'utf8');
    const toolPath = `/${toolDirName}`;

    if (!appsMap.has(toolPath)) {
      unregistered++;
    }

    try {
      const result = transformHtml(originalHtml, toolDirName, appsMap);

      if (result.skipped) {
        skipped++;
        console.log(`  SKIP: ${toolDirName} (${result.reason})`);
        continue;
      }

      fs.writeFileSync(htmlPath, result.html, 'utf8');
      processed++;
      console.log(`  OK:   ${toolDirName}`);
    } catch (err) {
      errors.push({ toolDirName, err });
      console.error(`  ERR:  ${toolDirName}: ${err.message}`);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`  Processed:    ${processed}`);
  console.log(`  Skipped:      ${skipped}`);
  console.log(`  Unregistered: ${unregistered}`);
  console.log(`  Errors:       ${errors.length}`);

  if (errors.length > 0) {
    console.error('\nErrors:');
    for (const { toolDirName, err } of errors) {
      console.error(`  ${toolDirName}: ${err.message}`);
    }
    process.exit(1);
  }
}

main();
