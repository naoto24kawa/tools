import { useState } from 'react';
import type { ImageGeneratorSettings, SizePreset } from '@types';
import { ASPECT_RATIOS, SIZE_PRESETS, COLOR_PRESETS, DEFAULT_SETTINGS } from '@config/presets';
import { SizeInput } from '@components/SizeInput';
import { AspectRatioSelector } from '@components/AspectRatioSelector';
import { PresetSelector } from '@components/PresetSelector';
import { ColorPicker } from '@components/ColorPicker';
import { PatternSelector } from '@components/PatternSelector';
import { TextInput } from '@components/TextInput';
import { ExportPanel } from '@components/ExportPanel';

export function App() {
  const [settings, setSettings] = useState<ImageGeneratorSettings>(DEFAULT_SETTINGS);

  // サイズ変更（アスペクト比を考慮）
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

  // アスペクト比変更
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

  // プリセット選択
  const handlePresetSelect = (preset: SizePreset) => {
    setSettings((prev) => ({
      ...prev,
      width: preset.width,
      height: preset.height,
      aspectRatio: preset.width / preset.height,
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ marginBottom: '0.5rem' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Tools トップに戻る
          </a>
        </div>
        <h1>🎨 Image Generator</h1>
        <p>テスト用画像を簡単生成</p>
      </header>

      <div className="app-container">
        <aside className="controls-panel">
          <SizeInput
            width={settings.width}
            height={settings.height}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
          />

          <AspectRatioSelector
            aspectRatios={ASPECT_RATIOS}
            selectedAspectRatio={settings.aspectRatio}
            onAspectRatioChange={handleAspectRatioChange}
          />

          <PresetSelector presets={SIZE_PRESETS} onPresetSelect={handlePresetSelect} />

          <ColorPicker
            label="背景色"
            color={settings.backgroundColor}
            presets={COLOR_PRESETS}
            onColorChange={(color) => setSettings((prev) => ({ ...prev, backgroundColor: color }))}
          />

          <PatternSelector
            pattern={settings.pattern}
            onPatternChange={(pattern) => setSettings((prev) => ({ ...prev, pattern }))}
          />

          <ColorPicker
            label="テキスト色"
            color={settings.textColor}
            presets={COLOR_PRESETS}
            onColorChange={(color) => setSettings((prev) => ({ ...prev, textColor: color }))}
          />

          <TextInput
            text={settings.text}
            fontSize={settings.fontSize}
            textAlignment={settings.textAlignment}
            textVerticalAlignment={settings.textVerticalAlignment}
            onTextChange={(text) => setSettings((prev) => ({ ...prev, text }))}
            onFontSizeChange={(fontSize) => setSettings((prev) => ({ ...prev, fontSize }))}
            onTextAlignmentChange={(textAlignment) =>
              setSettings((prev) => ({ ...prev, textAlignment }))
            }
            onTextVerticalAlignmentChange={(textVerticalAlignment) =>
              setSettings((prev) => ({ ...prev, textVerticalAlignment }))
            }
          />
        </aside>

        <main className="preview-panel">
          <ExportPanel
            settings={settings}
            onFormatChange={(format) => setSettings((prev) => ({ ...prev, format }))}
            onQualityChange={(quality) => setSettings((prev) => ({ ...prev, quality }))}
            onFilenameChange={(filename) => setSettings((prev) => ({ ...prev, filename }))}
          />
        </main>
      </div>
    </div>
  );
}
