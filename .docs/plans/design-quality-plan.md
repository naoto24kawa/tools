# AI Design Quality System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Claude が新アプリ生成時と既存アプリ監査時に同じルールセットを使えるよう、AI向けデザインルール集と静的解析スクリプトを整備する。

**Architecture:** `.docs/DESIGN.md`（ルール ID 付き AI 向けドキュメント）+ `scripts/design-audit.js`（静的解析）+ `CLAUDE.md` 追記の3点セット。

**Tech Stack:** Node.js (scripts/design-audit.js), Markdown (.docs/DESIGN.md)

---

## File Structure

| ファイル | 操作 | 内容 |
|---------|------|------|
| `.docs/DESIGN.md` | 新規作成（設計フェーズで作成済み） | DS-001〜DS-010 の AI 向けルール集 |
| `scripts/design-audit.js` | 新規作成 | 全アプリの静的解析スクリプト |
| `CLAUDE.md` | 追記 (末尾) | DESIGN.md と design-audit.js への参照 |

---

## Task 1: `.docs/DESIGN.md` をコミットする

**Files:**
- Create: `.docs/DESIGN.md` (設計フェーズで既に作成済み)

- [ ] **Step 1: ファイルが正しく作成されていることを確認する**

```bash
cat .docs/DESIGN.md | head -5
grep "DS-" .docs/DESIGN.md | head -10
```

Expected: `# AI Design Rules — Elchika Tools` が1行目に表示され、DS-001〜DS-010 が含まれている。

- [ ] **Step 2: コミットする**

```bash
git add .docs/DESIGN.md
git commit -m "docs: add AI-oriented design rules (.docs/DESIGN.md, DS-001~DS-010)"
```

---

## Task 2: `scripts/design-audit.js` を作成する

**Files:**
- Create: `scripts/design-audit.js`

- [ ] **Step 1: スクリプトを作成する**

`scripts/design-audit.js` を以下の内容で作成する:

