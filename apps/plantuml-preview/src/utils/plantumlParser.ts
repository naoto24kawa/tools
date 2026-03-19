export interface ClassMember {
  visibility: '+' | '-' | '#' | '~';
  name: string;
  isMethod: boolean;
}

export interface UmlClass {
  name: string;
  stereotype?: string;
  members: ClassMember[];
}

export interface UmlRelation {
  from: string;
  to: string;
  type: 'extends' | 'implements' | 'association' | 'aggregation' | 'composition' | 'dependency';
  label?: string;
}

export interface UmlDiagram {
  classes: UmlClass[];
  relations: UmlRelation[];
}

export function parsePlantUml(input: string): UmlDiagram {
  const classes: UmlClass[] = [];
  const relations: UmlRelation[] = [];
  const lines = input.split('\n').map((l) => l.trim());

  let currentClass: UmlClass | null = null;
  let inBlock = false;

  for (const line of lines) {
    // Skip empty, @startuml, @enduml, comments
    if (
      line.length === 0 ||
      line.startsWith('@') ||
      line.startsWith("'") ||
      line.startsWith('//')
    ) {
      continue;
    }

    // Class declaration with body: class Name { or class Name <<stereotype>> {
    const classOpenMatch = line.match(
      /^(?:abstract\s+)?class\s+(\w+)(?:\s*<<\s*([^>]+)\s*>>)?\s*\{$/
    );
    if (classOpenMatch) {
      currentClass = {
        name: classOpenMatch[1],
        stereotype: classOpenMatch[2],
        members: [],
      };
      inBlock = true;
      continue;
    }

    // Interface declaration: interface Name {
    const ifaceOpenMatch = line.match(
      /^interface\s+(\w+)(?:\s*<<\s*([^>]+)\s*>>)?\s*\{$/
    );
    if (ifaceOpenMatch) {
      currentClass = {
        name: ifaceOpenMatch[1],
        stereotype: ifaceOpenMatch[2] || 'interface',
        members: [],
      };
      inBlock = true;
      continue;
    }

    // Closing brace
    if (line === '}' && currentClass && inBlock) {
      classes.push(currentClass);
      currentClass = null;
      inBlock = false;
      continue;
    }

    // Member inside class
    if (currentClass && inBlock) {
      const memberMatch = line.match(/^([+\-#~])?\s*(.+)$/);
      if (memberMatch) {
        const visibility = (memberMatch[1] || '+') as ClassMember['visibility'];
        const name = memberMatch[2].trim();
        const isMethod = name.includes('(');
        currentClass.members.push({ visibility, name, isMethod });
      }
      continue;
    }

    // Simple class declaration without body: class Name
    const simpleClassMatch = line.match(
      /^(?:abstract\s+)?class\s+(\w+)(?:\s*<<\s*([^>]+)\s*>>)?$/
    );
    if (simpleClassMatch) {
      classes.push({
        name: simpleClassMatch[1],
        stereotype: simpleClassMatch[2],
        members: [],
      });
      continue;
    }

    // Simple interface declaration without body
    const simpleIfaceMatch = line.match(
      /^interface\s+(\w+)(?:\s*<<\s*([^>]+)\s*>>)?$/
    );
    if (simpleIfaceMatch) {
      classes.push({
        name: simpleIfaceMatch[1],
        stereotype: simpleIfaceMatch[2] || 'interface',
        members: [],
      });
      continue;
    }

    // Relations:
    // A --|> B (extends), A ..|> B (implements), A --> B (association)
    // A --o B (aggregation), A --* B (composition), A ..> B (dependency)
    const relMatch = line.match(
      /^(\w+)\s+(--|\.\.)([\|><o*]?)([><]?)\s+(\w+)(?:\s*:\s*(.+))?$/
    );
    if (relMatch) {
      const from = relMatch[1];
      const lineStyle = relMatch[2]; // -- or ..
      const decorator1 = relMatch[3]; // |, >, <, o, *
      const decorator2 = relMatch[4]; // > or empty
      const to = relMatch[5];
      const label = relMatch[6];

      let type: UmlRelation['type'] = 'association';

      if (decorator1 === '|' && decorator2 === '>') {
        type = lineStyle === '..' ? 'implements' : 'extends';
      } else if (decorator1 === '>' || decorator2 === '>') {
        type = lineStyle === '..' ? 'dependency' : 'association';
      } else if (decorator1 === 'o') {
        type = 'aggregation';
      } else if (decorator1 === '*') {
        type = 'composition';
      }

      relations.push({ from, to, type, label });
      continue;
    }
  }

  // Handle unclosed class
  if (currentClass) {
    classes.push(currentClass);
  }

  return { classes, relations };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const CLASS_COLORS = [
  '#E8F4FD', '#E8F5E9', '#FFF3E0', '#FCE4EC',
  '#F3E5F5', '#E0F7FA', '#FFFDE7', '#EFEBE9',
];

const BORDER_COLORS = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#9B59B6', '#1ABC9C', '#F39C12', '#795548',
];

interface ClassPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateClassDiagramSvg(diagram: UmlDiagram): string {
  if (diagram.classes.length === 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><text x="150" y="50" text-anchor="middle" fill="#999" font-size="14">No classes defined</text></svg>';
  }

  const classWidth = 220;
  const headerHeight = 40;
  const memberHeight = 22;
  const padding = 50;
  const hGap = 60;
  const vGap = 60;

  // Calculate positions
  const positions = new Map<string, ClassPosition>();
  const cols = Math.min(Math.ceil(Math.sqrt(diagram.classes.length)), 4);

  diagram.classes.forEach((cls, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const stereotypeHeight = cls.stereotype ? 16 : 0;
    const fieldsCount = cls.members.filter((m) => !m.isMethod).length;
    const methodsCount = cls.members.filter((m) => m.isMethod).length;
    const separators = fieldsCount > 0 && methodsCount > 0 ? 1 : 0;
    const totalMembers = cls.members.length + separators;
    const classHeight = headerHeight + stereotypeHeight + totalMembers * memberHeight + 12;

    positions.set(cls.name, {
      x: padding + col * (classWidth + hGap),
      y: padding + row * (Math.max(...diagram.classes.map(c => {
        const sh = c.stereotype ? 16 : 0;
        const fc = c.members.filter(m => !m.isMethod).length;
        const mc = c.members.filter(m => m.isMethod).length;
        const sep = fc > 0 && mc > 0 ? 1 : 0;
        return headerHeight + sh + (c.members.length + sep) * memberHeight + 12;
      })) + vGap),
      width: classWidth,
      height: classHeight,
    });
  });

  // SVG bounds
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

  // Defs for arrow markers
  parts.push('<defs>');
  parts.push(
    '<marker id="arrow-extends" markerWidth="16" markerHeight="12" refX="16" refY="6" orient="auto">'
  );
  parts.push(
    '<polygon points="0 0, 16 6, 0 12" fill="white" stroke="#666" stroke-width="1.5" />'
  );
  parts.push('</marker>');
  parts.push(
    '<marker id="arrow-implements" markerWidth="16" markerHeight="12" refX="16" refY="6" orient="auto">'
  );
  parts.push(
    '<polygon points="0 0, 16 6, 0 12" fill="white" stroke="#666" stroke-width="1.5" />'
  );
  parts.push('</marker>');
  parts.push(
    '<marker id="arrow-assoc" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">'
  );
  parts.push('<polygon points="0 0, 10 3.5, 0 7" fill="#666" />');
  parts.push('</marker>');
  parts.push(
    '<marker id="diamond-agg" markerWidth="14" markerHeight="10" refX="14" refY="5" orient="auto">'
  );
  parts.push(
    '<polygon points="0 5, 7 0, 14 5, 7 10" fill="white" stroke="#666" stroke-width="1.5" />'
  );
  parts.push('</marker>');
  parts.push(
    '<marker id="diamond-comp" markerWidth="14" markerHeight="10" refX="14" refY="5" orient="auto">'
  );
  parts.push(
    '<polygon points="0 5, 7 0, 14 5, 7 10" fill="#666" stroke="#666" stroke-width="1.5" />'
  );
  parts.push('</marker>');
  parts.push('</defs>');

  // Draw relations
  for (const rel of diagram.relations) {
    const fromPos = positions.get(rel.from);
    const toPos = positions.get(rel.to);
    if (!fromPos || !toPos) continue;

    const fromCX = fromPos.x + fromPos.width / 2;
    const fromCY = fromPos.y + fromPos.height / 2;
    const toCX = toPos.x + toPos.width / 2;
    const toCY = toPos.y + toPos.height / 2;

    const dx = toCX - fromCX;
    const dy = toCY - fromCY;

    let startX: number;
    let startY: number;
    let endX: number;
    let endY: number;

    if (Math.abs(dx) > Math.abs(dy)) {
      startX = dx > 0 ? fromPos.x + fromPos.width : fromPos.x;
      startY = fromCY;
      endX = dx > 0 ? toPos.x : toPos.x + toPos.width;
      endY = toCY;
    } else {
      startX = fromCX;
      startY = dy > 0 ? fromPos.y + fromPos.height : fromPos.y;
      endX = toCX;
      endY = dy > 0 ? toPos.y : toPos.y + toPos.height;
    }

    const isDashed =
      rel.type === 'implements' || rel.type === 'dependency';
    const dashAttr = isDashed ? ' stroke-dasharray="6,4"' : '';

    let markerEnd = '';
    switch (rel.type) {
      case 'extends':
        markerEnd = ' marker-end="url(#arrow-extends)"';
        break;
      case 'implements':
        markerEnd = ' marker-end="url(#arrow-implements)"';
        break;
      case 'association':
      case 'dependency':
        markerEnd = ' marker-end="url(#arrow-assoc)"';
        break;
      case 'aggregation':
        markerEnd = ' marker-start="url(#diamond-agg)"';
        break;
      case 'composition':
        markerEnd = ' marker-start="url(#diamond-comp)"';
        break;
    }

    parts.push(
      `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#666" stroke-width="1.5"${dashAttr}${markerEnd} />`
    );

    if (rel.label) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      parts.push(
        `<text x="${midX}" y="${midY - 6}" text-anchor="middle" font-size="10" fill="#666">${escapeXml(rel.label)}</text>`
      );
    }
  }

  // Draw classes
  diagram.classes.forEach((cls, classIndex) => {
    const pos = positions.get(cls.name);
    if (!pos) return;

    const bgColor = CLASS_COLORS[classIndex % CLASS_COLORS.length];
    const borderColor = BORDER_COLORS[classIndex % BORDER_COLORS.length];
    const stereotypeHeight = cls.stereotype ? 16 : 0;

    // Shadow
    parts.push(
      `<rect x="${pos.x + 3}" y="${pos.y + 3}" width="${pos.width}" height="${pos.height}" rx="4" fill="#00000010" />`
    );

    // Background
    parts.push(
      `<rect x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${pos.height}" rx="4" fill="${bgColor}" stroke="${borderColor}" stroke-width="2" />`
    );

    // Stereotype
    let nameY = pos.y + 26;
    if (cls.stereotype) {
      parts.push(
        `<text x="${pos.x + pos.width / 2}" y="${pos.y + 16}" text-anchor="middle" font-size="10" fill="#999" font-style="italic">&lt;&lt;${escapeXml(cls.stereotype)}&gt;&gt;</text>`
      );
      nameY = pos.y + 34;
    }

    // Class name
    parts.push(
      `<text x="${pos.x + pos.width / 2}" y="${nameY}" text-anchor="middle" font-size="14" font-weight="bold" fill="#333" font-family="sans-serif">${escapeXml(cls.name)}</text>`
    );

    // Separator after header
    const sepY = pos.y + headerHeight + stereotypeHeight;
    parts.push(
      `<line x1="${pos.x}" y1="${sepY}" x2="${pos.x + pos.width}" y2="${sepY}" stroke="${borderColor}" stroke-width="1" />`
    );

    // Members
    const fields = cls.members.filter((m) => !m.isMethod);
    const methods = cls.members.filter((m) => m.isMethod);
    let memberY = sepY + memberHeight;

    for (const field of fields) {
      const visIcon = getVisibilityIcon(field.visibility);
      const visColor = getVisibilityColor(field.visibility);
      parts.push(
        `<text x="${pos.x + 10}" y="${memberY}" font-size="11" fill="${visColor}" font-family="monospace">${visIcon}</text>`
      );
      parts.push(
        `<text x="${pos.x + 24}" y="${memberY}" font-size="11" fill="#555" font-family="sans-serif">${escapeXml(field.name)}</text>`
      );
      memberY += memberHeight;
    }

    // Separator between fields and methods
    if (fields.length > 0 && methods.length > 0) {
      parts.push(
        `<line x1="${pos.x}" y1="${memberY - memberHeight / 2 + 2}" x2="${pos.x + pos.width}" y2="${memberY - memberHeight / 2 + 2}" stroke="${borderColor}" stroke-width="0.5" stroke-dasharray="4,2" />`
      );
      memberY += memberHeight / 2;
    }

    for (const method of methods) {
      const visIcon = getVisibilityIcon(method.visibility);
      const visColor = getVisibilityColor(method.visibility);
      parts.push(
        `<text x="${pos.x + 10}" y="${memberY}" font-size="11" fill="${visColor}" font-family="monospace">${visIcon}</text>`
      );
      parts.push(
        `<text x="${pos.x + 24}" y="${memberY}" font-size="11" fill="#555" font-family="sans-serif">${escapeXml(method.name)}</text>`
      );
      memberY += memberHeight;
    }
  });

  parts.push('</svg>');
  return parts.join('\n');
}

function getVisibilityIcon(vis: ClassMember['visibility']): string {
  switch (vis) {
    case '+':
      return '+';
    case '-':
      return '-';
    case '#':
      return '#';
    case '~':
      return '~';
  }
}

function getVisibilityColor(vis: ClassMember['visibility']): string {
  switch (vis) {
    case '+':
      return '#50B86C';
    case '-':
      return '#F56C6C';
    case '#':
      return '#E6A23C';
    case '~':
      return '#4A90D9';
  }
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
