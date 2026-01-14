import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Slider } from '@components/ui/slider';
import { Switch } from '@components/ui/switch';
import { ALPHA_THRESHOLD_PRESETS } from '@config/constants';
import type { TrimSettings as TrimSettingsType } from '@types';

interface TrimSettingsProps {
  settings: TrimSettingsType;
  onSettingsChange: (updates: Partial<TrimSettingsType>) => void;
}

export function TrimSettings({ settings, onSettingsChange }: TrimSettingsProps) {
  return (
    <div className="space-y-6">
      {/* アルファ閾値設定 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>アルファ閾値</Label>
          <span className="text-sm text-muted-foreground">{settings.alphaThreshold}</span>
        </div>
        <Slider
          value={[settings.alphaThreshold]}
          onValueChange={([value]) => onSettingsChange({ alphaThreshold: value ?? 0 })}
          min={0}
          max={255}
          step={1}
        />
        <p className="text-xs text-muted-foreground">
          この値以下のアルファ値を透明 (余白) とみなします
        </p>
        <div className="flex flex-wrap gap-2">
          {ALPHA_THRESHOLD_PRESETS.map((preset) => (
            <Button
              key={preset.value}
              variant={settings.alphaThreshold === preset.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSettingsChange({ alphaThreshold: preset.value })}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* マージン設定 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>マージン追加</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">均等</span>
            <Switch
              checked={settings.uniformMargin}
              onCheckedChange={(checked) => onSettingsChange({ uniformMargin: checked })}
            />
          </div>
        </div>

        {settings.uniformMargin ? (
          <div className="space-y-2">
            <Label htmlFor="margin" className="text-sm">
              全辺 (px)
            </Label>
            <Input
              id="margin"
              type="number"
              value={settings.marginTop}
              onChange={(e) => {
                const value = Math.max(0, Number(e.target.value));
                onSettingsChange({
                  marginTop: value,
                  marginRight: value,
                  marginBottom: value,
                  marginLeft: value,
                });
              }}
              min={0}
              max={1000}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="marginTop" className="text-xs">
                上 (px)
              </Label>
              <Input
                id="marginTop"
                type="number"
                value={settings.marginTop}
                onChange={(e) =>
                  onSettingsChange({ marginTop: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                max={1000}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marginRight" className="text-xs">
                右 (px)
              </Label>
              <Input
                id="marginRight"
                type="number"
                value={settings.marginRight}
                onChange={(e) =>
                  onSettingsChange({ marginRight: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                max={1000}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marginBottom" className="text-xs">
                下 (px)
              </Label>
              <Input
                id="marginBottom"
                type="number"
                value={settings.marginBottom}
                onChange={(e) =>
                  onSettingsChange({ marginBottom: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                max={1000}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="marginLeft" className="text-xs">
                左 (px)
              </Label>
              <Input
                id="marginLeft"
                type="number"
                value={settings.marginLeft}
                onChange={(e) =>
                  onSettingsChange({ marginLeft: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                max={1000}
              />
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">トリミング後に追加する余白を指定します</p>
      </div>
    </div>
  );
}
