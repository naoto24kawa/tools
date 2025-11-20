import { Button } from '@components/ui/button';
import { Card } from '@components/ui/card';
import type { DiffResult, IgnoreOptions, Language, ViewMode } from '@types';
import { DiffStatistics } from './DiffStatistics';
import { ExportActions } from './ExportActions';
import { IgnoreOptionsToggles } from './IgnoreOptionsToggles';
import { LanguageSelector } from './LanguageSelector';
import { ViewModeSelector } from './ViewModeSelector';

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
