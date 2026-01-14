# E2Eテストガイド

このディレクトリには、Playwrightを使用したE2Eテストが含まれています。

## ディレクトリ構造

```
e2e/
├── apps/                      # アプリケーションごとのテスト
│   ├── url-encoder/
│   │   ├── basic.spec.ts      # 基本的な機能テスト
│   │   └── encoding.spec.ts   # エンコード機能テスト
│   ├── image-crop/
│   └── ...
├── shared/                    # 共通リソース
│   ├── helpers/               # ヘルパー関数
│   │   └── test-helpers.ts
│   ├── fixtures/              # テストフィクスチャ
│   └── page-objects/          # ページオブジェクト
└── README.md                  # このファイル
```

## テストの実行

### 基本的な実行

```bash
# すべてのテストを実行
bun run test:e2e

# 特定のテストファイルのみ実行
bun run test:e2e e2e/apps/url-encoder/basic.spec.ts

# 特定のブラウザでのみ実行
bun run test:e2e --project=chromium
bun run test:e2e --project=firefox
bun run test:e2e --project=webkit
```

### インタラクティブモード

```bash
# UIモードで実行（推奨）
bun run test:e2e:ui
```

UIモードでは、テストをインタラクティブに実行し、各ステップを視覚的に確認できます。

### デバッグ

```bash
# デバッグモードで実行
bun run test:e2e:debug

# ヘッド付きモードで実行（ブラウザを表示）
bun run test:e2e:headed
```

### レポート

```bash
# HTMLレポートを表示
bun run test:e2e:report
```

テスト実行後、`playwright-report/`ディレクトリにHTMLレポートが生成されます。

## テストの書き方

### 基本的なテスト

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // テストコード
    const button = page.getByRole('button', { name: /Click me/i });
    await expect(button).toBeVisible();
    await button.click();
  });
});
```

### ヘルパー関数の使用

```typescript
import { test, expect } from '@playwright/test';
import { navigateAndWait, fillInput } from '../shared/helpers/test-helpers';

test('should use helpers', async ({ page }) => {
  await navigateAndWait(page, '/');
  await fillInput(page, 'input[name="username"]', 'testuser');
});
```

## ベストプラクティス

### 1. セレクタの優先順位

Playwrightは、以下の優先順位でセレクタを使用することを推奨しています：

1. **ロールベース**: `page.getByRole('button', { name: /Submit/i })`
2. **ラベル**: `page.getByLabel('Email')`
3. **プレースホルダー**: `page.getByPlaceholder('Enter email')`
4. **テキスト**: `page.getByText('Welcome')`
5. **テストID**: `page.getByTestId('submit-button')`
6. **CSSセレクタ**: 最後の手段として使用

### 2. 待機の処理

Playwrightは自動的に要素を待機しますが、必要に応じて明示的な待機を使用できます：

```typescript
// 要素が表示されるまで待機
await page.waitForSelector('.my-element');

// ネットワークがアイドル状態になるまで待機
await page.waitForLoadState('networkidle');

// カスタム条件を待機
await page.waitForFunction(() => window.myGlobalVar === true);
```

### 3. アサーション

Playwrightの`expect`を使用して、さまざまなアサーションを実行できます：

```typescript
// 要素の可視性
await expect(page.getByRole('button')).toBeVisible();

// テキスト内容
await expect(page.getByRole('heading')).toHaveText('Welcome');

// 属性
await expect(page.getByRole('link')).toHaveAttribute('href', '/about');

// 値
await expect(page.getByRole('textbox')).toHaveValue('test');
```

### 4. テストの独立性

各テストは独立して実行できるようにします：

```typescript
test.beforeEach(async ({ page }) => {
  // 各テストの前に初期状態にリセット
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  // クリーンアップ処理
});
```

### 5. スクリーンショットとトレース

失敗時のデバッグに役立つように、スクリーンショットとトレースを活用します：

```typescript
// 手動でスクリーンショットを撮影
await page.screenshot({ path: 'screenshot.png' });

// トレースを記録（playwright.config.tsで設定済み）
// 失敗時に自動的に記録されます
```

## トラブルシューティング

### テストが失敗する

1. **UIモードで実行**: `bun run test:e2e:ui`で各ステップを確認
2. **ヘッド付きモードで実行**: `bun run test:e2e:headed`でブラウザの動作を確認
3. **デバッグモードで実行**: `bun run test:e2e:debug`でステップバイステップで実行

### タイムアウトエラー

```typescript
// 個別のテストでタイムアウトを延長
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60秒
  // テストコード
});
```

### 要素が見つからない

1. セレクタが正しいか確認
2. 要素が表示されるまで待機しているか確認
3. ページが正しく読み込まれているか確認

## 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwrightベストプラクティス](https://playwright.dev/docs/best-practices)
- [Playwrightセレクタガイド](https://playwright.dev/docs/selectors)
