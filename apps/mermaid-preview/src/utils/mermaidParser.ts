export interface FlowNode {
  id: string;
  label: string;
  shape: 'rect' | 'round' | 'diamond' | 'circle';
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;
  style: 'solid' | 'dotted';
  arrowHead: boolean;
}

export interface FlowChart {
  nodes: FlowNode[];
  edges: FlowEdge[];
  direction: 'TB' | 'LR';
}

export function parseFlowchart(input: string): FlowChart {
  const lines = input
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('%%'));

  const nodes = new Map<string, FlowNode>();
  const edges: FlowEdge[] = [];
  let direction: 'TB' | 'LR' = 'TB';

  for (const line of lines) {
    // Parse direction: graph TD, graph LR, etc.
    const dirMatch = line.match(/^(?:graph|flowchart)\s+(TB|TD|BT|LR|RL)\s*$/i);
    if (dirMatch) {
      const dir = dirMatch[1].toUpperCase();
      direction = dir === 'LR' || dir === 'RL' ? 'LR' : 'TB';
      continue;
    }

    // Skip pure direction lines
    if (/^(?:graph|flowchart)\s*$/i.test(line)) {
      continue;
    }

    // Parse edge: A --> B, A -->|label| B, A --- B, A -.-> B
    const edgeMatch = line.match(
      /^(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|(?:\(\(([^)]*)\)\)))?\s*(-->|---|-\.->|==>)(?:\|([^|]*)\|)?\s*(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|(?:\(\(([^)]*)\)\)))?$/
    );

    if (edgeMatch) {
      const fromId = edgeMatch[1];
      const fromLabel =
        edgeMatch[2] ?? edgeMatch[3] ?? edgeMatch[4] ?? edgeMatch[5] ?? null;
      const arrow = edgeMatch[6];
      const edgeLabel = edgeMatch[7] ?? '';
      const toId = edgeMatch[8];
      const toLabel =
        edgeMatch[9] ?? edgeMatch[10] ?? edgeMatch[11] ?? edgeMatch[12] ?? null;

      // Determine from shape
      if (!nodes.has(fromId)) {
        let shape: FlowNode['shape'] = 'rect';
        if (edgeMatch[3] !== undefined) shape = 'round';
        if (edgeMatch[4] !== undefined) shape = 'diamond';
        if (edgeMatch[5] !== undefined) shape = 'circle';
        nodes.set(fromId, {
          id: fromId,
          label: fromLabel ?? fromId,
          shape,
        });
      } else if (fromLabel) {
        const existing = nodes.get(fromId)!;
        existing.label = fromLabel;
      }

      // Determine to shape
      if (!nodes.has(toId)) {
        let shape: FlowNode['shape'] = 'rect';
        if (edgeMatch[10] !== undefined) shape = 'round';
        if (edgeMatch[11] !== undefined) shape = 'diamond';
        if (edgeMatch[12] !== undefined) shape = 'circle';
        nodes.set(toId, {
          id: toId,
          label: toLabel ?? toId,
          shape,
        });
      } else if (toLabel) {
        const existing = nodes.get(toId)!;
        existing.label = toLabel;
      }

      edges.push({
        from: fromId,
        to: toId,
        label: edgeLabel,
        style: arrow === '-.->' ? 'dotted' : 'solid',
        arrowHead: arrow !== '---',
      });
      continue;
    }

    // Parse standalone node: A[Label], A(Label), A{Label}, A((Label))
    const nodeMatch = line.match(
      /^(\w+)(?:\[([^\]]*)\]|\(([^)]*)\)|\{([^}]*)\}|(?:\(\(([^)]*)\)\)))$/
    );
    if (nodeMatch) {
      const id = nodeMatch[1];
      const label =
        nodeMatch[2] ?? nodeMatch[3] ?? nodeMatch[4] ?? nodeMatch[5] ?? id;
      let shape: FlowNode['shape'] = 'rect';
      if (nodeMatch[3] !== undefined) shape = 'round';
      if (nodeMatch[4] !== undefined) shape = 'diamond';
      if (nodeMatch[5] !== undefined) shape = 'circle';

      if (!nodes.has(id)) {
        nodes.set(id, { id, label, shape });
      }
    }
  }

  return {
    nodes: Array.from(nodes.values()),
    edges,
    direction,
  };
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

