import { useMemo, useCallback } from 'react';
import type { CountSettings } from '@types';
import { analyzeText } from '@utils/textAnalysis';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { DEFAULT_COUNT_SETTINGS, STORAGE_KEYS } from '@config/constants';

/**
 * テキストカウンター機能を提供するカスタムフック
 */
export function useTextCounter() {
  const [text, setText] = useLocalStorage<string>(STORAGE_KEYS.TEXT, '');
  const [settings, setSettings] = useLocalStorage<CountSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_COUNT_SETTINGS
  );

  // テキスト統計を計算（メモ化）
  const stats = useMemo(() => {
    return analyzeText(text, settings);
  }, [text, settings]);

  // テキストをクリア
  const clearText = useCallback(() => {
    setText('');
  }, [setText]);

  // 設定をリセット
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_COUNT_SETTINGS);
  }, [setSettings]);

  return {
    text,
    setText,
    settings,
    setSettings,
    stats,
    clearText,
    resetSettings,
  };
}
