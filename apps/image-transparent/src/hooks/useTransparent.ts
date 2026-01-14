import { DEFAULT_TARGET_COLOR, DEFAULT_TOLERANCE } from '@config/constants';
import type { RgbColor, TransparentSettings } from '@types';
import { useCallback, useState } from 'react';

const initialSettings: TransparentSettings = {
  targetColor: DEFAULT_TARGET_COLOR,
  tolerance: DEFAULT_TOLERANCE,
};

export function useTransparent() {
  const [settings, setSettings] = useState<TransparentSettings>(initialSettings);
  const [isEyedropperMode, setIsEyedropperMode] = useState(false);

  const setTargetColor = useCallback((color: RgbColor) => {
    setSettings((prev) => ({ ...prev, targetColor: color }));
  }, []);

  const setTolerance = useCallback((tolerance: number) => {
    setSettings((prev) => ({ ...prev, tolerance }));
  }, []);

  const toggleEyedropperMode = useCallback(() => {
    setIsEyedropperMode((prev) => !prev);
  }, []);

  const disableEyedropperMode = useCallback(() => {
    setIsEyedropperMode(false);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(initialSettings);
    setIsEyedropperMode(false);
  }, []);

  return {
    settings,
    isEyedropperMode,
    setTargetColor,
    setTolerance,
    toggleEyedropperMode,
    disableEyedropperMode,
    resetSettings,
  };
}
