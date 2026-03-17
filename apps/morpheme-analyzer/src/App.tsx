import { Copy, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { type CharType, getStats, TYPE_COLORS, TYPE_LABELS, tokenize } from '@/utils/morpheme';

const ALL_TYPES: CharType[] = [
  'hiragana',
  'katakana',
  'kanji',
  'latin',
  'number',
  'symbol',
  'space',
];

export default function App() {
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const tokens = useMemo(() => tokenize(input), [input]);
  const stats = useMemo(() => getStats(tokens), [tokens]);

  const copyToClipboard = async () => {
    const text = tokens.map((t) => `${t.surface}\t${TYPE_LABELS[t.type]}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'クリップボードにコピーしました' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  const clearAll = () => {
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Morpheme Analyzer</h1>
          <p className="text-muted-foreground">
            日本語テキストを文字種別(ひらがな・カタカナ・漢字・英字・数字・記号)で分割します。
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>入力</CardTitle>
            <CardDescription>解析したいテキストを入力してください。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">テキスト</Label>
              <textarea
                id="input"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="例: 東京タワーは333mです。"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={clearAll} disabled={!input}>
                <Trash2 className="mr-2 h-4 w-4" /> クリア
              </Button>
              <Button type="button" onClick={copyToClipboard} disabled={tokens.length === 0}>
                <Copy className="mr-2 h-4 w-4" /> 結果をコピー
              </Button>
            </div>
          </CardContent>
        </Card>

        {tokens.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>解析結果</CardTitle>
                <CardDescription>文字種別ごとに色分けして表示します。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 p-4 bg-muted rounded-md min-h-[60px]">
                  {tokens.map((token, i) => (
                    <span
                      key={`${i}-${token.surface}`}
                      className="inline-flex items-center rounded px-2 py-1 text-sm font-mono border"
                      style={{
                        backgroundColor: `${TYPE_COLORS[token.type]}20`,
                        borderColor: TYPE_COLORS[token.type],
                        color: TYPE_COLORS[token.type],
                      }}
                      title={TYPE_LABELS[token.type]}
                    >
                      {token.type === 'space' ? '\u2423' : token.surface}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {ALL_TYPES.map((type) => (
                    <div key={type} className="flex items-center gap-1.5 text-xs">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      />
                      <span>{TYPE_LABELS[type]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>トークン一覧</CardTitle>
                <CardDescription>検出されたトークン: {tokens.length}個</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">#</th>
                        <th className="text-left py-2 px-3 font-medium">表層形</th>
                        <th className="text-left py-2 px-3 font-medium">文字種別</th>
                        <th className="text-left py-2 px-3 font-medium">文字数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, i) => (
                        <tr key={`${i}-${token.surface}`} className="border-b last:border-0">
                          <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                          <td className="py-2 px-3 font-mono">
                            <span
                              className="inline-flex items-center rounded px-1.5 py-0.5"
                              style={{
                                backgroundColor: `${TYPE_COLORS[token.type]}20`,
                                color: TYPE_COLORS[token.type],
                              }}
                            >
                              {token.type === 'space' ? '\u2423' : token.surface}
                            </span>
                          </td>
                          <td className="py-2 px-3">{TYPE_LABELS[token.type]}</td>
                          <td className="py-2 px-3">{[...token.surface].length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>統計</CardTitle>
                <CardDescription>文字種別ごとのトークン数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {ALL_TYPES.filter((type) => stats[type]).map((type) => (
                    <div
                      key={type}
                      className="flex flex-col items-center p-3 rounded-md border"
                      style={{ borderColor: TYPE_COLORS[type] }}
                    >
                      <span className="text-2xl font-bold" style={{ color: TYPE_COLORS[type] }}>
                        {stats[type]}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {TYPE_LABELS[type]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
}
