import { AlertCircle, CheckCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { validateHTML } from '@/utils/htmlValidator';

export default function App() {
  const [input, setInput] = useState('');
  const issues = useMemo(() => validateHTML(input), [input]);
  const errors = issues.filter((i) => i.type === 'error');
  const warnings = issues.filter((i) => i.type === 'warning');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">HTML Validator</h1>
          <p className="text-muted-foreground">HTMLの構文チェックを行います。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Validator</CardTitle>
            <CardDescription>HTMLを入力するとリアルタイムで検証されます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {input.trim() && (
              <div className="flex items-center gap-2 text-sm">
                {errors.length === 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      {warnings.length > 0 ? `${warnings.length} warning(s)` : 'Valid HTML'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-600">
                      {errors.length} error(s), {warnings.length} warning(s)
                    </span>
                  </>
                )}
              </div>
            )}
            <textarea
              className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder="<html>...</html>"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {issues.length > 0 && (
              <div className="space-y-1">
                {issues.map((issue, i) => {
                  const key = `${issue.type}-${issue.message}-${i}`;
                  return (
                    <div
                      key={key}
                      className={`text-sm p-2 rounded ${issue.type === 'error' ? 'bg-red-50 dark:bg-red-950 text-red-700' : 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700'}`}
                    >
                      {issue.line && <span className="font-mono mr-2">L{issue.line}</span>}
                      {issue.message}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
