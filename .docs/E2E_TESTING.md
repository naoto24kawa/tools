# E2Eテスティングガイド

このドキュメントでは、Elchika ToolsプロジェクトでPlaywrightを使用したE2Eテストについて説明します。

## 概要

E2E（End-to-End）テストは、アプリケーション全体の動作を実際のユーザーの視点からテストする手法です。このプロジェクトでは、Playwrightを使用してブラウザ自動化によるE2Eテストを実行します。

## Playwrightとは

Playwrightは、Microsoftが開発したブラウザ自動化ライブラリです。以下の特徴があります：

- **複数ブラウザ対応**: Chromium、Firefox、Webkitをサポート
- **自動待機**: 要素が準備できるまで自動的に待機
- **強力なセレクタ**: ロールベース、テキストベースなど多様なセレクタ
- **並列実行**: テストを並列で実行して高速化
- **デバッグツール**: UIモード、トレースビューアなど充実したデバッグツール

## セットアップ

### 前提条件

- Node.js 18以上
- pnpm

### インストール

プロジェクトルートで以下を実行：

```bash
pnpm install
```

Playwrightのブラウザをインストール(初回のみ):

```bash
pnpm dlx playwright install
```

## テストの実行

### 基本的な実行

```bash
# すべてのE2Eテストを実行
pnpm test:e2e

# 特定のテストファイルのみ実行
pnpm test:e2e e2e/apps/url-encoder/basic.spec.ts

# 特定のブラウザでのみ実行
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

### UIモード（推奨）

UIモードは、テストをインタラクティブに実行し、各ステップを視覚的に確認できます。

```bash
pnpm test:e2e:ui
```

UIモードの機能：

- テストの選択と実行
- 各ステップの視覚的な確認
- タイムトラベルデバッグ
- ロケーターの探索
- スクリーンショットとトレースの表示

### デバッグモード

```bash
# デバッグモードで実行
pnpm test:e2e:debug

# ヘッド付きモードで実行（ブラウザを表示）
pnpm test:e2e:headed
```

### レポート

テスト実行後、HTMLレポートが自動的に生成されます。

```bash
# HTMLレポートを表示
pnpm test:e2e:report
```

## テストの書き方

### 基本構造

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前に実行される処理
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // テストコード
    const button = page.getByRole('button', { name: /Submit/i });
    await expect(button).toBeVisible();
    await button.click();
  });

  test.afterEach(async ({ page }) => {
    // 各テストの後に実行される処理（クリーンアップなど）
  });
});
```

### セレクタの使用

Playwrightは、以下の優先順位でセレクタを使用することを推奨しています：

#### 1. ロールベースセレクタ（最優先）

```typescript
// ボタン
await page.getByRole('button', { name: /Submit/i });

// リンク
await page.getByRole('link', { name: /Home/i });

// テキストボックス
await page.getByRole('textbox', { name: /Email/i });

// 見出し
await page.getByRole('heading', { name: /Welcome/i });
```

#### 2. ラベルベースセレクタ

```typescript
await page.getByLabel('Email');
await page.getByLabel('Password');
```

#### 3. プレースホルダーベースセレクタ

```typescript
await page.getByPlaceholder('Enter your email');
```

#### 4. テキストベースセレクタ

```typescript
await page.getByText('Welcome to our site');
await page.getByText(/welcome/i); // 正規表現も使用可能
```

#### 5. テストIDセレクタ

```typescript
await page.getByTestId('submit-button');
```

#### 6. CSSセレクタ（最後の手段）

```typescript
await page.locator('.my-class');
await page.locator('#my-id');
```

### アクション

```typescript
// クリック
await page.getByRole('button').click();

// テキスト入力
await page.getByRole('textbox').fill('test@example.com');

// 選択
await page.getByRole('combobox').selectOption('option1');

// チェックボックス
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();

// ホバー
await page.getByRole('button').hover();

// ダブルクリック
await page.getByRole('button').dblclick();
```

### アサーション

```typescript
// 可視性
await expect(page.getByRole('button')).toBeVisible();
await expect(page.getByRole('button')).toBeHidden();

// テキスト
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByRole('heading')).toContainText('Wel');

// 値
await expect(page.getByRole('textbox')).toHaveValue('test');

// 属性
await expect(page.getByRole('link')).toHaveAttribute('href', '/about');

// カウント
await expect(page.getByRole('listitem')).toHaveCount(5);

// 有効/無効
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('button')).toBeDisabled();
```

### 待機

Playwrightは自動的に要素を待機しますが、必要に応じて明示的な待機も使用できます：

```typescript
// 要素が表示されるまで待機
await page.waitForSelector('.my-element');

// ネットワークがアイドル状態になるまで待機
await page.waitForLoadState('networkidle');

// ナビゲーションを待機
await page.waitForURL('**/success');

// カスタム条件を待機
await page.waitForFunction(() => window.myGlobalVar === true);

// タイムアウト
await page.waitForTimeout(1000); // 1秒待機（非推奨、他の方法を優先）
```

