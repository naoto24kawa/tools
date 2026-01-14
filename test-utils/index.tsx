import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * カスタムレンダー関数
 * 必要に応じてプロバイダーをラップできる
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * テスト用のモック関数を作成
 */
export function createMockFn<T extends (...args: any[]) => any>(): jest.Mock<T> {
  return jest.fn() as jest.Mock<T>;
}

/**
 * 非同期処理を待機
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ローカルストレージのモック
 */
export const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

/**
 * クリップボードAPIのモック
 */
export const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
  readText: jest.fn().mockResolvedValue(''),
};

// グローバルにモックを設定
if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  if (global.window) {
    Object.defineProperty(global.window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  }

  Object.defineProperty(global.navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
    configurable: true,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
