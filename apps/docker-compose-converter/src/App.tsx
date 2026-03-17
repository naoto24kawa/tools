import { ArrowDown, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { convertDockerRunToCompose } from '@/utils/dockerCompose';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      const result = convertDockerRunToCompose(input);
      setOutput(result);
      toast({ title: 'Converted successfully' });
    } catch {
      toast({
        title: 'Conversion failed',
        description: 'Invalid docker run command',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast({ title: 'Copied to clipboard' });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Docker Run to Compose</h1>
          <p className="text-muted-foreground">
            Convert docker run commands to docker-compose.yml format.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>Paste your docker run command below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Docker Run Command</Label>
              <textarea
                id="input"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="docker run -d --name web -p 80:80 -v /data:/data nginx"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <Button type="button" onClick={handleConvert} disabled={!input.trim()}>
                Convert <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output">docker-compose.yml</Label>
              <textarea
                id="output"
                readOnly
                className="flex min-h-[300px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Converted docker-compose.yml will appear here..."
                value={output}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button type="button" onClick={copyToClipboard} disabled={!output}>
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
