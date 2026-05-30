# Markdown to PDF — Design Spec

**Goal:** ブラウザ上でマークダウンを入力・アップロードし、ブラウザ印刷API経由でPDFとして保存できるクライアントサイドツールを構築する。

**Architecture:** `marked`（MD→HTML変換）+ CSS `@media print`（レイアウト制御）+ `window.print()`（出力）。PDF生成ライブラリ不要でレンダリング品質を最大化する。

**Tech Stack:** React 18 + TypeScript, marked, DOMPurify, Tailwind CSS, shadcn/ui

---

## アプリ概要

- **アプリ名:** `markdown-to-pdf`
- **URL:** `tools.elchika.app/markdown-to-pdf/`
- **分類:** テキスト系ツール
- **完全クライアントサイド:** サーバー通信なし

---

## ファイル構成

| ファイル | 操作 | 責務 |
|---------|------|------|
| `apps/markdown-to-pdf/src/App.tsx` | 新規作成 | UI全体（エディタ・プレビュー・設定・ファイル入力） |
| `apps/markdown-to-pdf/src/utils/markdownConverter.ts` | 新規作成 | `marked` + `DOMPurify` によるMD→HTML変換（純粋関数） |
| `apps/markdown-to-pdf/src/utils/printStyles.ts` | 新規作成 | 設定値（用紙サイズ・フォントサイズ）を受け取りCSS文字列を生成（純粋関数） |
| `apps/markdown-to-pdf/src/utils/__tests__/markdownConverter.test.ts` | 新規作成 | Markdown構文の変換テスト |
| `apps/markdown-to-pdf/src/utils/__tests__/printStyles.test.ts` | 新規作成 | CSS文字列生成テスト |
| `apps/markdown-to-pdf/index.html` | 新規作成 | lang="ja", meta description, OGPタグ設定済み |
| `apps/markdown-to-pdf/package.json` | 新規作成 | 依存関係（marked, dompurify） |
| `apps/markdown-to-pdf/vite.config.ts` | 新規作成 | port: 3187 |
| `packages/router/src/config/apps.ts` | 修正 | `markdown-to-pdf` ルーティング追加 |

---

## UI設計

### レイアウト

```
┌─────────────────────────────────────────────────────┐
│ header: ← Tools トップに戻る / h1 / 説明文           │
├─────────────────────────────────────────────────────┤
│ 設定バー: 用紙サイズ [A4▼]  フォントサイズ [中▼]     │
├──────────────────────┬──────────────────────────────┤
│ エディタ（左50%）     │  プレビュー（右50%）          │
│  textarea            │  sanitized HTML レンダリング  │
│  [📁 ファイルを開く] │  （リアルタイム更新）          │
│  ドラッグ＆ドロップ  │                               │
├──────────────────────┴──────────────────────────────┤
│ [📥 PDF として保存]                                  │
│ ※ 印刷ダイアログで「送信先: PDFに保存」を選択         │
└─────────────────────────────────────────────────────┘
```

### 設定項目

| 項目 | 選択肢 | デフォルト |
|------|--------|-----------|
| 用紙サイズ | A4 / Letter | A4 |
| フォントサイズ | 小(12px) / 中(16px) / 大(20px) | 中(16px) |

### ファイル入力

- 「ファイルを開く」ボタン: `<input type="file" accept=".md,.markdown">` を非表示でトリガー
- ドラッグ＆ドロップ: エディタ領域全体がドロップゾーン（`.md` / `.markdown` のみ受け付け）
- FileReader API でテキスト読み込み → textarea に反映

---

## データフロー

```
[ユーザー入力 / ファイルアップロード]
        ↓ markdownText (state)
[markdownConverter.ts: marked(text) → HTML → DOMPurify.sanitize()]
        ↓ sanitizedHtml (state)
[プレビューパネル: サニタイズ済みHTMLをレンダリング]

[「PDF として保存」クリック]
        ↓ paperSize, fontSize (state)
[printStyles.ts: generatePrintCSS({ paperSize, fontSize }) → CSS文字列]
        ↓
[DOM: <style id="md-print-styles"> を upsert]
        ↓
[window.print()]
```

