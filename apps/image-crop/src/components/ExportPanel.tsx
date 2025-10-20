import { useRef, useState, useMemo } from 'react';
import type { ExportSettings, PixelCrop, PreviewInfo, AspectRatioOption } from '@types';
import { ImageExporter } from '@services/ImageExporter';
import { useToast } from '@hooks/useToast';
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
  const { toast } = useToast();

  // ImageExporterインスタンスをメモ化（再レンダリングごとに再作成しない）
  const exporter = useMemo(() => new ImageExporter(), []);

  const handleExport = async () => {
    if (!imgRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await exporter.exportImage(imgRef.current, crop, exportSettings);

      if (result.success) {
        toast({
          title: '成功',
          description: '画像を保存しました',
          variant: 'success',
        });
      } else {
        toast({
          title: 'エラー',
          description: result.error || 'エクスポートに失敗しました',
          variant: 'destructive',
        });
      }
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
