# Markdown to PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** マークダウンをブラウザ上でリアルタイムプレビューしながら `window.print()` 経由でPDFとして保存できるクライアントサイドSPAを構築する。

**Architecture:** `marked.parse()` でMD→HTML変換、`DOMPurify.sanitize({ RETURN_DOM_FRAGMENT: true })` でXSSを防ぎつつDOMノードとして安全にレンダリング、`@media print` CSS + `window.print()` でPDF出力。innerHTML は使用しない。

**Tech Stack:** React 19, TypeScript, marked, DOMPurify, Tailwind CSS 3.4, shadcn/ui, Vite+

---

## File Structure

| ファイル | 操作 | 内容 |
|---------|------|------|
| `apps/markdown-to-pdf/package.json` | 新規作成 | 依存関係（marked, dompurify, @types/dompurify） |
| `apps/markdown-to-pdf/index.html` | 新規作成 | lang="ja", meta description, OGP |
| `apps/markdown-to-pdf/vite.config.ts` | 新規作成 | port: 5455, パスエイリアス |
| `apps/markdown-to-pdf/tsconfig.json` | 新規作成 | tsconfig.base.json 継承 + パスエイリアス |
| `apps/markdown-to-pdf/tailwind.config.js` | 新規作成 | shadcn/ui トークン設定 |
| `apps/markdown-to-pdf/postcss.config.js` | 新規作成 | tailwindcss + autoprefixer |
| `apps/markdown-to-pdf/wrangler.toml` | 新規作成 | レガシー設定 |
| `apps/markdown-to-pdf/src/main.tsx` | 新規作成 | React エントリポイント |
| `apps/markdown-to-pdf/src/index.css` | 新規作成 | Tailwind base + shadcn CSS 変数 |
| `apps/markdown-to-pdf/src/components/ui/` | 新規作成 | shadcn/ui コンポーネント |
| `apps/markdown-to-pdf/src/lib/utils.ts` | 新規作成 | `cn()` ユーティリティ |
| `apps/markdown-to-pdf/src/hooks/useToast.ts` | 新規作成 | toast フック |
| `apps/markdown-to-pdf/src/utils/markdownConverter.ts` | 新規作成 | marked + DOMPurify によるMD変換（文字列 / DOMFragment 両対応） |
| `apps/markdown-to-pdf/src/utils/printStyles.ts` | 新規作成 | @media print CSS 文字列生成 |
| `apps/markdown-to-pdf/src/utils/__tests__/markdownConverter.test.ts` | 新規作成 | 変換ロジックテスト |
| `apps/markdown-to-pdf/src/utils/__tests__/printStyles.test.ts` | 新規作成 | CSS生成テスト |
| `apps/markdown-to-pdf/src/App.tsx` | 新規作成 | メインUI |
| `packages/router/src/config/apps.ts` | 修正 | `markdown-to-pdf` ルーティング追加 |

---

## Task 1: アプリスキャフォールド（設定ファイル群）

**Files:**
- Create: `apps/markdown-to-pdf/package.json`
- Create: `apps/markdown-to-pdf/index.html`
- Create: `apps/markdown-to-pdf/vite.config.ts`
- Create: `apps/markdown-to-pdf/tsconfig.json`
- Create: `apps/markdown-to-pdf/tailwind.config.js`
- Create: `apps/markdown-to-pdf/postcss.config.js`
- Create: `apps/markdown-to-pdf/wrangler.toml`

- [ ] **Step 1: `package.json` を作成する**

```json
{
  "name": "markdown-to-pdf",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "preview": "vp preview",
    "type-check": "vp check",
    "test": "vp test",
    "test:watch": "vp test --watch",
    "test:coverage": "vp test --coverage",
    "lint": "vp check",
    "lint:fix": "vp check --fix",
    "format": "vp check --fix",
    "format:check": "vp check",
    "deploy": "vp build && wrangler pages deploy dist --project-name=tools-markdown-to-pdf"
  },
  "dependencies": {
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-toast": "^1.2.15",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dompurify": "^3.2.6",
    "lucide-react": "^0.546.0",
    "marked": "^15.0.12",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.5",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react-swc": "^4.3.0",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "vite": "^8.0.0"
  }
}
```

