import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Textarea } from '@components/ui/textarea';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { useDeduplicate } from '@hooks/useDeduplicate';
import { Copy, Trash2 } from 'lucide-react';

export function App() {
  const {
    text,
    setText,
    settings,
    setSettings,
    deduplicatedText,
    removedLineCount,
    clearText,
    copyResult,
  } = useDeduplicate();

  const handleCopyResult = async () => {
    const success = await copyResult();
    if (success) {
      alert('結果をクリップボードにコピーしました');
    } else {
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
          <h1 className="text-3xl font-bold tracking-tight">🔀 Text Deduplicate</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            テキストの重複行を削除して整理 - ログファイルやデータの整理に最適
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            🔒 すべての処理はブラウザ内で完結 - データは外部に送信・保存されません
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
          {/* 左カラム: 設定パネル + 統計情報 */}
          <div className="space-y-6">
            {/* 統計情報パネル */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">📊 統計情報</h2>

              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">元の行数</span>
                  <span className="font-medium">{text.split('\n').length}</span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">結果の行数</span>
                  <span className="font-medium">{deduplicatedText.split('\n').length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">削除された行数</span>
                  <span className="font-medium text-destructive">{removedLineCount}</span>
                </div>
              </div>
            </Card>

            {/* 設定パネル */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">⚙️ 設定</h2>

              <div className="space-y-4">
                {/* 大文字小文字を区別 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="case-sensitive">大文字小文字を区別</Label>
                    <p className="text-xs text-muted-foreground">
                      「Hello」と「hello」を別の行として扱う
                    </p>
                  </div>
                  <Switch
                    id="case-sensitive"
                    checked={settings.caseSensitive}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, caseSensitive: checked })
                    }
                  />
                </div>

                {/* 空白をトリム */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="trim-whitespace">先頭・末尾の空白を無視</Label>
                    <p className="text-xs text-muted-foreground">
                      「  hello  」と「hello」を同じ行として扱う
                    </p>
                  </div>
                  <Switch
                    id="trim-whitespace"
                    checked={settings.trimWhitespace}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, trimWhitespace: checked })
                    }
                  />
                </div>

                {/* 空行を保持 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="keep-empty-lines">空行を保持</Label>
                    <p className="text-xs text-muted-foreground">
                      空行を結果に含める
                    </p>
                  </div>
                  <Switch
                    id="keep-empty-lines"
                    checked={settings.keepEmptyLines}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, keepEmptyLines: checked })
                    }
                  />
                </div>
              </div>
            </Card>

            {/* アクションボタン */}
            <Card className="p-6">
              <div className="space-y-2">
                <Button onClick={handleCopyResult} variant="outline" className="w-full" size="lg">
                  <Copy className="mr-2 h-4 w-4" />
                  結果をコピー
                </Button>
                <Button onClick={clearText} variant="destructive" className="w-full" size="lg">
                  <Trash2 className="mr-2 h-4 w-4" />
                  テキストをクリア
                </Button>
              </div>
            </Card>
          </div>

          {/* 右カラム: テキスト入力・結果表示 */}
          <div className="space-y-6">
            {/* 入力エリア */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">✏️ 入力テキスト</h2>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="ここにテキストを入力または貼り付けてください..."
                className="min-h-[calc(50vh-12rem)] resize-none font-mono text-sm"
              />
            </Card>

            {/* 結果エリア */}
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold">✨ 結果</h2>

              <Textarea
                value={deduplicatedText}
                readOnly
                placeholder="重複行が削除された結果がここに表示されます..."
                className="min-h-[calc(50vh-12rem)] resize-none font-mono text-sm bg-muted/50"
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

