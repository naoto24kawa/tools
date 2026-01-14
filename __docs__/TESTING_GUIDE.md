# テスト実装ガイド

このドキュメントでは、Elchika Toolsプロジェクトでのテスト実装方法を説明します。

## 目次

1. [テスト戦略](#テスト戦略)
2. [単体テスト（bun test）](#単体テストbun-test)
3. [結合テスト（Playwright）](#結合テストplaywright)
4. [テストテンプレート](#テストテンプレート)
5. [カバレッジ目標](#カバレッジ目標)
6. [ベストプラクティス](#ベストプラクティス)

---

## テスト戦略

### 単体テスト vs 結合テスト

- **単体テスト（bun test）**: 個別の関数、コンポーネント、ユーティリティをテスト
- **結合テスト（Playwright）**: アプリケーション全体のE2Eフローをテスト

### カバレッジ目標

- **ユーティリティ関数**: 95%以上
- **カスタムフック**: 90%以上
- **コンポーネント**: 85%以上
- **全体**: 90%以上

---

## 単体テスト（bun test）

### セットアップ

プロジェクトルートに以下のファイルが設定済み：

- `bunfig.test.ts` - Bunのテスト設定
- `test-setup.ts` - グローバルセットアップ
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
import { describe, test, expect } from 'bun:test';
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
import { describe, test, expect } from 'bun:test';
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
      const mockFn = jest.fn();
      
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
import { describe, test, expect } from 'bun:test';
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
bun test

# ウォッチモードで実行
bun test --watch

# カバレッジを表示
bun test --coverage

# 特定のファイルのみ実行
bun test src/components/__tests__/MyComponent.test.tsx
```

---

## 結合テスト（Playwright）

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

#### 2. メイン機能のテスト

```typescript
import { test, expect } from '@playwright/test';

test.describe('My App - Main Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should process input correctly', async ({ page }) => {
    const input = page.getByRole('textbox');
    await input.fill('test input');
    
    const submitButton = page.getByRole('button', { name: /Submit/i });
    await submitButton.click();
    
    await expect(page.getByText('Success')).toBeVisible();
  });

  test('should handle edge cases', async ({ page }) => {
    const input = page.getByRole('textbox');
    await input.fill('');
    
    const submitButton = page.getByRole('button', { name: /Submit/i });
    await expect(submitButton).toBeDisabled();
  });
});
```

### テストの実行

```bash
# すべての結合テストを実行
bun run test:e2e

# UIモードで実行
bun run test:e2e:ui

# 特定のテストのみ実行
bun run test:e2e e2e/apps/my-app/basic.spec.ts
```

---

## テストテンプレート

### 単体テスト - コンポーネント

```typescript
import { describe, test, expect } from 'bun:test';
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

  describe('Props', () => {
    test('should handle props correctly', () => {
      render(<ComponentName prop="value" />);
      // アサーション
    });
  });

  describe('State', () => {
    test('should update state correctly', async () => {
      const user = userEvent.setup();
      render(<ComponentName />);
      // 状態変更とアサーション
    });
  });
});
```

### 単体テスト - ユーティリティ関数

```typescript
import { describe, test, expect } from 'bun:test';
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

    test('should handle null/undefined', () => {
      expect(functionName(null)).toBe(null);
      expect(functionName(undefined)).toBe(undefined);
    });
  });

  describe('Error Handling', () => {
    test('should throw error for invalid input', () => {
      expect(() => functionName(invalidInput)).toThrow();
    });
  });
});
```

### 結合テスト - アプリケーション

```typescript
import { test, expect } from '@playwright/test';

test.describe('App Name - Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform main action', async ({ page }) => {
    // アクション
    // アサーション
  });

  test('should handle error case', async ({ page }) => {
    // エラーケースのアクション
    // アサーション
  });

  test('should validate user flow', async ({ page }) => {
    // 複数ステップのフロー
    // アサーション
  });
});
```

---

## カバレッジ目標

### 測定方法

```bash
# カバレッジレポートを生成
bun test --coverage

# HTMLレポートを表示
open coverage/index.html
```

### 目標値

| カテゴリ | 目標カバレッジ |
|---------|--------------|
| ユーティリティ関数 | 95%以上 |
| カスタムフック | 90%以上 |
| コンポーネント | 85%以上 |
| 全体 | 90%以上 |

### カバレッジ向上のヒント

1. **エッジケースをテスト**: 空入力、null、undefined、極端な値
2. **エラーハンドリングをテスト**: try-catchブロック、エラー状態
3. **条件分岐をテスト**: if-else、switch、三項演算子
4. **非同期処理をテスト**: Promise、async/await、タイムアウト

---

## ベストプラクティス

### 1. テストの構造

- **AAA パターン**: Arrange（準備）、Act（実行）、Assert（検証）
- **1テスト1アサーション**: 可能な限り1つのテストで1つのことをテスト
- **明確なテスト名**: 何をテストしているのかが分かる名前を付ける

### 2. テストの独立性

- 各テストは独立して実行可能にする
- テスト間で状態を共有しない
- `beforeEach`/`afterEach`でクリーンアップ

### 3. モックの使用

- 外部依存（API、ファイルシステム）はモック
- 時間に依存する処理はモック
- ランダム性のある処理はモック

### 4. アサーションの選択

```typescript
// ✅ 良い例
expect(element).toBeInTheDocument();
expect(element).toHaveValue('expected');

// ❌ 悪い例
expect(element !== null).toBe(true);
expect(element.value === 'expected').toBe(true);
```

### 5. 非同期処理の待機

```typescript
// ✅ 良い例
await waitFor(() => {
  expect(element).toBeVisible();
});

// ❌ 悪い例
await new Promise(resolve => setTimeout(resolve, 1000));
```

---

## 実装チェックリスト

各アプリケーションで以下を実装：

### 単体テスト
- [ ] メインコンポーネントのテスト
- [ ] ユーティリティ関数のテスト
- [ ] カスタムフックのテスト
- [ ] UIコンポーネントのテスト

### 結合テスト
- [ ] 基本機能のテスト
- [ ] メイン機能のテスト
- [ ] エラーハンドリングのテスト
- [ ] ユーザーフローのテスト

### カバレッジ
- [ ] 90%以上達成
- [ ] 未カバー部分の特定
- [ ] 追加テストの実装

---

## 参考リンク

- [Bun Test Documentation](https://bun.sh/docs/cli/test)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
