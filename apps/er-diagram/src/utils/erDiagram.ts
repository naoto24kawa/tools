export interface Column {
  name: string;
  type: string;
  isPK: boolean;
  isFK: boolean;
  fkRef?: string; // tableName.columnName
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Relationship {
  from: string; // tableName
  fromColumn: string;
  to: string; // tableName
  toColumn: string;
}

export interface ERModel {
  tables: Table[];
  relationships: Relationship[];
}

export function parseERInput(input: string): ERModel {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  const lines = input.split('\n').map((l) => l.trim());

  let currentTable: Table | null = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (line.length === 0 || line.startsWith('#') || line.startsWith('//')) {
      if (line.length === 0 && currentTable) {
        tables.push(currentTable);
        currentTable = null;
      }
      continue;
    }

    // Table declaration: [TableName] or table TableName
    const tableMatch = line.match(/^\[(\w+)\]$/) || line.match(/^table\s+(\w+)$/i);
    if (tableMatch) {
      if (currentTable) {
        tables.push(currentTable);
      }
      currentTable = { name: tableMatch[1], columns: [] };
      continue;
    }

    // Column definition within a table
    if (currentTable) {
      const colMatch = line.match(
        /^(\w+)\s+(\w+(?:\(\d+(?:,\s*\d+)?\))?)\s*(PK|FK(?:\s*->\s*\w+\.\w+)?)?(?:\s*,\s*(PK|FK(?:\s*->\s*\w+\.\w+)?))?/i
      );
      if (colMatch) {
        const name = colMatch[1];
        const type = colMatch[2];
        const flags = (colMatch[3] || '') + ' ' + (colMatch[4] || '');
        const isPK = /PK/i.test(flags);
        const isFK = /FK/i.test(flags);
        let fkRef: string | undefined;

        const fkMatch = flags.match(/FK\s*->\s*(\w+\.\w+)/i);
        if (fkMatch) {
          fkRef = fkMatch[1];
        }

        const column: Column = { name, type, isPK, isFK, fkRef };
        currentTable.columns.push(column);

        // Auto-create relationship if FK reference exists
        if (fkRef) {
          const [refTable, refColumn] = fkRef.split('.');
          relationships.push({
            from: currentTable.name,
            fromColumn: name,
            to: refTable,
            toColumn: refColumn,
          });
        }
        continue;
      }
    }
  }

  // Push last table if exists
  if (currentTable) {
    tables.push(currentTable);
  }

  return { tables, relationships };
}

interface TablePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const TABLE_COLORS = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#9B59B6', '#1ABC9C', '#E74C3C', '#3498DB',
];

