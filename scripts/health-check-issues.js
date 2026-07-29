#!/usr/bin/env node
/**
 * 全ツールの健康診断 Issue を一括作成するスクリプト
 * 使用方法: node scripts/health-check-issues.js [--dry-run] [--limit=N] [--offset=N]
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;
const offsetArg = args.find((a) => a.startsWith("--offset="));
const OFFSET = offsetArg ? parseInt(offsetArg.split("=")[1]) : 0;

const TEMPLATE_DESC = "クライアントサイドで動作する画像トリミングアプリ";
const REPO = "naoto24kawa/tools";

// apps.ts から登録済みツール情報を取得
function parseAppsTs() {
  const content = fs.readFileSync("./packages/router/src/config/apps.ts", "utf-8");
  const map = new Map();
  const regex =
    /\{\s*path:\s*'([^']+)',\s*url:\s*'[^']+',\s*icon:\s*'([^']*)',\s*displayName:\s*'([^']+)',\s*description:\s*'([^']+)',\s*category:\s*'([^']+)'\s*\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const toolName = match[1].replace("/", "");
    map.set(toolName, {
      path: match[1],
      icon: match[2],
      displayName: match[3],
      description: match[4],
      category: match[5],
    });
  }
  return map;
}

// index.html からメタ情報を解析
function parseHtml(htmlPath) {
  if (!fs.existsSync(htmlPath)) return null;
  const html = fs.readFileSync(htmlPath, "utf-8");

  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/);
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/);
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/);
  const langMatch = html.match(/<html[^>]*lang="([^"]*)"/);

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    metaDesc: descMatch ? descMatch[1].trim() : null,
    hasOGTitle: !!ogTitleMatch,
    hasOGDesc: !!ogDescMatch,
    hasOGImage: !!ogImageMatch,
    lang: langMatch ? langMatch[1] : null,
  };
}

// テストファイルの有無チェック
function hasTests(toolDir) {
  const testsDir = path.join(toolDir, "src/utils/__tests__");
  if (!fs.existsSync(testsDir)) return false;
  const files = fs
    .readdirSync(testsDir)
    .filter((f) => f.endsWith(".test.ts") || f.endsWith(".test.tsx"));
  return files.length > 0;
}

// ツール情報を収集
function collectToolInfo(toolName, registeredInfo) {
  const toolDir = `./apps/${toolName}`;
  const htmlPath = path.join(toolDir, "index.html");
  const html = parseHtml(htmlPath);
  const testExists = hasTests(toolDir);

  const issues = [];
  const checks = {};

  checks.registered = !!registeredInfo;
  if (!registeredInfo) {
    issues.push("apps.ts に未登録（ルーティング未設定）");
  }

  if (html) {
    if (!html.metaDesc) {
      checks.metaDesc = "missing";
      issues.push('`<meta name="description">` が未設定');
    } else if (html.metaDesc === TEMPLATE_DESC) {
      checks.metaDesc = "template";
      issues.push('`<meta name="description">` がテンプレートのまま');
    } else if (html.metaDesc === "") {
      checks.metaDesc = "empty";
      issues.push('`<meta name="description">` が空');
    } else {
      checks.metaDesc = "ok";
    }

    checks.ogTitle = html.hasOGTitle;
    checks.ogDesc = html.hasOGDesc;
    checks.ogImage = html.hasOGImage;
    if (!html.hasOGTitle || !html.hasOGDesc || !html.hasOGImage) {
      const missing = [];
      if (!html.hasOGTitle) missing.push("og:title");
      if (!html.hasOGDesc) missing.push("og:description");
      if (!html.hasOGImage) missing.push("og:image");
      issues.push(`OGP タグ未設定: ${missing.join(", ")}`);
    }

    checks.lang = html.lang;
    if (html.lang !== "ja") {
      issues.push(`html lang 属性が "ja" でない (現在: "${html.lang}")`);
    }
  } else {
    issues.push("index.html が存在しない");
    checks.metaDesc = "no-html";
  }

  checks.tests = testExists;
  if (!testExists) {
    issues.push("ユニットテストが存在しない");
  }

  let displayName = registeredInfo?.displayName;
  if (!displayName && html?.title) {
    displayName = html.title.replace(" - Elchika Tools", "").trim();
  }
  if (!displayName) {
    displayName = toolName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return {
    toolName,
    displayName,
    path: registeredInfo?.path ?? `/${toolName}`,
    category: registeredInfo?.category ?? "未登録",
    description: registeredInfo?.description ?? html?.metaDesc ?? "（未設定）",
    icon: registeredInfo?.icon ?? "🔧",
    issues,
    checks,
    html,
  };
}

// Issue 本文を生成
function generateIssueBody(info) {
  const { path: toolPath, category, description, checks, issues, html } = info;

  const registeredEmoji = checks.registered ? "✅" : "❌";
  const metaDescEmoji = checks.metaDesc === "ok" ? "✅" : "❌";
  const ogEmoji = checks.ogTitle && checks.ogDesc && checks.ogImage ? "✅" : "❌";
  const testEmoji = checks.tests ? "✅" : "❌";
  const langEmoji = checks.lang === "ja" ? "✅" : "❌";

  const currentMetaDesc = html?.metaDesc ?? "（なし）";
  const isTemplateDesc = currentMetaDesc === TEMPLATE_DESC;

  const staticSummary =
    issues.length === 0
      ? "静的解析で問題は検出されませんでした。"
      : `静的解析で **${issues.length}件** の問題を検出しました。`;

  const issueList = issues.map((i) => `- ⚠️ ${i}`).join("\n") || "- なし";

  const metaDescDetail = (() => {
    switch (checks.metaDesc) {
      case "ok":
        return "正常";
      case "template":
        return "**テンプレートのまま**";
      case "missing":
        return "**未設定**";
      case "empty":
        return "**空**";
      default:
        return "index.html なし";
    }
  })();

  return `## ツール情報

| 項目 | 値 |
|------|-----|
| パス | \`${toolPath}\` |
| カテゴリ | ${category} |
| 説明 (apps.ts) | ${description} |
| apps.ts 登録 | ${registeredEmoji} |

## 静的解析結果

${staticSummary}

| チェック項目 | 状態 | 詳細 |
|-------------|:----:|------|
| apps.ts 登録 | ${registeredEmoji} | ${checks.registered ? "登録済み" : "**未登録** - ルーティング未設定"} |
| meta description | ${metaDescEmoji} | ${metaDescDetail} |
| OGP タグ | ${ogEmoji} | og:title ${checks.ogTitle ? "✅" : "❌"} / og:description ${checks.ogDesc ? "✅" : "❌"} / og:image ${checks.ogImage ? "✅" : "❌"} |
| lang 属性 | ${langEmoji} | \`${checks.lang ?? "なし"}\` |
| ユニットテスト | ${testEmoji} | ${checks.tests ? "あり" : "**なし**"} |

### 検出された問題

${issueList}

${isTemplateDesc ? `> **現在の meta description**: \`${currentMetaDesc}\`\n` : ""}
## チェックリスト

### SEO / メタ情報
- [${checks.metaDesc === "ok" ? "x" : " "}] \`<meta name="description">\` がツールの内容を正確に説明している
- [${checks.ogTitle && checks.ogDesc ? "x" : " "}] OGP タグが設定されている (\`og:title\`, \`og:description\`, \`og:image\`)

### アクセシビリティ (WCAG 2.1 AA)
- [ ] コントラスト比 4.5:1 以上（テキスト）
- [ ] フォーカスインジケーターが視覚的に明確
- [ ] インタラクティブ要素に適切な ARIA ラベル
- [ ] キーボードのみで全機能が操作できる
- [ ] スクリーンリーダーで主要機能が利用できる

### コード品質
- [ ] \`vp check\` (Oxlint) でエラーなし
- [ ] TypeScript 型エラーなし
- [${checks.tests ? "x" : " "}] ユニットテストが存在する
- [ ] コアロジックがテストでカバーされている

### UI 動作確認
- [ ] 基本機能（入力 → 処理 → 出力）が正常動作
- [ ] エラー入力時に適切なメッセージ表示
- [ ] モバイル幅 (375px) でレイアウト崩れなし

---

*このIssueは健康診断スクリプトにより自動生成されました。チェックリスト完了後にIssueをクローズしてください。*`;
}

// gh issue create を spawnSync で実行（シェルインジェクション防止）
function createIssue(title, body, label) {
  const tmpFile = `/tmp/gh-issue-body-${Date.now()}.md`;
  fs.writeFileSync(tmpFile, body, "utf-8");

  const result = spawnSync(
    "gh",
    ["issue", "create", "--repo", REPO, "--title", title, "--label", label, "--body-file", tmpFile],
    { encoding: "utf-8" },
  );

  fs.unlinkSync(tmpFile);

  if (result.status !== 0) {
    throw new Error(result.stderr || "gh issue create failed");
  }
  return result.stdout.trim();
}

// メイン処理
async function main() {
  console.log("📊 ツール情報を収集中...");

  const registeredMap = parseAppsTs();
  const allTools = fs
    .readdirSync("./apps")
    .filter((d) => fs.statSync(`./apps/${d}`).isDirectory())
    .sort();

  console.log(`登録済み: ${registeredMap.size} / 合計: ${allTools.length}`);

  const toolInfos = allTools.map((name) => collectToolInfo(name, registeredMap.get(name)));

  const totalIssueCount = toolInfos.reduce((sum, t) => sum + t.issues.length, 0);
  const withIssues = toolInfos.filter((t) => t.issues.length > 0).length;
  console.log(
    `問題のあるツール: ${withIssues}/${allTools.length} (検出問題総数: ${totalIssueCount})`,
  );

  if (DRY_RUN) {
    console.log("\n--- DRY RUN: 最初の2件のIssue内容 ---\n");
    for (const info of toolInfos.slice(0, 2)) {
      const title = `[Health Check] ${info.displayName} (${info.path})`;
      console.log(`### ${title}`);
      console.log(generateIssueBody(info));
      console.log("\n---\n");
    }
    return;
  }

  const targets = toolInfos.slice(
    OFFSET,
    OFFSET === 0 && LIMIT === Infinity ? undefined : OFFSET + LIMIT,
  );
  console.log(`\n🚀 Issue 作成開始: ${targets.length}件 (offset=${OFFSET})`);

  let created = 0;
  let failed = 0;

  for (const info of targets) {
    const title = `[Health Check] ${info.displayName} (${info.path})`;

    try {
      const url = createIssue(title, generateIssueBody(info), "health-check");
      created++;
      process.stdout.write(`\r✅ ${created}/${targets.length} 作成済み`);
    } catch (err) {
      failed++;
      console.error(`\n❌ 失敗: ${title}`);
      console.error(err.message);
    }

    // レート制限対策
    if (created % 20 === 0 && created > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n\n✨ 完了: 成功 ${created} / 失敗 ${failed}`);
}

main().catch(console.error);