## テスト戦略

### ページオブジェクトパターン

ページオブジェクトパターンを使用して、テストコードを整理します。

```typescript
// e2e/shared/page-objects/url-encoder-page.ts
import { Page } from '@playwright/test';

export class UrlEncoderPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async fillInput(text: string) {
    await this.page.getByRole('textbox').first().fill(text);
  }

  async clickEncode() {
    await this.page.getByRole('button', { name: /エンコード/i }).click();
  }

  async getOutput() {
    return await this.page.getByRole('textbox').nth(1).inputValue();
  }
}

// テストで使用
import { UrlEncoderPage } from '../shared/page-objects/url-encoder-page';

test('should encode URL', async ({ page }) => {
  const urlEncoderPage = new UrlEncoderPage(page);
  await urlEncoderPage.goto();
  await urlEncoderPage.fillInput('hello world');
  await urlEncoderPage.clickEncode();
  const output = await urlEncoderPage.getOutput();
  expect(output).toBe('hello%20world');
});
```

### テストデータ管理

テストデータは、フィクスチャファイルで管理します。

```typescript
// e2e/shared/fixtures/test-data.ts
export const testData = {
  urls: {
    simple: 'https://example.com',
    withQuery: 'https://example.com?q=test',
    withSpaces: 'https://example.com/path with spaces',
  },
  encodedUrls: {
    simple: 'https%3A%2F%2Fexample.com',
    withQuery: 'https%3A%2F%2Fexample.com%3Fq%3Dtest',
    withSpaces: 'https%3A%2F%2Fexample.com%2Fpath%20with%20spaces',
  },
};

// テストで使用
import { testData } from '../shared/fixtures/test-data';

test('should encode URL', async ({ page }) => {
  // testData.urls.simpleを使用
});
```

## CI/CD統合

### GitHub Actions

`.github/workflows/e2e.yml`でGitHub ActionsによるE2Eテストの自動実行を設定できます。

```yaml
name: E2E Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm dlx playwright install --with-deps
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## ベストプラクティス

### 1. テストの独立性

各テストは独立して実行できるようにします。

```typescript
test.beforeEach(async ({ page }) => {
  // 各テストの前に初期状態にリセット
  await page.goto('/');
});
```

### 2. 明確なテスト名

テスト名は、何をテストしているのかが明確にわかるようにします。

```typescript
// ❌ 悪い例
test('test 1', async ({ page }) => { /* ... */ });

// ✅ 良い例
test('should encode URL with spaces correctly', async ({ page }) => { /* ... */ });
```

### 3. アサーションの明確化

アサーションは、何を検証しているのかが明確にわかるようにします。

```typescript
// ❌ 悪い例
expect(output).toBe('hello%20world');

// ✅ 良い例
expect(output).toBe('hello%20world'); // スペースが%20にエンコードされることを確認
```

### 4. 不安定なテストを避ける

タイムアウトやランダムな失敗を避けるため、自動待機を活用します。

```typescript
// ❌ 悪い例
await page.waitForTimeout(1000); // 固定時間の待機

// ✅ 良い例
await expect(page.getByRole('button')).toBeVisible(); // 要素が表示されるまで自動待機
```

### 5. スクリーンショットとトレース

失敗時のデバッグに役立つように、スクリーンショットとトレースを活用します。

```typescript
// playwright.config.tsで設定済み
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

## トラブルシューティング

### テストが失敗する

1. **UIモードで実行**: `pnpm test:e2e:ui`で各ステップを確認
2. **ヘッド付きモードで実行**: `pnpm test:e2e:headed`でブラウザの動作を確認
3. **デバッグモードで実行**: `pnpm test:e2e:debug`でステップバイステップで実行
4. **トレースを確認**: `pnpm test:e2e:report`でトレースを表示

### タイムアウトエラー

```typescript
// 個別のテストでタイムアウトを延長
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60秒
  // テストコード
});

// グローバルタイムアウトを変更（playwright.config.ts）
export default defineConfig({
  timeout: 30000, // 30秒
});
```

### 要素が見つからない

1. セレクタが正しいか確認
2. 要素が表示されるまで待機しているか確認
3. ページが正しく読み込まれているか確認
4. UIモードでロケーターを探索

### ブラウザが起動しない

```bash
# ブラウザを再インストール
pnpm dlx playwright install
```

## 参考リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [Playwrightベストプラクティス](https://playwright.dev/docs/best-practices)
- [Playwrightセレクタガイド](https://playwright.dev/docs/selectors)
- [Playwright API リファレンス](https://playwright.dev/docs/api/class-playwright)
