import type { ImageGeneratorSettings } from '@types';
import { generateCanvas, downloadCanvas } from '@utils/canvasGenerator';
import { PreviewCanvas } from './PreviewCanvas';
import { ExportSettings } from './ExportSettings';
import { Eye } from 'lucide-react';

interface ExportPanelProps {
  /** 画像生成設定 */
  settings: ImageGeneratorSettings;
  /** フォーマット変更ハンドラー */
  onFormatChange: (format: 'png' | 'jpeg') => void;
  /** 品質変更ハンドラー */
  onQualityChange: (quality: number) => void;
  /** ファイル名変更ハンドラー */
  onFilenameChange: (filename: string) => void;
}

/**
 * プレビューとエクスポート機能を提供するパネルコンポーネント
 *
 * PreviewCanvas と ExportSettings を組み合わせて、
 * 画像のプレビュー表示とエクスポート機能を提供します。
 */
export function ExportPanel({
  settings,
  onFormatChange,
  onQualityChange,
  onFilenameChange,
}: ExportPanelProps) {
  const handleDownload = () => {
    const canvas = generateCanvas(settings);
    downloadCanvas(canvas, settings.filename, settings.format, settings.quality);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">プレビュー・エクスポート</h2>
      </div>

      <PreviewCanvas settings={settings} />

      <ExportSettings
        settings={settings}
        onFormatChange={onFormatChange}
        onQualityChange={onQualityChange}
        onFilenameChange={onFilenameChange}
        onDownload={handleDownload}
      />
    </div>
  );
}