---

## `markdownConverter.ts` 設計

```typescript
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function convertMarkdownToHtml(markdown: string): string {
  const raw = marked(markdown) as string;
  return DOMPurify.sanitize(raw);
}
```

- `marked` のデフォルト設定を使用（GFM有効、表サポートあり）
- `DOMPurify.sanitize()` でXSSを防ぐ（必須）
- 戻り値はサニタイズ済みHTML文字列

---

## `printStyles.ts` 設計

```typescript
export type PaperSize = 'A4' | 'Letter';
export type FontSize = 12 | 16 | 20;

export function generatePrintCSS(options: { paperSize: PaperSize; fontSize: FontSize }): string {
  return `@media print { ... }`;
}
```

**`@media print` で適用するスタイル:**

```css
@media print {
  /* エディタ・設定・ボタンを非表示にしてプレビューのみ印刷 */
  body > #root > * { display: none !important; }
  #pdf-preview { display: block !important; }

  @page {
    size: A4;          /* 設定値で切り替え */
    margin: 2cm;
  }

  body {
    font-size: 16px;   /* 設定値で切り替え */
    font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
    color: #000;
    background: #fff;
  }

  h1 { font-size: 2em; border-bottom: 2px solid #333; padding-bottom: 0.25em; margin-top: 1.5em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.2em; margin-top: 1.2em; }
  h3 { font-size: 1.25em; margin-top: 1em; }

  pre { background: #f5f5f5; padding: 12px; border-radius: 4px; overflow: visible; white-space: pre-wrap; }
  pre, code { font-family: 'Courier New', monospace; font-size: 0.875em; }
  code:not(pre code) { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }

  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; }
  th { background: #f5f5f5; font-weight: bold; }

  hr { page-break-after: always; border: none; margin: 0; }

  a { color: #000; text-decoration: underline; }
  img { max-width: 100%; }

  blockquote { border-left: 4px solid #ccc; margin-left: 0; padding-left: 1em; color: #555; }
}
```

---

## エクスポートフロー

```typescript
function handleExport() {
  const css = generatePrintCSS({ paperSize, fontSize });
  let styleEl = document.getElementById('md-print-styles') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'md-print-styles';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
  window.print();
}
```

---

## テスト設計

### `markdownConverter.test.ts`

| テストケース | 入力 | 期待出力 |
|------------|------|---------|
| 見出し変換 | `# Hello` | `<h1>Hello</h1>` を含む |
| 箇条書き | `- item` | `<ul><li>item</li></ul>` を含む |
| コードブロック | ` ```js\nconsole.log()\n``` ` | `<pre><code>` を含む |
| 表 | GFM table syntax | `<table>` を含む |
| XSS サニタイズ | `<script>alert(1)</script>` | `<script>` が除去される |
| 空文字 | `""` | `""` を返す |

### `printStyles.test.ts`

| テストケース | 入力 | 期待出力 |
|------------|------|---------|
| A4 / 中 | `{ paperSize: 'A4', fontSize: 16 }` | `size: A4` と `font-size: 16px` を含む |
| Letter / 小 | `{ paperSize: 'Letter', fontSize: 12 }` | `size: Letter` と `font-size: 12px` を含む |
| 大フォント | `{ paperSize: 'A4', fontSize: 20 }` | `font-size: 20px` を含む |

---

## DS-001〜DS-010 チェックリスト

- [x] DS-001: `min-h-screen bg-background` ラッパー
- [x] DS-002: ヘッダーにバックリンク・h1・説明文
- [x] DS-003: Button に `type="button"`
- [x] DS-004: shadcn カラートークンのみ使用
- [x] DS-005: `@/components/ui/` パスエイリアス
- [x] DS-006: `<html lang="ja">`
- [x] DS-007: meta description ツール固有
- [x] DS-008: og:title / og:description
- [x] DS-009: `max-w-7xl` コンテナ
