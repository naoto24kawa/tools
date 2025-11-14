import type { DiffStatistics as DiffStatisticsType } from '@types';

interface DiffStatisticsProps {
  statistics: DiffStatisticsType | null;
}

export function DiffStatistics({ statistics }: DiffStatisticsProps) {
  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">統計情報</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-green-600">追加</span>
          <span className="font-medium">{statistics.linesAdded} 行</span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-600">削除</span>
          <span className="font-medium">{statistics.linesRemoved} 行</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">変更なし</span>
          <span className="font-medium">{statistics.linesUnchanged} 行</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">元の文字数</span>
            <span className="font-medium">{statistics.originalCharCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">変更後の文字数</span>
            <span className="font-medium">{statistics.modifiedCharCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
