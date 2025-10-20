# 画像トリミングアプリ

クライアントサイドで完結する画像トリミングアプリケーション

## 特徴

- **完全クライアントサイド処理**: 画像データをサーバーに送信しません
- **直感的な操作**: マウス/タッチ操作と数値入力の両方に対応
- **高速動作**: bun + Vite による高速な開発環境
- **複数フォーマット対応**: JPEG、PNG、WebP形式でのエクスポート

## 技術スタック

- **ランタイム**: bun
- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **画像処理**: react-image-crop + Canvas API
- **デプロイ**: Cloudflare Pages

## セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview
```

## テスト

```bash
# テスト実行
bun test

# ウォッチモード
bun test --watch

# カバレッジ測定
bun test --coverage
```

## デプロイ

```bash
# Cloudflare Pagesへデプロイ
bun run deploy
```

## 使い方

1. 画像をドラッグ＆ドロップまたはクリックして選択
2. マウスでトリミング領域を調整
3. 必要に応じて座標を数値入力で微調整
4. フォーマットと品質を選択
5. ダウンロードボタンをクリック

## 対応フォーマット

### 入力

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### 出力

- JPEG (品質調整可能)
- PNG
- WebP (品質調整可能)

## 制限事項

- 最大ファイルサイズ: 10MB
- 最大解像度: 8000 x 8000 px

## ライセンス

MIT
