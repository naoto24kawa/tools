import { describe, it, expect } from 'vitest';
import { validateToml, parseToml } from '../tomlValidator';

describe('validateToml', () => {
  it('returns error for empty input', () => {
    const result = validateToml('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('validates simple key-value pairs', () => {
    const result = validateToml('name = "test"\nversion = 1');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.name).toBe('test');
    expect(parsed.version).toBe(1);
  });

  it('validates table headers', () => {
    const result = validateToml('[server]\nhost = "localhost"\nport = 8080');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.server.host).toBe('localhost');
    expect(parsed.server.port).toBe(8080);
  });

  it('validates boolean values', () => {
    const result = validateToml('enabled = true\ndisabled = false');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.enabled).toBe(true);
    expect(parsed.disabled).toBe(false);
  });

  it('validates arrays', () => {
    const result = validateToml('ports = [80, 443, 8080]');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.ports).toEqual([80, 443, 8080]);
  });

  it('validates string arrays', () => {
    const result = validateToml('tags = ["web", "api", "v2"]');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.tags).toEqual(['web', 'api', 'v2']);
  });

  it('validates inline tables', () => {
    const result = validateToml('point = {x = 1, y = 2}');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.point).toEqual({ x: 1, y: 2 });
  });

  it('handles comments', () => {
    const result = validateToml('# This is a comment\nname = "test"');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.name).toBe('test');
  });

  it('handles float values', () => {
    const result = validateToml('pi = 3.14');
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.pi).toBeCloseTo(3.14);
  });

  it('generates JSON output', () => {
    const result = validateToml('key = "value"');
    expect(result.json).toBeTruthy();
    expect(() => JSON.parse(result.json!)).not.toThrow();
  });

  it('handles literal strings', () => {
    const result = validateToml("path = 'C:\\\\Users\\\\test'");
    expect(result.valid).toBe(true);
    const parsed = JSON.parse(result.json!);
    expect(parsed.path).toBe('C:\\\\Users\\\\test');
  });
});

describe('parseToml', () => {
  it('parses array of tables', () => {
    const input = `[[servers]]
name = "alpha"

[[servers]]
name = "beta"`;
    const result = parseToml(input);
    expect(Array.isArray(result.servers)).toBe(true);
    const servers = result.servers as Record<string, unknown>[];
    expect(servers).toHaveLength(2);
    expect(servers[0].name).toBe('alpha');
    expect(servers[1].name).toBe('beta');
  });

  it('parses nested tables', () => {
    const input = `[database]
server = "192.168.1.1"
ports = [8001, 8001, 8002]
enabled = true`;
    const result = parseToml(input);
    const db = result.database as Record<string, unknown>;
    expect(db.server).toBe('192.168.1.1');
    expect(db.enabled).toBe(true);
  });
});
