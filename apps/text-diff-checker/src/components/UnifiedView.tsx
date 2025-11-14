import type { DiffResult, Language } from '@types';
import { DiffLine } from './DiffLine';

interface UnifiedViewProps {
  diffResult: DiffResult;
  language: Language;
}

export function UnifiedView({ diffResult, language }: UnifiedViewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full font-mono text-sm">
        {diffResult.changes.map((change, index) => (
          <DiffLine key={index} change={change} language={language} showLineNumbers />
        ))}
      </div>
    </div>
  );
}
