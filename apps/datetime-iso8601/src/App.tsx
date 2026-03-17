import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { formatISO8601Variants, iso8601ToDate } from '@/utils/iso8601';

export default function App() {
  const [input, setInput] = useState(new Date().toISOString());
  const { toast } = useToast();

  const date = useMemo(() => iso8601ToDate(input), [input]);
  const variants = useMemo(() => (date ? formatISO8601Variants(date) : {}), [date]);

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: 'Copied' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ISO 8601 Converter</h1>
          <p className="text-muted-foreground">ISO 8601形式の日時変換を行います。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>
              ISO 8601日時文字列またはdatetime-localを入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>ISO 8601 String</Label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Date/Time Picker</Label>
                <input
                  type="datetime-local"
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!Number.isNaN(d.getTime())) setInput(d.toISOString());
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setInput(new Date().toISOString())}>
              Now
            </Button>

            {!date && input.trim() && (
              <div className="text-sm text-red-500">Invalid date string</div>
            )}

            {Object.keys(variants).length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                {Object.entries(variants).map(([label, value]) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-36 text-muted-foreground">{label}</span>
                    <code className="flex-1 font-mono">{value}</code>
                    <Button size="icon" variant="ghost" onClick={() => copyValue(value)}>
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
