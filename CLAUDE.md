# Elchika Tools

ブラウザ上で完結するクライアントサイドツール集。333個のツールを `apps/` 配下に個別SPAとして管理。

## アーキテクチャ

```
elchika-tools/
  apps/                  # 各ツール(独立SPA) - 333個
  packages/
    router/              # Cloudflare Workers ルーター + Static Assets
      src/               # ルーティングロジック(Hono)
        config/apps.ts   # 全アプリのルーティング定義
      public/            # ビルド済み静的ファイル(build-all.sh が生成)
  scripts/               # 管理スクリプト(create-app, delete-app, build-all, generate-docs)
  .docs/                 # デザインシステム・テンプレートガイド
  e2e/                   # Playwright E2Eテスト
  .storybook/            # Storybook設定
```

### デプロイアーキテクチャ

```
User → tools.elchika.app/<app>/
  → Cloudflare Workers (packages/router)
    → Static Assets (packages/router/public/<app>/)
```

- 全アプリを1つの Workers プロジェクトに統合
- `scripts/build-all.sh` で全アプリビルド → `packages/router/public/` にまとめる
- `packages/router` を1回デプロイすれば全ツール公開
- 個別の Cloudflare Pages プロジェクトは不要

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
  wrangler.toml        # レガシー(個別デプロイ用、現在は build-all 方式)
```

## 技術スタック

- **UI**: React 18 + TypeScript (strict)
- **ビルド**: Vite+ (Vite 8 + Rolldown)
- **スタイリング**: Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- **ランタイム**: Node.js (pnpm via Vite+ CLI `vp`)
- **Linter/Formatter**: Oxlint + Oxfmt (via `vp check`)
- **テスト**: vp test / Vitest (ユニット) + Playwright (E2E)
- **ホスティング**: Cloudflare Workers + Static Assets (1プロジェクトに統合)
- **ルーター**: Hono (packages/router)
- **モノレポ**: pnpm workspaces (`apps/*`, `packages/*`)

## コマンド

```bash
# 依存関係
pnpm install

# 開発(各アプリごと)
cd apps/<tool-name> && vp dev

# テスト
vp test                     # ユニットテスト
pnpm test:e2e               # E2Eテスト

# lint / format
vp check                    # Oxlint + Oxfmt check
vp check --fix              # Oxlint + Oxfmt auto-fix

# 全アプリビルド → router/public/ にまとめる
bash scripts/build-all.sh

# router デプロイ(全ツール公開)
cd packages/router && pnpm run deploy

# Storybook
pnpm storybook

# アプリ管理
node scripts/create-app.js       # 新規アプリ作成
node scripts/delete-app.js       # アプリ削除
pnpm run scripts/generate-docs.ts # ドキュメント一括生成
```

## コーディング規約

- パスエイリアス: `@/` → `src/`, `@components/`, `@utils/`, `@types/`, `@config/`, `@hooks/`, `@services/`
- ボタン要素には必ず `type="button"` を付与
- 非同期クリップボード操作は try/catch で囲む
- UI コンポーネントは shadcn/ui を使用(Radix UI ベース)
- コアロジックは `src/utils/` に純粋関数として分離
- テストは `src/utils/__tests__/` に配置
- Oxfmt: indent 2 spaces, single quotes, semicolons, line width 100
- innerHTML を動的に設定する場合は必ず入力をエスケープしてから渡す(XSS対策)

## 新規アプリ作成

1. `node scripts/create-app.js` または既存アプリをコピー
2. `package.json` の name を更新
3. `vite.config.ts` の port を一意に設定
4. `index.html` の title, description を更新
5. `src/utils/` にコアロジック、`src/App.tsx` にUI実装
6. テスト追加: `src/utils/__tests__/`
7. `packages/router/src/config/apps.ts` にルーティング設定追加

参考: `.docs/APP_TEMPLATE_GUIDE.md`, `.docs/DESIGN_SYSTEM.md`

## デプロイ

全アプリを1つの Cloudflare Workers プロジェクトとしてデプロイ。

```bash
bash scripts/build-all.sh          # 全アプリビルド → public/ へ
cd packages/router && pnpm run deploy  # Workers デプロイ
```

`packages/router` が `tools.elchika.app/<tool-name>` へのルーティングと静的ファイル配信を担当。
ルーティング設定は `packages/router/src/config/apps.ts` で一元管理。

## Gotchas

- ほぼ全アプリが完全クライアントサイド (例外: image-ocr は tesseract.js がCDNから言語データをダウンロード、dns-lookup は DoH API を使用)
- `url-encoder` が最初期のテンプレート。多くのアプリがこれをベースにコピーされている
- 一部アプリの `index.html` に元テンプレートの title/description が残っている場合がある
- 各アプリの `wrangler.toml` はレガシー(個別Pages デプロイ時代の名残)。現在は build-all 方式を使用
- `packages/router/public/` はビルド生成物。git管理するかは運用方針次第
