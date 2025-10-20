import type { ImageGeneratorSettings } from '@types';
import { createNumberInputHandler } from '@utils/inputValidation';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, File, FileType, Sliders } from 'lucide-react';

interface ExportSettingsProps {
  /** 画像生成設定 */
  settings: ImageGeneratorSettings;
  /** フォーマット変更ハンドラー */
  onFormatChange: (format: 'png' | 'jpeg') => void;
  /** 品質変更ハンドラー */
  onQualityChange: (quality: number) => void;
  /** ファイル名変更ハンドラー */
  onFilenameChange: (filename: string) => void;
  /** ダウンロードボタンクリックハンドラー */
  onDownload: () => void;
}

/**
 * エクスポート設定のUIコンポーネント
 *
 * ファイル名、フォーマット、JPEG品質の設定と
 * ダウンロードボタンを提供します。
 */
export function ExportSettings({
  settings,
  onFormatChange,
  onQualityChange,
  onFilenameChange,
  onDownload,
}: ExportSettingsProps) {
  const handleQualityChange = createNumberInputHandler(onQualityChange, {
    min: 1,
    max: 100,
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="filename-input" className="flex items-center gap-1.5">
          <File className="h-3.5 w-3.5 text-muted-foreground" />
          ファイル名
        </Label>
        <Input
          id="filename-input"
          type="text"
          value={settings.filename}
          onChange={(e) => onFilenameChange(e.target.value)}
          placeholder="generated-image"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="format-select" className="flex items-center gap-1.5">
          <FileType className="h-3.5 w-3.5 text-muted-foreground" />
          フォーマット
        </Label>
        <Select
          value={settings.format}
          onValueChange={(value) => onFormatChange(value as 'png' | 'jpeg')}
        >
          <SelectTrigger id="format-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.format === 'jpeg' && (
        <div className="space-y-2">
          <Label htmlFor="quality-input" className="flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
            品質 ({settings.quality}%)
          </Label>
          <input
            id="quality-input"
            type="range"
            min="1"
            max="100"
            value={settings.quality}
            onChange={handleQualityChange}
            className="w-full"
          />
        </div>
      )}

      <Button onClick={onDownload} type="button" className="w-full" size="lg">
        <Download className="mr-2 h-4 w-4" />
        ダウンロード
      </Button>
    </div>
  );
}
