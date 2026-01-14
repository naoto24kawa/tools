import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { COLOR_PRESETS } from '@config/constants';
import type { RgbColor } from '@types';
import { hexToRgb, rgbToHex } from '@utils/transparentImage';
import { Pipette } from 'lucide-react';

interface ColorPickerProps {
  color: RgbColor;
  isEyedropperMode: boolean;
  onColorChange: (color: RgbColor) => void;
  onToggleEyedropper: () => void;
}

export function ColorPicker({
  color,
  isEyedropperMode,
  onColorChange,
  onToggleEyedropper,
}: ColorPickerProps) {
  const hexColor = rgbToHex(color);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) {
      onColorChange(rgb);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) {
      onColorChange(rgb);
    }
  };

  return (
    <div className="space-y-4">
      <Label>透過にする色</Label>

      {/* カラー入力 */}
      <div className="flex gap-2">
        <Input
          type="color"
          value={hexColor}
          onChange={handleColorInputChange}
          className="h-10 w-16 cursor-pointer p-1"
          aria-label="色を選択"
        />
        <Input
          type="text"
          value={hexColor}
          onChange={handleHexChange}
          className="flex-1 font-mono"
          placeholder="#ffffff"
          aria-label="16進数カラーコード"
        />
        <Button
          variant={isEyedropperMode ? 'default' : 'outline'}
          size="icon"
          onClick={onToggleEyedropper}
          title="画像から色を取得"
          aria-label="スポイトツール"
          aria-pressed={isEyedropperMode}
        >
          <Pipette className="h-4 w-4" />
        </Button>
      </div>

      {/* RGB値表示 */}
      <div className="flex gap-2 text-sm text-muted-foreground">
        <span>R: {color.r}</span>
        <span>G: {color.g}</span>
        <span>B: {color.b}</span>
      </div>

      {/* プリセット */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">プリセット</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => onColorChange(preset.color)}
              className="gap-2"
            >
              <div
                className="h-4 w-4 rounded border"
                style={{ backgroundColor: rgbToHex(preset.color) }}
              />
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {isEyedropperMode && (
        <p className="text-sm text-primary">画像をクリックして色を取得してください</p>
      )}
    </div>
  );
}
