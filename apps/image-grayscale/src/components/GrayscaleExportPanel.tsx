import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { EXPORT_FORMATS } from '@config/constants';
import type { ExportSettings } from '@hooks/useGrayscaleState';
import { canvasToBlob } from '@utils/grayscaleConverter';
import { Download } from 'lucide-react';
import { useState } from 'react';

interface GrayscaleExportPanelProps {
  canvas: HTMLCanvasElement | null;
  exportSettings: ExportSettings;
  onExportSettingsChange: (settings: Partial<ExportSettings>) => void;
}

export function GrayscaleExportPanel({
  canvas,
  exportSettings,
  onExportSettingsChange,
}: GrayscaleExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!canvas) {
      alert('エクスポートする画像がありません');
      return;
    }

    setIsExporting(true);

    try {
      // キャンバスからBlobを生成
      const blob = await canvasToBlob(canvas, exportSettings.format, exportSettings.quality / 100);

      // ダウンロード
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // 拡張子を取得
      const ext = exportSettings.format.split('/')[1];
      link.download = `${exportSettings.filename}.${ext}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('画像のエクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  const showQuality =
    exportSettings.format === 'image/jpeg' || exportSettings.format === 'image/webp';

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">エクスポート設定</h3>

        {/* ファイル名 */}
        <div className="space-y-2">
          <Label htmlFor="filename">ファイル名</Label>
          <Input
            id="filename"
            value={exportSettings.filename}
            onChange={(e) => onExportSettingsChange({ filename: e.target.value })}
            placeholder="grayscale-image"
          />
        </div>

        {/* フォーマット */}
        <div className="space-y-2">
          <Label htmlFor="format">フォーマット</Label>
          <Select
            value={exportSettings.format}
            onValueChange={(value) =>
              onExportSettingsChange({ format: value as ExportSettings['format'] })
            }
          >
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPORT_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 品質（JPEG/WebPのみ） */}
        {showQuality && (
          <div className="space-y-2">
            <Label htmlFor="quality">品質 ({exportSettings.quality}%)</Label>
            <Input
              id="quality"
              type="range"
              min={1}
              max={100}
              value={exportSettings.quality}
              onChange={(e) => onExportSettingsChange({ quality: Number(e.target.value) })}
            />
          </div>
        )}

        {/* エクスポートボタン */}
        <Button
          onClick={handleExport}
          disabled={!canvas || isExporting}
          className="w-full"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          {isExporting ? 'エクスポート中...' : 'ダウンロード'}
        </Button>

        {!canvas && <p className="text-sm text-muted-foreground">画像をアップロードしてください</p>}
      </div>
    </Card>
  );
}
