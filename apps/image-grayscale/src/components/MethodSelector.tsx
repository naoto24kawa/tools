import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { GRAYSCALE_METHODS } from '@config/constants';
import type { GrayscaleMethod } from '@utils/grayscaleConverter';

interface MethodSelectorProps {
  method: GrayscaleMethod;
  onMethodChange: (method: GrayscaleMethod) => void;
}

export function MethodSelector({ method, onMethodChange }: MethodSelectorProps) {
  const selectedMethod = GRAYSCALE_METHODS.find((m) => m.value === method);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="method">変換方式</Label>
        <Select value={method} onValueChange={(value) => onMethodChange(value as GrayscaleMethod)}>
          <SelectTrigger id="method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GRAYSCALE_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMethod && (
        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm text-muted-foreground">{selectedMethod.description}</p>
        </div>
      )}
    </div>
  );
}
