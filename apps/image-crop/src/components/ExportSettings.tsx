import type { ExportSettings as ExportSettingsType } from '@types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Settings, FileType, Sliders, File } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ExportSettingsProps {
  exportSettings: ExportSettingsType;
  onExportSettingsChange: (settings: ExportSettingsType) => void;
}

export function ExportSettings({ exportSettings, onExportSettingsChange }: ExportSettingsProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">エクスポート設定</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="format-select" className="flex items-center gap-1.5">
          <FileType className="h-3.5 w-3.5 text-muted-foreground" />
          フォーマット
        </Label>
        <Select
          value={exportSettings.format}
          onValueChange={(value) =>
            onExportSettingsChange({
              ...exportSettings,
              format: value as 'jpeg' | 'png' | 'webp',
            })
          }
        >
          <SelectTrigger id="format-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(exportSettings.format === 'jpeg' || exportSettings.format === 'webp') && (
        <div className="space-y-2">
          <Label htmlFor="quality-input" className="flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            品質: {Math.round(exportSettings.quality * 100)}%
          </Label>
          <input
            id="quality-input"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={exportSettings.quality}
            onChange={(e) =>
              onExportSettingsChange({
                ...exportSettings,
                quality: parseFloat(e.target.value),
              })
            }
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="filename-input" className="flex items-center gap-1.5">
          <File className="h-3.5 w-3.5 text-muted-foreground" />
          ファイル名
        </Label>
        <Input
          id="filename-input"
          type="text"
          value={exportSettings.filename}
          onChange={(e) =>
            onExportSettingsChange({
              ...exportSettings,
              filename: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
