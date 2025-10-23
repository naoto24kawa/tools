---
name: app-template
description: Elchika Toolsで新規アプリケーションを作成する手順とテンプレートを提供します。新規アプリ作成、アプリセットアップ、shadcn/ui追加、依存関係インストール、ディレクトリ構造整備、テンプレートファイル（App.tsx、index.css、tsconfig.json、vite.config.ts、tailwind.config.js）、実装チェックリスト、トラブルシューティングに関する質問や実装時に使用してください。統一されたデザインシステムに準拠した新しいアプリを効率的に作成するために参照します。
---

# 新規アプリケーション作成ガイド

このガイドでは、統一されたデザインシステムに従って新しいアプリケーションを作成する手順を説明します。

## 目次

1. [前提条件](#前提条件)
2. [アプリの作成手順](#アプリの作成手順)
3. [テンプレート構造](#テンプレート構造)
4. [実装チェックリスト](#実装チェックリスト)

---

## 前提条件

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) を読んで理解している
- Bun >= 1.0.0 がインストールされている
- プロジェクトルートで `bun install` を実行済み

---

## アプリの作成手順

### 1. アプリディレクトリの作成

```bash
# プロジェクトルートで実行
npm run create-app <app-name>

# 例:
npm run create-app image-resize
```

これにより、以下の構造が自動生成されます：

```
apps/image-resize/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

### 2. 依存関係のインストール

```bash
cd apps/image-resize
bun install
```

### 3. shadcn/ui コンポーネントの追加

必須コンポーネントを追加：

```bash
# button
bunx shadcn@latest add button

# card
bunx shadcn@latest add card

# input
bunx shadcn@latest add input

# label
bunx shadcn@latest add label

# select
bunx shadcn@latest add select
```

任意で必要なコンポーネントを追加：

```bash
# toast（通知）
bunx shadcn@latest add toast

# dialog（モーダル）
bunx shadcn@latest add dialog

# その他
bunx shadcn@latest add <component-name>
```

### 4. ディレクトリ構造の整備

必要に応じてディレクトリを作成：

```bash
mkdir -p src/{hooks,utils,services,config,types}
```

---

## テンプレート構造

### 1. App.tsx（基本テンプレート）

```tsx
import { Card } from '@components/ui/card';

export function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* ツールトップへのリンク */}
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          {/* タイトル */}
          <h1 className="text-3xl font-bold tracking-tight">
            {/* 絵文字 */} アプリ名
          </h1>
          {/* 説明文 */}
          <p className="mt-1 text-sm text-muted-foreground">
            アプリの説明をここに記述
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          {/* 左カラム: 設定パネル */}
          <Card className="p-6">
            <div className="space-y-6">
              {/* 設定フォームをここに配置 */}
            </div>
          </Card>

          {/* 右カラム: プレビュー/実行パネル */}
          <Card className="p-6">
            {/* プレビューや結果をここに表示 */}
          </Card>
        </div>
      </main>
    </div>
  );
}
```

### 2. index.css（基本テンプレート）

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 3. tsconfig.json（基本テンプレート）

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@services/*": ["./src/services/*"],
      "@config/*": ["./src/config/*"],
      "@types": ["./src/types"],
      "@lib/*": ["./src/lib/*"]
    },

    /* Linting */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### 4. vite.config.ts（基本テンプレート）

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@services': path.resolve(__dirname, './src/services'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

### 5. tailwind.config.js（基本テンプレート）

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 6. README.md（基本テンプレート）

```markdown
# アプリ名

アプリの簡単な説明

## 特徴

- 特徴1
- 特徴2
- 特徴3

## 技術スタック

- **ランタイム**: Bun
- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **デプロイ**: Cloudflare Pages

## セットアップ

\```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview
\```

## 使い方

1. 手順1
2. 手順2
3. 手順3

## ライセンス

MIT
```

---

## 実装チェックリスト

新しいアプリを作成する際は、以下のチェックリストを使用してください：

### 基本セットアップ

- [ ] アプリディレクトリを作成
- [ ] 依存関係をインストール
- [ ] shadcn/ui コンポーネントを追加

### デザインシステム準拠

#### ヘッダー

- [ ] ツールトップへのリンクを追加
- [ ] タイトルに絵文字を含める
- [ ] 説明文を追加
- [ ] 正しいスタイルを適用

#### レイアウト

- [ ] `min-h-screen bg-background` を使用
- [ ] ヘッダーに `border-b bg-card shadow-sm` を適用
- [ ] メインコンテンツに `mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8` を適用
- [ ] 2カラムレイアウトを実装（必要な場合）

#### UIコンポーネント

- [ ] shadcn/ui コンポーネントを使用
- [ ] カスタムCSSを最小限に抑える
- [ ] Tailwind CSSユーティリティクラスを活用

### ディレクトリ構造

- [ ] `src/components/` を作成
- [ ] `src/components/ui/` を作成
- [ ] 必要に応じて `src/hooks/` を作成
- [ ] 必要に応じて `src/utils/` を作成
- [ ] 必要に応じて `src/config/` を作成
- [ ] 必要に応じて `src/types/` を作成

### Path Alias

- [ ] `tsconfig.json` にpath aliasを設定
- [ ] `vite.config.ts` にaliasを設定
- [ ] すべてのインポートでpath aliasを使用

### TypeScript

- [ ] 厳格モードを有効化
- [ ] すべてのPropsに型を定義
- [ ] すべてのStateに型を定義
- [ ] 型エラーがゼロ

### スタイリング

- [ ] `index.css` にCSS変数を定義
- [ ] `tailwind.config.js` を設定
- [ ] ダークモード対応（必要な場合）
- [ ] レスポンシブデザインを実装

### アクセシビリティ

- [ ] セマンティックHTMLを使用
- [ ] すべてのフォーム要素にラベルを追加
- [ ] ARIA属性を適切に使用
- [ ] キーボード操作に対応

### ドキュメント

- [ ] README.mdを作成
- [ ] 使い方を記載
- [ ] セットアップ手順を記載

### テスト

- [ ] 開発サーバーで動作確認
- [ ] ビルドが成功することを確認
- [ ] レスポンシブデザインを確認
- [ ] 型チェックを実行
- [ ] Lintを実行

---

## 参考実装

既存のアプリケーションを参考にしてください：

### Image Crop
- **パス**: `apps/image-crop/`
- **特徴**: 画像アップロード、トリミング、エクスポート
- **参考ポイント**: カスタムフックの使用、複雑な状態管理

### Image Generate
- **パス**: `apps/image-generate/`
- **特徴**: 設定ベースの画像生成、プレビュー機能
- **参考ポイント**: 多数の設定項目、リアルタイムプレビュー

---

## トラブルシューティング

### shadcn/ui コンポーネントが追加できない

```bash
# components.jsonが存在するか確認
ls components.json

# 存在しない場合は初期化
bunx shadcn@latest init
```

### Path Aliasが機能しない

1. `tsconfig.json` のpathsを確認
2. `vite.config.ts` のaliasを確認
3. 開発サーバーを再起動

### CSS変数が適用されない

1. `index.css` が正しくインポートされているか確認
2. Tailwind CSSの設定を確認
3. ブラウザのキャッシュをクリア

---

## まとめ

このガイドに従うことで、統一されたデザインシステムに準拠した新しいアプリケーションを効率的に作成できます。

不明な点があれば、既存のアプリ（image-crop、image-generate）のコードを参照するか、[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) を確認してください。
