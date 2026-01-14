# 📐 Image Resize

画像を拡大・縮小するツール。パーセント、ピクセル、ファイルサイズで指定可能。

## ✨ 特徴

- **3つのリサイズ方法**
  - パーセント指定：元画像のサイズに対する割合で指定
  - ピクセル指定：幅と高さを直接指定
  - ファイルサイズ指定：目標ファイルサイズを指定（実装予定）
- **アスペクト比維持機能**：画像の縦横比を保ったままリサイズ
- **複数フォーマット対応**：PNG、JPEG、WebP形式でエクスポート
- **クライアントサイド処理**：すべての処理はブラウザ内で完結。データは外部に送信・保存されません
- **リアルタイムプレビュー**：リサイズ前後の画像を比較表示

## 🚀 使い方

1. **画像を選択**：ファイル選択で画像をアップロード
2. **リサイズ方法を選択**：パーセント、ピクセル、ファイルサイズから選択
3. **サイズを指定**：
   - パーセント：1-200%の範囲でスライダーで調整
   - ピクセル：幅・高さを直接入力（アスペクト比維持オプション付き）
4. **フォーマットを選択**：PNG、JPEG、WebPから選択
5. **リサイズ実行**：ボタンをクリックしてリサイズ
6. **ダウンロード**：リサイズ後の画像をダウンロード

## 🛠️ 技術スタック

- **ランタイム**: Bun
- **フロントエンド**: React 18 + TypeScript
- **UIコンポーネント**: shadcn/ui (Radix UI)
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **デプロイ**: Cloudflare Pages

## 📦 セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# 型チェック
bun run type-check

# Lint
bun run lint
bun run lint:fix

# フォーマット
bun run format
bun run format:check
```

## 📁 プロジェクト構造

```
apps/image-resize/
├── src/
│   ├── components/      # Reactコンポーネント
│   │   └── ui/         # shadcn/uiコンポーネント
│   ├── hooks/          # カスタムフック
│   │   └── useResizeState.ts
│   ├── utils/          # ユーティリティ関数
│   │   ├── imageResize.ts
│   │   ├── exportImage.ts
│   │   └── fileSizeCalculator.ts
│   ├── config/         # 設定・定数
│   │   └── constants.ts
│   ├── types/          # 型定義
│   │   └── index.ts
│   ├── lib/            # ライブラリラッパー
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── wrangler.toml
```

## 🔧 開発

### Path Alias

プロジェクトでは以下のPath Aliasを使用しています：

```typescript
@components/* → ./src/components/*
@hooks/* → ./src/hooks/*
@utils/* → ./src/utils/*
@config/* → ./src/config/*
@types → ./src/types
@lib/* → ./src/lib/*
```

### コーディング規約

- TypeScript strict mode有効
- ESLint + Prettierによるコード品質管理
- Tailwind CSSユーティリティクラスを使用
- shadcn/uiコンポーネントをベースに構築

## 🚢 デプロイ

```bash
# Cloudflare Pagesにデプロイ
bun run deploy
```

## 📝 今後の予定

- [ ] ファイルサイズ指定でのリサイズ機能の完全実装
- [ ] バッチ処理機能（複数画像の一括リサイズ）
- [ ] プリセットサイズの追加
- [ ] 画質調整スライダー
- [ ] ドラッグ&ドロップ対応

## 📄 ライセンス

MIT

---

🔒 **プライバシー**: すべての処理はブラウザ内で完結します。画像データは外部サーバーに送信されることはありません。
