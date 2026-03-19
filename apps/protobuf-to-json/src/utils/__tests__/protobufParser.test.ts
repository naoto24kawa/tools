import { describe, it, expect } from 'vitest';
import { parse, toJson } from '../protobufParser';

describe('protobufParser', () => {
  describe('parse', () => {
    it('parses a simple message', () => {
      const proto = `
        message User {
          string name = 1;
          int32 age = 2;
        }
      `;
      const messages = parse(proto);
      expect(messages).toHaveLength(1);
      expect(messages[0].name).toBe('User');
      expect(messages[0].fields).toHaveLength(2);
    });

    it('parses repeated fields', () => {
      const proto = `
        message User {
          string name = 1;
          repeated string tags = 2;
        }
      `;
      const messages = parse(proto);
      expect(messages[0].fields[1].repeated).toBe(true);
    });

    it('parses optional fields', () => {
      const proto = `
        message User {
          optional string nickname = 1;
        }
      `;
      const messages = parse(proto);
      expect(messages[0].fields[0].optional).toBe(true);
    });

    it('parses oneof', () => {
      const proto = `
        message Event {
          string id = 1;
          oneof payload {
            string text = 2;
            int32 number = 3;
          }
        }
      `;
      const messages = parse(proto);
      expect(messages[0].oneofs).toHaveLength(1);
      expect(messages[0].oneofs[0].name).toBe('payload');
      expect(messages[0].oneofs[0].fields).toHaveLength(2);
    });

    it('parses nested messages', () => {
      const proto = `
        message Outer {
          message Inner {
            string value = 1;
          }
          Inner inner = 1;
        }
      `;
      const messages = parse(proto);
      expect(messages[0].nestedMessages).toHaveLength(1);
      expect(messages[0].nestedMessages[0].name).toBe('Inner');
    });

    it('parses multiple messages', () => {
      const proto = `
        message User {
          string name = 1;
        }
        message Post {
          string title = 1;
        }
      `;
      const messages = parse(proto);
      expect(messages).toHaveLength(2);
    });

    it('removes comments', () => {
      const proto = `
        // This is a comment
        message User {
          string name = 1; // inline comment
          /* block comment */
          int32 age = 2;
        }
      `;
      const messages = parse(proto);
      expect(messages[0].fields).toHaveLength(2);
    });

    it('throws on empty input', () => {
      expect(() => parse('')).toThrow('Input is empty');
    });

    it('throws when no messages found', () => {
      expect(() => parse('syntax = "proto3";')).toThrow('No message definitions found');
    });
  });

  describe('toJson', () => {
    it('generates JSON with default values', () => {
      const proto = `
        message User {
          string name = 1;
          int32 age = 2;
          bool active = 3;
        }
      `;
      const messages = parse(proto);
      const json = JSON.parse(toJson(messages));
      expect(json.name).toBe('');
      expect(json.age).toBe(0);
      expect(json.active).toBe(false);
    });

    it('generates array for repeated fields', () => {
      const proto = `
        message User {
          repeated string tags = 1;
        }
      `;
      const messages = parse(proto);
      const json = JSON.parse(toJson(messages));
      expect(Array.isArray(json.tags)).toBe(true);
    });

    it('handles oneof by including first field', () => {
      const proto = `
        message Event {
          oneof payload {
            string text = 1;
            int32 number = 2;
          }
        }
      `;
      const messages = parse(proto);
      const json = JSON.parse(toJson(messages));
      expect(json.text).toBe('');
    });

    it('handles nested message references', () => {
      const proto = `
        message Outer {
          message Inner {
            string value = 1;
          }
          Inner inner = 2;
        }
      `;
      const messages = parse(proto);
      const json = JSON.parse(toJson(messages));
      expect(json.inner).toEqual({ value: '' });
    });

    it('wraps multiple messages', () => {
      const proto = `
        message A { string x = 1; }
        message B { int32 y = 1; }
      `;
      const messages = parse(proto);
      const json = JSON.parse(toJson(messages));
      expect(json.A).toBeDefined();
      expect(json.B).toBeDefined();
    });
  });
});
