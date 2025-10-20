import type { SizePreset } from '@types';
import { getSizeCategoryLabel } from '@config/categoryLabels';
import { Button } from './ui/button';

interface PresetSelectorProps {
  presets: readonly SizePreset[];
  onPresetSelect: (preset: SizePreset) => void;
}

export function PresetSelector({ presets, onPresetSelect }: PresetSelectorProps) {
  const categories = [...new Set(presets.map((p) => p.category))];

  return (
    <div className="space-y-4 border-b pb-6">
      <h3 className="text-lg font-semibold">サイズプリセット</h3>
      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {getSizeCategoryLabel(category)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {presets
              .filter((p) => p.category === category)
              .map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => onPresetSelect(preset)}
                  type="button"
                >
                  {preset.label}
                </Button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
