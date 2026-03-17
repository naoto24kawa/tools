import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { jsonToTable } from '@/utils/jsonToTable';

export default function App() {
  const [input, setInput] = useState('');
  const result = useMemo(() => jsonToTable(input), [input]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">JSON to Table</h1>
          <p className="text-muted-foreground">JSONデータをテーブル形式で表示します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>JSON配列を入力してください。</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              placeholder={'[{"name":"Alice","age":30},{"name":"Bob","age":25}]'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        {result.error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded p-2">
            {result.error}
          </div>
        )}

        {result.headers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Table ({result.rows.length} rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {result.headers.map((h) => (
                        <th key={h} className="text-left py-2 px-3 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, ri) => {
                      const rowKey = row.join('-') || String(ri);
                      return (
                        <tr key={rowKey} className="border-b hover:bg-muted/30">
                          {row.map((cell, ci) => {
                            const cellKey = `${rowKey}-${result.headers[ci]}`;
                            return (
                              <td key={cellKey} className="py-1.5 px-3 font-mono">
                                {cell}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
