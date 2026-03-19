import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Copy } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { KAOMOJI_DATA, CATEGORIES, filterKaomoji, type KaomojiCategory } from '@/utils/kaomojiData';

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<KaomojiCategory | 'All'>('All');
  const [recentlyCopied, setRecentlyCopied] = useState<string[]>([]);
  const { toast } = useToast();

  const filtered = useMemo(
    () => filterKaomoji(KAOMOJI_DATA, search, category),
    [search, category]
  );

  const copyKaomoji = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setRecentlyCopied((prev) => [text, ...prev.filter((t) => t !== text)].slice(0, 10));
      toast({ title: 'Copied!' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Kaomoji Picker</h1>
          <p className="text-muted-foreground">
            Browse and copy Japanese emoticons (kaomoji). Click to copy.
          </p>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search kaomoji..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={category === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory('All')}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              type="button"
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} kaomoji found
        </p>

        {recentlyCopied.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recently Copied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recentlyCopied.map((text, i) => (
                  <Button
                    type="button"
                    key={`${text}-${i}`}
                    variant="secondary"
                    size="sm"
                    onClick={() => copyKaomoji(text)}
                    className="font-mono"
                  >
                    {text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((k, i) => (
            <button
              type="button"
              key={`${k.text}-${i}`}
              onClick={() => copyKaomoji(k.text)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg border border-transparent hover:border-primary hover:bg-accent transition-colors text-center"
              title={`${k.keywords.join(', ')} - Click to copy`}
            >
              <span className="text-lg font-mono whitespace-nowrap">{k.text}</span>
              <span className="text-[10px] text-muted-foreground">{k.category}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No kaomoji found for your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
