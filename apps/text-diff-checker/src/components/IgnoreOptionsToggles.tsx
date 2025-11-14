import type { IgnoreOptions } from '@types';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';

interface IgnoreOptionsTogglesProps {
  options: IgnoreOptions;
  onChange: (options: Partial<IgnoreOptions>) => void;
}

export function IgnoreOptionsToggles({ options, onChange }: IgnoreOptionsTogglesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">無視オプション</h3>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="ignore-whitespace" className="flex-1 cursor-pointer">
          先頭・末尾の空白を無視
        </Label>
        <Switch
          id="ignore-whitespace"
          checked={options.ignoreWhitespace}
          onCheckedChange={(checked) => onChange({ ignoreWhitespace: checked })}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="ignore-all-whitespace" className="flex-1 cursor-pointer">
          すべての空白を無視
        </Label>
        <Switch
          id="ignore-all-whitespace"
          checked={options.ignoreAllWhitespace}
          onCheckedChange={(checked) => onChange({ ignoreAllWhitespace: checked })}
        />
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="ignore-empty-lines" className="flex-1 cursor-pointer">
          空行を無視
        </Label>
        <Switch
          id="ignore-empty-lines"
          checked={options.ignoreEmptyLines}
          onCheckedChange={(checked) => onChange({ ignoreEmptyLines: checked })}
        />
      </div>
    </div>
  );
}
