import { useRef, useState } from 'react';
import type { ExportSettings, PixelCrop, PreviewInfo, AspectRatioOption } from '@types';
import { getCroppedImg } from '@utils/cropCalculator';
import { AspectRatioSelector } from './AspectRatioSelector';
import { ExportSettings as ExportSettingsComponent } from './ExportSettings';
import { PreviewInfo as PreviewInfoComponent } from './PreviewInfo';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ExportPanelProps {
  imageSrc: string;
  crop: PixelCrop;
  exportSettings: ExportSettings;
  onExportSettingsChange: (settings: ExportSettings) => void;
  previewInfo: PreviewInfo;
  aspectRatios: readonly AspectRatioOption[];
  selectedAspectRatio: number | undefined;
  onAspectRatioChange: (ratio: number | null) => void;
}

export function ExportPanel({
  imageSrc,
  crop,
  exportSettings,
  onExportSettingsChange,
  previewInfo,
  aspectRatios,
  selectedAspectRatio,
  onAspectRatioChange,
}: ExportPanelProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    if (!imgRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(
        imgRef.current,
        crop,
        exportSettings.format,
        exportSettings.quality
      );

      if (!blob) {
        alert('画像の処理に失敗しました');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportSettings.filename || `cropped-${Date.now()}.${exportSettings.format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('エクスポートに失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <img ref={imgRef} src={imageSrc} alt="" className="hidden" />

      <AspectRatioSelector
        aspectRatios={aspectRatios}
        selectedAspectRatio={selectedAspectRatio}
        onAspectRatioChange={onAspectRatioChange}
      />

      <ExportSettingsComponent
        exportSettings={exportSettings}
        onExportSettingsChange={onExportSettingsChange}
      />

      <PreviewInfoComponent previewInfo={previewInfo} />

      <Button
        onClick={handleExport}
        disabled={isProcessing || !crop.width || !crop.height}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            エクスポート中...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            ダウンロード
          </>
        )}
      </Button>
    </div>
  );
}
