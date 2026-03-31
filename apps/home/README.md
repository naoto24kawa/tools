# Home

Elchika Toolsのトップページ。全ツールをカテゴリ別カードUIで表示。検索・フィルタ機能付き。

**URL**: https://tools.elchika.app/

## 技術スタック

- React 19 + TypeScript
- Vite 8 (via vite-plus)
- Tailwind CSS 3.4
- Cloudflare Pages

## 開発

```bash
# 依存関係のインストール (ルートから)
bun install

# 開発サーバー起動
cd apps/home
bun run dev

# ビルド
bun run build

# デプロイ
bun run deploy
```

## ディレクトリ構成

```
apps/home/
  src/
    App.tsx                    # メインコンポーネント
    main.tsx                   # エントリポイント
    utils/
      apps.ts                  # ツール一覧データ
    components/
      ToolCard.tsx             # カードコンポーネント
      SearchBar.tsx            # 検索バー
      CategoryFilter.tsx       # カテゴリフィルタ
  index.html
  package.json
  vite.config.ts
  wrangler.toml
```

## ライセンス

MIT
