import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { type Deck, loadDecks, saveDecks, createDeck, createCard, getDeckStats } from '@/utils/flashcard';

type View = 'list' | 'edit' | 'study';

export default function App() {
  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
  const [view, setView] = useState<View>('list');
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { toast } = useToast();

  const activeDeck = decks.find((d) => d.id === activeDeckId) || null;

  useEffect(() => {
    saveDecks(decks);
  }, [decks]);

  const handleCreateDeck = useCallback(() => {
    const name = newDeckName.trim();
    if (!name) return;
    const deck = createDeck(name);
    setDecks((prev) => [...prev, deck]);
    setNewDeckName('');
    toast({ title: 'Deck created' });
  }, [newDeckName, toast]);

  const handleDeleteDeck = useCallback((id: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== id));
    if (activeDeckId === id) {
      setActiveDeckId(null);
      setView('list');
    }
    toast({ title: 'Deck deleted' });
  }, [activeDeckId, toast]);

  const handleAddCard = useCallback(() => {
    const front = newFront.trim();
    const back = newBack.trim();
    if (!front || !back || !activeDeckId) return;
    const card = createCard(front, back);
    setDecks((prev) =>
      prev.map((d) => (d.id === activeDeckId ? { ...d, cards: [...d.cards, card] } : d))
    );
    setNewFront('');
    setNewBack('');
    toast({ title: 'Card added' });
  }, [newFront, newBack, activeDeckId, toast]);

  const handleDeleteCard = useCallback((cardId: string) => {
    if (!activeDeckId) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeckId
          ? { ...d, cards: d.cards.filter((c) => c.id !== cardId) }
          : d
      )
    );
  }, [activeDeckId]);

  const handleMarkKnown = useCallback((known: boolean) => {
    if (!activeDeck) return;
    const card = activeDeck.cards[studyIndex];
    if (!card) return;
    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeckId
          ? {
              ...d,
              cards: d.cards.map((c) => (c.id === card.id ? { ...c, known } : c)),
            }
          : d
      )
    );
    setFlipped(false);
    if (studyIndex < activeDeck.cards.length - 1) {
      setStudyIndex((i) => i + 1);
    } else {
      toast({ title: 'Study session complete!' });
      setView('list');
    }
  }, [activeDeck, activeDeckId, studyIndex, toast]);

  const startStudy = useCallback((deckId: string) => {
    setActiveDeckId(deckId);
    setStudyIndex(0);
    setFlipped(false);
    setView('study');
  }, []);

  const startEdit = useCallback((deckId: string) => {
    setActiveDeckId(deckId);
    setView('edit');
  }, []);

  // List view
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Flashcard</h1>
            <p className="text-muted-foreground">
              Create decks, add cards, study with flip and mark known/unknown
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Create Deck</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="Deck name..."
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDeck()}
                />
                <Button type="button" onClick={handleCreateDeck}>
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {decks.map((deck) => {
              const stats = getDeckStats(deck);
              return (
                <Card key={deck.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {stats.total} cards | {stats.known} known | {stats.unknown} unknown
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => startStudy(deck.id)}
                        disabled={stats.total === 0}
                      >
                        Study
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => startEdit(deck.id)}>
                        Edit
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => handleDeleteDeck(deck.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {decks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No decks yet. Create one to get started.
            </p>
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  // Edit view
  if (view === 'edit' && activeDeck) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex items-center gap-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setView('list')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">{activeDeck.name}</h1>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Add Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Front</Label>
                <Input
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="Question..."
                />
              </div>
              <div className="space-y-2">
                <Label>Back</Label>
                <Input
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="Answer..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
                />
              </div>
              <Button type="button" onClick={handleAddCard}>
                Add Card
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {activeDeck.cards.map((card) => (
              <Card key={card.id}>
                <CardContent className="pt-4 pb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{card.front}</p>
                    <p className="text-sm text-muted-foreground">{card.back}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteCard(card.id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Study view
  if (view === 'study' && activeDeck) {
    const currentCard = activeDeck.cards[studyIndex];
    const progress = `${studyIndex + 1} / ${activeDeck.cards.length}`;

    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="flex items-center gap-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setView('list')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">{activeDeck.name}</h1>
            <span className="text-sm text-muted-foreground ml-auto">{progress}</span>
          </header>

          {currentCard ? (
            <>
              <Card
                className="min-h-[200px] flex items-center justify-center cursor-pointer"
                onClick={() => setFlipped((f) => !f)}
              >
                <CardContent className="pt-6 text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    {flipped ? 'Back' : 'Front'} (click to flip)
                  </p>
                  <p className="text-2xl font-medium">
                    {flipped ? currentCard.back : currentCard.front}
                  </p>
                </CardContent>
              </Card>

              {flipped && (
                <div className="flex gap-4 justify-center">
                  <Button type="button" variant="outline" onClick={() => handleMarkKnown(false)} className="flex-1">
                    Unknown
                  </Button>
                  <Button type="button" onClick={() => handleMarkKnown(true)} className="flex-1">
                    Known
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">No cards to study.</p>
          )}
        </div>
        <Toaster />
      </div>
    );
  }

  return null;
}
