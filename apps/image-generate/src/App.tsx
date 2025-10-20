import { ASPECT_RATIOS, SIZE_PRESETS, COLOR_PRESETS } from '@config/presets';
import { SizeInput } from '@components/SizeInput';
import { AspectRatioSelector } from '@components/AspectRatioSelector';
import { PresetSelector } from '@components/PresetSelector';
import { ColorPicker } from '@components/ColorPicker';
import { PatternSelector } from '@components/PatternSelector';
import { TextInput } from '@components/TextInput';
import { ExportPanel } from '@components/ExportPanel';
import { Card } from '@components/ui/card';
import { useImageSettings } from '@hooks/useImageSettings';

export function App() {
  const { settings, handlers } = useImageSettings();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">🎨 Image Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">テスト用画像を簡単生成</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          <Card className="h-fit max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
            <div className="space-y-6">
              <SizeInput
                width={settings.width}
                height={settings.height}
                onWidthChange={handlers.handleWidthChange}
                onHeightChange={handlers.handleHeightChange}
              />

              <AspectRatioSelector
                aspectRatios={ASPECT_RATIOS}
                selectedAspectRatio={settings.aspectRatio}
                onAspectRatioChange={handlers.handleAspectRatioChange}
              />

              <PresetSelector presets={SIZE_PRESETS} onPresetSelect={handlers.handlePresetSelect} />

              <ColorPicker
                label="背景色"
                color={settings.backgroundColor}
                presets={COLOR_PRESETS}
                onColorChange={handlers.handleBackgroundColorChange}
              />

              <PatternSelector
                pattern={settings.pattern}
                onPatternChange={handlers.handlePatternChange}
              />

              <ColorPicker
                label="テキスト色"
                color={settings.textColor}
                presets={COLOR_PRESETS}
                onColorChange={handlers.handleTextColorChange}
              />

              <TextInput
                text={settings.text}
                fontSize={settings.fontSize}
                textAlignment={settings.textAlignment}
                textVerticalAlignment={settings.textVerticalAlignment}
                onTextChange={handlers.handleTextChange}
                onFontSizeChange={handlers.handleFontSizeChange}
                onTextAlignmentChange={handlers.handleTextAlignmentChange}
                onTextVerticalAlignmentChange={handlers.handleTextVerticalAlignmentChange}
              />
            </div>
          </Card>

          <Card className="p-6">
            <ExportPanel
              settings={settings}
              onFormatChange={handlers.handleFormatChange}
              onQualityChange={handlers.handleQualityChange}
              onFilenameChange={handlers.handleFilenameChange}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
