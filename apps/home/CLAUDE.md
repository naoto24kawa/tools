# Home

Elchika Toolsのトップページ。全ツールのカテゴリ別一覧 + 検索 + フィルタ。

## アーキテクチャ

- SPA: React 19 + TypeScript + Vite 8
- UI: Tailwind CSS 3.4
- デプロイ: Cloudflare Pages
- 完全クライアントサイド処理(サーバー通信なし)

## 主要ファイル

- `src/App.tsx` - メインUI (検索、カテゴリフィルタ、カード一覧)
- `src/utils/apps.ts` - ツール一覧データ (AppInfo[], カテゴリ定義)
- `src/components/ToolCard.tsx` - ツールカードコンポーネント
- `src/components/SearchBar.tsx` - 検索バー
- `src/components/CategoryFilter.tsx` - カテゴリフィルタチップ

## コマンド

```bash
bun run dev      # 開発サーバー (port 5200)
bun run build    # ビルド
bun run deploy   # デプロイ
```

## 規約

- ツール追加時は `src/utils/apps.ts` の APPS 配列にエントリ追加
- パスエイリアス: `@/` = `src/`, `@components/`, `@utils/`
