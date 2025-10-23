import { useState } from 'react';
import type {
  ImageGeneratorSettings,
  SizePreset,
  PatternType,
  TextAlignment,
  TextVerticalAlignment,
} from '@types';
import { DEFAULT_SETTINGS } from '@config/presets';

/**
 * 画像設定の変更ハンドラー群
 */
export interface ImageSettingsHandlers {
  /** 幅を変更（アスペクト比を考慮） */
  handleWidthChange: (width: number) => void;
  /** 高さを変更（アスペクト比を考慮） */
  handleHeightChange: (height: number) => void;
  /** アスペクト比を変更 */
  handleAspectRatioChange: (ratio: number | null) => void;
  /** サイズプリセットを選択 */
  handlePresetSelect: (preset: SizePreset) => void;
  /** 背景色を変更 */
  handleBackgroundColorChange: (color: string) => void;
  /** 背景パターンを変更 */
  handlePatternChange: (pattern: PatternType) => void;
  /** テキスト色を変更 */
  handleTextColorChange: (color: string) => void;
  /** テキスト内容を変更 */
  handleTextChange: (text: string) => void;
  /** フォントサイズを変更 */
  handleFontSizeChange: (fontSize: number) => void;
  /** テキスト水平配置を変更 */
  handleTextAlignmentChange: (alignment: TextAlignment) => void;
  /** テキスト垂直配置を変更 */
  handleTextVerticalAlignmentChange: (alignment: TextVerticalAlignment) => void;
  /** エクスポート形式を変更 */
  handleFormatChange: (format: 'png' | 'jpeg') => void;
  /** JPEG品質を変更 */
  handleQualityChange: (quality: number) => void;
  /** ファイルサイズ制御モードを変更 */
  handleFileSizeModeChange: (mode: 'none' | 'minimum' | 'maximum') => void;
  /** ターゲットファイルサイズを変更 */
  handleTargetFileSizeChange: (size: number) => void;
  /** ファイル名を変更 */
  handleFilenameChange: (filename: string) => void;
}

/**
 * 画像設定の状態管理とハンドラーを提供するカスタムフック
 *
 * @returns settings - 現在の画像設定
 * @returns handlers - 設定を変更するハンドラー群
 *
 * @example
 * ```tsx
 * function App() {
 *   const { settings, handlers } = useImageSettings();
 *
 *   return (
 *     <SizeInput
 *       width={settings.width}
 *       height={settings.height}
 *       onWidthChange={handlers.handleWidthChange}
 *       onHeightChange={handlers.handleHeightChange}
 *     />
 *   );
 * }
 * ```
 */
export function useImageSettings() {
  const [settings, setSettings] = useState<ImageGeneratorSettings>(DEFAULT_SETTINGS);

  // ========================================
  // サイズ関連ハンドラー
  // ========================================

  /**
   * 幅を変更（アスペクト比が設定されている場合は高さも自動調整）
   */
  const handleWidthChange = (width: number) => {
    setSettings((prev) => {
      if (prev.aspectRatio === null) {
        return { ...prev, width };
      }
      return {
        ...prev,
        width,
        height: Math.round(width / prev.aspectRatio),
      };
    });
  };

  /**
   * 高さを変更（アスペクト比が設定されている場合は幅も自動調整）
   */
  const handleHeightChange = (height: number) => {
    setSettings((prev) => {
      if (prev.aspectRatio === null) {
        return { ...prev, height };
      }
      return {
        ...prev,
        height,
        width: Math.round(height * prev.aspectRatio),
      };
    });
  };

  /**
   * アスペクト比を変更（設定時は現在の幅を基準に高さを調整）
   */
  const handleAspectRatioChange = (ratio: number | null) => {
    setSettings((prev) => {
      if (ratio === null) {
        return { ...prev, aspectRatio: null };
      }
      return {
        ...prev,
        aspectRatio: ratio,
        height: Math.round(prev.width / ratio),
      };
    });
  };

  /**
   * サイズプリセットを選択（幅、高さ、アスペクト比を一括設定）
   */
  const handlePresetSelect = (preset: SizePreset) => {
    setSettings((prev) => ({
      ...prev,
      width: preset.width,
      height: preset.height,
      aspectRatio: preset.width / preset.height,
    }));
  };

  // ========================================
  // 背景関連ハンドラー
  // ========================================

  const handleBackgroundColorChange = (color: string) => {
    setSettings((prev) => ({ ...prev, backgroundColor: color }));
  };

  const handlePatternChange = (pattern: PatternType) => {
    setSettings((prev) => ({ ...prev, pattern }));
  };

  // ========================================
  // テキスト関連ハンドラー
  // ========================================

  const handleTextColorChange = (color: string) => {
    setSettings((prev) => ({ ...prev, textColor: color }));
  };

  const handleTextChange = (text: string) => {
    setSettings((prev) => ({ ...prev, text }));
  };

  const handleFontSizeChange = (fontSize: number) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const handleTextAlignmentChange = (textAlignment: TextAlignment) => {
    setSettings((prev) => ({ ...prev, textAlignment }));
  };

  const handleTextVerticalAlignmentChange = (textVerticalAlignment: TextVerticalAlignment) => {
    setSettings((prev) => ({ ...prev, textVerticalAlignment }));
  };

  // ========================================
  // エクスポート関連ハンドラー
  // ========================================

  const handleFormatChange = (format: 'png' | 'jpeg') => {
    setSettings((prev) => ({ ...prev, format }));
  };

  const handleQualityChange = (quality: number) => {
    setSettings((prev) => ({ ...prev, quality }));
  };

  const handleFileSizeModeChange = (fileSizeMode: 'none' | 'minimum' | 'maximum') => {
    setSettings((prev) => ({ ...prev, fileSizeMode }));
  };

  const handleTargetFileSizeChange = (targetFileSize: number) => {
    setSettings((prev) => ({ ...prev, targetFileSize }));
  };

  const handleFilenameChange = (filename: string) => {
    setSettings((prev) => ({ ...prev, filename }));
  };

  // ========================================
  // 返り値
  // ========================================

  const handlers: ImageSettingsHandlers = {
    handleWidthChange,
    handleHeightChange,
    handleAspectRatioChange,
    handlePresetSelect,
    handleBackgroundColorChange,
    handlePatternChange,
    handleTextColorChange,
    handleTextChange,
    handleFontSizeChange,
    handleTextAlignmentChange,
    handleTextVerticalAlignmentChange,
    handleFormatChange,
    handleQualityChange,
    handleFileSizeModeChange,
    handleTargetFileSizeChange,
    handleFilenameChange,
  };

  return {
    settings,
    handlers,
  };
}
