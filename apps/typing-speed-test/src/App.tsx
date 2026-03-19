import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { getRandomText, calculateStats, getCharStatuses } from '@/utils/typing';

type GameState = 'idle' | 'typing' | 'finished';

export default function App() {
  const [targetText, setTargetText] = useState(() => getRandomText());
  const [typedText, setTypedText] = useState('');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const { toast } = useToast();

  useEffect(() => {
    if (gameState === 'typing') {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 200);
      return () => clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, startTime]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (gameState === 'finished') return;
      const value = e.target.value;

      if (gameState === 'idle' && value.length > 0) {
        const now = Date.now();
        setGameState('typing');
        setStartTime(now);
      }

      setTypedText(value);

      if (value.length >= targetText.length) {
        const finalElapsed = Date.now() - (startTime || Date.now());
        setElapsed(finalElapsed);
        setGameState('finished');
        clearInterval(timerRef.current);
        const stats = calculateStats(targetText, value, finalElapsed);
        toast({ title: `Done! ${stats.wpm} WPM, ${stats.accuracy}% accuracy` });
      }
    },
    [gameState, targetText, startTime, toast]
  );

  const handleReset = useCallback(() => {
    setTargetText(getRandomText());
    setTypedText('');
    setGameState('idle');
    setStartTime(0);
    setElapsed(0);
    clearInterval(timerRef.current);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, []);

  const stats = calculateStats(targetText, typedText, elapsed);
  const charStatuses = getCharStatuses(targetText, typedText);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Typing Speed Test</h1>
          <p className="text-muted-foreground">
            Timer starts on first keypress. Type the displayed text as fast and accurately as you can.
          </p>
        </header>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{stats.wpm}</p>
              <p className="text-xs text-muted-foreground">WPM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{stats.cpm}</p>
              <p className="text-xs text-muted-foreground">CPM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{stats.elapsedSeconds}s</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div
              className="text-lg leading-relaxed font-mono p-4 rounded-md bg-muted/50 select-none cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {charStatuses.map((status, i) => (
                <span
                  key={i}
                  className={
                    status === 'correct'
                      ? 'text-green-600'
                      : status === 'incorrect'
                        ? 'text-red-500 bg-red-100'
                        : i === typedText.length
                          ? 'underline decoration-2 decoration-primary text-muted-foreground'
                          : 'text-muted-foreground'
                  }
                >
                  {targetText[i]}
                </span>
              ))}
            </div>

            <textarea
              ref={inputRef}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              placeholder="Start typing here..."
              value={typedText}
              onChange={handleInput}
              disabled={gameState === 'finished'}
              autoFocus
            />

            <Button type="button" onClick={handleReset} variant="outline">
              New Text
            </Button>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
