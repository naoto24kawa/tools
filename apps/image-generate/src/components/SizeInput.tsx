import { createNumberInputHandler } from '@utils/inputValidation';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Maximize2 } from 'lucide-react';

interface SizeInputProps {
  width: number;
  height: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export function SizeInput({ width, height, onWidthChange, onHeightChange }: SizeInputProps) {
  const handleWidthChange = createNumberInputHandler(onWidthChange, {
    min: 1,
    max: 10000,
  });

  const handleHeightChange = createNumberInputHandler(onHeightChange, {
    min: 1,
    max: 10000,
  });

  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex items-center gap-2">
        <Maximize2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">サイズ</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="width-input" className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />幅 (px)
          </Label>
          <Input
            id="width-input"
            type="number"
            min="1"
            max="10000"
            value={width}
            onChange={handleWidthChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height-input" className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
            高さ (px)
          </Label>
          <Input
            id="height-input"
            type="number"
            min="1"
            max="10000"
            value={height}
            onChange={handleHeightChange}
          />
        </div>
      </div>
    </div>
  );
}
