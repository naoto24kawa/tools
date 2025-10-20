# Image Generate

カスタマイズ可能な画像を生成・エクスポートできるWebアプリケーションです。モバイル、タブレット、デスクトップ、SNS用の画像を簡単に作成できます。

## 特徴

- **柔軟なサイズ設定**: ピクセル単位で自由にサイズ指定、またはデバイス・SNS向けのプリセットから選択
- **アスペクト比固定**: 16:9、4:3、1:1などの一般的な比率、またはフリーサイズ
- **背景カスタマイズ**:
  - 豊富なカラープリセット（基本色、グレースケール、プライマリカラー）
  - パターンオプション（チェッカーボード、グリッド）
- **テキスト配置**:
  - 任意のテキストを画像上に配置
  - フォントサイズ、色、水平・垂直配置のカスタマイズ
- **エクスポート**: PNG/JPEG形式でダウンロード（JPEG品質調整可能）
- **リアルタイムプレビュー**: 設定変更が即座に反映

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **パッケージマネージャー**: Bun
- **コード品質**: ESLint + Prettier
- **型安全性**: 厳格なTypeScript設定（strict mode + 高度なオプション）

## 必須要件

- [Bun](https://bun.sh/) v1.0.0 以上

## セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# ブラウザで http://localhost:5173 を開く
```

## 使用方法

### 1. サイズ設定

- **カスタムサイズ**: 幅・高さをピクセル単位で入力
- **プリセット選択**:
  - モバイル（iPhone 14 Pro、Pixel 7など）
  - タブレット（iPad Pro、Surface Proなど）
  - デスクトップ（Full HD、4Kなど）
  - SNS（Twitter投稿、Instagram投稿など）

### 2. アスペクト比

以下から選択可能：
- 16:9（動画・プレゼンテーション）
- 4:3（クラシック）
- 1:1（SNS正方形）
- 3:2（写真）
- Free（自由設定）

アスペクト比を固定すると、幅または高さを変更した際に自動的にもう一方が調整されます。

### 3. 背景設定

- **カラーピッカー**: 自由に色を選択
- **プリセット**: よく使う色をカテゴリ別に選択
- **パターン**:
  - なし
  - チェッカーボード（透過確認用）
  - グリッド（ガイドライン表示）

### 4. テキスト設定

- テキスト内容（改行対応）
- フォントサイズ（1-500px）
- テキスト色
- 水平配置（左・中央・右）
- 垂直配置（上・中央・下）

### 5. エクスポート

- ファイル名の指定
- フォーマット選択（PNG/JPEG）
- JPEG品質調整（1-100%）
- ダウンロードボタンでエクスポート

## プロジェクト構造

```
apps/image-generate/
├── src/
│   ├── components/          # React コンポーネント
│   │   ├── AspectRatioSelector.tsx
│   │   ├── BackgroundSettings.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── ExportPanel.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── PresetSelector.tsx
│   │   ├── SizeInput.tsx
│   │   └── TextInput.tsx
│   ├── config/              # 設定・定数
│   │   ├── aspectRatios.ts  # アスペクト比プリセット
│   │   ├── canvas.ts        # Canvas描画定数
│   │   ├── categoryLabels.ts # カテゴリラベルマッピング
│   │   ├── colorPresets.ts  # カラープリセット
│   │   └── sizePresets.ts   # サイズプリセット
│   ├── types/               # TypeScript 型定義
│   │   └── index.ts
│   ├── utils/               # ユーティリティ関数
│   │   ├── canvasGenerator.ts    # Canvas描画・エクスポート
│   │   └── inputValidation.ts    # 入力検証
│   ├── index.css            # グローバルスタイル
│   ├── main.tsx             # エントリーポイント
│   └── vite-env.d.ts        # Vite型定義
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── wrangler.toml            # Cloudflare Pages設定
```

## 開発

### コマンド

```bash
# 開発サーバー起動
bun run dev

# 型チェック
bun run type-check

# リント
bun run lint
bun run lint:fix

# フォーマット
bun run format
bun run format:check

# ビルド
bun run build

# プレビュー（ビルド後）
bun run preview
```

### Path Alias

プロジェクトでは以下のpath aliasが設定されています：

```typescript
import { ImageGenerator } from '@components/ImageGenerator';
import { generateCanvas } from '@utils/canvasGenerator';
import type { ImageGeneratorSettings } from '@types';
import { CANVAS_CONSTANTS } from '@config/canvas';
```

### TypeScript設定

厳格な型チェックを有効化しています：

- `strict: true`: 全ての厳格チェック有効
- `noUncheckedIndexedAccess: true`: インデックスアクセスの安全性
- `exactOptionalPropertyTypes: true`: オプションプロパティの厳密チェック
- `noImplicitReturns: true`: 暗黙的なreturnの禁止
- `noUnusedLocals: true`: 未使用変数の検出
- `noUnusedParameters: true`: 未使用パラメータの検出

## ビルド・デプロイ

### ローカルビルド

```bash
bun run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### Cloudflare Pages へのデプロイ

このプロジェクトはCloudflare Pages対応です。

```bash
# Wrangler CLIでデプロイ
bunx wrangler pages deploy dist
```

`wrangler.toml` にPages設定が含まれています。

## カスタマイズ

### プリセットの追加

#### サイズプリセット

`src/config/sizePresets.ts` を編集：

```typescript
export const SIZE_PRESETS: readonly SizePreset[] = [
  {
    label: 'カスタムデバイス (800x600)',
    width: 800,
    height: 600,
    category: 'custom',
  },
  // ... 他のプリセット
] as const;
```

#### カラープリセット

`src/config/colorPresets.ts` を編集：

```typescript
export const COLOR_PRESETS: readonly ColorPreset[] = [
  {
    label: 'ブランドカラー',
    value: '#FF6B35',
    category: 'primary',
  },
  // ... 他のプリセット
] as const;
```

### アスペクト比の追加

`src/config/aspectRatios.ts` を編集：

```typescript
export const ASPECT_RATIOS: readonly AspectRatioOption[] = [
  {
    label: '21:9',
    value: 21 / 9,
  },
  // ... 他のアスペクト比
] as const;
```

## 設定値の制約

### サイズ
- 幅・高さ: 1 〜 10,000 ピクセル

### テキスト
- フォントサイズ: 1 〜 500 ピクセル

### エクスポート
- JPEG品質: 1 〜 100%

詳細な型定義とドキュメントは `src/types/index.ts` を参照してください。

## ライセンス

MIT
