# Kana Converter

ひらがな・カタカナを相互変換。ブラウザ上で完結するクライアントサイドツール。

**URL**: https://tools.elchika.app/text-kana-converter

## 技術スタック

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3.4 + shadcn/ui
- Cloudflare Pages

## 開発

```bash
# 依存関係のインストール (ルートから)
bun install

# 開発サーバー起動
cd apps/text-kana-converter
bun run dev

# ビルド
bun run build

# デプロイ
bun run deploy
```

## テスト

```bash
bun test
```

## ディレクトリ構成

```
apps/text-kana-converter/
  src/
    App.tsx          # メインコンポーネント
    main.tsx         # エントリポイント
    components/ui/   # shadcn/ui コンポーネント
    utils/           # ユーティリティ関数
      kanaConverter.ts
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  postcss.config.js
  wrangler.toml
```

## ライセンス

MIT
