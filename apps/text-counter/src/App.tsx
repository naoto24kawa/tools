import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import { useTextCounter } from '@hooks/useTextCounter';
import { formatNumber, formatBytes, formatReadingTime, formatStatsForClipboard } from '@utils/formatters';
import { LANGUAGE_OPTIONS } from '@config/constants';

export function App() {
  const { text, setText, settings, setSettings, stats, clearText } = useTextCounter();

  const handleCopyStats = async () => {
    try {
      const formattedStats = formatStatsForClipboard(stats);
      await navigator.clipboard.writeText(formattedStats);
      alert('統計情報をクリップボードにコピーしました');
    } catch (error) {
      console.error('Failed to copy stats:', error);
      alert('コピーに失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <a href="/" className="text-sm text-primary hover:underline">
              ← Tools トップに戻る
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">📝 Text Counter</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            テキストの文字数、単語数、行数などをリアルタイムで解析
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          {/* 左カラム: 統計情報 + 設定パネル */}
          <div className="space-y-6">
            {/* 統計情報パネル */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">📊 統計情報</h2>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">文字数（スペース含む）</span>
                  <span className="font-medium">{formatNumber(stats.charsWithSpaces)}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">文字数（スペース除外）</span>
                  <span className="font-medium">{formatNumber(stats.charsWithoutSpaces)}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">単語数</span>
                  <span className="font-medium">{formatNumber(stats.words)}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">行数</span>
                  <span className="font-medium">{formatNumber(stats.lines)}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">段落数</span>
                  <span className="font-medium">{formatNumber(stats.paragraphs)}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">バイト数（UTF-8）</span>
                  <span className="font-medium">{formatBytes(stats.bytes)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">読了時間</span>
                  <span className="font-medium">{formatReadingTime(stats.readingTimeMinutes)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={handleCopyStats} variant="outline" className="flex-1" size="sm">
                  統計をコピー
                </Button>
              </div>
            </Card>

            {/* 設定パネル */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">⚙️ 設定</h2>

              <div className="space-y-4">
                {/* 言語設定 */}
                <div className="space-y-2">
                  <Label htmlFor="language">言語</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) =>
                      setSettings({ ...settings, language: value as 'ja' | 'en' | 'auto' })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* カウント設定 */}
                <div className="space-y-3">
                  <Label>カウント対象</Label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">スペースを含む</span>
                    <Switch
                      checked={settings.includeSpaces}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, includeSpaces: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">改行を含む</span>
                    <Switch
                      checked={settings.includeLineBreaks}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, includeLineBreaks: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">記号を含む</span>
                    <Switch
                      checked={settings.includeSymbols}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, includeSymbols: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* アクションボタン */}
            <Card className="p-6">
              <Button onClick={clearText} variant="destructive" className="w-full">
                テキストをクリア
              </Button>
            </Card>
          </div>

          {/* 右カラム: テキスト入力エリア */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">✏️ テキスト入力</h2>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ここにテキストを入力または貼り付けてください..."
              className="min-h-[calc(100vh-16rem)] resize-none font-mono text-sm"
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
