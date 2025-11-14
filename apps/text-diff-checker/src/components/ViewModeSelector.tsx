import type { ViewMode } from '@types';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { VIEW_MODES } from '@config/constants';

interface ViewModeSelectorProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeSelector({ value, onChange }: ViewModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="view-mode">表示モード</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="view-mode">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VIEW_MODES.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              {mode.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
