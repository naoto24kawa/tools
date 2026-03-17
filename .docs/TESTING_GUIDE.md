# テスト実装ガイド

このドキュメントでは、Elchika Toolsプロジェクトでのテスト実装方法を説明します。

## 目次

1. [テスト戦略](#テスト戦略)
2. [単体テスト(Vitest)](#単体テストvitest)
3. [結合テスト(Playwright)](#結合テストplaywright)
4. [テストテンプレート](#テストテンプレート)
5. [カバレッジ目標](#カバレッジ目標)
6. [ベストプラクティス](#ベストプラクティス)

---

## テスト戦略

### 単体テスト vs 結合テスト

- **単体テスト(Vitest)**: 個別の関数、コンポーネント、ユーティリティをテスト
- **結合テスト(Playwright)**: アプリケーション全体のE2Eフローをテスト

### カバレッジ目標

- **ユーティリティ関数**: 95%以上
- **カスタムフック**: 90%以上
- **コンポーネント**: 85%以上
- **全体**: 90%以上

---

## 単体テスト(Vitest)

### セットアップ

プロジェクトルートに以下のファイルが設定済み:

- `vite.config.ts` - ルートのVitest設定 (environment: happy-dom, setupFiles)
- `vitest-setup.ts` - グローバルセットアップ (jest-domマッチャー登録、cleanup)
- `test-utils/index.tsx` - 共通テストユーティリティ

### テストファイルの配置

```
src/
├── components/
│   ├── MyComponent.tsx
│   └── __tests__/
│       └── MyComponent.test.tsx
├── utils/
│   ├── helper.ts
│   └── __tests__/
│       └── helper.test.ts
└── hooks/
    ├── useCustomHook.ts
    └── __tests__/
        └── useCustomHook.test.ts
```

### 基本的なテストの書き方

#### 1. ユーティリティ関数のテスト

```typescript
import { describe, test, expect } from 'vitest';
import { myUtilFunction } from '../myUtil';

describe('myUtilFunction', () => {
  test('should return expected value for valid input', () => {
    const result = myUtilFunction('input');
    expect(result).toBe('expected output');
  });

  test('should handle edge cases', () => {
    expect(myUtilFunction('')).toBe('');
    expect(myUtilFunction(null)).toBe(null);
  });

  test('should throw error for invalid input', () => {
    expect(() => myUtilFunction(undefined)).toThrow();
  });
});
```

#### 2. Reactコンポーネントのテスト

```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  describe('Rendering', () => {
    test('should render with default props', () => {
      render(<MyComponent />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });

    test('should render with custom props', () => {
      render(<MyComponent title="Custom Title" />);
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('should handle button click', async () => {
      const user = userEvent.setup();
      const mockFn = vi.fn();

      render(<MyComponent onClick={mockFn} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should update state on input change', async () => {
      const user = userEvent.setup();
      render(<MyComponent />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test input');

      expect(input).toHaveValue('test input');
    });
  });
});
```

#### 3. カスタムフックのテスト

```typescript
import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.value).toBe('default');
  });

  test('should update value when action is called', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.setValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });
});
```

### テストの実行

```bash
# すべての単体テストを実行
vp test

# ウォッチモードで実行
vp test --watch

# カバレッジを表示
vp test --coverage

# 特定のファイルのみ実行
vp test src/components/__tests__/MyComponent.test.tsx
```

---

## 結合テスト(Playwright)

### テストファイルの配置

```
e2e/
├── apps/
│   ├── my-app/
│   │   ├── basic.spec.ts
│   │   ├── main-feature.spec.ts
│   │   └── error-handling.spec.ts
│   └── ...
└── shared/
    ├── helpers/
    └── page-objects/
```

### 基本的なテストの書き方

#### 1. 基本機能のテスト

```typescript
import { test, expect } from '@playwright/test';

test.describe('My App - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/My App/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /My App/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Submit/i })).toBeVisible();
  });
});
```

### テストの実行

```bash
# すべての結合テストを実行
pnpm test:e2e

# UIモードで実行
pnpm test:e2e:ui

# 特定のテストのみ実行
pnpm test:e2e e2e/apps/my-app/basic.spec.ts
```

---

## テストテンプレート

### 単体テスト - コンポーネント

```typescript
import { describe, test, expect } from 'vitest';
import { render, screen } from '../../../test-utils';
import userEvent from '@testing-library/user-event';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    test('should render correctly', () => {
      render(<ComponentName />);
      // アサーション
    });
  });

  describe('User Interactions', () => {
    test('should handle user action', async () => {
      const user = userEvent.setup();
      render(<ComponentName />);
      // インタラクションとアサーション
    });
  });
});
```

### 単体テスト - ユーティリティ関数

```typescript
import { describe, test, expect } from 'vitest';
import { functionName } from '../utils';

describe('functionName', () => {
  describe('Valid Input', () => {
    test('should return expected value', () => {
      expect(functionName('input')).toBe('output');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty input', () => {
      expect(functionName('')).toBe('');
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid input', () => {
      expect(() => functionName(invalidInput)).toThrow();
    });
  });
});
```

---

## カバレッジ目標

### 測定方法

```bash
# カバレッジレポートを生成
vp test --coverage
```

### 目標値

| カテゴリ | 目標カバレッジ |
|---------|--------------|
| ユーティリティ関数 | 95%以上 |
| カスタムフック | 90%以上 |
| コンポーネント | 85%以上 |
| 全体 | 90%以上 |

---

## ベストプラクティス

### 1. テストの構造

- **AAA パターン**: Arrange(準備)、Act(実行)、Assert(検証)
- **1テスト1アサーション**: 可能な限り1つのテストで1つのことをテスト
- **明確なテスト名**: 何をテストしているのかが分かる名前を付ける

### 2. テストの独立性

- 各テストは独立して実行可能にする
- テスト間で状態を共有しない
- `beforeEach`/`afterEach`でクリーンアップ

### 3. モックの使用

- 外部依存(API、ファイルシステム)はモック
- `vi.fn()` でモック関数を作成
- `vi.spyOn()` で既存関数をスパイ

### 4. アサーションの選択

```typescript
// Good
expect(element).toBeInTheDocument();
expect(element).toHaveValue('expected');

// Bad
expect(element !== null).toBe(true);
expect(element.value === 'expected').toBe(true);
```

### 5. 非同期処理の待機

```typescript
// Good
await waitFor(() => {
  expect(element).toBeVisible();
});

// Bad
await new Promise(resolve => setTimeout(resolve, 1000));
```

---

## 参考リンク

- [Vitest Documentation](https://vitest.dev/)
- [Vite+ Documentation](https://viteplus.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
