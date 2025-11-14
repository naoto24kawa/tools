import type { DiffResult } from '@types';
import { Button } from '@components/ui/button';
import { Copy } from 'lucide-react';
import { copyToClipboard, formatUnifiedDiff, formatPatchDiff } from '@services/clipboard';

interface ExportActionsProps {
  diffResult: DiffResult | null;
}

export function ExportActions({ diffResult }: ExportActionsProps) {
  const handleCopyUnified = async () => {
    if (!diffResult) return;
    const text = formatUnifiedDiff(diffResult.changes);
    await copyToClipboard(text);
  };

  const handleCopyPatch = async () => {
    if (!diffResult) return;
    const text = formatPatchDiff(diffResult.changes);
    await copyToClipboard(text);
  };

  const isDisabled = !diffResult || diffResult.changes.length === 0;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">エクスポート</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyUnified}
          disabled={isDisabled}
          className="w-full"
        >
          <Copy className="mr-2 h-4 w-4" />
          Unified形式でコピー
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyPatch}
          disabled={isDisabled}
          className="w-full"
        >
          <Copy className="mr-2 h-4 w-4" />
          Patch形式でコピー
        </Button>
      </div>
    </div>
  );
}