```javascript
#!/usr/bin/env node
/**
 * AI Design Quality Audit
 * DS-001〜DS-010 に基づき全アプリを静的解析する
 *
 * 使用方法:
 *   node scripts/design-audit.js
 *   node scripts/design-audit.js --app=url-encoder
 *   node scripts/design-audit.js --rule=DS-003
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const filterApp = args.find(a => a.startsWith('--app='))?.split('=')[1];
const filterRule = args.find(a => a.startsWith('--rule='))?.split('=')[1];

const ARBITRARY_COLOR_PATTERNS = [
  /\btext-(blue|red|green|yellow|purple|pink|orange|cyan|teal|indigo|violet|rose|fuchsia|sky|lime|amber|emerald|slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  /\bbg-(blue|red|green|yellow|purple|pink|orange|cyan|teal|indigo|violet|rose|fuchsia|sky|lime|amber|emerald|slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
  /\bborder-(blue|red|green|yellow|purple|pink|orange|cyan|teal|indigo|violet|rose|fuchsia|sky|lime|amber|emerald|slate|gray|zinc|neutral|stone)-\d{2,3}\b/,
];

/** apps/<name>/src/ 配下の tsx/ts ファイル一覧（components/ui/ 除外） */
function getTsxFiles(appDir) {
  const srcDir = path.join(appDir, 'src');
  if (!fs.existsSync(srcDir)) return [];
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'ui') continue; // shadcn 内部は除外
        walk(full);
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        results.push(full);
      }
    }
  }
  walk(srcDir);
  return results;
}

const RULES = {
  'DS-001': ({ appDir, tsxContents }) => {
    const appTsx = tsxContents.find(([f]) => f.endsWith('App.tsx'));
    if (!appTsx) return [];
    const [file, content] = appTsx;
    if (!content.includes('min-h-screen') || !content.includes('bg-background')) {
      return [{ rule: 'DS-001', file: path.relative(appDir, file), detail: 'min-h-screen bg-background ラッパーがない' }];
    }
    return [];
  },

  'DS-002': ({ appDir, tsxContents }) => {
    const appTsx = tsxContents.find(([f]) => f.endsWith('App.tsx'));
    if (!appTsx) return [];
    const [file, content] = appTsx;
    const violations = [];
    if (!content.includes('トップに戻る')) {
      violations.push({ rule: 'DS-002', file: path.relative(appDir, file), detail: '"← Tools トップに戻る" バックリンクがない' });
    }
    if (!content.includes('text-3xl font-bold tracking-tight')) {
      violations.push({ rule: 'DS-002', file: path.relative(appDir, file), detail: 'h1 に text-3xl font-bold tracking-tight がない' });
    }
    return violations;
  },

  'DS-003': ({ appDir, tsxContents }) => {
    const violations = [];
    for (const [file, content] of tsxContents) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/<button\b(?![^>]*\btype=)[^>]*>/.test(line)) {
          violations.push({ rule: 'DS-003', file: path.relative(appDir, file), detail: `L${i + 1}: <button> に type 属性がない` });
        }
      });
    }
    return violations;
  },

  'DS-004': ({ appDir, tsxContents }) => {
    const violations = [];
    for (const [file, content] of tsxContents) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
        for (const pattern of ARBITRARY_COLOR_PATTERNS) {
          const match = line.match(pattern);
          if (match) {
            violations.push({ rule: 'DS-004', file: path.relative(appDir, file), detail: `L${i + 1}: 任意カラークラス "${match[0]}"` });
            break;
          }
        }
      });
    }
    return violations;
  },

  'DS-005': ({ appDir, tsxContents }) => {
    const violations = [];
    for (const [file, content] of tsxContents) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/from\s+['"]\.\.+\/.*components\/ui\//.test(line)) {
          violations.push({ rule: 'DS-005', file: path.relative(appDir, file), detail: `L${i + 1}: 相対パスで components/ui をインポートしている` });
        }
      });
    }
    return violations;
  },

  'DS-006': ({ appDir, indexHtml }) => {
    if (!indexHtml) return [{ rule: 'DS-006', file: 'index.html', detail: 'index.html が存在しない' }];
    if (!/<html[^>]+lang="ja"/.test(indexHtml)) {
      return [{ rule: 'DS-006', file: 'index.html', detail: 'lang="ja" が設定されていない' }];
    }
    return [];
  },

  'DS-007': ({ appDir, indexHtml }) => {
    if (!indexHtml) return [];
    if (!/<meta\s[^>]*name="description"[^>]*content="[^"]+"\s*\/?>/i.test(indexHtml)) {
      return [{ rule: 'DS-007', file: 'index.html', detail: 'meta description が未設定または空' }];
    }
    return [];
  },

  'DS-008': ({ appDir, indexHtml }) => {
    if (!indexHtml) return [];
    const violations = [];
    if (!/<meta\s[^>]*property="og:title"/.test(indexHtml)) {
      violations.push({ rule: 'DS-008', file: 'index.html', detail: 'og:title がない' });
    }
    if (!/<meta\s[^>]*property="og:description"/.test(indexHtml)) {
      violations.push({ rule: 'DS-008', file: 'index.html', detail: 'og:description がない' });
    }
    return violations;
  },

  'DS-009': ({ appDir, tsxContents }) => {
    const appTsx = tsxContents.find(([f]) => f.endsWith('App.tsx'));
    if (!appTsx) return [];
    const [file, content] = appTsx;
    if (!content.includes('max-w-7xl') && !content.includes('max-w-6xl') && !content.includes('max-w-5xl')) {
      return [{ rule: 'DS-009', file: path.relative(appDir, file), detail: 'max-w コンテナがない (max-w-5xl/6xl/7xl のいずれか)' }];
    }
    return [];
  },

  'DS-010': ({ appDir, tsxContents }) => {
    const warnings = [];
    for (const [file, content] of tsxContents) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (/\b(?:gap|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|space-[xy])-\[/.test(line)) {
          if (!line.includes('optical adjustment')) {
            warnings.push({ rule: 'DS-010', file: path.relative(appDir, file), detail: `L${i + 1}: 任意スペーシング値 (SHOULD: /* optical adjustment */ コメントを付けること)` });
          }
        }
      });
    }
    return warnings;
  },
};

function auditApp(appName) {
  const appDir = path.join(__dirname, '..', 'apps', appName);
  if (!fs.existsSync(appDir)) return null;

  const indexHtmlPath = path.join(appDir, 'index.html');
  const indexHtml = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, 'utf-8') : null;

  const tsxFiles = getTsxFiles(appDir);
  const tsxContents = tsxFiles.map(f => [f, fs.readFileSync(f, 'utf-8')]);
  const ctx = { appDir, appName, indexHtml, tsxFiles, tsxContents };

  const violations = [];
  for (const [ruleId, check] of Object.entries(RULES)) {
    if (filterRule && filterRule !== ruleId) continue;
    violations.push(...check(ctx));
  }
  return { appName, violations };
}

async function main() {
  const appsDir = path.join(__dirname, '..', 'apps');
  const allApps = fs.readdirSync(appsDir)
    .filter(d => fs.statSync(path.join(appsDir, d)).isDirectory())
    .sort();

  const targets = filterApp ? allApps.filter(a => a === filterApp) : allApps;
  if (filterApp && targets.length === 0) {
    console.error(`❌ アプリ "${filterApp}" が見つかりません`);
    process.exit(1);
  }

  console.log(`\n🔍 デザイン監査開始: ${targets.length} アプリ${filterRule ? ` (${filterRule} のみ)` : ''}\n`);

  const results = targets.map(name => auditApp(name)).filter(Boolean);
  const violating = results.filter(r => r.violations.length > 0);
  const clean = results.filter(r => r.violations.length === 0);
  const totalViolations = results.reduce((s, r) => s + r.violations.length, 0);

  for (const { appName, violations } of violating) {
    console.log(`\n❌ ${appName} (${violations.length}件)`);
    for (const v of violations) {
      console.log(`   ${v.rule}  ${v.file}  ${v.detail}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊 デザイン監査結果`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`✅ 準拠: ${clean.length} / ${targets.length}`);
  console.log(`❌ 違反あり: ${violating.length} / ${targets.length}`);
  console.log(`   違反総数: ${totalViolations}`);
  console.log(`${'═'.repeat(60)}\n`);

  const outPath = path.join(__dirname, '..', '.docs', 'design-audit-result.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    filter: { app: filterApp ?? null, rule: filterRule ?? null },
    summary: { total: targets.length, clean: clean.length, violating: violating.length, totalViolations },
    apps: violating,
  }, null, 2));
  console.log(`📄 結果を保存: ${outPath}\n`);

  process.exit(violating.length > 0 ? 1 : 0);
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: 動作確認（単一アプリ）**

```bash
node scripts/design-audit.js --app=url-encoder
```

Expected: url-encoder の監査結果が表示され `.docs/design-audit-result.json` が生成される。

- [ ] **Step 3: 全アプリ走査**

```bash
node scripts/design-audit.js 2>&1 | tail -10
```

Expected: 全アプリの監査サマリーが表示される。

- [ ] **Step 4: コミットする**

```bash
git add scripts/design-audit.js
git commit -m "feat: add design-audit.js (DS-001~DS-010 static analysis)"
```

---

## Task 3: `CLAUDE.md` に Design Rules セクションを追記する

**Files:**
- Modify: `CLAUDE.md` (末尾に追記)

- [ ] **Step 1: CLAUDE.md の末尾に以下のセクションを追加する**

`## Gotchas` セクションの後、ファイル末尾に追記:

```
## Design Rules (AI向けデザイン品質)

UIコードを書く・レビューするときは必ず `.docs/DESIGN.md` を先に読むこと。

- **新規アプリ生成時**: DS-001〜DS-010 をすべて確認してからコミットする
- **既存アプリ監査時**: `node scripts/design-audit.js --app=<name>` を実行し、違反を修正する
- **全アプリ一括監査**: `node scripts/design-audit.js` → `.docs/design-audit-result.json` を参照
```

- [ ] **Step 2: 追記確認**

```bash
tail -10 CLAUDE.md
```

Expected: `Design Rules` セクションが末尾に表示される。

- [ ] **Step 3: コミットする**

```bash
git add CLAUDE.md
git commit -m "docs: add Design Rules section to CLAUDE.md"
```

---

## 完了確認

全タスク完了後:

```bash
# DESIGN.md が読み込める
grep "DS-" .docs/DESIGN.md | wc -l
# Expected: 10以上

# audit スクリプトが走る
node scripts/design-audit.js --app=url-encoder --rule=DS-006

# CLAUDE.md に参照が入っている
grep "DESIGN.md" CLAUDE.md
# Expected: .docs/DESIGN.md の行が表示される
```
