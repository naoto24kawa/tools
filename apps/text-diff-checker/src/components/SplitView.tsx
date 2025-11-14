import type { DiffResult, Language } from '@types';
import { DiffLine } from './DiffLine';

interface SplitViewProps {
  diffResult: DiffResult;
  language: Language;
}

export function SplitView({ diffResult, language }: SplitViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="border-r">
        <div className="bg-muted px-4 py-2 text-sm font-semibold">Original</div>
        <div className="overflow-x-auto">
          {diffResult.originalLines.map((line, index) => (
            <DiffLine key={index} change={line} language={language} side="original" />
          ))}
        </div>
      </div>
      <div>
        <div className="bg-muted px-4 py-2 text-sm font-semibold">Modified</div>
        <div className="overflow-x-auto">
          {diffResult.modifiedLines.map((line, index) => (
            <DiffLine key={index} change={line} language={language} side="modified" />
          ))}
        </div>
      </div>
    </div>
  );
}