- [ ] **Step 2: `index.html` を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Markdown to PDF - Elchika Tools</title>
    <meta name="description" content="マークダウンをPDFとして保存できるブラウザツール。リアルタイムプレビュー付き。" />
    <meta property="og:title" content="Markdown to PDF - Elchika Tools" />
    <meta property="og:description" content="マークダウンをPDFとして保存できるブラウザツール。リアルタイムプレビュー付き。" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tools.elchika.app/markdown-to-pdf" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: `vite.config.ts` を作成する**

```typescript
import path from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5455,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
```

- [ ] **Step 4: `tsconfig.json` を作成する**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": true,
    "paths": {
      "*": ["./*"],
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types": ["./src/types"],
      "@config/*": ["./src/config/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 5: `tailwind.config.js` を作成する**

`apps/url-encoder/tailwind.config.js` の内容をそのままコピーする:

```bash
cp apps/url-encoder/tailwind.config.js apps/markdown-to-pdf/tailwind.config.js
```

- [ ] **Step 6: `postcss.config.js` と `wrangler.toml` を作成する**

`postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`wrangler.toml`:
```toml
name = "tools-markdown-to-pdf"
compatibility_date = "2024-10-19"
```

- [ ] **Step 7: `pnpm install` を実行する**

```bash
cd apps/markdown-to-pdf && pnpm install
```

Expected: `node_modules/marked`, `node_modules/dompurify`, `node_modules/@types/dompurify` が存在する。

```bash
ls node_modules | grep -E "^(marked|dompurify)$"
```

Expected: `dompurify` と `marked` が表示される。

- [ ] **Step 8: コミットする**

```bash
cd ../..
git add apps/markdown-to-pdf/package.json apps/markdown-to-pdf/index.html apps/markdown-to-pdf/vite.config.ts apps/markdown-to-pdf/tsconfig.json apps/markdown-to-pdf/tailwind.config.js apps/markdown-to-pdf/postcss.config.js apps/markdown-to-pdf/wrangler.toml
git commit -m "chore: scaffold markdown-to-pdf app config files"
```

---

## Task 2: shadcn/ui コンポーネント + エントリポイント

**Files:**
- Create: `apps/markdown-to-pdf/src/main.tsx`
- Create: `apps/markdown-to-pdf/src/index.css`
- Create: `apps/markdown-to-pdf/src/lib/utils.ts`
- Create: `apps/markdown-to-pdf/src/hooks/useToast.ts`
- Create: `apps/markdown-to-pdf/src/components/ui/{button,card,select,label,toast,toaster}.tsx`

- [ ] **Step 1: ディレクトリを作成してファイルをコピーする**

```bash
mkdir -p apps/markdown-to-pdf/src/components/ui \
         apps/markdown-to-pdf/src/hooks \
         apps/markdown-to-pdf/src/lib

cp apps/url-encoder/src/components/ui/button.tsx   apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/components/ui/card.tsx     apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/components/ui/select.tsx   apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/components/ui/label.tsx    apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/components/ui/toast.tsx    apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/components/ui/toaster.tsx  apps/markdown-to-pdf/src/components/ui/
cp apps/url-encoder/src/hooks/useToast.ts          apps/markdown-to-pdf/src/hooks/
cp apps/url-encoder/src/index.css                  apps/markdown-to-pdf/src/
```

- [ ] **Step 2: `src/lib/utils.ts` を作成する**

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: `src/main.tsx` を作成する**

```tsx
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: コミットする**

```bash
git add apps/markdown-to-pdf/src/
git commit -m "chore: add entry point and shadcn/ui components for markdown-to-pdf"
```

---

## Task 3: `markdownConverter.ts` — TDD

**Files:**
- Create: `apps/markdown-to-pdf/src/utils/markdownConverter.ts`
- Create: `apps/markdown-to-pdf/src/utils/__tests__/markdownConverter.test.ts`

- [ ] **Step 1: テストファイルを作成する**

`apps/markdown-to-pdf/src/utils/__tests__/markdownConverter.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { convertMarkdownToHtml } from '../markdownConverter';

describe('convertMarkdownToHtml', () => {
  it('空文字を渡すと空文字を返す', () => {
    expect(convertMarkdownToHtml('')).toBe('');
  });

  it('h1 見出しを変換する', () => {
    const result = convertMarkdownToHtml('# Hello');
    expect(result).toContain('<h1>Hello</h1>');
  });

  it('h2 見出しを変換する', () => {
    const result = convertMarkdownToHtml('## World');
    expect(result).toContain('<h2>World</h2>');
  });

  it('箇条書きを変換する', () => {
    const result = convertMarkdownToHtml('- item1\n- item2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>item1</li>');
  });

  it('コードブロックを変換する', () => {
    const result = convertMarkdownToHtml('```js\nconsole.log("hi")\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code>');
  });

  it('インラインコードを変換する', () => {
    const result = convertMarkdownToHtml('use `npm install`');
    expect(result).toContain('<code>npm install</code>');
  });

  it('GFM テーブルを変換する', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const result = convertMarkdownToHtml(md);
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
  });

  it('script タグを除去してXSSを防ぐ', () => {
    const result = convertMarkdownToHtml('<script>alert(1)</script>');
    expect(result).not.toContain('<script>');
  });

  it('onerror 属性を除去する', () => {
    const result = convertMarkdownToHtml('<img onerror="alert(1)" src="x">');
    expect(result).not.toContain('onerror');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd apps/markdown-to-pdf && vp test src/utils/__tests__/markdownConverter.test.ts
```

Expected: FAIL — `Cannot find module '../markdownConverter'`

- [ ] **Step 3: `markdownConverter.ts` を実装する**

`apps/markdown-to-pdf/src/utils/markdownConverter.ts`:

```typescript
import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.use({ gfm: true });

export function convertMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  const raw = marked.parse(markdown) as string;
  return DOMPurify.sanitize(raw);
}

export function convertMarkdownToFragment(markdown: string): DocumentFragment {
  const raw = markdown ? (marked.parse(markdown) as string) : '';
  return DOMPurify.sanitize(raw, { RETURN_DOM_FRAGMENT: true }) as DocumentFragment;
}
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
cd apps/markdown-to-pdf && vp test src/utils/__tests__/markdownConverter.test.ts
```

Expected: PASS (9/9)

- [ ] **Step 5: コミットする**

```bash
cd ../..
git add apps/markdown-to-pdf/src/utils/markdownConverter.ts apps/markdown-to-pdf/src/utils/__tests__/markdownConverter.test.ts
git commit -m "feat(markdown-to-pdf): add markdownConverter with XSS sanitization"
```

---

## Task 4: `printStyles.ts` — TDD

**Files:**
- Create: `apps/markdown-to-pdf/src/utils/printStyles.ts`
- Create: `apps/markdown-to-pdf/src/utils/__tests__/printStyles.test.ts`

- [ ] **Step 1: テストファイルを作成する**

`apps/markdown-to-pdf/src/utils/__tests__/printStyles.test.ts`:

```typescript
import { describe, expect, it } from 'vitest';
import { generatePrintCSS } from '../printStyles';

describe('generatePrintCSS', () => {
  it('A4 サイズを含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('size: A4');
  });

  it('Letter サイズを含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'Letter', fontSize: 16 });
    expect(css).toContain('size: Letter');
  });

  it('フォントサイズ 12px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 12 });
    expect(css).toContain('font-size: 12px');
  });

  it('フォントサイズ 16px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('font-size: 16px');
  });

  it('フォントサイズ 20px を含む CSS を生成する', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 20 });
    expect(css).toContain('font-size: 20px');
  });

  it('@media print ブロックを含む', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('@media print');
  });

  it('#pdf-preview を表示する指定を含む', () => {
    const css = generatePrintCSS({ paperSize: 'A4', fontSize: 16 });
    expect(css).toContain('#pdf-preview');
  });
});
```

- [ ] **Step 2: テストが失敗することを確認する**

```bash
cd apps/markdown-to-pdf && vp test src/utils/__tests__/printStyles.test.ts
```

Expected: FAIL — `Cannot find module '../printStyles'`

- [ ] **Step 3: `printStyles.ts` を実装する**

`apps/markdown-to-pdf/src/utils/printStyles.ts`:

```typescript
export type PaperSize = 'A4' | 'Letter';
export type FontSize = 12 | 16 | 20;

