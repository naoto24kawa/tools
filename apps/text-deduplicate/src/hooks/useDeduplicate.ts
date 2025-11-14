import { useMemo, useCallback } from 'react';
import type { DeduplicateSettings } from '@types';
import { deduplicateLines, getRemovedLineCount } from '@utils/deduplicate';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { DEFAULT_DEDUPLICATE_SETTINGS, STORAGE_KEYS } from '@config/constants';

/**
 * 重複行削除機能を提供するカスタムフック
 */
export function useDeduplicate() {
  const [text, setText] = useLocalStorage<string>(STORAGE_KEYS.TEXT, '');
  const [settings, setSettings] = useLocalStorage<DeduplicateSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_DEDUPLICATE_SETTINGS
  );

  // 重複行を削除したテキストを計算（メモ化）
  const deduplicatedText = useMemo(() => {
    return deduplicateLines(text, settings);
  }, [text, settings]);

  // 削除された行数を計算
  const removedLineCount = useMemo(() => {
    return getRemovedLineCount(text, deduplicatedText);
  }, [text, deduplicatedText]);

  // テキストをクリア
  const clearText = useCallback(() => {
    setText('');
  }, [setText]);

  // 設定をリセット
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_DEDUPLICATE_SETTINGS);
  }, [setSettings]);

  // 結果をコピー
  const copyResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(deduplicatedText);
      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }, [deduplicatedText]);

  return {
    text,
    setText,
    settings,
    setSettings,
    deduplicatedText,
    removedLineCount,
    clearText,
    resetSettings,
    copyResult,
  };
}

