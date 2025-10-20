import type { ColorPreset } from '@types';
import { getColorCategoryLabel } from '@config/categoryLabels';
import { Input } from './ui/input';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  color: string;
  presets: readonly ColorPreset[];
  onColorChange: (color: string) => void;
}

export function ColorPicker({ label, color, presets, onColorChange }: ColorPickerProps) {
  const categories = [...new Set(presets.map((p) => p.category))];

  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-[60px_1fr] gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-md border border-input"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>

        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {getColorCategoryLabel(category)}
            </h4>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-2">
              {presets
                .filter((p) => p.category === category)
                .map((preset) => (
                  <button
                    key={preset.value}
                    className={`h-8 w-8 rounded-md border-2 transition-all hover:scale-110 ${
                      color.toUpperCase() === preset.value.toUpperCase()
                        ? 'border-primary scale-105'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: preset.value }}
                    onClick={() => onColorChange(preset.value)}
                    title={preset.label}
                    type="button"
                    aria-label={preset.label}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
