import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Trash2, Database as DbIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/useToast';
import {
  createDatabase,
  executeSQL,
  getTableSchemas,
  type Database,
  type QueryResult,
} from '@/utils/sqlEngine';

const EXAMPLE_QUERIES = `-- Create a table
CREATE TABLE users (id INT, name VARCHAR, age INT, city VARCHAR);

-- Insert data
INSERT INTO users VALUES (1, 'Alice', 30, 'Tokyo');
INSERT INTO users VALUES (2, 'Bob', 25, 'Osaka');
INSERT INTO users VALUES (3, 'Charlie', 35, 'Tokyo');
INSERT INTO users VALUES (4, 'Diana', 28, 'Nagoya');

-- Query data
SELECT * FROM users;
SELECT name, age FROM users WHERE city = 'Tokyo';
SELECT COUNT(*) FROM users;
SELECT * FROM users ORDER BY age DESC LIMIT 3;`;

interface HistoryEntry {
  sql: string;
  result: QueryResult;
}

export default function App() {
  const [db] = useState<Database>(createDatabase);
  const [sql, setSql] = useState(EXAMPLE_QUERIES);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { toast } = useToast();
  const historyEndRef = useRef<HTMLDivElement>(null);

  const schemas = getTableSchemas(db);

  const handleExecute = useCallback(() => {
    if (!sql.trim()) return;

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('--'));

    const newEntries: HistoryEntry[] = [];

    for (const stmt of statements) {
      if (!stmt || stmt.startsWith('--')) continue;
      const result = executeSQL(db, stmt);
      newEntries.push({ sql: stmt, result });
    }

    setHistory((prev) => [...prev, ...newEntries]);

    const errors = newEntries.filter((e) => e.result.error);
    if (errors.length > 0) {
      toast({
        title: 'Query error',
        description: errors[0].result.error,
        variant: 'destructive',
      });
    } else {
      const last = newEntries[newEntries.length - 1];
      if (last) {
        toast({ title: last.result.message || 'Executed successfully' });
      }
    }

    setTimeout(() => {
      historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [sql, db, toast]);

  const handleClear = () => {
    setHistory([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SQL Playground</h1>
          <p className="text-muted-foreground">
            In-memory SQL playground. Supports CREATE TABLE, INSERT, SELECT, UPDATE, DELETE.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr,250px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SQL Editor</CardTitle>
                <CardDescription>
                  Write SQL and press Ctrl+Enter or click Run.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter SQL statements..."
                  spellCheck={false}
                />
                <div className="flex gap-2">
                  <Button type="button" onClick={handleExecute}>
                    <Play className="mr-2 h-4 w-4" /> Run (Ctrl+Enter)
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClear}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                  {history.map((entry, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <pre className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                        {entry.sql}
                      </pre>
                      {entry.result.error ? (
                        <p className="text-sm text-destructive">{entry.result.error}</p>
                      ) : (
                        <>
                          {entry.result.columns.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm border-collapse">
                                <thead>
                                  <tr className="bg-muted/50">
                                    {entry.result.columns.map((col) => (
                                      <th key={col} className="text-left p-1.5 border text-xs font-medium">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {entry.result.rows.map((row, ri) => (
                                    <tr key={ri} className="hover:bg-muted/30">
                                      {row.map((cell, ci) => (
                                        <td key={ci} className="p-1.5 border text-xs font-mono">
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">{entry.result.message}</p>
                        </>
                      )}
                    </div>
                  ))}
                  <div ref={historyEndRef} />
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DbIcon className="h-4 w-4" /> Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schemas.length > 0 ? (
                <div className="space-y-4">
                  {schemas.map((schema) => (
                    <div key={schema.name} className="space-y-1">
                      <p className="text-sm font-bold">{schema.name}</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {schema.columns.map((col) => (
                          <li key={col} className="font-mono pl-2">- {col}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tables yet. Run CREATE TABLE to add one.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
