import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { parseUserAgent } from '@/utils/userAgentParser';

export default function App() {
  const [ua, setUa] = useState(typeof navigator !== 'undefined' ? navigator.userAgent : '');

  const parsed = useMemo(() => parseUserAgent(ua), [ua]);

  const items = [
    { label: 'Browser', value: `${parsed.browser} ${parsed.browserVersion}` },
    { label: 'OS', value: `${parsed.os} ${parsed.osVersion}` },
    { label: 'Device', value: parsed.device },
    { label: 'Engine', value: parsed.engine },
    { label: 'Mobile', value: parsed.isMobile ? 'Yes' : 'No' },
    { label: 'Bot', value: parsed.isBot ? 'Yes' : 'No' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Agent Parser</h1>
          <p className="text-muted-foreground">
            User Agent文字列を解析してブラウザ/OS情報を表示します。
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Parser</CardTitle>
            <CardDescription>
              User Agent文字列を入力または現在のブラウザの情報を表示します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ua">User Agent</Label>
              <textarea
                id="ua"
                value={ua}
                onChange={(e) => setUa(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
              <Button variant="outline" size="sm" onClick={() => setUa(navigator.userAgent)}>
                現在のブラウザを使用
              </Button>
            </div>

            <div className="grid gap-3 pt-4 border-t">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <span className="w-20 text-muted-foreground">{item.label}</span>
                  <code className="font-mono font-medium">{item.value}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
