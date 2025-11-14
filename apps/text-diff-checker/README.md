# Text Diff Checker

2つのテキストを比較して差分を視覚的に表示するWebツールです。

## 🎯 特徴

- **完全クライアントサイド**: すべての処理はブラウザ内で完結。データは外部に送信されません
- **複数の表示モード**: Unified形式とSplit形式の2つの表示モードに対応
- **シンタックスハイライト**: JavaScript、TypeScript、Python、HTML、CSS、JSON、Markdownなどに対応
- **柔軟な比較オプション**: 空白や空行を無視するオプション
- **詳細な統計情報**: 追加・削除・変更なし行数、文字数を表示
- **エクスポート機能**: Unified形式やGit patch形式でクリップボードにコピー
- **ファイル読み込み**: テキストファイルから直接読み込み可能
- **レスポンシブデザイン**: モバイル、タブレット、デスクトップに対応

## 🚀 使い方

### 基本的な使い方

1. **テキストを入力**: 左側に元のテキスト、右側に変更後のテキストを入力
2. **差分を確認**: 自動的に差分が計算され、追加行は緑、削除行は赤で表示されます
3. **表示モードを選択**: Unified（統合）またはSplit（分割）表示を選択
4. **オプションを調整**: 必要に応じて空白や空行を無視するオプションを有効化

### ファイルから読み込み

各テキスト入力エリアの右上にある「ファイル」ボタンをクリックして、テキストファイルを読み込めます。

対応ファイル形式:
- .txt, .md, .json
- .js, .ts, .tsx, .jsx
- .py, .html, .css
- その他のテキストファイル

### エクスポート

設定パネルの「エクスポート」セクションから、差分を以下の形式でクリップボードにコピーできます:

- **Unified形式**: +/- 記号付きの標準的な差分形式
- **Patch形式**: Git互換のpatch形式

## 🛠️ 技術スタック

- **React 18** - UIフレームワーク
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **shadcn/ui** - UIコンポーネントライブラリ
- **diff** - 差分計算ライブラリ
- **Cloudflare Pages** - ホスティング

## 📦 開発

### セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev

# ビルド
bun run build

# 型チェック
bun run type-check

# Lint
bun run lint
```

### ディレクトリ構造

```
src/
├── components/       # Reactコンポーネント
│   ├── ui/          # shadcn/uiコンポーネント
│   ├── Header.tsx
│   ├── TextInput.tsx
│   ├── DiffDisplay.tsx
│   └── ...
├── hooks/           # カスタムフック
│   ├── useDiffState.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── utils/           # ユーティリティ関数
│   ├── diffCalculator.ts
│   └── textPreprocessor.ts
├── services/        # サービス層
│   ├── fileLoader.ts
│   └── clipboard.ts
├── config/          # 設定・定数
│   └── constants.ts
├── types/           # 型定義
│   └── index.ts
├── App.tsx          # メインコンポーネント
└── main.tsx         # エントリーポイント
```

## 🔧 設定

### ローカルストレージ

以下の設定がブラウザのローカルストレージに保存されます:

- 表示モード（Unified / Split）
- 選択言語
- 無視オプション（空白、空行）

## 📝 ライセンス

MIT

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 🔗 関連リンク

- [Elchika Tools](https://tools.elchika.app)
- [開発者向けドキュメント](../../__docs__/README.md)
