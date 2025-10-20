import type { Crop } from '@types';
import { updateCropField, convertCropUnit } from '@utils/cropAdjuster';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Move, Maximize2, Ruler } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CropInputProps {
  crop: Crop;
  imageSize: { width: number; height: number };
  onCropChange: (crop: Crop) => void;
  onManualChange?: (crop: Crop) => void;
  selectedAspectRatio: number | undefined;
}

export function CropInput({
  crop,
  imageSize,
  onCropChange,
  onManualChange,
  selectedAspectRatio,
}: CropInputProps) {
  const handleChange = (field: keyof Crop, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCrop = updateCropField(crop, field, numValue, selectedAspectRatio);
    onCropChange(newCrop);
    // 手動変更を通知
    onManualChange?.(newCrop);
  };

  const handleUnitChange = (unit: 'px' | '%') => {
    const newCrop = convertCropUnit(crop, unit, imageSize);
    onCropChange(newCrop);
    // 手動変更を通知
    onManualChange?.(newCrop);
  };

  return (
    <div className="space-y-6 border-b pb-6">
      <div className="flex items-center gap-2">
        <Move className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">座標・サイズ調整</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="crop-x" className="flex items-center gap-1.5">
            <Move className="h-3.5 w-3.5 text-muted-foreground" />
            X座標
          </Label>
          <Input
            id="crop-x"
            type="number"
            value={Math.round(crop.x)}
            onChange={(e) => handleChange('x', e.target.value)}
            min="0"
            step="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crop-y" className="flex items-center gap-1.5">
            <Move className="h-3.5 w-3.5 text-muted-foreground" />
            Y座標
          </Label>
          <Input
            id="crop-y"
            type="number"
            value={Math.round(crop.y)}
            onChange={(e) => handleChange('y', e.target.value)}
            min="0"
            step="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="crop-width" className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />幅
          </Label>
          <Input
            id="crop-width"
            type="number"
            value={Math.round(crop.width)}
            onChange={(e) => handleChange('width', e.target.value)}
            min="1"
            step="1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crop-height" className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
            高さ
          </Label>
          <Input
            id="crop-height"
            type="number"
            value={Math.round(crop.height)}
            onChange={(e) => handleChange('height', e.target.value)}
            min="1"
            step="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit-select" className="flex items-center gap-1.5">
          <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
          単位
        </Label>
        <Select value={crop.unit} onValueChange={(value) => handleUnitChange(value as 'px' | '%')}>
          <SelectTrigger id="unit-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="px">ピクセル (px)</SelectItem>
            <SelectItem value="%">パーセント (%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
