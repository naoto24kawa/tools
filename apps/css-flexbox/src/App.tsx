import { Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { DEFAULT_CONFIG, type FlexConfig, generateCSS, OPTIONS } from '@/utils/flexbox';

export default function App() {
  const [config, setConfig] = useState<FlexConfig>(DEFAULT_CONFIG);
  const { toast } = useToast();
  const css = useMemo(() => generateCSS(config), [config]);

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(css);
      toast({ title: 'Copied' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: config.direction as React.CSSProperties['flexDirection'],
    justifyContent: config.justifyContent,
    alignItems: config.alignItems,
    flexWrap: config.flexWrap as React.CSSProperties['flexWrap'],
    gap: `${config.gap}px`,
    minHeight: 200,
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Flexbox Playground</h1>
          <p className="text-muted-foreground">CSS Flexboxのプロパティを視覚的に確認します。</p>
        </header>

        <div className="border rounded-lg p-4 bg-muted" style={containerStyle}>
          {Array.from({ length: config.itemCount }, (_, i) => (
            <div
              key={`item-${i + 1}`}
              className="bg-primary text-primary-foreground rounded px-4 py-3 text-sm font-medium"
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr,300px]">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.entries(OPTIONS) as [keyof typeof OPTIONS, readonly string[]][]).map(
                ([key, values]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs">{key}</Label>
                    <div className="flex flex-wrap gap-1">
                      {values.map((v) => (
                        <button
                          type="button"
                          key={v}
                          onClick={() => setConfig((p) => ({ ...p, [key]: v }))}
                          className={`px-2 py-1 rounded text-[10px] font-mono ${config[key] === v ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
              <div className="space-y-1">
                <Label className="text-xs">gap: {config.gap}px</Label>
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={config.gap}
                  onChange={(e) => setConfig((p) => ({ ...p, gap: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Items: {config.itemCount}</Label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={config.itemCount}
                  onChange={(e) => setConfig((p) => ({ ...p, itemCount: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="bg-muted rounded p-3 text-xs font-mono whitespace-pre-wrap">
                {css}
              </pre>
              <Button onClick={copyCSS} className="w-full">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