export interface PrintOptions {
  paperSize: PaperSize;
  fontSize: FontSize;
}

export function generatePrintCSS({ paperSize, fontSize }: PrintOptions): string {
  return `@media print {
  body > #root > * { display: none !important; }
  #pdf-preview { display: block !important; }

  @page {
    size: ${paperSize};
    margin: 2cm;
  }

  body {
    font-size: ${fontSize}px;
    font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
    color: #000;
    background: #fff;
  }

  h1 { font-size: 2em; border-bottom: 2px solid #333; padding-bottom: 0.25em; margin-top: 1.5em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.2em; margin-top: 1.2em; }
  h3 { font-size: 1.25em; margin-top: 1em; }
  h4, h5, h6 { margin-top: 0.8em; }

  p { margin: 0.75em 0; line-height: 1.7; }

  pre {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    overflow: visible;
    white-space: pre-wrap;
    word-break: break-all;
  }
  pre, code { font-family: 'Courier New', monospace; font-size: 0.875em; }
  code:not(pre code) { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }

  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th, td { border: 1px solid #ccc; padding: 8px 12px; }
  th { background: #f5f5f5; font-weight: bold; }

  hr { page-break-after: always; border: none; margin: 0; }

  a { color: #000; text-decoration: underline; }
  img { max-width: 100%; height: auto; }

  blockquote {
    border-left: 4px solid #ccc;
    margin: 1em 0;
    padding: 0.5em 1em;
    color: #555;
    background: #fafafa;
  }

  ul, ol { padding-left: 2em; margin: 0.5em 0; }
  li { margin: 0.25em 0; }
}`;
}
```

- [ ] **Step 4: テストが通ることを確認する**

```bash
cd apps/markdown-to-pdf && vp test src/utils/__tests__/printStyles.test.ts
```

Expected: PASS (7/7)

- [ ] **Step 5: コミットする**

```bash
cd ../..
git add apps/markdown-to-pdf/src/utils/printStyles.ts apps/markdown-to-pdf/src/utils/__tests__/printStyles.test.ts
git commit -m "feat(markdown-to-pdf): add printStyles CSS generator"
```

---

## Task 5: `App.tsx` — メインUI

**Files:**
- Create: `apps/markdown-to-pdf/src/App.tsx`

- [ ] **Step 1: `App.tsx` を作成する**

`apps/markdown-to-pdf/src/App.tsx`:

```tsx
import { FileText, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { convertMarkdownToFragment } from '@/utils/markdownConverter';
import { type FontSize, type PaperSize, generatePrintCSS } from '@/utils/printStyles';

const SAMPLE_MARKDOWN = `# マークダウンのサンプル

これは **太字** と *斜体* のテキストです。

## 機能一覧

- リアルタイムプレビュー
- ファイルアップロード対応（.md）
- 用紙サイズ・フォントサイズ設定

## コード例

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

インラインコードは \`const x = 1\` のように書けます。

## テーブル

| 項目 | 説明 |
|------|------|
| A4   | 210 × 297mm |
| Letter | 215.9 × 279.4mm |

> 印刷ダイアログで「送信先: PDFに保存」を選択してください。

---

2ページ目はここから始まります。
`;

export default function App() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [fontSize, setFontSize] = useState<FontSize>(16);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const fragment = convertMarkdownToFragment(markdown);
    el.replaceChildren(fragment);
  }, [markdown]);

  const handleFileRead = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
        toast({ title: '.md または .markdown ファイルのみ対応しています', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setMarkdown((e.target?.result as string) ?? '');
      reader.readAsText(file);
    },
    [toast]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileRead(file);
      e.target.value = '';
    },
    [handleFileRead]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileRead(file);
    },
    [handleFileRead]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleExport = useCallback(() => {
    const css = generatePrintCSS({ paperSize, fontSize });
    let styleEl = document.getElementById('md-print-styles') as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'md-print-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;
    window.print();
  }, [paperSize, fontSize]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">📄 Markdown to PDF</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            マークダウンを入力またはファイルをアップロードして、PDFとして保存できます。
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="paper-size">
              用紙サイズ
            </label>
            <Select value={paperSize} onValueChange={(v) => setPaperSize(v as PaperSize)}>
              <SelectTrigger id="paper-size" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4</SelectItem>
                <SelectItem value="Letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground" htmlFor="font-size">
              フォントサイズ
            </label>
            <Select
              value={String(fontSize)}
              onValueChange={(v) => setFontSize(Number(v) as FontSize)}
            >
              <SelectTrigger id="font-size" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">小 (12px)</SelectItem>
                <SelectItem value="16">中 (16px)</SelectItem>
                <SelectItem value="20">大 (20px)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card
            className={isDragOver ? 'border-primary ring-2 ring-primary' : ''}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">マークダウン</CardTitle>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1 h-3 w-3" />
                ファイルを開く
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown"
                className="hidden"
                onChange={handleFileChange}
              />
            </CardHeader>
            <CardContent>
              <textarea
                aria-label="マークダウン入力"
                className="flex min-h-[520px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder=".md ファイルをドロップするか、マークダウンを入力してください..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={previewRef}
                id="pdf-preview"
                className="prose prose-sm min-h-[520px] max-w-none rounded-md border border-input bg-background px-4 py-3"
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <Button type="button" size="lg" onClick={handleExport}>
            <FileText className="mr-2 h-4 w-4" />
            PDF として保存
          </Button>
          <p className="text-xs text-muted-foreground">
            印刷ダイアログで「送信先: PDF に保存」を選択してください
          </p>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
```

- [ ] **Step 2: 開発サーバーで動作確認する**

```bash
cd apps/markdown-to-pdf && vp dev
```

ブラウザで `http://localhost:5455` を開き、以下を確認する:
1. サンプルマークダウンがプレビューパネルに正しくレンダリングされる
2. テキストエリアを編集するとプレビューがリアルタイムに更新される
3. 「ファイルを開く」で `.md` ファイルを選択するとエディタに反映される
4. `.md` ファイルをエディタ領域にドラッグ＆ドロップできる
5. 「PDF として保存」ボタンで印刷ダイアログが開く
6. 印刷プレビューにはマークダウンのレンダリング結果のみ表示される（エディタ・ボタンは非表示）
7. 用紙サイズ・フォントサイズを変えて再エクスポートすると設定が反映される

- [ ] **Step 3: コミットする**

```bash
cd ../..
git add apps/markdown-to-pdf/src/App.tsx
git commit -m "feat(markdown-to-pdf): implement main UI with editor, preview, and PDF export"
```

---

## Task 6: ルーター登録

**Files:**
- Modify: `packages/router/src/config/apps.ts`

- [ ] **Step 1: `apps.ts` に `markdown-to-pdf` を追加する**

`packages/router/src/config/apps.ts` の `text-markdown-preview` の直後に以下を追加する:

```typescript
{ path: '/markdown-to-pdf', url: 'https://tools-markdown-to-pdf.elchika.app', icon: '📄', displayName: 'Markdown to PDF', description: 'MarkdownをPDFとして保存', category: 'Text' },
```

- [ ] **Step 2: 追加を確認する**

```bash
grep "markdown-to-pdf" packages/router/src/config/apps.ts
```

Expected: 上記行が1行表示される。

- [ ] **Step 3: コミットする**

```bash
git add packages/router/src/config/apps.ts
git commit -m "feat(router): register markdown-to-pdf app"
```

---

## 完了確認

全タスク完了後に以下を確認する:

```bash
# ユニットテスト全通過
cd apps/markdown-to-pdf && vp test

# DS-001〜DS-010 監査
cd ../.. && node scripts/design-audit.js --app=markdown-to-pdf
```

Expected:
- テスト: 16件以上 PASS
- 監査: `✅ 準拠: 1 / 1` (MUST 違反 0件)
