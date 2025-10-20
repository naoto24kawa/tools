import type { PatternType } from '@types';
import { Button } from './ui/button';

interface PatternSelectorProps {
  pattern: PatternType;
  onPatternChange: (pattern: PatternType) => void;
}

export function PatternSelector({ pattern, onPatternChange }: PatternSelectorProps) {
  const patterns: { value: PatternType; label: string }[] = [
    { value: 'none', label: 'なし' },
    { value: 'checkerboard', label: 'チェッカーボード' },
    { value: 'grid', label: 'グリッド' },
  ];

  return (
    <div className="space-y-4 border-b pb-6">
      <h3 className="text-lg font-semibold">パターン</h3>
      <div className="flex flex-wrap gap-2">
        {patterns.map((p) => (
          <Button
            key={p.value}
            variant={pattern === p.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPatternChange(p.value)}
            type="button"
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
