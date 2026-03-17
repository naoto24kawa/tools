import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { dateToRFC2822, dateToUTC, rfc2822ToDate } from '@/utils/rfc2822';

export default function App() {
  const [input, setInput] = useState(dateToRFC2822(new Date()));
  const { toast } = useToast();

  const date = useMemo(() => rfc2822ToDate(input), [input]);
  const rfc2822 = useMemo(() => (date ? dateToRFC2822(date) : ''), [date]);
  const utc = useMemo(() => (date ? dateToUTC(date) : ''), [date]);
  const iso = useMemo(() => (date ? date.toISOString() : ''), [date]);

  const copyValue = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast({ title: 'Copied' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">RFC 2822 Date Converter</h1>
          <p className="text-muted-foreground">RFC 2822形式の日時変換を行います。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>RFC 2822日時文字列を入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>RFC 2822 / Date String</Label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Date Picker</Label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!Number.isNaN(d.getTime())) setInput(dateToRFC2822(d));
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setInput(dateToRFC2822(new Date()))}>
              Now
            </Button>
            {!date && input.trim() && <div className="text-sm text-red-500">Invalid date</div>}
            {date && (
              <div className="space-y-2 pt-4 border-t">
                {[
                  { label: 'RFC 2822', value: rfc2822 },
                  { label: 'UTC', value: utc },
                  { label: 'ISO 8601', value: iso },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className="w-24 text-muted-foreground">{item.label}</span>
                    <code className="flex-1 font-mono">{item.value}</code>
                    <Button size="icon" variant="ghost" onClick={() => copyValue(item.value)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
