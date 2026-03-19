import { describe, expect, it } from 'vitest';
import { parsePlantUml, generateClassDiagramSvg } from '../plantumlParser';

describe('parsePlantUml', () => {
  it('parses a simple class with members', () => {
    const input = `class Animal {
  +name: string
  -age: number
  +speak()
  #move(distance: number)
}`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes).toHaveLength(1);
    expect(diagram.classes[0].name).toBe('Animal');
    expect(diagram.classes[0].members).toHaveLength(4);
  });

  it('identifies fields and methods', () => {
    const input = `class User {
  +name: string
  +login()
}`;
    const diagram = parsePlantUml(input);
    const fields = diagram.classes[0].members.filter((m) => !m.isMethod);
    const methods = diagram.classes[0].members.filter((m) => m.isMethod);
    expect(fields).toHaveLength(1);
    expect(methods).toHaveLength(1);
  });

  it('parses visibility modifiers', () => {
    const input = `class Test {
  +public
  -private
  #protected
  ~package
}`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes[0].members[0].visibility).toBe('+');
    expect(diagram.classes[0].members[1].visibility).toBe('-');
    expect(diagram.classes[0].members[2].visibility).toBe('#');
    expect(diagram.classes[0].members[3].visibility).toBe('~');
  });

  it('parses extends relation', () => {
    const input = `class Animal {
}
class Dog {
}
Dog --|> Animal`;
    const diagram = parsePlantUml(input);
    expect(diagram.relations).toHaveLength(1);
    expect(diagram.relations[0].type).toBe('extends');
    expect(diagram.relations[0].from).toBe('Dog');
    expect(diagram.relations[0].to).toBe('Animal');
  });

  it('parses implements relation', () => {
    const input = `interface Serializable {
}
class User {
}
User ..|> Serializable`;
    const diagram = parsePlantUml(input);
    expect(diagram.relations).toHaveLength(1);
    expect(diagram.relations[0].type).toBe('implements');
  });

  it('parses interface with stereotype', () => {
    const input = `interface Repository {
  +findById(id: string)
  +save(entity: T)
}`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes[0].stereotype).toBe('interface');
  });

  it('parses class with stereotype', () => {
    const input = `class UserService <<service>> {
  +getUser()
}`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes[0].stereotype).toBe('service');
  });

  it('parses simple class without body', () => {
    const diagram = parsePlantUml('class Helper');
    expect(diagram.classes).toHaveLength(1);
    expect(diagram.classes[0].name).toBe('Helper');
    expect(diagram.classes[0].members).toHaveLength(0);
  });

  it('parses relation with label', () => {
    const input = `class Order {
}
class Customer {
}
Customer --> Order : places`;
    const diagram = parsePlantUml(input);
    expect(diagram.relations[0].label).toBe('places');
  });

  it('skips @startuml and @enduml', () => {
    const input = `@startuml
class A {
}
@enduml`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes).toHaveLength(1);
  });

  it('handles empty input', () => {
    const diagram = parsePlantUml('');
    expect(diagram.classes).toHaveLength(0);
    expect(diagram.relations).toHaveLength(0);
  });

  it('parses multiple classes', () => {
    const input = `class A {
  +field1
}
class B {
  -field2
}
class C {
  #field3
}`;
    const diagram = parsePlantUml(input);
    expect(diagram.classes).toHaveLength(3);
  });
});

describe('generateClassDiagramSvg', () => {
  it('generates valid SVG for classes', () => {
    const diagram = parsePlantUml(`class User {
  +name: string
  +login()
}`);
    const svg = generateClassDiagramSvg(diagram);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('User');
    expect(svg).toContain('name');
    expect(svg).toContain('login');
  });

  it('generates placeholder for empty diagram', () => {
    const diagram = parsePlantUml('');
    const svg = generateClassDiagramSvg(diagram);
    expect(svg).toContain('No classes defined');
  });

  it('includes arrow markers', () => {
    const diagram = parsePlantUml(`class A {
}
class B {
}
A --|> B`);
    const svg = generateClassDiagramSvg(diagram);
    expect(svg).toContain('marker');
  });
});