function layoutNodes(
  chart: FlowChart
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  const nodeWidth = 140;
  const nodeHeight = 50;
  const hGap = 60;
  const vGap = 80;

  // Build adjacency list for topological sorting
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of chart.nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of chart.edges) {
    adjacency.get(edge.from)?.push(edge.to);
    inDegree.set(edge.to, (inDegree.get(edge.to) ?? 0) + 1);
  }

  // Assign levels via BFS (topological)
  const levels = new Map<string, number>();
  const queue: string[] = [];

  for (const [nodeId, deg] of inDegree) {
    if (deg === 0) {
      queue.push(nodeId);
      levels.set(nodeId, 0);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) ?? 0;

    for (const neighbor of adjacency.get(current) ?? []) {
      const newLevel = currentLevel + 1;
      const existingLevel = levels.get(neighbor);
      if (existingLevel === undefined || newLevel > existingLevel) {
        levels.set(neighbor, newLevel);
      }
      inDegree.set(neighbor, (inDegree.get(neighbor) ?? 1) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Handle disconnected nodes
  for (const node of chart.nodes) {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0);
    }
  }

  // Group by level
  const levelGroups = new Map<number, string[]>();
  for (const [nodeId, level] of levels) {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(nodeId);
  }

  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

  for (const level of sortedLevels) {
    const nodesAtLevel = levelGroups.get(level)!;
    const totalWidth = nodesAtLevel.length * nodeWidth + (nodesAtLevel.length - 1) * hGap;
    const startX = -totalWidth / 2 + nodeWidth / 2;

    for (let i = 0; i < nodesAtLevel.length; i++) {
      const nodeId = nodesAtLevel[i];
      if (chart.direction === 'LR') {
        positions.set(nodeId, {
          x: level * (nodeWidth + hGap),
          y: startX + i * (nodeWidth + hGap),
          width: nodeWidth,
          height: nodeHeight,
        });
      } else {
        positions.set(nodeId, {
          x: startX + i * (nodeWidth + hGap),
          y: level * (nodeHeight + vGap),
          width: nodeWidth,
          height: nodeHeight,
        });
      }
    }
  }

  return positions;
}

const COLORS = [
  '#4A90D9', '#50B86C', '#E6A23C', '#F56C6C',
  '#909399', '#9B59B6', '#1ABC9C', '#E74C3C',
];

export function generateSvg(chart: FlowChart): string {
  if (chart.nodes.length === 0) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="100" y="50" text-anchor="middle" fill="#999" font-size="14">No diagram to display</text></svg>';
  }

  const positions = layoutNodes(chart);

  // Calculate bounds
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pos of positions.values()) {
    minX = Math.min(minX, pos.x - pos.width / 2);
    minY = Math.min(minY, pos.y - pos.height / 2);
    maxX = Math.max(maxX, pos.x + pos.width / 2);
    maxY = Math.max(maxY, pos.y + pos.height / 2);
  }

  const padding = 60;
  const svgWidth = maxX - minX + padding * 2;
  const svgHeight = maxY - minY + padding * 2;
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;

  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">`
  );

  // Defs for arrowheads
  parts.push('<defs>');
  parts.push(
    '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">'
  );
  parts.push('<polygon points="0 0, 10 3.5, 0 7" fill="#555" />');
  parts.push('</marker>');
  parts.push('</defs>');

  // Draw edges
  for (const edge of chart.edges) {
    const fromPos = positions.get(edge.from);
    const toPos = positions.get(edge.to);
    if (!fromPos || !toPos) continue;

    const x1 = fromPos.x + offsetX;
    const y1 = fromPos.y + offsetY;
    const x2 = toPos.x + offsetX;
    const y2 = toPos.y + offsetY;

    // Calculate edge start/end points on node boundaries
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);

    const startX = x1 + Math.cos(angle) * (fromPos.width / 2);
    const startY = y1 + Math.sin(angle) * (fromPos.height / 2);
    const endX = x2 - Math.cos(angle) * (toPos.width / 2);
    const endY = y2 - Math.sin(angle) * (toPos.height / 2);

    const strokeDash = edge.style === 'dotted' ? ' stroke-dasharray="5,5"' : '';
    const markerEnd = edge.arrowHead ? ' marker-end="url(#arrowhead)"' : '';

    parts.push(
      `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#555" stroke-width="2"${strokeDash}${markerEnd} />`
    );

    if (edge.label) {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      parts.push(
        `<rect x="${midX - 20}" y="${midY - 10}" width="40" height="20" fill="white" rx="3" />`
      );
      parts.push(
        `<text x="${midX}" y="${midY + 4}" text-anchor="middle" font-size="11" fill="#555">${escapeXml(edge.label)}</text>`
      );
    }
  }

  // Draw nodes
  chart.nodes.forEach((node, index) => {
    const pos = positions.get(node.id);
    if (!pos) return;

    const cx = pos.x + offsetX;
    const cy = pos.y + offsetY;
    const color = COLORS[index % COLORS.length];

    switch (node.shape) {
      case 'round':
        parts.push(
          `<rect x="${cx - pos.width / 2}" y="${cy - pos.height / 2}" width="${pos.width}" height="${pos.height}" rx="20" ry="20" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" />`
        );
        break;
      case 'diamond':
        parts.push(
          `<polygon points="${cx},${cy - pos.height / 2} ${cx + pos.width / 2},${cy} ${cx},${cy + pos.height / 2} ${cx - pos.width / 2},${cy}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" />`
        );
        break;
      case 'circle':
        parts.push(
          `<circle cx="${cx}" cy="${cy}" r="${Math.min(pos.width, pos.height) / 2}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" />`
        );
        break;
      default:
        parts.push(
          `<rect x="${cx - pos.width / 2}" y="${cy - pos.height / 2}" width="${pos.width}" height="${pos.height}" rx="5" ry="5" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" />`
        );
    }

    parts.push(
      `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-family="sans-serif" fill="#333">${escapeXml(node.label)}</text>`
    );
  });

  parts.push('</svg>');
  return parts.join('\n');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
