import { Label } from '@components/ui/label';
import { Slider } from '@components/ui/slider';
import { MAX_TOLERANCE, MIN_TOLERANCE } from '@config/constants';

interface ToleranceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function ToleranceSlider({ value, onChange }: ToleranceSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="tolerance">許容範囲</Label>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <Slider
        id="tolerance"
        value={[value]}
        onValueChange={(values) => {
          const newValue = values[0];
          if (newValue !== undefined) {
            onChange(newValue);
          }
        }}
        min={MIN_TOLERANCE}
        max={MAX_TOLERANCE}
        step={1}
        aria-label="許容範囲"
      />
      <p className="text-xs text-muted-foreground">
        値が大きいほど、似た色も透過になります（0=完全一致のみ、255=全ての色）
      </p>
    </div>
  );
}
