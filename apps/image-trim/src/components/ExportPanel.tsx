import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import type { ExportSettings, TrimResult } from '@types';
import { downloadBlob } from '@utils/imageTrimmer';

interface ExportPanelProps {
  trimResult: TrimResult | null;
  exportSettings: ExportSettings;
  onExportSettingsChange: (updates: Partial<ExportSettings>) => void;
}

export function ExportPanel({
  trimResult,
  exportSettings,
  onExportSettingsChange,
}: ExportPanelProps) {
  const handleDownload = () => {
    if (!trimResult) return;
    downloadBlob(trimResult.blob, exportSettings.filename);
  };

  if (!trimResult) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="filename">ファイル名</Label>
        <Input
          id="filename"
          value={exportSettings.filename}
          onChange={(e) => onExportSettingsChange({ filename: e.target.value })}
        />
      </div>

      <Button className="w-full" onClick={handleDownload}>
        ダウンロード
      </Button>
    </div>
  );
}
