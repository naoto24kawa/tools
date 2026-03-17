# Image Trim

透過PNG画像の余白トリミング。

## アーキテクチャ

- SPA: React 18 + TypeScript + Vite 6
- UI: Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- デプロイ: Cloudflare Pages
- 完全クライアントサイド処理(サーバー通信なし)

## 主要ファイル

- `src/App.tsx` - メインUI
- `src/utils/imageTrimmer.ts` - コアロジック
- `src/utils/transparencyDetector.ts` - コアロジック

## コマンド

```bash
bun run dev      # 開発サーバー
bun run build    # ビルド
bun test         # テスト
bun run deploy   # デプロイ
```

## 規約

- パスエイリアス: `@/` = `src/`, `@components/` = `src/components/`
- ボタンには必ず `type="button"` を付与
- 非同期クリップボード操作は try/catch で囲む
- linter: Biome (`bun run lint`)
- テスト: bun test (`src/utils/__tests__/`)
