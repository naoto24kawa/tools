import type { Change, Language } from '@types';

interface DiffLineProps {
  change: Change;
  language: Language;
  showLineNumbers?: boolean;
  side?: 'original' | 'modified';
}

export function DiffLine({ change, showLineNumbers = false }: DiffLineProps) {
  const bgColor = {
    added: 'bg-green-50 dark:bg-green-950',
    removed: 'bg-red-50 dark:bg-red-950',
    unchanged: '',
  }[change.type];

  const indicator = {
    added: '+',
    removed: '-',
    unchanged: ' ',
  }[change.type];

  return (
    <div className={`flex ${bgColor}`}>
      {showLineNumbers && (
        <div className="w-12 flex-shrink-0 select-none px-2 py-1 text-right text-xs text-muted-foreground">
          {change.lineNumber}
        </div>
      )}
      <div className="w-6 flex-shrink-0 select-none px-1 py-1 text-xs text-muted-foreground">
        {indicator}
      </div>
      <div className="flex-1 px-2 py-1">
        <code className="text-xs">{change.content}</code>
      </div>
    </div>
  );
}
