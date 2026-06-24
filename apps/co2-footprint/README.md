# CO2 Footprint Calculator

CO2 排出量を計算・可視化するツール。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/co2-footprint/

## 技術スタック

- React 18 + TypeScript
- Vite (Vite+)
- Tailwind CSS 3.4 + shadcn/ui
- Cloudflare Workers + Static Assets

## 開発

```bash
# 依存関係のインストール (ルートから)
pnpm install

# 開発サーバー起動
cd apps/co2-footprint
vp dev

# ビルド
vp build

# テスト
vp test

# Lint/Format
vp check
vp check --fix
```

## ディレクトリ構成

```
apps/co2-footprint/
  src/
    App.tsx                    # メインコンポーネント
    main.tsx                   # エントリポイント
    utils/
      co2Footprint.ts          # 計算ロジック
      __tests__/               # ユニットテスト
    components/ui/             # shadcn/ui コンポーネント
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  postcss.config.js
```

## ライセンス

MIT
