import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import {
  type CronFields,
  cronToString,
  DEFAULT_CRON,
  describeCron,
  PRESETS,
  parseCron,
} from '@/utils/crontab';

const FIELD_LABELS = [
  { key: 'minute', label: '分 (0-59)' },
  { key: 'hour', label: '時 (0-23)' },
  { key: 'dayOfMonth', label: '日 (1-31)' },
  { key: 'month', label: '月 (1-12)' },
  { key: 'dayOfWeek', label: '曜日 (0-6)' },
] as const;

export default function App() {
  const [fields, setFields] = useState<CronFields>(DEFAULT_CRON);
  const { toast } = useToast();

  const cronStr = useMemo(() => cronToString(fields), [fields]);
  const description = useMemo(() => describeCron(fields), [fields]);

  const copyValue = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast({ title: 'Copied' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const handleParse = (cron: string) => {
    const parsed = parseCron(cron);
    if (parsed) setFields(parsed);
  };

  const cls =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono';

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Crontab Generator</h1>
          <p className="text-muted-foreground">Cron式の生成とパースを行います。</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl font-mono">{cronStr}</span>
              <Button size="icon" variant="ghost" onClick={() => copyValue(cronStr)}>
                <Copy className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {FIELD_LABELS.map((f) => (
                <div key={f.key} className="space-y-1">
                  <Label className="text-xs">{f.label}</Label>
                  <input
                    type="text"
                    value={fields[f.key]}
                    onChange={(e) => setFields((p) => ({ ...p, [f.key]: e.target.value }))}
                    className={cls}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-xs text-muted-foreground">Presets</Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p.cron}
                    onClick={() => handleParse(p.cron)}
                    className="px-3 py-1 rounded text-xs border hover:bg-muted transition-colors"
                  >
                    {p.label} <span className="font-mono text-muted-foreground ml-1">{p.cron}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-xs">Cron式をパース</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="*/5 * * * *"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleParse((e.target as HTMLInputElement).value);
                  }}
                  className={`${cls} flex-1`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
