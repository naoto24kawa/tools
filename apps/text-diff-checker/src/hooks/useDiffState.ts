import { useState, useMemo, useCallback } from 'react';
import type { ViewMode, Language, IgnoreOptions, DiffResult } from '@types';
import { DEFAULT_SETTINGS } from '@config/constants';
import { calculateDiff } from '@utils/diffCalculator';
import { useDebounce } from './useDebounce';
import { useLocalStorage } from './useLocalStorage';

/**
 * 差分チェッカーのメイン状態管理フック
 */
export function useDiffState() {
  // テキスト状態
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');

  // 設定（ローカルストレージに保存）
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'diff-view-mode',
    DEFAULT_SETTINGS.viewMode
  );
  const [language, setLanguage] = useLocalStorage<Language>(
    'diff-language',
    DEFAULT_SETTINGS.language
  );
  const [ignoreOptions, setIgnoreOptions] = useLocalStorage<IgnoreOptions>(
    'diff-ignore-options',
    DEFAULT_SETTINGS.ignoreOptions
  );

  // デバウンスされたテキスト
  const debouncedOriginalText = useDebounce(originalText, 300);
  const debouncedModifiedText = useDebounce(modifiedText, 300);

  // 差分計算
  const diffResult = useMemo<DiffResult | null>(() => {
    if (!debouncedOriginalText && !debouncedModifiedText) {
      return null;
    }

    try {
      return calculateDiff(debouncedOriginalText, debouncedModifiedText, ignoreOptions);
    } catch (error) {
      console.error('Diff calculation error:', error);
      return null;
    }
  }, [debouncedOriginalText, debouncedModifiedText, ignoreOptions]);

  // 無視オプションの更新
  const updateIgnoreOptions = useCallback(
    (updates: Partial<IgnoreOptions>) => {
      setIgnoreOptions((prev) => ({ ...prev, ...updates }));
    },
    [setIgnoreOptions]
  );

  // すべてクリア
  const clearAll = useCallback(() => {
    setOriginalText('');
    setModifiedText('');
  }, []);

  return {
    originalText,
    modifiedText,
    viewMode,
    language,
    ignoreOptions,
    diffResult,
    setOriginalText,
    setModifiedText,
    setViewMode,
    setLanguage,
    updateIgnoreOptions,
    clearAll,
  };
}
