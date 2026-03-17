export interface XMLValidationResult {
  valid: boolean;
  error: string | null;
  formatted: string;
}

export function validateXML(xml: string): XMLValidationResult {
  if (!xml.trim()) return { valid: false, error: null, formatted: '' };

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const errorNode = doc.querySelector('parsererror');

  if (errorNode) {
    return { valid: false, error: errorNode.textContent ?? 'Invalid XML', formatted: '' };
  }

  const serializer = new XMLSerializer();
  const formatted = serializer.serializeToString(doc);

  return { valid: true, error: null, formatted };
}
