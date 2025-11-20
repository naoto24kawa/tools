import { DEFAULT_EXPORT_SETTINGS, DEFAULT_RESIZE_SETTINGS } from '@config/constants';
import type { ExportSettings, ResizeSettings } from '@types';
import { useCallback, useState } from 'react';

/**
 * リサイズ設定管理専用フック
 * 責任: ResizeSettingsとExportSettingsの状態管理
 */
export function useResizeSettings() {
  const [resizeSettings, setResizeSettings] = useState<ResizeSettings>(DEFAULT_RESIZE_SETTINGS);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(DEFAULT_EXPORT_SETTINGS);

  const updateResizeSettings = useCallback((updates: Partial<ResizeSettings>) => {
    setResizeSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateExportSettings = useCallback((updates: Partial<ExportSettings>) => {
    setExportSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setResizeSettings(DEFAULT_RESIZE_SETTINGS);
    setExportSettings(DEFAULT_EXPORT_SETTINGS);
  }, []);

  return {
    resizeSettings,
    exportSettings,
    setResizeSettings,
    setExportSettings,
    updateResizeSettings,
    updateExportSettings,
    resetSettings,
  };
}
