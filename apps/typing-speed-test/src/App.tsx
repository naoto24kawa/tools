import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import { RotateCcw, History, Trophy } from 'lucide-react';
import {
  type TypingResult,
  getRandomText,
  calculateWPM,
  calculateCPM,
  calculateAccuracy,
  getCharStatuses,
  loadResults,
  saveResult,
} from '@/utils/typingTest';

type GameState = 'idle' | 'typing' | 'finished';

export default function App() {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [targetText, setTargetText] = useState(() => getRandomText('en'));
  const [typedText, setTypedText] = useState('');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [results, setResults] = useState<TypingResult[]>(loadResults);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (gameState === 'finished') {
        e.preventDefault();
        return;
      }
    },
    [gameState]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (gameState === 'finished') return;

      const value = e.target.value;

      if (gameState === 'idle' && value.length > 0) {
        setGameState('typing');
        setStartTime(Date.now());
      }

      setTypedText(value);

      // Check if completed
      if (value.length >= targetText.length) {
        const now = Date.now();
        setEndTime(now);
        setGameState('finished');

        const duration = now - (startTime || now);
        let correctChars = 0;
        for (let i = 0; i < targetText.length; i++) {
          if (value[i] === targetText[i]) correctChars++;
        }

        const wpm = calculateWPM(correctChars, duration);
        const cpm = calculateCPM(correctChars, duration);
        const accuracy = calculateAccuracy(correctChars, value.length);

        const updated = saveResult({
          wpm,
          cpm,
          accuracy,
          textLength: targetText.length,
          duration: Math.round(duration / 1000),
          language,
        });
        setResults(updated);
        toast({ title: `Done! ${wpm} WPM, ${accuracy}% accuracy` });
      }
    },
    [gameState, targetText, startTime, language, toast]
  );

  const handleReset = () => {
    const text = getRandomText(language);
    setTargetText(text);
    setTypedText('');
    setGameState('idle');
    setStartTime(null);
    setEndTime(null);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  const handleLanguageChange = (lang: 'en' | 'ja') => {
    setLanguage(lang);
    setTargetText(getRandomText(lang));
    setTypedText('');
    setGameState('idle');
    setStartTime(null);
    setEndTime(null);
  };

  const charStatuses = getCharStatuses(targetText, typedText, typedText.length);

  const currentDuration =
    gameState === 'typing' && startTime
      ? Date.now() - startTime
      : endTime && startTime
        ? endTime - startTime
        : 0;

  let correctChars = 0;
  for (let i = 0; i < typedText.length && i < targetText.length; i++) {
    if (typedText[i] === targetText[i]) correctChars++;
  }

  const currentWpm = calculateWPM(correctChars, currentDuration);
  const currentAccuracy = calculateAccuracy(correctChars, typedText.length);

  // Live timer update
  const [, setTick] = useState(0);
  useEffect(() => {
    if (gameState === 'typing') {
      const interval = setInterval(() => setTick((t) => t + 1), 200);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Typing Speed Test</h1>
          <p className="text-muted-foreground">
            Test your typing speed and accuracy. Timer starts on first keypress.
          </p>
        </header>

        <div className="flex gap-3 items-center">
          <div className="flex gap-1">
            <Button
              type="button"
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange('en')}
            >
              English
            </Button>
            <Button
              type="button"
              variant={language === 'ja' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange('ja')}
            >
              Japanese
            </Button>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" /> New Text
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="mr-2 h-4 w-4" /> History
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{currentWpm}</p>
              <p className="text-xs text-muted-foreground">WPM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">{currentAccuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold">
                {Math.round(currentDuration / 1000)}s
              </p>
              <p className="text-xs text-muted-foreground">Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Text display */}
        <Card>
          <CardContent className="pt-6">
            <div
              className="text-lg leading-relaxed font-mono p-4 rounded-md bg-muted/50 mb-4 select-none"
              onClick={() => inputRef.current?.focus()}
            >
              {charStatuses.map((cs, i) => (
                <span
                  key={i}
                  className={
                    cs.status === 'correct'
                      ? 'text-green-600'
                      : cs.status === 'incorrect'
                        ? 'text-red-500 bg-red-100'
                        : cs.status === 'current'
                          ? 'underline decoration-2 decoration-primary'
                          : 'text-muted-foreground'
                  }
                >
                  {cs.char}
                </span>
              ))}
            </div>

            <textarea
              ref={inputRef}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              placeholder={
                gameState === 'idle'
                  ? 'Start typing here...'
                  : gameState === 'finished'
                    ? 'Finished! Click "New Text" to try again.'
                    : 'Keep typing...'
              }
              value={typedText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={gameState === 'finished'}
              autoFocus
            />
          </CardContent>
        </Card>

        {/* History */}
        {showHistory && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" /> Results History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-muted-foreground text-sm">No results yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Date</th>
                        <th className="text-right py-2 px-2">WPM</th>
                        <th className="text-right py-2 px-2">CPM</th>
                        <th className="text-right py-2 px-2">Accuracy</th>
                        <th className="text-right py-2 px-2">Time</th>
                        <th className="text-right py-2 pl-2">Lang</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 20).map((r) => (
                        <tr key={r.id} className="border-b">
                          <td className="py-2 pr-4 text-muted-foreground">
                            {new Date(r.date).toLocaleDateString()}
                          </td>
                          <td className="text-right py-2 px-2 font-medium">{r.wpm}</td>
                          <td className="text-right py-2 px-2">{r.cpm}</td>
                          <td className="text-right py-2 px-2">{r.accuracy}%</td>
                          <td className="text-right py-2 px-2">{r.duration}s</td>
                          <td className="text-right py-2 pl-2 uppercase">{r.language}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster />
    </div>
  );
}
