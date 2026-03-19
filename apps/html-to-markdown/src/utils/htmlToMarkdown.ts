function getTextContent(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return convertNode(node as Element);
  }
  return '';
}

function convertChildren(element: Element): string {
  let result = '';
  for (let i = 0; i < element.childNodes.length; i++) {
    result += getTextContent(element.childNodes[i]);
  }
  return result;
}

function convertTable(table: Element): string {
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return '';

  const tableData: string[][] = [];

  rows.forEach((row) => {
    const cells: string[] = [];
    row.querySelectorAll('th, td').forEach((cell) => {
      cells.push(convertChildren(cell).trim());
    });
    tableData.push(cells);
  });

  if (tableData.length === 0) return '';

  // Determine column count
  const colCount = Math.max(...tableData.map((row) => row.length));

  // Normalize rows
  const normalized = tableData.map((row) => {
    while (row.length < colCount) row.push('');
    return row;
  });

  // Column widths
  const widths = Array.from({ length: colCount }, (_, col) =>
    Math.max(3, ...normalized.map((row) => row[col].length))
  );

  // Build table
  const lines: string[] = [];

  // Header row
  const headerRow = normalized[0]
    .map((cell, i) => cell.padEnd(widths[i]))
    .join(' | ');
  lines.push(`| ${headerRow} |`);

  // Separator
  const separator = widths.map((w) => '-'.repeat(w)).join(' | ');
  lines.push(`| ${separator} |`);

  // Data rows
  for (let r = 1; r < normalized.length; r++) {
    const dataRow = normalized[r]
      .map((cell, i) => cell.padEnd(widths[i]))
      .join(' | ');
    lines.push(`| ${dataRow} |`);
  }

  return '\n' + lines.join('\n') + '\n';
}

function convertList(element: Element, ordered: boolean, depth: number = 0): string {
  let result = '';
  const indent = '  '.repeat(depth);
  let counter = 1;

  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.tagName === 'LI') {
      // Get direct text content (excluding nested lists)
      let itemText = '';
      let nestedList = '';

      for (let j = 0; j < child.childNodes.length; j++) {
        const node = child.childNodes[j];
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          if (el.tagName === 'UL') {
            nestedList += convertList(el, false, depth + 1);
          } else if (el.tagName === 'OL') {
            nestedList += convertList(el, true, depth + 1);
          } else {
            itemText += convertNode(el);
          }
        } else {
          itemText += node.textContent || '';
        }
      }

      const prefix = ordered ? `${counter}. ` : '- ';
      result += `${indent}${prefix}${itemText.trim()}\n`;
      if (nestedList) {
        result += nestedList;
      }
      counter++;
    }
  }

  return result;
}

function convertNode(element: Element): string {
  const tag = element.tagName;

  switch (tag) {
    case 'H1':
      return `\n# ${convertChildren(element).trim()}\n\n`;
    case 'H2':
      return `\n## ${convertChildren(element).trim()}\n\n`;
    case 'H3':
      return `\n### ${convertChildren(element).trim()}\n\n`;
    case 'H4':
      return `\n#### ${convertChildren(element).trim()}\n\n`;
    case 'H5':
      return `\n##### ${convertChildren(element).trim()}\n\n`;
    case 'H6':
      return `\n###### ${convertChildren(element).trim()}\n\n`;

    case 'P':
      return `\n${convertChildren(element).trim()}\n\n`;

    case 'BR':
      return '  \n';

    case 'HR':
      return '\n---\n\n';

    case 'STRONG':
    case 'B':
      return `**${convertChildren(element).trim()}**`;

    case 'EM':
    case 'I':
      return `*${convertChildren(element).trim()}*`;

    case 'S':
    case 'DEL':
      return `~~${convertChildren(element).trim()}~~`;

    case 'A': {
      const href = element.getAttribute('href') || '';
      const text = convertChildren(element).trim();
      const title = element.getAttribute('title');
      if (title) {
        return `[${text}](${href} "${title}")`;
      }
      return `[${text}](${href})`;
    }

    case 'IMG': {
      const src = element.getAttribute('src') || '';
      const alt = element.getAttribute('alt') || '';
      const title = element.getAttribute('title');
      if (title) {
        return `![${alt}](${src} "${title}")`;
      }
      return `![${alt}](${src})`;
    }

    case 'CODE': {
      const parent = element.parentElement;
      if (parent && parent.tagName === 'PRE') {
        return convertChildren(element);
      }
      return `\`${convertChildren(element)}\``;
    }

    case 'PRE': {
      const codeEl = element.querySelector('code');
      const content = codeEl ? convertChildren(codeEl) : convertChildren(element);
      const lang = codeEl?.getAttribute('class')?.match(/language-(\w+)/)?.[1] || '';
      return `\n\`\`\`${lang}\n${content.trim()}\n\`\`\`\n\n`;
    }

    case 'BLOCKQUOTE': {
      const content = convertChildren(element).trim();
      const lines = content.split('\n');
      return '\n' + lines.map((line) => `> ${line}`).join('\n') + '\n\n';
    }

    case 'UL':
      return '\n' + convertList(element, false);

    case 'OL':
      return '\n' + convertList(element, true);

    case 'TABLE':
      return convertTable(element);

    case 'THEAD':
    case 'TBODY':
    case 'TFOOT':
    case 'TR':
    case 'TH':
    case 'TD':
      // These are handled by convertTable
      return convertChildren(element);

    case 'DIV':
    case 'SECTION':
    case 'ARTICLE':
    case 'MAIN':
    case 'HEADER':
    case 'FOOTER':
    case 'NAV':
    case 'ASIDE':
    case 'SPAN':
      return convertChildren(element);

    default:
      return convertChildren(element);
  }
}

export function convert(html: string): string {
  if (!html.trim()) {
    throw new Error('Input is empty');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const body = doc.body;
  let result = convertChildren(body);

  // Clean up excessive newlines
  result = result.replace(/\n{3,}/g, '\n\n');
  result = result.trim() + '\n';

  return result;
}
