# Elchika Tools - 統一デザインシステム仕様書

このドキュメントは、apps/ 配下のすべてのアプリケーションで統一されたデザインパターンを適用するための仕様書です。

## 目次

1. [デザイン原則](#デザイン原則)
2. [技術スタック](#技術スタック)
3. [レイアウトパターン](#レイアウトパターン)
4. [UIコンポーネントガイドライン](#uiコンポーネントガイドライン)
5. [ディレクトリ構造](#ディレクトリ構造)
6. [スタイリング規約](#スタイリング規約)
7. [命名規約](#命名規約)
8. [アクセシビリティ](#アクセシビリティ)

---

## デザイン原則

### 1. 一貫性
- すべてのアプリで同じUIコンポーネントとレイアウトパターンを使用する
- 統一されたカラーパレットとタイポグラフィを適用する

### 2. シンプルさ
- 直感的で分かりやすいUIを提供する
- 不要な装飾を避け、機能に集中する

### 3. レスポンシブ対応
- モバイル、タブレット、デスクトップすべてのデバイスで最適な体験を提供する
- Tailwind CSSのユーティリティクラスを活用する

### 4. パフォーマンス
- 軽量で高速なアプリケーションを維持する
- 不要な再レンダリングを避ける

---

## 技術スタック

### 必須技術

```json
{
  "framework": "React 18.3.1",
  "language": "TypeScript 5.7.2",
  "bundler": "Vite+ (Vite 8 + Rolldown)",
  "runtime": "Node.js >= 18.0.0",
  "styling": "Tailwind CSS 3.4.17",
  "ui-components": "shadcn/ui (Radix UI ベース)",
  "deployment": "Cloudflare Pages"
}
```

### 推奨ライブラリ

- **状態管理**: React Hooks（useState, useReducer, useContext）
- **フォーム**: ネイティブフォームまたはReact Hook Form
- **バリデーション**: Zod
- **アイコン**: Lucide React
- **アニメーション**: tailwindcss-animate

---

## レイアウトパターン

### 1. ページ全体の構造

すべてのアプリは以下の構造を持つ必要があります：

```tsx
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
            {/* 絵文字 */} {/* アプリ名 */}
          </h1>
          {/* 説明文 */}
          <p className="mt-1 text-sm text-muted-foreground">
            {/* アプリの説明 */}
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* コンテンツ */}
      </main>
    </div>
  );
}
```

### 2. ヘッダー仕様

#### 必須要素

1. **ツールトップへのリンク**
   - テキスト: "← Tools トップに戻る"
   - リンク先: "/"
   - スタイル: `text-sm text-primary hover:underline`
   - マージン: `mb-2`

2. **タイトル**
   - フォーマット: `絵文字 + アプリ名`
   - スタイル: `text-3xl font-bold tracking-tight`
   - 例:
     - 🖼️ Image Cropper
     - 🎨 Image Generator

3. **説明文**
   - 1行の簡潔な説明
   - スタイル: `mt-1 text-sm text-muted-foreground`

#### ヘッダーのコンテナスタイル

```tsx
<header className="border-b bg-card shadow-sm">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    {/* 内容 */}
  </div>
</header>
```

### 3. メインコンテンツレイアウト

#### 標準コンテナ

```tsx
<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  {/* コンテンツ */}
</main>
```

#### 2カラムレイアウト（推奨）

設定パネルとプレビュー/実行パネルを分離する場合：

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
  {/* 左カラム: 設定パネル */}
  <Card className="p-6">
    {/* 設定内容 */}
  </Card>

  {/* 右カラム: プレビュー/実行パネル */}
  <Card className="p-6">
    {/* プレビュー/実行内容 */}
  </Card>
</div>
```

**カラム幅のバリエーション:**

- 設定が少ない場合: `lg:grid-cols-[400px_1fr]`
- 設定が多い場合: `lg:grid-cols-[1fr_400px]`（右側に設定）
- バランス型: `lg:grid-cols-2`

---

## UIコンポーネントガイドライン

### 1. shadcn/ui コンポーネント

すべてのアプリは shadcn/ui をベースとしたUIコンポーネントを使用します。

#### 必須コンポーネント

以下のコンポーネントは各アプリの `src/components/ui/` に配置する必要があります：

- **button.tsx** - ボタンコンポーネント
- **card.tsx** - カードコンポーネント
- **input.tsx** - テキスト入力コンポーネント
- **label.tsx** - ラベルコンポーネント
- **select.tsx** - セレクトボックスコンポーネント

#### 任意コンポーネント

必要に応じて追加：

- **toast.tsx** / **toaster.tsx** - トースト通知
- **dialog.tsx** - モーダルダイアログ
- **tabs.tsx** - タブコンポーネント
- **slider.tsx** - スライダー
- **switch.tsx** - スイッチ
- その他、Radix UIベースのコンポーネント

### 2. カードコンポーネントの使用

#### 基本的な使い方

```tsx
import { Card } from '@components/ui/card';

<Card className="p-6">
  {/* コンテンツ */}
</Card>
```

#### カードの種類

1. **設定カード**
   - 高さ: `h-fit`
   - スクロール: 必要に応じて `max-h-[calc(100vh-12rem)] overflow-y-auto`

2. **プレビューカード**
   - パディング: `p-6`
   - 伸縮: `flex-1`

### 3. ボタンコンポーネント

#### バリアント

```tsx
<Button variant="default">デフォルト</Button>
<Button variant="outline">アウトライン</Button>
<Button variant="destructive">削除</Button>
<Button variant="secondary">セカンダリ</Button>
<Button variant="ghost">ゴースト</Button>
<Button variant="link">リンク</Button>
```

#### サイズ

```tsx
<Button size="default">デフォルト</Button>
<Button size="sm">小</Button>
<Button size="lg">大</Button>
<Button size="icon">アイコン</Button>
```

### 4. 入力コンポーネント

#### テキスト入力

```tsx
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

<div className="space-y-2">
  <Label htmlFor="width">幅 (px)</Label>
  <Input
    id="width"
    type="number"
    value={width}
    onChange={(e) => setWidth(Number(e.target.value))}
  />
</div>
```

#### セレクトボックス

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

<Select value={format} onValueChange={setFormat}>
  <SelectTrigger>
    <SelectValue placeholder="フォーマットを選択" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="png">PNG</SelectItem>
    <SelectItem value="jpeg">JPEG</SelectItem>
  </SelectContent>
</Select>
```

---

## ディレクトリ構造

### 標準ディレクトリ構造

```
apps/[app-name]/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── ui/             # shadcn/uiベースコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── select.tsx
│   │   ├── FeatureA.tsx    # 機能別コンポーネント
│   │   └── FeatureB.tsx
│   ├── hooks/              # カスタムフック
│   │   └── useFeature.ts
│   ├── utils/              # ユーティリティ関数
│   │   └── helpers.ts
│   ├── services/           # ビジネスロジック・API呼び出し
│   │   └── api.ts
│   ├── config/             # 設定・定数
│   │   └── constants.ts
│   ├── types/              # 型定義
│   │   └── index.ts
│   ├── lib/                # 外部ライブラリのラッパー
│   │   └── utils.ts
│   ├── App.tsx             # メインコンポーネント
│   ├── main.tsx            # エントリーポイント
│   ├── index.css           # グローバルスタイル
│   └── vite-env.d.ts       # Vite型定義
├── public/                 # 静的ファイル
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── .prettierrc.json
└── README.md
```

### ディレクトリの役割

#### 必須ディレクトリ

1. **src/components/** - すべてのReactコンポーネント
   - **src/components/ui/** - 再利用可能なUIコンポーネント（shadcn/ui）

2. **src/** - ルートレベルファイル
   - **App.tsx** - メインアプリケーションコンポーネント
   - **main.tsx** - エントリーポイント
   - **index.css** - グローバルスタイル

#### 推奨ディレクトリ

3. **src/hooks/** - カスタムフック
4. **src/utils/** - 純粋関数・ヘルパー
5. **src/config/** - 定数・設定値
6. **src/types/** - TypeScript型定義

#### 任意ディレクトリ

7. **src/services/** - API呼び出し・ビジネスロジック
8. **src/lib/** - 外部ライブラリのラッパー
9. **src/contexts/** - React Context

---

## スタイリング規約

### 1. Tailwind CSS

#### 基本原則

- ユーティリティファーストのアプローチを採用
- カスタムCSSは最小限に抑える
- CSS変数を使ったテーマシステムを活用

#### CSS変数ベースのテーマ

`src/index.css` でテーマ変数を定義：

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
    /* ... その他のダークモード変数 */
  }
}
```

#### Tailwind設定

`tailwind.config.js`:

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

### 2. レスポンシブデザイン

#### ブレークポイント

Tailwindのデフォルトブレークポイントを使用：

```
sm: 640px   // モバイル（横向き）・小型タブレット
md: 768px   // タブレット
lg: 1024px  // デスクトップ
xl: 1280px  // 大型デスクトップ
2xl: 1536px // 超大型ディスプレイ
```

#### モバイルファーストアプローチ

```tsx
{/* モバイル: 1カラム、デスクトップ: 2カラム */}
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* ... */}
</div>

{/* モバイル: 小パディング、デスクトップ: 大パディング */}
<div className="px-4 py-6 sm:px-6 lg:px-8">
  {/* ... */}
</div>
```

### 3. スペーシング

#### 一貫したスペーシングの使用

- **gap-6**: グリッドアイテム間
- **space-y-6**: 垂直方向の子要素間
- **space-x-4**: 水平方向の子要素間
- **p-6**: カード内パディング
- **py-6**: 垂直パディング（ヘッダー・フッターなど）

---

## 命名規約

### 1. ファイル命名

#### コンポーネントファイル

- **PascalCase** を使用
- 拡張子: `.tsx`
- 例: `ImageUpload.tsx`, `ExportPanel.tsx`

#### フックファイル

- **camelCase** で `use` から始める
- 拡張子: `.ts` または `.tsx`
- 例: `useCropState.ts`, `useImageSettings.ts`

#### ユーティリティファイル

- **camelCase** を使用
- 拡張子: `.ts`
- 例: `formatters.ts`, `validators.ts`

#### 型定義ファイル

- **index.ts** または機能名
- 例: `types/index.ts`, `types/image.ts`

#### 設定ファイル

- **camelCase** または **kebab-case**
- 例: `constants.ts`, `aspect-ratios.ts`

### 2. コンポーネント命名

#### 機能ベース命名

```tsx
// ❌ 悪い例
<Panel />
<Input1 />
<Thing />

// ✅ 良い例
<ExportPanel />
<SizeInput />
<ImageUpload />
```

#### UI コンポーネント

shadcn/ui コンポーネントは元の名前を保持：

```tsx
<Button />
<Card />
<Input />
<Label />
<Select />
```

### 3. 変数・関数命名

#### 変数

- **camelCase** を使用
- boolean値は `is`, `has`, `should` などのプレフィックスを付ける

```tsx
const imageUrl = '...';
const isLoading = false;
const hasError = true;
const shouldShowPreview = false;
```

#### 関数

- **camelCase** を使用
- イベントハンドラーは `handle` プレフィックス
- コールバック関数は `on` プレフィックス

```tsx
// イベントハンドラー
const handleImageLoad = (image: File) => { /* ... */ };
const handleExport = () => { /* ... */ };

// コールバック関数
onImageLoad={(image) => { /* ... */ }}
onExportSettingsChange={(settings) => { /* ... */ }}

// ユーティリティ関数
const calculateAspectRatio = (width: number, height: number) => { /* ... */ };
const formatFileSize = (bytes: number) => { /* ... */ };
```

#### カスタムフック

- **camelCase** で `use` から始める

```tsx
const useCropState = () => { /* ... */ };
const useImageSettings = () => { /* ... */ };
const useDebounce = () => { /* ... */ };
```

### 4. 定数命名

#### グローバル定数

- **UPPER_SNAKE_CASE** を使用

```tsx
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/webp'];
export const DEFAULT_QUALITY = 0.92;
```

#### 設定オブジェクト

- **UPPER_SNAKE_CASE** または **PascalCase**

```tsx
export const ASPECT_RATIOS = [
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
] as const;

export const SizePresets = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
} as const;
```

---

## Path Alias 設定

### TypeScript設定

すべてのアプリで以下のpath aliasを設定する必要があります：

#### tsconfig.json

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@services/*": ["./src/services/*"],
      "@config/*": ["./src/config/*"],
      "@types": ["./src/types"],
      "@lib/*": ["./src/lib/*"]
    }
  }
}
```

#### vite.config.ts

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

### 使用例

```tsx
// ❌ 悪い例（相対パス）
import { Button } from '../../components/ui/button';
import { useCropState } from '../../hooks/useCropState';

// ✅ 良い例（path alias）
import { Button } from '@components/ui/button';
import { useCropState } from '@hooks/useCropState';
```

---

## アクセシビリティ

### 1. セマンティックHTML

適切なHTML要素を使用する：

```tsx
// ✅ 良い例
<header>...</header>
<main>...</main>
<nav>...</nav>
<button>...</button>

// ❌ 悪い例
<div onClick={...}>...</div> {/* ボタンの代わりにdiv */}
```

### 2. ARIA属性

必要に応じてARIA属性を追加：

```tsx
<button aria-label="画像をアップロード">
  <UploadIcon />
</button>

<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### 3. キーボード操作

すべてのインタラクティブ要素はキーボードで操作可能にする：

```tsx
<div
  tabIndex={0}
  role="button"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  クリック可能な要素
</div>
```

### 4. フォームラベル

すべての入力要素にラベルを付ける：

```tsx
<Label htmlFor="width">幅 (px)</Label>
<Input id="width" type="number" />
```

### 5. コントラスト

適切なカラーコントラスト比を維持：

- 通常テキスト: 最低 4.5:1
- 大きなテキスト: 最低 3:1

---

## TypeScript設定

### 1. 厳格モード

すべてのアプリで厳格なTypeScript設定を使用：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. 型定義

#### Props型定義

```tsx
interface ImageUploadProps {
  onImageLoad: (image: File) => void;
  accept?: string[];
  maxSize?: number;
}

export function ImageUpload({
  onImageLoad,
  accept = ['image/*'],
  maxSize = 10 * 1024 * 1024
}: ImageUploadProps) {
  // ...
}
```

#### State型定義

```tsx
interface ImageState {
  status: 'idle' | 'loading' | 'loaded' | 'error';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  error?: string;
}

const [image, setImage] = useState<ImageState>({
  status: 'idle',
  src: '',
  naturalWidth: 0,
  naturalHeight: 0,
});
```

---

## まとめ

このデザインシステムに従うことで、すべてのアプリケーションが：

1. **一貫した見た目と操作感**を持つ
2. **保守しやすく拡張しやすい**コードベースになる
3. **高品質でアクセシブル**なユーザー体験を提供する
4. **チーム開発が円滑**に進む

新しいアプリを作成する際は、このドキュメントを参照し、既存のアプリ（image-crop、image-generate）をテンプレートとして使用してください。