export function generateERSvg(model: ERModel): string {
  if (model.tables.length === 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><text x="150" y="50" text-anchor="middle" fill="#999" font-size="14">No tables defined</text></svg>';
  }

  const colHeight = 24;
  const headerHeight = 32;
  const tableWidth = 200;
  const padding = 40;

  // Calculate positions for each table
  const positions = new Map<string, TablePosition>();
  const cols = Math.ceil(Math.sqrt(model.tables.length));

  model.tables.forEach((table, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const tableHeight = headerHeight + table.columns.length * colHeight + 8;

    const x = padding + col * (tableWidth + 100);
    const y = padding + row * 250;

    positions.set(table.name, {
      x,
      y,
      width: tableWidth,
      height: tableHeight,
    });
  });

  // Calculate SVG bounds
  let maxX = 0;
  let maxY = 0;
  for (const pos of positions.values()) {
    maxX = Math.max(maxX, pos.x + pos.width);
    maxY = Math.max(maxY, pos.y + pos.height);
  }

  const svgWidth = maxX + padding;
  const svgHeight = maxY + padding;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`
  );

  // Defs
  parts.push('<defs>');
  parts.push(
    '<marker id="fk-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">'
  );
  parts.push('<polygon points="0 0, 8 3, 0 6" fill="#999" />');
  parts.push('</marker>');
  parts.push('</defs>');

  // Draw relationships first (behind tables)
  for (const rel of model.relationships) {
    const fromPos = positions.get(rel.from);
    const toPos = positions.get(rel.to);
    if (!fromPos || !toPos) continue;

    const fromCenterX = fromPos.x + fromPos.width / 2;
    const fromCenterY = fromPos.y + fromPos.height / 2;
    const toCenterX = toPos.x + toPos.width / 2;
    const toCenterY = toPos.y + toPos.height / 2;

    // Calculate connection points on table borders
    const dx = toCenterX - fromCenterX;
    const dy = toCenterY - fromCenterY;

    let startX: number;
    let startY: number;
    let endX: number;
    let endY: number;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      startX = dx > 0 ? fromPos.x + fromPos.width : fromPos.x;
      startY = fromCenterY;
      endX = dx > 0 ? toPos.x : toPos.x + toPos.width;
      endY = toCenterY;
    } else {
      // Vertical connection
      startX = fromCenterX;
      startY = dy > 0 ? fromPos.y + fromPos.height : fromPos.y;
      endX = toCenterX;
      endY = dy > 0 ? toPos.y : toPos.y + toPos.height;
    }

    // Draw curved line
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    parts.push(
      `<path d="M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${midY} Q ${midX} ${endY} ${endX} ${endY}" fill="none" stroke="#999" stroke-width="1.5" stroke-dasharray="6,3" marker-end="url(#fk-arrow)" />`
    );

    // Relationship label
    parts.push(
      `<text x="${midX}" y="${midY - 6}" text-anchor="middle" font-size="9" fill="#999">${escapeXml(rel.fromColumn)} -> ${escapeXml(rel.toColumn)}</text>`
    );
  }

  // Draw tables
  model.tables.forEach((table, tableIndex) => {
    const pos = positions.get(table.name);
    if (!pos) return;

    const color = TABLE_COLORS[tableIndex % TABLE_COLORS.length];

    // Table shadow
    parts.push(
      `<rect x="${pos.x + 3}" y="${pos.y + 3}" width="${pos.width}" height="${pos.height}" rx="6" ry="6" fill="#00000015" />`
    );

    // Table body
    parts.push(
      `<rect x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${pos.height}" rx="6" ry="6" fill="white" stroke="${color}" stroke-width="2" />`
    );

    // Header
    parts.push(
      `<rect x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${headerHeight}" rx="6" ry="6" fill="${color}" />`
    );
    // Cover bottom corners of header
    parts.push(
      `<rect x="${pos.x}" y="${pos.y + headerHeight - 6}" width="${pos.width}" height="6" fill="${color}" />`
    );

    // Table name
    parts.push(
      `<text x="${pos.x + pos.width / 2}" y="${pos.y + 21}" text-anchor="middle" font-size="13" font-weight="bold" fill="white" font-family="sans-serif">${escapeXml(table.name)}</text>`
    );

    // Separator line
    parts.push(
      `<line x1="${pos.x}" y1="${pos.y + headerHeight}" x2="${pos.x + pos.width}" y2="${pos.y + headerHeight}" stroke="${color}" stroke-width="1" />`
    );

    // Columns
    table.columns.forEach((col, colIndex) => {
      const cy = pos.y + headerHeight + colIndex * colHeight + 18;
      const cx = pos.x + 12;

      // Key indicator
      let prefix = '  ';
      if (col.isPK) prefix = 'PK';
      else if (col.isFK) prefix = 'FK';

      const prefixColor = col.isPK ? '#E6A23C' : col.isFK ? '#4A90D9' : '#ccc';

      parts.push(
        `<text x="${cx}" y="${cy}" font-size="10" fill="${prefixColor}" font-family="monospace" font-weight="bold">${prefix}</text>`
      );

      // Column name
      parts.push(
        `<text x="${cx + 24}" y="${cy}" font-size="11" fill="#333" font-family="sans-serif">${escapeXml(col.name)}</text>`
      );

      // Column type
      parts.push(
        `<text x="${pos.x + pos.width - 10}" y="${cy}" text-anchor="end" font-size="10" fill="#999" font-family="monospace">${escapeXml(col.type)}</text>`
      );
    });
  });

  parts.push('</svg>');
  return parts.join('\n');
}

export function svgToPngDataUrl(
  svgString: string,
  scale: number = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}
