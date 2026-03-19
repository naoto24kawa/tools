export interface ProtoField {
  name: string;
  type: string;
  number: number;
  repeated: boolean;
  optional: boolean;
  mapKeyType?: string;
  mapValueType?: string;
}

export interface ProtoOneOf {
  name: string;
  fields: ProtoField[];
}

export interface ProtoEnum {
  name: string;
  values: { name: string; number: number }[];
}

export interface ProtoMessage {
  name: string;
  fields: ProtoField[];
  oneofs: ProtoOneOf[];
  nestedMessages: ProtoMessage[];
  nestedEnums: ProtoEnum[];
}

function getDefaultValue(
  type: string,
  messages: Map<string, ProtoMessage>,
  enums: Map<string, ProtoEnum>,
): unknown {
  switch (type) {
    case 'double':
    case 'float':
      return 0.0;
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'fixed32':
    case 'fixed64':
    case 'sfixed32':
    case 'sfixed64':
      return 0;
    case 'bool':
      return false;
    case 'string':
      return '';
    case 'bytes':
      return '';
    default: {
      // Check if it's an enum
      const enumDef = enums.get(type);
      if (enumDef && enumDef.values.length > 0) {
        return enumDef.values[0].name;
      }
      // Check if it's a nested message
      const msgDef = messages.get(type);
      if (msgDef) {
        return messageToJson(msgDef, messages, enums);
      }
      return {};
    }
  }
}

function messageToJson(
  message: ProtoMessage,
  messages: Map<string, ProtoMessage>,
  enums: Map<string, ProtoEnum>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  // Register nested messages and enums
  for (const nested of message.nestedMessages) {
    messages.set(nested.name, nested);
  }
  for (const nested of message.nestedEnums) {
    enums.set(nested.name, nested);
  }

  for (const field of message.fields) {
    if (field.mapKeyType && field.mapValueType) {
      // Map field
      const keyExample = field.mapKeyType === 'string' ? 'key' : '1';
      const valueExample = getDefaultValue(field.mapValueType, messages, enums);
      result[field.name] = { [keyExample]: valueExample };
    } else if (field.repeated) {
      result[field.name] = [getDefaultValue(field.type, messages, enums)];
    } else {
      result[field.name] = getDefaultValue(field.type, messages, enums);
    }
  }

  // Handle oneofs - include the first field of each oneof
  for (const oneof of message.oneofs) {
    if (oneof.fields.length > 0) {
      const field = oneof.fields[0];
      result[field.name] = getDefaultValue(field.type, messages, enums);
    }
  }

  return result;
}

function parseEnum(content: string): ProtoEnum {
  const nameMatch = content.match(/enum\s+(\w+)\s*\{/);
  const name = nameMatch ? nameMatch[1] : 'Unknown';

  const values: { name: string; number: number }[] = [];
  const valueRegex = /(\w+)\s*=\s*(\d+)/g;
  let match;
  while ((match = valueRegex.exec(content)) !== null) {
    values.push({ name: match[1], number: parseInt(match[2], 10) });
  }

  return { name, values };
}

function extractBody(content: string): string {
  const firstBrace = content.indexOf('{');
  if (firstBrace === -1) return content;

  let depth = 0;
  let lastBrace = content.length - 1;
  for (let i = firstBrace; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        lastBrace = i;
        break;
      }
    }
  }

  return content.slice(firstBrace + 1, lastBrace);
}

function extractBraceContent(content: string, startIdx: number): string | null {
  const braceStart = content.indexOf('{', startIdx);
  if (braceStart === -1) return null;

  let depth = 0;
  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        return content.slice(startIdx, i + 1);
      }
    }
  }

  return null;
}

