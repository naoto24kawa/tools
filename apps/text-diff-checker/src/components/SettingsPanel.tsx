import type { ViewMode, Language, IgnoreOptions, DiffResult } from '@types';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { ViewModeSelector } from './ViewModeSelector';
import { LanguageSelector } from './LanguageSelector';
import { IgnoreOptionsToggles } from './IgnoreOptionsToggles';
import { DiffStatistics } from './DiffStatistics';
import { ExportActions } from './ExportActions';

interface SettingsPanelProps {
  viewMode: ViewMode;
  language: Language;
  ignoreOptions: IgnoreOptions;
  diffResult: DiffResult | null;
  onViewModeChange: (mode: ViewMode) => void;
  onLanguageChange: (language: Language) => void;
  onIgnoreOptionsChange: (options: Partial<IgnoreOptions>) => void;
  onClearAll: () => void;
}

export function SettingsPanel({
  viewMode,
  language,
  ignoreOptions,
  diffResult,
  onViewModeChange,
  onLanguageChange,
  onIgnoreOptionsChange,
  onClearAll,
}: SettingsPanelProps) {
  return (
    <Card className="h-fit p-6">
      <div className="space-y-6">
        <ViewModeSelector value={viewMode} onChange={onViewModeChange} />
        <LanguageSelector value={language} onChange={onLanguageChange} />
        <IgnoreOptionsToggles options={ignoreOptions} onChange={onIgnoreOptionsChange} />
        <DiffStatistics statistics={diffResult?.statistics || null} />
        <ExportActions diffResult={diffResult} />
        <Button variant="outline" onClick={onClearAll} className="w-full">
          すべてクリア
        </Button>
      </div>
    </Card>
  );
}
