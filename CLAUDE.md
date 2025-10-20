# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Elchika Toolsは、Webブラウザで完結する便利なツール集のモノレポプロジェクトです。すべてのツールはクライアントサイドで動作し、データがサーバーに送信されることはありません。

- **技術スタック**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **ホスティング**: Cloudflare Pages (各アプリ) + Cloudflare Workers (ルーター)
- **パッケージマネージャー**: Bun
- **モノレポ構成**: apps/* (各ツールアプリ) + packages/router (Cloudflare Workersルーター)

## コマンド

### 開発サーバー
```bash
# 個別アプリの起動
bun run dev:image-crop      # Image Crop ツール
bun run dev:image-generate  # Image Generate ツール
bun run dev:router          # Cloudflare Workers ルーター

# 全アプリ同時起動は不可 - 個別に起動すること
```

### ビルド・デプロイ
```bash
# ビルド
bun run build              # 全アプリ + ルーターをビルド
bun run build:apps         # アプリのみビルド
bun run build:router       # ルーターのみビルド

# デプロイ
bun run deploy             # ビルド + 全デプロイ
bun run deploy:apps        # アプリのみデプロイ
bun run deploy:router      # ルーターのみデプロイ
```

### 品質チェック
```bash
# 型チェック
bun run type-check         # 全プロジェクトの型チェック
bun run type-check:apps    # アプリのみ
bun run type-check:router  # ルーターのみ

# Lint
bun run lint               # ESLint実行
bun run lint:fix           # ESLint自動修正

# フォーマット
bun run format             # Prettier実行
bun run format:check       # Prettierチェックのみ

# テスト
bun test                   # 全テスト実行
cd apps/image-crop && bun test --watch  # 特定アプリのwatch mode
```

### アプリ管理
```bash
# 新規アプリ作成
bun run create-app

# アプリ削除
bun run delete-app
```

## アーキテクチャ

### モノレポ構造

```
apps/
  image-crop/        # 画像トリミングツール
  image-generate/    # 画像生成ツール
packages/
  router/            # Cloudflare Workers ルーター (Hono)
```

### ルーティングアーキテクチャ

- **packages/router**: Honoベースのルーター。各アプリへのプロキシとツール一覧ページを提供
- ルートパス (`/`): ツール一覧ページ
- アプリパス (`/image-crop/*`, `/image-generate/*`): 各Cloudflare Pagesアプリへプロキシ
- 設定ファイル: `packages/router/src/config/apps.ts` - アプリ追加時に更新必須

### 各アプリの構造

すべてのアプリは統一されたデザインシステムに準拠:

```
src/
  components/
    ui/               # shadcn/uiコンポーネント
    *.tsx             # 機能別コンポーネント
  hooks/              # カスタムフック
  services/           # ビジネスロジック (エクスポート、通知など)
  utils/              # ユーティリティ関数
  config/             # 定数定義
  types/              # 型定義
```

**重要な設計原則**:
- **完全クライアントサイド**: すべての処理はブラウザ内で完結
- **型安全性**: TypeScript strict mode有効
- **Path Alias**: `@components`, `@hooks`, `@utils`, `@config`, `@services`, `@types`を使用
- **レイアウトパターン**: ヘッダー + 2カラムレイアウト (メイン + 設定パネル)

## 重要なファイル

### ドキュメント (`__docs__/`)
新規アプリ作成や既存アプリ修正時は、必ず以下を参照:

- `DESIGN_SYSTEM.md`: デザイン原則、UIパターン、命名規約
- `APP_TEMPLATE_GUIDE.md`: 新規アプリ作成手順とチェックリスト
- `COMPONENT_PATTERNS.md`: 再利用可能なコンポーネントパターン

### 設定ファイル
- `tsconfig.base.json`: 全プロジェクト共通のTypeScript設定
- `apps/*/tsconfig.json`: 各アプリの設定 (base継承 + Path Alias)
- `packages/router/src/config/apps.ts`: ルーター設定 (新規アプリ追加時に更新)

## 開発ワークフロー

### 新規アプリ作成
1. `bun run create-app` でテンプレート生成
2. `__docs__/APP_TEMPLATE_GUIDE.md` のチェックリストに従う
3. 必要なshadcn/uiコンポーネントを追加: `bunx shadcn@latest add [component]`
4. `packages/router/src/config/apps.ts` に設定追加

### 既存アプリ修正
1. `__docs__/DESIGN_SYSTEM.md` で規約確認
2. 修正実施 (必ずPath Aliasを使用)
3. `bun run type-check` で型チェック
4. `bun run lint:fix` でLint
5. `bun run format` でフォーマット

### デプロイ前チェックリスト
- [ ] 型エラーなし (`bun run type-check`)
- [ ] Lintエラーなし (`bun run lint`)
- [ ] テスト成功 (`bun test`)
- [ ] 開発サーバーで動作確認
- [ ] レスポンシブデザイン確認

## 注意事項

### Path Alias
すべてのインポートでPath Aliasを使用すること:
```typescript
// Good
import { Button } from '@components/ui/button';
import { useCropState } from '@hooks/useCropState';

// Bad
import { Button } from '../../components/ui/button';
```

### shadcn/ui追加
各アプリディレクトリで個別に追加:
```bash
cd apps/[app-name]
bunx shadcn@latest add button
```

### Cloudflare Workers/Pagesデプロイ
- 各アプリは独立したCloudflare Pagesプロジェクト
- ルーターはCloudflare Workersにデプロイ
- wrangler.tomlは各アプリとルーターに存在

### テスト
- 各アプリで個別にテスト実行
- utilsディレクトリの関数は必ずテストを書く
- Bunのテストランナーを使用

## よくある問題

### 型エラー
- Path Aliasがtsconfig.jsonに定義されているか確認
- `bun run type-check`で全体チェック

### shadcn/uiコンポーネントが見つからない
- 正しいアプリディレクトリで`bunx shadcn@latest add [component]`を実行
- `components.json`が各アプリに存在することを確認

### ルーターに新規アプリが表示されない
- `packages/router/src/config/apps.ts`のAPPS_CONFIGに追加
- ルーターを再起動
