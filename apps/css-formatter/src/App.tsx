import { ArrowRight, Copy, Minimize2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { formatCss, minifyCss } from '@/utils/cssFormatter';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const { toast } = useToast();

  const handleFormat = () => {
    try {
      const result = formatCss(input, Number(indentSize));
      setOutput(result);
      toast({ title: 'Formatted successfully' });
    } catch {
      toast({ title: 'Formatting failed', variant: 'destructive' });
    }
  };

  const handleMinify = () => {
    try {
      const result = minifyCss(input);
      setOutput(result);
      toast({ title: 'Minified successfully' });
    } catch {
      toast({ title: 'Minification failed', variant: 'destructive' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({ title: 'Copied to clipboard' });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CSS Formatter / Minifier</h1>
          <p className="text-muted-foreground">Format or minify your CSS code instantly.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Formatter</CardTitle>
            <CardDescription>Paste your CSS to format or minify.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="indent-size">Indent Size</Label>
              <Select value={indentSize} onValueChange={setIndentSize}>
                <SelectTrigger className="w-[100px]" id="indent-size">
                  <SelectValue placeholder="Indent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="8">8 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
              <div className="space-y-2">
                <Label htmlFor="input">Input</Label>
                <textarea
                  id="input"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Paste your CSS here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center pt-10">
                <Button onClick={handleFormat} disabled={!input}>
                  Format <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleMinify} variant="secondary" disabled={!input}>
                  Minify <Minimize2 className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output">Output</Label>
                <textarea
                  id="output"
                  readOnly
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Result will appear here..."
                  value={output}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button onClick={copyToClipboard} disabled={!output}>
                <Copy className="mr-2 h-4 w-4" /> Copy Result
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
