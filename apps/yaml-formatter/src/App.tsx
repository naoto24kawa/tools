import { ArrowLeft, ArrowRight, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { formatYaml, jsonToYaml, yamlToJson } from '@/utils/yamlFormatter';

export default function App() {
  const [yamlInput, setYamlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const { toast } = useToast();

  const handleYamlToJson = () => {
    try {
      const result = yamlToJson(yamlInput);
      setJsonOutput(result);
      toast({ title: 'YAML to JSON conversion successful' });
    } catch (e) {
      toast({
        title: 'Conversion failed',
        description: e instanceof Error ? e.message : 'Invalid YAML',
        variant: 'destructive',
      });
    }
  };

  const handleJsonToYaml = () => {
    try {
      const result = jsonToYaml(jsonOutput);
      setYamlInput(result);
      toast({ title: 'JSON to YAML conversion successful' });
    } catch (e) {
      toast({
        title: 'Conversion failed',
        description: e instanceof Error ? e.message : 'Invalid JSON',
        variant: 'destructive',
      });
    }
  };

  const handleFormatYaml = () => {
    try {
      const result = formatYaml(yamlInput);
      setYamlInput(result);
      toast({ title: 'YAML formatted successfully' });
    } catch (e) {
      toast({
        title: 'Format failed',
        description: e instanceof Error ? e.message : 'Invalid YAML',
        variant: 'destructive',
      });
    }
  };

  const copyYaml = () => {
    navigator.clipboard.writeText(yamlInput);
    toast({ title: 'YAML copied to clipboard' });
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonOutput);
    toast({ title: 'JSON copied to clipboard' });
  };

  const clearAll = () => {
    setYamlInput('');
    setJsonOutput('');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">YAML Formatter</h1>
          <p className="text-muted-foreground">
            Convert between YAML and JSON, or format YAML with consistent indentation.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Converter</CardTitle>
            <CardDescription>Enter YAML or JSON to convert and format.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr,auto,1fr] items-start">
              <div className="space-y-2">
                <Label htmlFor="yaml-input">YAML</Label>
                <textarea
                  id="yaml-input"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="Enter YAML here..."
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 justify-center pt-10">
                <Button type="button" onClick={handleYamlToJson} disabled={!yamlInput}>
                  YAML to JSON <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  onClick={handleJsonToYaml}
                  variant="secondary"
                  disabled={!jsonOutput}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> JSON to YAML
                </Button>
                <Button
                  type="button"
                  onClick={handleFormatYaml}
                  variant="outline"
                  disabled={!yamlInput}
                >
                  Format YAML
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-output">JSON</Label>
                <textarea
                  id="json-output"
                  className="flex min-h-[300px] w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  placeholder="JSON output will appear here..."
                  value={jsonOutput}
                  onChange={(e) => setJsonOutput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
              <Button type="button" onClick={copyYaml} disabled={!yamlInput}>
                <Copy className="mr-2 h-4 w-4" /> Copy YAML
              </Button>
              <Button type="button" onClick={copyJson} disabled={!jsonOutput}>
                <Copy className="mr-2 h-4 w-4" /> Copy JSON
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
