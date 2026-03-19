export interface TableSchema {
  name: string;
  columns: string[];
}

export interface QueryResult {
  columns: string[];
  rows: string[][];
  message: string;
  error?: string;
}

export interface Database {
  tables: Map<string, { columns: string[]; rows: string[][] }>;
}

export function createDatabase(): Database {
  return { tables: new Map() };
}

function parseValues(valueStr: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < valueStr.length; i++) {
    const ch = valueStr[i];

    if (inQuote) {
      if (ch === quoteChar) {
        inQuote = false;
      } else {
        current += ch;
      }
    } else if (ch === "'" || ch === '"') {
      inQuote = true;
      quoteChar = ch;
    } else if (ch === ',') {
      values.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  values.push(current.trim());
  return values;
}

export function executeSQL(db: Database, sql: string): QueryResult {
  const trimmed = sql.trim().replace(/;$/, '').trim();

  if (!trimmed) {
    return { columns: [], rows: [], message: 'Empty query' };
  }

  try {
    const upper = trimmed.toUpperCase();

    if (upper.startsWith('CREATE TABLE')) {
      return executeCreate(db, trimmed);
    }
    if (upper.startsWith('INSERT INTO')) {
      return executeInsert(db, trimmed);
    }
    if (upper.startsWith('SELECT')) {
      return executeSelect(db, trimmed);
    }
    if (upper.startsWith('DROP TABLE')) {
      return executeDrop(db, trimmed);
    }
    if (upper.startsWith('SHOW TABLES') || upper === 'SHOW TABLES') {
      return executeShowTables(db);
    }
    if (upper.startsWith('DELETE FROM')) {
      return executeDelete(db, trimmed);
    }
    if (upper.startsWith('UPDATE')) {
      return executeUpdate(db, trimmed);
    }

    return { columns: [], rows: [], message: '', error: 'Unsupported SQL statement' };
  } catch (e) {
    return {
      columns: [],
      rows: [],
      message: '',
      error: e instanceof Error ? e.message : 'Unknown error',
    };
  }
}

function executeCreate(db: Database, sql: string): QueryResult {
  const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\((.+)\)/is);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid CREATE TABLE syntax' };
  }

  const tableName = match[1];
  const colDefs = match[2].split(',').map((c) => c.trim().split(/\s+/)[0]);

  if (db.tables.has(tableName.toUpperCase())) {
    return { columns: [], rows: [], message: '', error: `Table "${tableName}" already exists` };
  }

  db.tables.set(tableName.toUpperCase(), { columns: colDefs, rows: [] });
  return { columns: [], rows: [], message: `Table "${tableName}" created with ${colDefs.length} column(s)` };
}

function executeInsert(db: Database, sql: string): QueryResult {
  const match = sql.match(/INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*\((.+)\)/is);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid INSERT syntax' };
  }

  const tableName = match[1].toUpperCase();
  const table = db.tables.get(tableName);
  if (!table) {
    return { columns: [], rows: [], message: '', error: `Table "${match[1]}" not found` };
  }

  const values = parseValues(match[3]);

  // Handle multiple VALUES tuples
  const fullValuesStr = sql.match(/VALUES\s+(.*)/is)?.[1] || '';
  const tuples = fullValuesStr.match(/\([^)]+\)/g);

  if (tuples) {
    for (const tuple of tuples) {
      const vals = parseValues(tuple.slice(1, -1));
      // Pad to column count
      while (vals.length < table.columns.length) vals.push('');
      table.rows.push(vals.slice(0, table.columns.length));
    }
    return { columns: [], rows: [], message: `Inserted ${tuples.length} row(s) into "${match[1]}"` };
  }

  while (values.length < table.columns.length) values.push('');
  table.rows.push(values.slice(0, table.columns.length));
  return { columns: [], rows: [], message: `Inserted 1 row into "${match[1]}"` };
}

function executeSelect(db: Database, sql: string): QueryResult {
  // Parse SELECT ... FROM ... WHERE ...
  const match = sql.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/is);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid SELECT syntax' };
  }

  const selectCols = match[1].trim();
  const tableName = match[2].toUpperCase();
  const whereClause = match[3]?.trim();
  const orderBy = match[4]?.trim();
  const limit = match[5] ? parseInt(match[5]) : undefined;

  const table = db.tables.get(tableName);
  if (!table) {
    return { columns: [], rows: [], message: '', error: `Table "${match[2]}" not found` };
  }

  // Determine columns
  let columns: string[];
  let colIndices: number[];

  if (selectCols === '*') {
    columns = [...table.columns];
    colIndices = table.columns.map((_, i) => i);
  } else {
    const requested = selectCols.split(',').map((c) => c.trim());
    columns = [];
    colIndices = [];

    for (const col of requested) {
      // Handle COUNT(*)
      if (/^COUNT\s*\(\s*\*\s*\)/i.test(col)) {
        columns.push('COUNT(*)');
        colIndices.push(-1); // Special marker
        continue;
      }
      const idx = table.columns.findIndex(
        (c) => c.toUpperCase() === col.toUpperCase()
      );
      if (idx === -1) {
        return { columns: [], rows: [], message: '', error: `Column "${col}" not found` };
      }
      columns.push(table.columns[idx]);
      colIndices.push(idx);
    }
  }

  // Handle COUNT(*)
  if (colIndices.includes(-1)) {
    let filteredRows = table.rows;
    if (whereClause) {
      filteredRows = table.rows.filter((row) => evaluateWhere(row, table.columns, whereClause));
    }
    return {
      columns: ['COUNT(*)'],
      rows: [[String(filteredRows.length)]],
      message: `1 row returned`,
    };
  }

  // Filter rows
  let rows = table.rows;
  if (whereClause) {
    rows = rows.filter((row) => evaluateWhere(row, table.columns, whereClause));
  }

  // Order by
  if (orderBy) {
    const desc = /\s+DESC$/i.test(orderBy);
    const orderCol = orderBy.replace(/\s+(ASC|DESC)$/i, '').trim();
    const orderIdx = table.columns.findIndex(
      (c) => c.toUpperCase() === orderCol.toUpperCase()
    );
    if (orderIdx !== -1) {
      rows = [...rows].sort((a, b) => {
        const va = a[orderIdx];
        const vb = b[orderIdx];
        const na = parseFloat(va);
        const nb = parseFloat(vb);
        if (!isNaN(na) && !isNaN(nb)) {
          return desc ? nb - na : na - nb;
        }
        return desc ? vb.localeCompare(va) : va.localeCompare(vb);
      });
    }
  }

  // Limit
  if (limit !== undefined) {
    rows = rows.slice(0, limit);
  }

  // Project columns
  const projected = rows.map((row) =>
    colIndices.map((i) => row[i] ?? '')
  );

  return {
    columns,
    rows: projected,
    message: `${projected.length} row(s) returned`,
  };
}

