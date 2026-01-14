# Elchika Tools

Webブラウザで完結する便利なツール集です。すべてクライアントサイドで動作するため、データがサーバーに送信されることはありません。

## 🛠️ 利用可能なツール

### 🖼️ Image Cropper

**画像トリミングツール**

ブラウザ上で画像をトリミングできるツールです。アップロードした画像はすべてクライアントサイドで処理され、サーバーに送信されることはありません。

**特徴:**

- 完全クライアントサイド処理（画像データがサーバーに送信されない）
- マウス/タッチ操作と数値入力の両方に対応
- アスペクト比固定機能
- 複数フォーマット対応（JPEG、PNG、WebP）
- 品質調整機能

**使い方:**

1. 画像をドラッグ＆ドロップまたはクリックして選択
2. マウスでトリミング領域を調整
3. アスペクト比を選択（任意）
4. 座標を数値入力で微調整（任意）
5. フォーマットと品質を選択
6. ダウンロード

🔗 **ツールを使う**: https://tools.elchika.app/image-crop

---

### 🎨 Image Generator

**画像生成ツール**

テスト用のダミー画像や、カスタムサイズの画像を簡単に生成できるツールです。

**特徴:**

- 柔軟なサイズ設定（1〜10,000px）
- デバイス・SNS向けプリセット（iPhone、iPad、Twitter、Instagramなど）
- アスペクト比固定機能（16:9、4:3、1:1など）
- 背景カスタマイズ（カラーパレット、パターン）
- テキスト配置機能（フォントサイズ、色、配置調整）
- リアルタイムプレビュー
- PNG/JPEG形式でエクスポート

**使い方:**

1. サイズを入力またはプリセットから選択
2. アスペクト比を選択（任意）
3. 背景色とパターンを設定
4. テキストを入力・調整（任意）
5. フォーマットを選択してダウンロード

🔗 **ツールを使う**: https://tools.elchika.app/image-generate

---

### 📝 Text Diff Checker

**テキスト差分チェッカー**

2つのテキストを比較して差分を視覚的に表示するツールです。コードレビュー、文書比較、変更履歴の確認に最適です。

**特徴:**

- 完全クライアントサイド処理（データがサーバーに送信されない）
- Unified/Split表示モード
- シンタックスハイライト対応（JavaScript、TypeScript、Python、HTML、CSS、JSON、Markdown）
- 空白・空行を無視するオプション
- 詳細な統計情報（追加・削除・変更なし行数、文字数）
- Unified形式・Git patch形式でエクスポート
- ファイルからの読み込み対応

**使い方:**

1. 2つのテキストを入力またはファイルから読み込み
2. 差分が自動的に計算され表示される
3. 表示モードや無視オプションを調整
4. 必要に応じて差分をコピー

🔗 **ツールを使う**: https://tools.elchika.app/text-diff-checker

---

## 📱 モバイル対応

すべてのツールはレスポンシブデザインで、スマートフォンやタブレットでも快適に使えます。

## 🔒 プライバシー

すべてのツールはクライアントサイド（ブラウザ内）で完結します。画像やデータがサーバーに送信されることはありません。

## 💻 開発者向け情報

このプロジェクトに貢献したい開発者の方は、[開発者向けドキュメント](./__docs__/README.md) をご覧ください。

### 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui (Radix UI)
- **ホスティング**: Cloudflare Pages

### セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバーの起動
bun run dev:image-crop        # Image Crop
bun run dev:image-generate    # Image Generate
bun run dev:text-diff-checker # Text Diff Checker

# Storybookの起動
bun run storybook             # UIコンポーネントのカタログを表示
```

### Storybook

UIコンポーネントのドキュメントとカタログを確認できます。

```bash
# Storybookの起動
bun run storybook

# Storybookのビルド
bun run build-storybook
```

### E2Eテスト

Playwrightを使用したE2Eテストを実行できます。

```bash
# E2Eテストを実行
bun run test:e2e

# UIモードで実行（インタラクティブ）
bun run test:e2e:ui

# ヘッド付きモードで実行（ブラウザを表示）
bun run test:e2e:headed

# デバッグモードで実行
bun run test:e2e:debug

# HTMLレポートを表示
bun run test:e2e:report
```

## 🧪 テスト

このプロジェクトでは、包括的なテストカバレッジを実現しています。

### テストの種類

- **単体テスト（bun test）**: コンポーネント、ユーティリティ関数、カスタムフックのテスト
- **結合テスト（Playwright）**: E2Eでアプリケーション全体の動作をテスト

### テストの実行

```bash
# すべての単体テストを実行
bun test

# ウォッチモードで実行
bun test --watch

# カバレッジを表示
bun test --coverage

# すべてのテスト（単体+結合）を実行
bun run test:all
```

### カバレッジ目標

- **Lines**: 90%以上
- **Functions**: 90%以上
- **Branches**: 85%以上
- **Statements**: 90%以上

### テスト実装状況

✅ **Router パッケージ**: 単体テスト3ファイル  
✅ **URL Encoder**: 単体テスト5ファイル + 結合テスト2ファイル  
✅ **Text Counter**: 単体テスト5ファイル + 結合テスト1ファイル  
✅ **Text Deduplicate**: 単体テスト2ファイル + 結合テスト1ファイル  
✅ **Text Diff Checker**: 単体テスト3ファイル + 結合テスト1ファイル  
✅ **Image Resize**: 単体テスト1ファイル + 結合テスト1ファイル  
✅ **Image Crop**: 単体テスト1ファイル + 結合テスト1ファイル  
✅ **Image Generate**: 単体テスト1ファイル + 結合テスト1ファイル  
✅ **Image Grayscale**: 単体テスト1ファイル + 結合テスト1ファイル  
✅ **Image Assets**: 単体テスト1ファイル + 結合テスト1ファイル

**合計: 36ファイル（単体テスト23 + 結合テスト10 + テスト基盤3）**

詳細は[テスト実装ガイド](./__docs__/TESTING_GUIDE.md)をご覧ください。

詳しくは [開発者向けドキュメント](./__docs__/README.md) をご覧ください。

## 📄 ライセンス

MIT
