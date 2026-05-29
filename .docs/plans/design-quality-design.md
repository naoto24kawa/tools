# AI Design Quality System — Design Spec

**Goal:** Claude が新アプリを生成するとき・既存アプリを監査するときに同じルールセットを参照できる AI 向けデザイン品質システムを構築する。

**Architecture:**
- `.docs/DESIGN.md` — AI 向けルール集（ルール ID + MUST/MUST NOT + コードスニペット）
- `scripts/design-audit.js` — 静的解析で全アプリの違反を検出・JSON 出力
- `CLAUDE.md` — 上記2ファイルへの参照を追記

**Tech Stack:** Node.js (scripts), Markdown (DESIGN.md)

---

## Part 1: DESIGN.md の構造

### フォーマット原則

- ルール ID: `DS-NNN`（Design System）
- 各ルールは `MUST` / `MUST NOT` / `SHOULD` で強度を明示
- コードスニペットは ✅/❌ で即判断できるようにする
- 人間向け説明は省略し、AI が高速スキャンできる密度に保つ

### ルールカテゴリと ID

| ID | カテゴリ | チェック内容 |
|----|---------|------------|
| DS-001 | ページ構造 | `min-h-screen bg-background` ラッパー、header > main 順序 |
| DS-002 | ヘッダー | "← Tools トップに戻る" リンク、h1 スタイル、説明文スタイル |
| DS-003 | ボタン | `type="button"` 必須、shadcn Button 使用、`<div onClick>` 禁止 |
| DS-004 | カラー | shadcn トークン必須、任意カラー (`text-blue-*` 等) 禁止 |
| DS-005 | インポート | `@components/ui/` エイリアス必須、相対パス禁止 |
| DS-006 | HTML lang | `<html lang="ja">` 必須 |
| DS-007 | Meta description | `<meta name="description">` 必須、空・テンプレート禁止 |
| DS-008 | OGP | `og:title` / `og:description` 必須 |
| DS-009 | コンテナ | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` パターン使用 |
| DS-010 | スペーシング | shadcn/Tailwind スケールトークン推奨、`gap-[14px]` 等の任意値は警告 (SHOULD) |

---

## Part 2: design-audit.js の設計

### 処理フロー

```
1. packages/router/public/ からデプロイ済みアプリ名を収集
2. 各アプリの以下ファイルを読み込む:
   - apps/<name>/index.html
   - apps/<name>/src/**/*.tsx
3. 各ファイルに対してルールチェック (grep / 正規表現)
4. 違反を { appName, rule, file, detail } として収集
5. JSON 出力 + コンソールサマリー
6. .docs/design-audit-result.json に保存
```

### チェック実装方針

- `index.html` → 文字列検索（lang, meta, og タグ）
- `*.tsx` → 正規表現（クラス名パターン、インポートパターン、button 要素）
- 判定は「見つかるべきものがない」または「あってはならないものがある」の2方向

### 出力フォーマット

```json
{
  "timestamp": "2026-05-29T...",
  "summary": {
    "total": 328,
    "clean": 295,
    "violating": 33,
    "totalViolations": 87
  },
  "apps": [
    {
      "appName": "example-tool",
      "violations": [
        {
          "rule": "DS-003",
          "file": "src/App.tsx",
          "detail": "<button> 要素に type 属性がない"
        }
      ]
    }
  ]
}
```

### CLI オプション

```
node scripts/design-audit.js [--rule=DS-003] [--app=image-resize] [--fix-hints]
```

- `--rule=DS-NNN` — 特定ルールのみチェック
- `--app=<name>` — 特定アプリのみチェック
- `--fix-hints` — 各違反に修正コードスニペットを付与

---

## Part 3: CLAUDE.md への統合

### 追記内容

```markdown
## Design Rules (AI向けデザイン品質)

UIコードを書く・レビューするときは必ず `.docs/DESIGN.md` を先に読むこと。
既存アプリを監査するときは `node scripts/design-audit.js` を実行して結果を確認すること。
新規アプリ作成時は DS-001〜DS-010 を全て満たすこと。
```

---

## ファイル一覧

| ファイル | 操作 | 内容 |
|---------|------|------|
| `.docs/DESIGN.md` | 新規作成 | AI向けルール集 (DS-001〜DS-010) |
| `scripts/design-audit.js` | 新規作成 | 静的解析スクリプト |
| `CLAUDE.md` | 追記 | DESIGN.md / audit スクリプトへの参照 |

---

## 成功基準

1. `node scripts/design-audit.js` が 328 アプリを走査してレポートを生成できる
2. `.docs/DESIGN.md` を読んだ Claude が新アプリのコードに DS-001〜DS-010 を適用できる
3. 監査結果 JSON から Claude がどのアプリの何を直すべきか判断できる
