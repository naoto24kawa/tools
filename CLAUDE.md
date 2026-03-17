# Elchika Tools

ブラウザ上で完結するクライアントサイドツール集。178個のツールを `apps/` 配下に個別SPAとしてホスト。

## アーキテクチャ

```
elchika-tools/
  apps/           # 各ツール(独立SPA) - 178個
  packages/
    router/       # Cloudflare Workers ルーター
  __docs__/       # デザインシステム・テンプレートガイド
  scripts/        # 管理スクリプト(create-app, delete-app, generate-docs)
  e2e/            # Playwright E2Eテスト
  .storybook/     # Storybook設定
```

### 各アプリの構成

```
apps/<tool-name>/
  src/
    App.tsx            # メインコンポーネント(ロジック+UI)
    main.tsx           # エントリポイント
    components/ui/     # shadcn/ui コンポーネント
    utils/             # コアロジック(純粋関数)
      __tests__/       # ユニットテスト
    hooks/             # カスタムフック(あれば)
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  postcss.config.js
  wrangler.toml        # Cloudflare Pages デプロイ設定
```

## 技術スタック

- **UI**: React 18 + TypeScript (strict)
- **ビルド**: Vite 6
- **スタイリング**: Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- **ランタイム**: Bun
- **Linter/Formatter**: Biome (indent: 2 spaces, single quotes, semicolons)
- **テスト**: bun test (ユニット) + Playwright (E2E)
- **ホスティング**: Cloudflare Pages (各アプリ個別デプロイ)
- **モノレポ**: Bun workspaces (`apps/*`, `packages/*`)

## コマンド

```bash
# 依存関係
bun install

# 開発 (各アプリごと)
cd apps/<tool-name> && bun run dev

# テスト
bun test                    # ユニットテスト
bun run test:e2e            # E2Eテスト

# lint
bun run lint                # Biome check
bun run lint:fix            # Biome auto-fix

# ビルド・デプロイ
cd apps/<tool-name> && bun run build
cd apps/<tool-name> && bun run deploy

# Storybook
bun run storybook

# アプリ管理
node scripts/create-app.js       # 新規アプリ作成
node scripts/delete-app.js       # アプリ削除
bun run scripts/generate-docs.ts # ドキュメント一括生成
```

## コーディング規約

- パスエイリアス: `@/` → `src/`, `@components/`, `@utils/`, `@types/`, `@config/`, `@hooks/`, `@services/`
- ボタン要素には必ず `type="button"` を付与
- 非同期クリップボード操作は try/catch で囲む
- UI コンポーネントは shadcn/ui を使用(Radix UI ベース)
- コアロジックは `src/utils/` に純粋関数として分離
- テストは `src/utils/__tests__/` に配置
- Biome: `indentStyle: "space"`, `indentWidth: 2`, `quoteStyle: "single"`, `lineWidth: 100`

## 新規アプリ作成

1. `node scripts/create-app.js` または既存アプリをコピー
2. `package.json` の name, wrangler name を更新
3. `vite.config.ts` の port を一意に設定
4. `index.html` の title, description を更新
5. `src/utils/` にコアロジック、`src/App.tsx` にUI実装
6. テスト追加: `src/utils/__tests__/`

参考: `__docs__/APP_TEMPLATE_GUIDE.md`, `__docs__/DESIGN_SYSTEM.md`

## デプロイ

各アプリは Cloudflare Pages に個別プロジェクトとしてデプロイ。
`packages/router` が `tools.elchika.app/<tool-name>` へのルーティングを担当。

## Gotchas

- ほぼ全アプリが完全クライアントサイド (例外: image-ocr は tesseract.js がCDNから言語データをダウンロード)
- `url-encoder` が最初期のテンプレート。多くのアプリがこれをベースにコピーされている
- 一部アプリの `index.html` に元テンプレートの title/description が残っている場合がある
- `packages/router` は Cloudflare Workers で動作し、各アプリへのプロキシルーティングを行う
