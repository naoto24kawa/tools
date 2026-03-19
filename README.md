# Elchika Tools

Webブラウザで完結する便利なツール集。すべてクライアントサイドで動作し、データがサーバーに送信されることはありません。

**https://tools.elchika.app**

## ツール数

**333個** のツールを19カテゴリで提供しています。

| カテゴリ | 数 | 代表例 |
|----------|-----|--------|
| Text | 29 | Text Counter, Diff Checker, Reading Time, Emoji Search |
| Encode | 15 | URL Encoder, Base64, Morse, NATO Phonetic, Zalgo |
| Crypto / Hash | 16 | AES, SHA, Bcrypt, RSA, Enigma |
| Security | 6 | Password Strength, TOTP, CSP Builder, SRI Hash |
| Number / Math | 20 | Calculator, Statistics, Matrix, Prime, Fibonacci |
| DateTime | 12 | Unix Timestamp, Crontab, World Clock, Working Days |
| JSON | 12 | Formatter, Validator, Diff, JSON Schema Generator |
| Code / Dev | 36 | HTTP Status, Regex Tester, Gitignore, tsconfig Builder |
| Color / CSS | 22 | Color Picker, Gradient, Animation Builder, Tailwind↔CSS |
| Image | 22 | Crop, Resize, OCR, Favicon, Pixel Art Editor |
| PDF | 9 | Merge, Split, Compress, Watermark |
| Audio | 8 | Trim, Convert, Visualizer, Metronome |
| Video | 11 | Trim, Compress, Thumbnail, Rotate, Watermark |
| Data Viz | 7 | Chart Builder, Mermaid Preview, Gantt, ER Diagram |
| Business | 8 | Tax Calculator, Loan, Invoice, Working Days |
| Conversion | 10 | CSV↔JSON, YAML, HTML↔Markdown, iCal Parser |
| File Ops | 7 | Hash Checker, ZIP Creator/Extractor, EXIF Editor |
| Utility | 9 | Pomodoro, Kanban, Whiteboard, Typing Test |
| Network / DevOps | 16 | DNS Lookup, WebSocket Tester, K8s YAML, Nginx Config |

## プライバシー

すべてのツールはクライアントサイド(ブラウザ内)で完結します。データがサーバーに送信されることはありません。
(例外: image-ocr は tesseract.js がCDNから言語データをダウンロード、dns-lookup は DoH API を使用)

## 技術スタック

- **UI**: React 18 + TypeScript (strict)
- **ビルド**: Vite+ (Vite 8 + Rolldown)
- **スタイリング**: Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- **Linter/Formatter**: Oxlint + Oxfmt (`vp check`)
- **テスト**: Vitest (ユニット) + Playwright (E2E)
- **ホスティング**: Cloudflare Workers + Static Assets
- **モノレポ**: pnpm workspaces

## アーキテクチャ

```
User → tools.elchika.app/<app>/
  → Router Worker + Static Assets
    → 直接ファイル配信(プロキシなし)
```

全アプリを `packages/router/public/` に静的ファイルとしてバンドルし、1つの Cloudflare Workers プロジェクトとしてデプロイする構成。

```
elchika-tools/
  apps/                  # 各ツール(独立SPA) - 333個
  packages/
    router/              # Cloudflare Workers ルーター
      src/               # ルーティングロジック
      public/            # ビルド済み静的ファイル(全アプリ)
  scripts/               # 管理スクリプト
  .docs/                 # ドキュメント
  e2e/                   # Playwright E2Eテスト
  .storybook/            # Storybook設定
```

## 開発

### セットアップ

```bash
pnpm install
```

### 個別アプリの開発

```bash
cd apps/<tool-name>
vp dev          # 開発サーバー起動
vp test         # ユニットテスト
vp check        # lint + format チェック
vp check --fix  # 自動修正
```

### 全体ビルド & デプロイ

```bash
# 全アプリをビルドして packages/router/public/ にまとめる
bash scripts/build-all.sh

# router をデプロイ(全ツールが公開される)
cd packages/router && pnpm run deploy
```

### その他のコマンド

```bash
node scripts/create-app.js       # 新規アプリ作成(対話的)
node scripts/delete-app.js       # アプリ削除
pnpm storybook                   # Storybook起動
pnpm test:e2e                    # E2Eテスト
```

## 新規アプリ追加手順

1. `node scripts/create-app.js <app-name> "説明"` でスケルトン作成
2. `vite.config.ts` の port を一意に設定
3. `index.html` の title, description を更新
4. `src/utils/` にコアロジック(純粋関数)を実装
5. `src/App.tsx` に UI を実装(shadcn/ui 使用)
6. `src/utils/__tests__/` にユニットテスト追加
7. `packages/router/src/config/apps.ts` にルーティング設定追加
8. `bash scripts/build-all.sh` でビルド確認

詳しくは [.docs/APP_TEMPLATE_GUIDE.md](.docs/APP_TEMPLATE_GUIDE.md)、[.docs/DESIGN_SYSTEM.md](.docs/DESIGN_SYSTEM.md) を参照。

## ライセンス

MIT
