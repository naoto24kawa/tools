export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  primaryKey: boolean;
  unique: boolean;
}

export interface Table {
  name: string;
  columns: Column[];
}

function mapSqlTypeToJsonSchema(sqlType: string): { type: string; format?: string } {
  const normalized = sqlType.toUpperCase().replace(/\(.+\)/, '').trim();

  switch (normalized) {
    case 'INT':
    case 'INTEGER':
    case 'SMALLINT':
    case 'TINYINT':
    case 'MEDIUMINT':
    case 'BIGINT':
    case 'SERIAL':
    case 'BIGSERIAL':
      return { type: 'integer' };

    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
    case 'NUMERIC':
    case 'REAL':
    case 'DOUBLE PRECISION':
      return { type: 'number' };

    case 'BOOLEAN':
    case 'BOOL':
      return { type: 'boolean' };

    case 'DATE':
      return { type: 'string', format: 'date' };

    case 'DATETIME':
    case 'TIMESTAMP':
    case 'TIMESTAMPTZ':
      return { type: 'string', format: 'date-time' };

    case 'TIME':
    case 'TIMETZ':
      return { type: 'string', format: 'time' };

    case 'JSON':
    case 'JSONB':
      return { type: 'object' };

    case 'UUID':
      return { type: 'string', format: 'uuid' };

    case 'TEXT':
    case 'VARCHAR':
    case 'CHAR':
    case 'CHARACTER VARYING':
    case 'CHARACTER':
    case 'NVARCHAR':
    case 'NCHAR':
    case 'CLOB':
    case 'ENUM':
      return { type: 'string' };

    case 'BLOB':
    case 'BYTEA':
    case 'BINARY':
    case 'VARBINARY':
      return { type: 'string', format: 'byte' };

    default:
      return { type: 'string' };
  }
}

function parseColumnDefinition(definition: string): Column | null {
  const trimmed = definition.trim();

  // Skip constraints that are defined at table level
  if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|CHECK|CONSTRAINT|INDEX|KEY)\b/i.test(trimmed)) {
    return null;
  }

  // Match column: name type(args)? constraints...
  // First extract name and the rest
  const nameMatch = trimmed.match(/^[`"']?(\w+)[`"']?\s+(.+)$/i);
  if (!nameMatch) return null;

  const name = nameMatch[1];
  const rest = nameMatch[2];

  // Extract type (possibly with parenthesized args like VARCHAR(255))
  // and two-word types like DOUBLE PRECISION, CHARACTER VARYING
  const twoWordTypes = /^(DOUBLE\s+PRECISION|CHARACTER\s+VARYING)\b/i;
  const typeWithParens = /^(\w+\s*\([^)]*\))/i;
  const simpleType = /^(\w+)/i;

  let type: string;
  let constraintStr: string;

  const twoWordMatch = rest.match(twoWordTypes);
  if (twoWordMatch) {
    type = twoWordMatch[1];
    constraintStr = rest.slice(twoWordMatch[0].length).trim();
  } else {
    const parensMatch = rest.match(typeWithParens);
    if (parensMatch) {
      type = parensMatch[1];
      constraintStr = rest.slice(parensMatch[0].length).trim();
    } else {
      const simpleMatch = rest.match(simpleType);
      if (!simpleMatch) return null;
      type = simpleMatch[1];
      constraintStr = rest.slice(simpleMatch[0].length).trim();
    }
  }

  const upperConstraints = constraintStr.toUpperCase();
  const notNull = upperConstraints.includes('NOT NULL');
  const primaryKey = upperConstraints.includes('PRIMARY KEY');
  const unique = upperConstraints.includes('UNIQUE');

  // Extract default value
  let defaultValue: string | undefined;
  const defaultMatch = constraintStr.match(/DEFAULT\s+(.+?)(?:\s+(?:NOT\s+NULL|NULL|PRIMARY|UNIQUE|CHECK|REFERENCES)|,|$)/i);
  if (defaultMatch) {
    defaultValue = defaultMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }

  return {
    name,
    type,
    nullable: !notNull && !primaryKey,
    defaultValue,
    primaryKey,
    unique,
  };
}

// Note: This is a pure client-side SQL DDL parser. It only parses SQL text
// strings to extract schema information - no SQL is ever executed.
export function parse(sql: string): Table[] {
  if (!sql.trim()) {
    throw new Error('Input is empty');
  }

  const tables: Table[] = [];

  // Match CREATE TABLE statements
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]*?)\)\s*;?/gi;

  let match;
  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];

    // Split by commas, but be careful with parentheses
    const columnDefs = splitColumnDefinitions(columnsStr);

    const columns: Column[] = [];
    for (const def of columnDefs) {
      const column = parseColumnDefinition(def);
      if (column) {
        columns.push(column);
      }
    }

    tables.push({ name: tableName, columns });
  }

  if (tables.length === 0) {
    throw new Error('No CREATE TABLE statements found');
  }

  return tables;
}

function splitColumnDefinitions(str: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of str) {
    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

export function toJsonSchema(tables: Table[], prettyPrint: boolean = true): string {
  if (tables.length === 1) {
    return JSON.stringify(tableToSchema(tables[0]), null, prettyPrint ? 2 : undefined);
  }

  const schemas: Record<string, unknown> = {};
  for (const table of tables) {
    schemas[table.name] = tableToSchema(table);
  }

  return JSON.stringify(schemas, null, prettyPrint ? 2 : undefined);
}

function tableToSchema(table: Table): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: table.name,
    type: 'object',
  };

  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const column of table.columns) {
    const propSchema: Record<string, unknown> = {};
    const typeInfo = mapSqlTypeToJsonSchema(column.type);

    if (column.nullable) {
      propSchema.type = [typeInfo.type, 'null'];
    } else {
      propSchema.type = typeInfo.type;
      required.push(column.name);
    }

    if (typeInfo.format) {
      propSchema.format = typeInfo.format;
    }

    if (column.defaultValue !== undefined) {
      propSchema.default = column.defaultValue;
    }

    // Extract max length from type like VARCHAR(255)
    const lengthMatch = column.type.match(/\((\d+)\)/);
    if (lengthMatch && typeInfo.type === 'string') {
      propSchema.maxLength = parseInt(lengthMatch[1], 10);
    }

    if (column.unique || column.primaryKey) {
      propSchema.description = column.primaryKey ? 'Primary Key' : 'Unique';
    }

    properties[column.name] = propSchema;
  }

  schema.properties = properties;
  if (required.length > 0) {
    schema.required = required;
  }

  return schema;
}
