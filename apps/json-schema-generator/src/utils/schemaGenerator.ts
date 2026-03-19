export interface SchemaOptions {
  includeExamples: boolean;
  requireAll: boolean;
  prettyPrint: boolean;
}

export const defaultOptions: SchemaOptions = {
  includeExamples: true,
  requireAll: true,
  prettyPrint: true,
};

interface JsonSchema {
  $schema?: string;
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  examples?: unknown[];
  enum?: unknown[];
  oneOf?: JsonSchema[];
  [key: string]: unknown;
}

function inferType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function generateSchemaForValue(value: unknown, options: SchemaOptions): JsonSchema {
  if (value === null) {
    const schema: JsonSchema = { type: 'null' };
    if (options.includeExamples) {
      schema.examples = [null];
    }
    return schema;
  }

  if (Array.isArray(value)) {
    const schema: JsonSchema = { type: 'array' };

    if (value.length > 0) {
      // Check if all items are the same type
      const types = new Set(value.map(inferType));

      if (types.size === 1) {
        schema.items = generateSchemaForValue(value[0], options);

        // For objects, merge all items' properties
        if (types.has('object')) {
          const mergedSchema = mergeObjectSchemas(
            value as Record<string, unknown>[],
            options
          );
          schema.items = mergedSchema;
        }
      } else {
        // Mixed types
        const typeSchemas: JsonSchema[] = [];
        const seenTypes = new Set<string>();

        for (const item of value) {
          const type = inferType(item);
          if (!seenTypes.has(type)) {
            seenTypes.add(type);
            typeSchemas.push(generateSchemaForValue(item, options));
          }
        }

        schema.items = { oneOf: typeSchemas };
      }
    }

    if (options.includeExamples && value.length > 0) {
      schema.examples = [value.slice(0, 3)];
    }

    return schema;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const schema: JsonSchema = { type: 'object' };
    const properties: Record<string, JsonSchema> = {};

    const keys = Object.keys(obj);

    for (const key of keys) {
      properties[key] = generateSchemaForValue(obj[key], options);
    }

    schema.properties = properties;

    if (options.requireAll && keys.length > 0) {
      schema.required = keys;
    }

    return schema;
  }

  if (typeof value === 'string') {
    const schema: JsonSchema = { type: 'string' };

    // Detect formats
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      schema.format = 'date';
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      schema.format = 'date-time';
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      schema.format = 'email';
    } else if (/^https?:\/\//.test(value)) {
      schema.format = 'uri';
    }

    if (options.includeExamples) {
      schema.examples = [value];
    }

    return schema;
  }

  if (typeof value === 'number') {
    const schema: JsonSchema = {
      type: Number.isInteger(value) ? 'integer' : 'number',
    };
    if (options.includeExamples) {
      schema.examples = [value];
    }
    return schema;
  }

  if (typeof value === 'boolean') {
    const schema: JsonSchema = { type: 'boolean' };
    if (options.includeExamples) {
      schema.examples = [value];
    }
    return schema;
  }

  return {};
}

function mergeObjectSchemas(
  objects: Record<string, unknown>[],
  options: SchemaOptions
): JsonSchema {
  const allKeys = new Set<string>();
  for (const obj of objects) {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  }

  const properties: Record<string, JsonSchema> = {};

  for (const key of allKeys) {
    // Find first non-undefined value for this key
    for (const obj of objects) {
      if (key in obj) {
        properties[key] = generateSchemaForValue(obj[key], options);
        break;
      }
    }
  }

  const schema: JsonSchema = {
    type: 'object',
    properties,
  };

  if (options.requireAll) {
    // Only require keys that exist in all objects
    const requiredKeys = [...allKeys].filter((key) =>
      objects.every((obj) => key in obj)
    );
    if (requiredKeys.length > 0) {
      schema.required = requiredKeys;
    }
  }

  return schema;
}

export function generate(jsonStr: string, options: SchemaOptions = defaultOptions): string {
  if (!jsonStr.trim()) {
    throw new Error('Input is empty');
  }

  let data: unknown;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid JSON: ' + (e instanceof Error ? e.message : 'Parse error'));
  }

  const schema: JsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...generateSchemaForValue(data, options),
  };

  return JSON.stringify(schema, null, options.prettyPrint ? 2 : undefined);
}
