import type { AspectRatioOption } from '@types';
import { Button } from './ui/button';
import { Crop } from 'lucide-react';

interface AspectRatioSelectorProps {
  aspectRatios: readonly AspectRatioOption[];
  selectedAspectRatio: number | null;
  onAspectRatioChange: (ratio: number | null) => void;
}

export function AspectRatioSelector({
  aspectRatios,
  selectedAspectRatio,
  onAspectRatioChange,
}: AspectRatioSelectorProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex items-center gap-2">
        <Crop className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">アスペクト比</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {aspectRatios.map((option) => (
          <Button
            key={option.label}
            variant={selectedAspectRatio === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAspectRatioChange(option.value)}
            type="button"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
