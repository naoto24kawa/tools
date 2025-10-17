# Tools Router

Cloudflare Workers + Honoを使用した、複数の独立したツールアプリケーションを単一のエントリーポイントで管理するルーティングシステムです。

## 📖 目次

- [概要](#概要)
- [なぜこのプロジェクトが必要か](#なぜこのプロジェクトが必要か)
- [クイックスタート](#クイックスタート)
- [CI/CD設定](#cicd設定)
- [コマンドリファレンス](#コマンドリファレンス)
- [アーキテクチャ](#アーキテクチャ)
- [プロジェクト構造](#プロジェクト構造)
- [詳細ガイド](#詳細ガイド)

## 概要

このプロジェクトは、複数のツールアプリケーションを**Cloudflare Workers**上で統合管理するためのルーティングシステムです。

**主な特徴**:
- 🔄 **統一エントリーポイント**: すべてのツールに単一URLでアクセス
- 🧩 **独立したアプリ**: 各ツールは完全に独立したWorkerとして動作
- 🌍 **言語/FW自由**: TypeScript, Python, Rustなど、各ツールで異なる技術スタックを使用可能
- ⚡ **エッジで高速**: Cloudflareのグローバルネットワークで低レイテンシ
- 🎯 **自動化**: アプリの追加・削除が完全自動化

## なぜこのプロジェクトが必要か

**課題**:
複数の小さなツールやAPIを開発する際、それぞれを別々にデプロイ・管理するのは煩雑です。

**解決策**:
このプロジェクトでは、Service Bindingsを活用して：

1. **統一されたエントリーポイント**: `https://tools.example.com/tool-name/` で全ツールにアクセス
2. **独立したデプロイ**: 各ツールは個別にデプロイ・更新可能
3. **技術的柔軟性**: ツールごとに最適な言語/フレームワークを選択
4. **運用の簡素化**: 単一のドメイン・証明書で複数ツールを管理

## クイックスタート

### 1. セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd tools

# 依存関係をインストール
npm install
```

### 2. 新しいツールを作成

```bash
# 新規ツールの自動生成（例: PDFコンバーター）
npm run create-app pdf-converter "PDFコンバーター"

# ツールディレクトリに移動して開発
cd apps/pdf-converter
npm install
npm run dev
```

### 3. デプロイ

```bash
# 子アプリをデプロイ
npm run deploy:pdf-converter

# メインルーターをデプロイ
npm run deploy:router
```

これだけで `https://your-worker.workers.dev/pdf-converter/` でアクセス可能になります！

## CI/CD設定

### GitHub Actionsによる自動デプロイ

このプロジェクトには、GitHub Actionsを使用したCI/CDワークフローが組み込まれています。

#### ワークフローの種類

1. **CI (Pull Request時)**
   - 型チェック（TypeScript）
   - ビルドテスト
   - トリガー: Pull Requestの作成・更新

2. **Deploy (mainブランチへのマージ時)**
   - ビルド実行
   - 子アプリのデプロイ
   - メインルーターのデプロイ
   - トリガー: mainブランチへのpush

#### 初期設定手順

##### 1. Cloudflare API Tokenの取得

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. My Profile → API Tokens
3. "Create Token" をクリック
4. "Edit Cloudflare Workers" テンプレートを選択
5. 必要な権限を確認:
   - `Workers Scripts:Edit`
   - `Account Settings:Read`
6. "Continue to summary" → "Create Token"
7. 表示されたトークンをコピー（一度しか表示されません）

##### 2. GitHub Secretsの設定

1. GitHubリポジトリページに移動
2. Settings → Secrets and variables → Actions
3. "New repository secret" をクリック
4. Secret情報を入力:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: 手順1でコピーしたAPIトークン
5. "Add secret" をクリック

##### 3. カスタムドメイン設定（オプション）

`tools.elchika.app` でアクセスする場合:

1. Cloudflare Dashboardで `elchika.app` ドメインを管理していることを確認
2. 初回デプロイ後、Workers & Pages → tools-router → Settings → Domains & Routes
3. "Add Custom Domain" をクリック
4. `tools.elchika.app` を入力
5. DNS設定が自動的に追加されます

#### デプロイフロー

```
コード変更
    ↓
Git Commit & Push
    ↓
Pull Request作成
    ↓
CI実行 (型チェック・ビルド)
    ↓
レビュー & マージ
    ↓
mainブランチにpush
    ↓
Deploy実行
    ├─ 1. apps/image-cropをビルド
    ├─ 2. apps/image-cropをデプロイ
    └─ 3. tools-routerをデプロイ
         ↓
    https://tools.elchika.app で公開
```

#### 手動デプロイ

CI/CDを使用せず、手動でデプロイする場合:

```bash
# すべてビルド＆デプロイ（推奨）
npm run deploy

# 個別にデプロイ
npm run build:image-crop
npm run deploy:image-crop
npm run deploy:router
```

#### トラブルシューティング

**デプロイが失敗する場合:**

1. **API Tokenの確認**
   - GitHub Secretsに `CLOUDFLARE_API_TOKEN` が正しく設定されているか確認
   - トークンの有効期限が切れていないか確認

2. **ビルドエラー**
   - ローカルで `npm run build` を実行して、ビルドが成功するか確認
   - 依存関係が正しくインストールされているか確認

3. **Service Bindingエラー**
   - 子アプリが先にデプロイされているか確認
   - wrangler.tomlのサービス名が一致しているか確認

## コマンドリファレンス

### アプリ管理コマンド

| コマンド | 説明 | 例 |
|---------|------|-----|
| `npm run create-app <name> [description]` | 新規アプリを作成（メインルーター自動更新） | `npm run create-app pdf-tool "PDFツール"` |
| `npm run delete-app <name>` | アプリを削除（メインルーター自動更新） | `npm run delete-app pdf-tool` |

#### create-app オプション

```bash
# 基本的な使い方
npm run create-app <アプリ名> [説明]

# 対話的に入力
npm run create-app my-tool

# メインルーター更新をスキップ
npm run create-app my-tool "説明" --skip-router

# ヘルプを表示
npm run create-app --help
```

**自動実行される処理**:
- アプリディレクトリ生成
- `wrangler.toml` にService Binding追加
- `package.json` にデプロイスクリプト追加
- `src/index.ts` にルーティング追加

#### delete-app オプション

```bash
# 基本的な使い方
npm run delete-app <アプリ名>

# 確認なしで削除
npm run delete-app my-tool --force

# Cloudflare Workerも削除
npm run delete-app my-tool --delete-worker

# メインルーター更新をスキップ
npm run delete-app my-tool --skip-router

# ヘルプを表示
npm run delete-app --help
```

**自動実行される処理**:
- アプリディレクトリ削除
- `wrangler.toml` からService Binding削除
- `package.json` からデプロイスクリプト削除
- `src/index.ts` からルーティング削除

### 開発コマンド

| コマンド | 説明 | 使用場所 |
|---------|------|---------|
| `npm run dev` | ローカル開発サーバー起動 | ルート または apps/<name>/ |
| `npm run type-check` | TypeScriptの型チェック | ルート または apps/<name>/ |

```bash
# メインルーターの開発
npm run dev  # http://localhost:8787

# 子アプリの開発
cd apps/my-tool
npm run dev  # http://localhost:8788
```

### デプロイコマンド

| コマンド | 説明 | 備考 |
|---------|------|-----|
| `npm run deploy` | 全アプリ+ルーターをデプロイ | 一括デプロイ（推奨） |
| `npm run deploy:router` | メインルーターのみデプロイ | ルーティング変更時 |
| `npm run deploy:<app-name>` | 特定アプリのみデプロイ | 個別デプロイ |
| `npm run deploy:apps` | 全子アプリをデプロイ | ルーター以外 |

```bash
# 一括デプロイ（推奨）
npm run deploy

# 個別デプロイ
npm run deploy:pdf-tool
npm run deploy:router

# 初回デプロイの順序
npm run deploy:pdf-tool  # 1. 子アプリを先に
npm run deploy:router    # 2. メインルーターを後に
```

**重要**: Service Bindingsのため、**子アプリ → メインルーター**の順でデプロイしてください。

### その他のコマンド

```bash
# Cloudflare Workerを削除（手動）
wrangler delete tools-<app-name>

# デプロイ履歴を確認
wrangler deployments list --name tools-<app-name>

# ログを確認
wrangler tail tools-<app-name>
```

## アーキテクチャ

```
ユーザーリクエスト
    ↓
メインルーター (tools-router)
    ↓ Service Binding経由
子アプリ (tools-image-crop, など)
```

### 特徴

- **独立性**: 各ツールは完全に独立したWorkerとして実装
- **柔軟性**: 異なる言語/フレームワークの使用が可能
- **拡張性**: 新しいツールの追加が容易
- **統一性**: 単一のエントリーポイントで全ツールにアクセス

## プロジェクト構造

```
/tools
├── package.json           # メインルーターの依存関係
├── tsconfig.json          # TypeScript設定
├── wrangler.toml          # メインルーターの設定
├── src/
│   └── index.ts           # メインルーター実装
└── apps/
    └── image-crop/        # 画像トリミングツール（例）
        ├── package.json
        ├── wrangler.toml
        └── src/
            └── index.ts
```

## セットアップ

### 1. 依存関係のインストール

```bash
# メインルーターの依存関係
npm install

# 各子アプリの依存関係
cd apps/image-crop
npm install
cd ../..
```

### 2. ローカル開発

各Workerを個別に起動してテストできます：

```bash
# 子アプリを起動（例: image-crop）
cd apps/image-crop
npm run dev
# → http://localhost:8788 で起動

# 別のターミナルでメインルーターを起動
npm run dev
# → http://localhost:8787 で起動
```

**注意**: ローカル開発時は、`wrangler.toml`のService Bindingsが機能しないため、各Workerを個別にテストすることをお勧めします。

## デプロイ

### 重要: デプロイ順序

Service Bindingsを使用しているため、**必ず子アプリを先にデプロイ**してください。

```bash
# 1. 子アプリをデプロイ
npm run deploy:image-crop

# 2. メインルーターをデプロイ
npm run deploy:router

# または一括デプロイ（推奨）
npm run deploy
```

### 初回デプロイ時の注意

初回デプロイ時にService Bindingのエラーが出る場合は、以下の手順で対応してください：

1. 子アプリを個別にデプロイ
2. Cloudflare Dashboardで子Workerが正常にデプロイされたことを確認
3. メインルーターをデプロイ

## エンドポイント

デプロイ後、以下のエンドポイントが利用可能になります：

### メインルーター

- `GET /` - 利用可能なツールの一覧
- `GET /health` - ヘルスチェック

### 画像トリミングツール

- `GET /image-crop/` - ツール情報
- `GET /image-crop/health` - ヘルスチェック
- `POST /image-crop/crop` - 画像トリミング（未実装）

## 新しいツールの追加

### 自動生成スクリプトを使用（推奨） ✨

新規アプリを作成すると、**メインルーターへの追加も自動で行われます**：

```bash
# 基本的な使い方
npm run create-app <アプリ名> [説明]

# 例1: 引数で指定
npm run create-app pdf-converter "PDFコンバーター"

# 例2: 対話的に入力
npm run create-app image-resize
# → アプリの説明を入力してください: 画像リサイズツール
```

**アプリ名の形式**:
- kebab-case（小文字とハイフン）で指定してください
- 例: `image-crop`, `pdf-converter`, `data-analyzer`

**自動で実行される処理**:

1. アプリディレクトリの生成:
   - `apps/<アプリ名>/package.json`
   - `apps/<アプリ名>/wrangler.toml`
   - `apps/<アプリ名>/tsconfig.json`
   - `apps/<アプリ名>/src/index.ts`

2. メインルーターの自動更新:
   - `wrangler.toml` に Service Binding追加
   - `package.json` にデプロイスクリプト追加
   - `src/index.ts` に型定義、ルーティング、エンドポイント一覧を追加

3. バックアップファイルの作成:
   - 編集前のファイルを`.backup`として保存

**次のステップ**:
```bash
# 依存関係のインストール
cd apps/<アプリ名>
npm install

# ローカル開発
npm run dev

# デプロイ
npm run deploy:<アプリ名>
cd ../..
npm run deploy:router
```

### 方法2: 手動で追加

#### 1. ツールのディレクトリを作成

```bash
mkdir -p apps/new-tool/src
```

#### 2. 必要なファイルを作成

`templates/app/` ディレクトリのテンプレートを参考に作成してください。

#### 3. メインルーターに追加

`wrangler.toml`にService Bindingを追加：

```toml
[[services]]
binding = "NEW_TOOL"
service = "tools-new-tool"
```

`src/index.ts`の型定義とルーティングを追加：

```typescript
type Bindings = {
  IMAGE_CROP: Fetcher
  NEW_TOOL: Fetcher  // 追加
}

// ルーティング追加
app.all('/new-tool/*', async (c) => {
  try {
    const path = c.req.path.replace('/new-tool', '') || '/'
    const url = new URL(path, 'http://internal')
    const request = new Request(url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    })
    return await c.env.NEW_TOOL.fetch(request)
  } catch (error) {
    console.error('Error proxying to new-tool:', error)
    return c.json({ error: 'Service unavailable' }, 503)
  }
})
```

#### 4. デプロイ

```bash
# 新しいツールをデプロイ
cd apps/new-tool
npm install
wrangler deploy
cd ../..

# メインルーターを再デプロイ
npm run deploy:router
```

## ツールの削除

不要になったアプリを削除できます。**メインルーターからの削除も自動で行われます** ✨

```bash
# 基本的な使い方
npm run delete-app <アプリ名>

# 例
npm run delete-app pdf-converter

# 確認なしで削除（注意）
npm run delete-app image-resize --force

# Cloudflare Workerも削除
npm run delete-app test-tool --delete-worker

# ヘルプを表示
npm run delete-app --help
```

**自動で実行される処理**:

1. メインルーターから削除:
   - `wrangler.toml` から Service Binding削除
   - `package.json` からデプロイスクリプト削除
   - `src/index.ts` から型定義、ルーティング、エンドポイント一覧を削除

2. アプリディレクトリの削除:
   - `apps/<アプリ名>/` を完全に削除

3. バックアップファイルの作成:
   - 編集前のファイルを`.backup`として保存

**オプション**:

```bash
# Cloudflare Workerも削除（デプロイ済みの場合）
npm run delete-app <アプリ名> --delete-worker

# メインルーター更新をスキップ（手動で行う場合）
npm run delete-app <アプリ名> --skip-router
```

**次のステップ**:
```bash
# バックアップファイルの確認（問題なければ削除）
rm wrangler.toml.backup package.json.backup src/index.ts.backup

# メインルーターを再デプロイ
npm run deploy:router
```

## コスト考慮事項

### 無料プラン

- 100,000リクエスト/日
- Service Bindingsにより、1ユーザーリクエスト = 2 Worker リクエスト
- **実質的に50,000ユーザーリクエスト/日まで**

### Paidプラン

- $5/月 + 超過分$0.50/100万リクエスト
- より多くのトラフィックに対応可能

### コスト最適化

ツール数が3個以下で、すべて同じ言語/フレームワークを使用する場合は、単一Workerでの実装を検討してください（リクエスト数が半分になります）。

## トラブルシューティング

### Service Bindingのエラー

```
Error: Service binding "IMAGE_CROP" not found
```

**解決方法**: 子アプリが正しくデプロイされているか確認してください。

```bash
wrangler deployments list --name tools-image-crop
```

### ローカル開発でのService Binding

ローカル開発時はService Bindingsが動作しないため、各Workerを個別にテストしてください。

### デプロイ順序のエラー

必ず**子アプリ → メインルーター**の順でデプロイしてください。

## セキュリティ

実装済みのセキュリティ機能：

- セキュリティヘッダー（`hono/secure-headers`）
- CORS設定
- エラーハンドリング
- 圧縮

本番環境では以下の追加を検討してください：

- Cloudflare Accessによる認証
- Rate Limiting（KV使用）
- 入力バリデーション

## 参考リソース

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/)
- [Hono Framework](https://hono.dev/)

## ライセンス

MIT
