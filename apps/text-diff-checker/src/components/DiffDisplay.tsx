import type { DiffResult, ViewMode, Language } from '@types';
import { Card } from '@components/ui/card';
import { UnifiedView } from './UnifiedView';
import { SplitView } from './SplitView';

interface DiffDisplayProps {
  diffResult: DiffResult | null;
  viewMode: ViewMode;
  language: Language;
}

export function DiffDisplay({ diffResult, viewMode, language }: DiffDisplayProps) {
  if (!diffResult || diffResult.changes.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        <p>テキストを入力すると差分が表示されます</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {viewMode === 'unified' ? (
        <UnifiedView diffResult={diffResult} language={language} />
      ) : (
        <SplitView diffResult={diffResult} language={language} />
      )}
    </Card>
  );
}
