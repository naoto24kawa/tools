import { describe, expect, it } from 'vitest';
import { parseERInput, generateERSvg } from '../erDiagram';

describe('parseERInput', () => {
  it('parses a simple table definition', () => {
    const input = `[Users]
id INT PK
name VARCHAR(100)
email VARCHAR(255)`;
    const model = parseERInput(input);
    expect(model.tables).toHaveLength(1);
    expect(model.tables[0].name).toBe('Users');
    expect(model.tables[0].columns).toHaveLength(3);
    expect(model.tables[0].columns[0].isPK).toBe(true);
    expect(model.tables[0].columns[1].isPK).toBe(false);
  });

  it('parses FK relationships', () => {
    const input = `[Users]
id INT PK
name VARCHAR(100)

[Posts]
id INT PK
user_id INT FK -> Users.id
title VARCHAR(255)`;
    const model = parseERInput(input);
    expect(model.tables).toHaveLength(2);
    expect(model.relationships).toHaveLength(1);
    expect(model.relationships[0].from).toBe('Posts');
    expect(model.relationships[0].fromColumn).toBe('user_id');
    expect(model.relationships[0].to).toBe('Users');
    expect(model.relationships[0].toColumn).toBe('id');
  });

  it('handles multiple tables', () => {
    const input = `[Users]
id INT PK

[Posts]
id INT PK

[Comments]
id INT PK`;
    const model = parseERInput(input);
    expect(model.tables).toHaveLength(3);
  });

  it('skips comment lines', () => {
    const input = `# This is a comment
[Users]
// Another comment
id INT PK`;
    const model = parseERInput(input);
    expect(model.tables).toHaveLength(1);
    expect(model.tables[0].columns).toHaveLength(1);
  });

  it('handles empty input', () => {
    const model = parseERInput('');
    expect(model.tables).toHaveLength(0);
    expect(model.relationships).toHaveLength(0);
  });

  it('supports "table" keyword syntax', () => {
    const input = `table Users
id INT PK
name VARCHAR(100)`;
    const model = parseERInput(input);
    expect(model.tables).toHaveLength(1);
    expect(model.tables[0].name).toBe('Users');
  });
});

describe('generateERSvg', () => {
  it('generates valid SVG for tables', () => {
    const model = parseERInput(`[Users]
id INT PK
name VARCHAR(100)`);
    const svg = generateERSvg(model);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Users');
    expect(svg).toContain('id');
    expect(svg).toContain('INT');
  });

  it('generates placeholder for empty model', () => {
    const model = parseERInput('');
    const svg = generateERSvg(model);
    expect(svg).toContain('No tables defined');
  });

  it('includes relationship arrows for FK references', () => {
    const model = parseERInput(`[Users]
id INT PK

[Posts]
id INT PK
user_id INT FK -> Users.id`);
    const svg = generateERSvg(model);
    expect(svg).toContain('marker');
    expect(svg).toContain('fk-arrow');
  });
});
