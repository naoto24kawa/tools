export interface XmlToJsonOptions {
  includeAttributes: boolean;
  attributePrefix: string;
  textContentKey: string;
  prettyPrint: boolean;
}

export const defaultOptions: XmlToJsonOptions = {
  includeAttributes: true,
  attributePrefix: '@',
  textContentKey: '#text',
  prettyPrint: true,
};

function nodeToJson(node: Element, options: XmlToJsonOptions): unknown {
  const result: Record<string, unknown> = {};

  // Handle attributes
  if (options.includeAttributes && node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      result[`${options.attributePrefix}${attr.name}`] = attr.value;
    }
  }

  // Handle child nodes
  const children = node.childNodes;
  let hasElementChildren = false;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      hasElementChildren = true;
      const childElement = child as Element;
      const tagName = childElement.tagName;
      const childValue = nodeToJson(childElement, options);

      if (tagName in result) {
        const existing = result[tagName];
        if (Array.isArray(existing)) {
          existing.push(childValue);
        } else {
          result[tagName] = [existing, childValue];
        }
      } else {
        result[tagName] = childValue;
      }
    }
  }

  // Handle text content
  const textContent = Array.from(children)
    .filter((child) => child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE)
    .map((child) => child.textContent || '')
    .join('')
    .trim();

  if (textContent) {
    if (hasElementChildren || Object.keys(result).length > 0) {
      result[options.textContentKey] = textContent;
    } else {
      return textContent;
    }
  }

  if (Object.keys(result).length === 0 && !textContent) {
    return null;
  }

  return result;
}

export function convert(xml: string, options: XmlToJsonOptions = defaultOptions): string {
  if (!xml.trim()) {
    throw new Error('Input is empty');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('Invalid XML: ' + (errorNode.textContent || 'Parse error'));
  }

  const root = doc.documentElement;
  const result: Record<string, unknown> = {};
  result[root.tagName] = nodeToJson(root, options);

  return JSON.stringify(result, null, options.prettyPrint ? 2 : undefined);
}
