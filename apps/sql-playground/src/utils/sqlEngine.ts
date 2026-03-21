import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';

let db: SqlJsDatabase | null = null;

export interface QueryResult {
  columns: string[];
  values: unknown[][];
  changes: number;
}

export async function initDatabase(): Promise<void> {
  const isNode = typeof window === 'undefined';
  let SQL;
  if (isNode) {
    // Node.js / Vitest: sql.js resolves wasm from its own dist automatically
    SQL = await initSqlJs();
  } else {
    // Browser: load local WASM file
    SQL = await initSqlJs({
      locateFile: (file: string) => `./${file}`,
    });
  }
  db = new SQL.Database();
}

export function executeQuery(sql: string): QueryResult[] {
  if (!db) throw new Error('Database not initialized');
  const results = db.exec(sql);
  const changes = db.getRowsModified();
  return results.map((r, i) => ({
    columns: r.columns,
    values: r.values,
    changes: i === results.length - 1 ? changes : 0,
  }));
}

export function resetDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function getTableNames(): string[] {
  if (!db) return [];
  const results = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  if (results.length === 0) return [];
  return results[0].values.map((row) => String(row[0]));
}
