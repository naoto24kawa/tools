import { Copy, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { markdownToHtml } from '@/utils/markdown';

export default function App() {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const html = useMemo(() => markdownToHtml(input), [input]);

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      toast({ title: 'HTML copied' });
    } catch {
      toast({ title: 'コピーに失敗しました', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Markdown to HTML</h1>
          <p className="text-muted-foreground">MarkdownテキストをHTMLに変換します。</p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>Markdownを入力するとHTMLに変換されます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Markdown</Label>
                <textarea
                  className="flex min-h-[350px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  placeholder="# Hello World"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>HTML Output</Label>
                <textarea
                  readOnly
                  className="flex min-h-[350px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  value={html}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setInput('')}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={copyHtml} disabled={!html}>
                <Copy className="mr-2 h-4 w-4" /> Copy HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