function parseMessage(content: string): ProtoMessage {
  const nameMatch = content.match(/message\s+(\w+)\s*\{/);
  const name = nameMatch ? nameMatch[1] : 'Unknown';

  const fields: ProtoField[] = [];
  const oneofs: ProtoOneOf[] = [];
  const nestedMessages: ProtoMessage[] = [];
  const nestedEnums: ProtoEnum[] = [];

  // Remove nested message/enum blocks first, collecting them
  let body = extractBody(content);

  // Parse nested messages
  const nestedMsgRegex = /message\s+\w+\s*\{/g;
  let msgMatch;
  while ((msgMatch = nestedMsgRegex.exec(body)) !== null) {
    const startIdx = msgMatch.index;
    const nestedBody = extractBraceContent(body, startIdx);
    if (nestedBody) {
      nestedMessages.push(parseMessage(nestedBody));
      body = body.slice(0, startIdx) + body.slice(startIdx + nestedBody.length);
      nestedMsgRegex.lastIndex = startIdx;
    }
  }

  // Parse nested enums
  const nestedEnumRegex = /enum\s+\w+\s*\{/g;
  let enumMatch;
  while ((enumMatch = nestedEnumRegex.exec(body)) !== null) {
    const startIdx = enumMatch.index;
    const nestedBody = extractBraceContent(body, startIdx);
    if (nestedBody) {
      nestedEnums.push(parseEnum(nestedBody));
      body = body.slice(0, startIdx) + body.slice(startIdx + nestedBody.length);
      nestedEnumRegex.lastIndex = startIdx;
    }
  }

  // Parse oneof blocks
  const oneofRegex = /oneof\s+(\w+)\s*\{([^}]*)\}/g;
  let oneofMatch;
  while ((oneofMatch = oneofRegex.exec(body)) !== null) {
    const oneofName = oneofMatch[1];
    const oneofBody = oneofMatch[2];
    const oneofFields: ProtoField[] = [];

    const fieldRegex = /(\w[\w.]*)\s+(\w+)\s*=\s*(\d+)/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(oneofBody)) !== null) {
      oneofFields.push({
        name: fieldMatch[2],
        type: fieldMatch[1],
        number: parseInt(fieldMatch[3], 10),
        repeated: false,
        optional: false,
      });
    }

    oneofs.push({ name: oneofName, fields: oneofFields });
  }

  // Remove oneof blocks from body for regular field parsing
  body = body.replace(/oneof\s+\w+\s*\{[^}]*\}/g, '');

  // Parse regular fields
  const fieldRegex =
    /(repeated|optional)?\s*(map<\s*(\w+)\s*,\s*([\w.]+)\s*>|[\w.]+)\s+(\w+)\s*=\s*(\d+)/g;
  let fieldMatch;
  while ((fieldMatch = fieldRegex.exec(body)) !== null) {
    const modifier = fieldMatch[1] || '';
    const fullType = fieldMatch[2];
    const mapKeyType = fieldMatch[3];
    const mapValueType = fieldMatch[4];
    const fieldName = fieldMatch[5];
    const fieldNumber = parseInt(fieldMatch[6], 10);

    const field: ProtoField = {
      name: fieldName,
      type: mapKeyType ? 'map' : fullType,
      number: fieldNumber,
      repeated: modifier === 'repeated',
      optional: modifier === 'optional',
    };

    if (mapKeyType && mapValueType) {
      field.mapKeyType = mapKeyType;
      field.mapValueType = mapValueType;
    }

    fields.push(field);
  }

  return { name, fields, oneofs, nestedMessages, nestedEnums };
}

// Note: This is a pure client-side .proto text parser. It only parses
// protobuf definition text to extract structure - no code execution occurs.
export function parse(proto: string): ProtoMessage[] {
  if (!proto.trim()) {
    throw new Error('Input is empty');
  }

  // Remove comments
  let cleaned = proto.replace(/\/\/.*$/gm, '');
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

  const messages: ProtoMessage[] = [];

  // Find top-level messages
  const msgRegex = /message\s+\w+\s*\{/g;
  let match;

  while ((match = msgRegex.exec(cleaned)) !== null) {
    // Check this is top-level (no preceding opening braces unclosed)
    const before = cleaned.slice(0, match.index);
    const openBraces = (before.match(/\{/g) || []).length;
    const closeBraces = (before.match(/\}/g) || []).length;

    if (openBraces === closeBraces) {
      const fullContent = extractBraceContent(cleaned, match.index);
      if (fullContent) {
        messages.push(parseMessage(fullContent));
      }
    }
  }

  if (messages.length === 0) {
    throw new Error('No message definitions found');
  }

  return messages;
}

export function toJson(messages: ProtoMessage[], prettyPrint: boolean = true): string {
  const allMessages = new Map<string, ProtoMessage>();
  const allEnums = new Map<string, ProtoEnum>();

  // First pass: collect all messages
  for (const msg of messages) {
    allMessages.set(msg.name, msg);
    for (const nested of msg.nestedMessages) {
      allMessages.set(nested.name, nested);
    }
    for (const nested of msg.nestedEnums) {
      allEnums.set(nested.name, nested);
    }
  }

  if (messages.length === 1) {
    const result = messageToJson(messages[0], allMessages, allEnums);
    return JSON.stringify(result, null, prettyPrint ? 2 : undefined);
  }

  const result: Record<string, unknown> = {};
  for (const msg of messages) {
    result[msg.name] = messageToJson(msg, allMessages, allEnums);
  }

  return JSON.stringify(result, null, prettyPrint ? 2 : undefined);
}
