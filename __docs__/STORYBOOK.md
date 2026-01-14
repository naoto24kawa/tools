# Storybook ガイド

このドキュメントでは、Elchika Toolsプロジェクトで使用するStorybookについて説明します。

## 概要

Storybookは、UIコンポーネントを独立した環境で開発・テスト・ドキュメント化するためのツールです。このプロジェクトでは、shadcn/uiベースの共通UIコンポーネントのストーリーを管理しています。

## Storybookの起動

```bash
# 開発モードで起動
bun run storybook

# ブラウザで http://localhost:6006 にアクセス
```

## Storybookのビルド

```bash
# 静的ファイルとしてビルド
bun run build-storybook

# ビルドされたファイルは storybook-static/ に出力されます
```

## ストーリーの構造

### ファイル配置

ストーリーファイルは、対応するコンポーネントと同じディレクトリに配置します。

```
apps/url-encoder/src/components/ui/
├── button.tsx
├── button.stories.tsx  # ← ストーリーファイル
├── card.tsx
├── card.stories.tsx
└── ...
```

### 基本的なストーリーの書き方

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

// メタデータの定義
const meta = {
  title: 'UI/Button',  // Storybookでの表示パス
  component: Button,
  parameters: {
    layout: 'centered',  // レイアウト設定
  },
  tags: ['autodocs'],  // 自動ドキュメント生成
  argTypes: {
    // コントロールの設定
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 個別のストーリー
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};
```

### カスタムレンダリング

複雑なレイアウトやコンポーネントの組み合わせを表示する場合は、`render`関数を使用します。

```tsx
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
```

## Tailwind CSSとの統合

Storybookは、プロジェクトと同じTailwind CSS設定を使用しています。

### 設定ファイル

- `.storybook/tailwind.config.js` - Tailwind設定
- `.storybook/postcss.config.js` - PostCSS設定
- `.storybook/preview.css` - グローバルスタイル（CSS変数を含む）

### CSS変数の使用

既存のアプリケーションと同じCSS変数が利用可能です。

```css
/* .storybook/preview.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

## ストーリーの追加方法

### 1. 新しいコンポーネントのストーリーを作成

```bash
# コンポーネントファイルと同じディレクトリに作成
touch apps/[app-name]/src/components/ui/[component-name].stories.tsx
```

### 2. ストーリーファイルを編集

基本的なテンプレートをコピーして、コンポーネントに合わせて調整します。

### 3. Storybookで確認

Storybookを起動して、新しいストーリーが表示されることを確認します。

```bash
bun run storybook
```

## ベストプラクティス

### 1. すべてのバリアントを網羅する

コンポーネントのすべてのバリアント（variant、size、stateなど）をストーリーとして作成します。

```tsx
export const Default: Story = { /* ... */ };
export const Destructive: Story = { /* ... */ };
export const Outline: Story = { /* ... */ };
// すべてのバリアントを個別のストーリーとして定義
```

### 2. 実用的な例を提供する

実際の使用例を示すストーリーを作成します。

```tsx
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="email@example.com" />
    </div>
  ),
};
```

### 3. インタラクティブなコントロールを活用する

`argTypes`を使用して、Storybookのコントロールパネルでプロパティを変更できるようにします。

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'destructive', 'outline'],
  },
  size: {
    control: 'select',
    options: ['default', 'sm', 'lg'],
  },
}
```

### 4. アクセシビリティをチェックする

`@storybook/addon-a11y`アドオンが有効になっているため、アクセシビリティの問題を自動的に検出できます。

## モノレポでの使用

このプロジェクトはモノレポ構成のため、複数のアプリケーションとパッケージのストーリーを一元管理しています。

### ストーリーの検索パターン

```typescript
// .storybook/main.ts
stories: [
  '../apps/**/src/**/*.stories.@(js|jsx|ts|tsx)',
  '../packages/**/src/**/*.stories.@(js|jsx|ts|tsx)',
],
```

### 他のアプリケーションへの展開

`url-encoder`アプリで作成したストーリーは、他のアプリケーションにも同様のパターンで追加できます。

```bash
# 例: image-crop アプリにストーリーを追加
cp apps/url-encoder/src/components/ui/button.stories.tsx \
   apps/image-crop/src/components/ui/button.stories.tsx
```

## トラブルシューティング

### Storybookが起動しない

1. 依存関係を再インストール
   ```bash
   bun install
   ```

2. キャッシュをクリア
   ```bash
   rm -rf node_modules/.cache
   ```

### スタイルが適用されない

1. Tailwind CSSの設定を確認
   - `.storybook/tailwind.config.js`
   - `.storybook/postcss.config.js`

2. CSS変数が正しく定義されているか確認
   - `.storybook/preview.css`

### ストーリーが表示されない

1. ファイル名が正しいか確認（`*.stories.tsx`）
2. ファイルが正しいディレクトリにあるか確認
3. Storybookを再起動

## 参考リンク

- [Storybook公式ドキュメント](https://storybook.js.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