function evaluateWhere(
  row: string[],
  columns: string[],
  whereClause: string
): boolean {
  // Simple: column = value, column != value, column > value, etc.
  const match = whereClause.match(/(\w+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*'?([^']*)'?/i);
  if (!match) return true;

  const colName = match[1];
  const operator = match[2].toUpperCase();
  const value = match[3];

  const colIdx = columns.findIndex(
    (c) => c.toUpperCase() === colName.toUpperCase()
  );
  if (colIdx === -1) return true;

  const cellValue = row[colIdx];
  const numCell = parseFloat(cellValue);
  const numValue = parseFloat(value);
  const useNum = !isNaN(numCell) && !isNaN(numValue);

  switch (operator) {
    case '=':
      return useNum ? numCell === numValue : cellValue === value;
    case '!=':
    case '<>':
      return useNum ? numCell !== numValue : cellValue !== value;
    case '>':
      return useNum ? numCell > numValue : cellValue > value;
    case '<':
      return useNum ? numCell < numValue : cellValue < value;
    case '>=':
      return useNum ? numCell >= numValue : cellValue >= value;
    case '<=':
      return useNum ? numCell <= numValue : cellValue <= value;
    case 'LIKE': {
      const pattern = value.replace(/%/g, '.*').replace(/_/g, '.');
      return new RegExp(`^${pattern}$`, 'i').test(cellValue);
    }
    default:
      return true;
  }
}

function executeDrop(db: Database, sql: string): QueryResult {
  const match = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid DROP TABLE syntax' };
  }

  const tableName = match[1].toUpperCase();
  if (!db.tables.has(tableName)) {
    return { columns: [], rows: [], message: '', error: `Table "${match[1]}" not found` };
  }

  db.tables.delete(tableName);
  return { columns: [], rows: [], message: `Table "${match[1]}" dropped` };
}

function executeShowTables(db: Database): QueryResult {
  const tables = [...db.tables.keys()];
  return {
    columns: ['Table Name'],
    rows: tables.map((t) => [t]),
    message: `${tables.length} table(s)`,
  };
}

function executeDelete(db: Database, sql: string): QueryResult {
  const match = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/is);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid DELETE syntax' };
  }

  const tableName = match[1].toUpperCase();
  const whereClause = match[2]?.trim();
  const table = db.tables.get(tableName);
  if (!table) {
    return { columns: [], rows: [], message: '', error: `Table "${match[1]}" not found` };
  }

  if (!whereClause) {
    const count = table.rows.length;
    table.rows = [];
    return { columns: [], rows: [], message: `Deleted ${count} row(s)` };
  }

  const before = table.rows.length;
  table.rows = table.rows.filter((row) => !evaluateWhere(row, table.columns, whereClause));
  const deleted = before - table.rows.length;
  return { columns: [], rows: [], message: `Deleted ${deleted} row(s)` };
}

function executeUpdate(db: Database, sql: string): QueryResult {
  const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/is);
  if (!match) {
    return { columns: [], rows: [], message: '', error: 'Invalid UPDATE syntax' };
  }

  const tableName = match[1].toUpperCase();
  const setClause = match[2].trim();
  const whereClause = match[3]?.trim();
  const table = db.tables.get(tableName);
  if (!table) {
    return { columns: [], rows: [], message: '', error: `Table "${match[1]}" not found` };
  }

  // Parse SET clause
  const assignments = setClause.split(',').map((s) => {
    const [col, val] = s.split('=').map((p) => p.trim());
    return { col, val: val.replace(/^['"]|['"]$/g, '') };
  });

  let count = 0;
  for (const row of table.rows) {
    if (!whereClause || evaluateWhere(row, table.columns, whereClause)) {
      for (const { col, val } of assignments) {
        const idx = table.columns.findIndex(
          (c) => c.toUpperCase() === col.toUpperCase()
        );
        if (idx !== -1) {
          row[idx] = val;
        }
      }
      count++;
    }
  }

  return { columns: [], rows: [], message: `Updated ${count} row(s)` };
}

export function getTableSchemas(db: Database): TableSchema[] {
  const schemas: TableSchema[] = [];
  for (const [name, table] of db.tables) {
    schemas.push({ name, columns: table.columns });
  }
  return schemas;
}
