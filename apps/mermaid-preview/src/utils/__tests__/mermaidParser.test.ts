import { describe, expect, it } from 'vitest';
import { parseFlowchart, generateSvg } from '../mermaidParser';

describe('parseFlowchart', () => {
  it('parses simple A --> B edge', () => {
    const result = parseFlowchart('A --> B');
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0].from).toBe('A');
    expect(result.edges[0].to).toBe('B');
    expect(result.edges[0].arrowHead).toBe(true);
  });

  it('parses nodes with labels', () => {
    const result = parseFlowchart('A[Start] --> B[End]');
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes[0].label).toBe('Start');
    expect(result.nodes[1].label).toBe('End');
  });

  it('parses round nodes with parentheses', () => {
    const result = parseFlowchart('A(Rounded) --> B');
    expect(result.nodes[0].shape).toBe('round');
    expect(result.nodes[0].label).toBe('Rounded');
  });

  it('parses diamond nodes with braces', () => {
    const result = parseFlowchart('A{Decision} --> B');
    expect(result.nodes[0].shape).toBe('diamond');
    expect(result.nodes[0].label).toBe('Decision');
  });

  it('parses graph direction', () => {
    const result = parseFlowchart('graph LR\nA --> B');
    expect(result.direction).toBe('LR');
    expect(result.nodes).toHaveLength(2);
  });

  it('parses edge labels', () => {
    const result = parseFlowchart('A -->|yes| B');
    expect(result.edges[0].label).toBe('yes');
  });

  it('parses dashed edges', () => {
    const result = parseFlowchart('A -.-> B');
    expect(result.edges[0].style).toBe('dotted');
  });

  it('parses line without arrow', () => {
    const result = parseFlowchart('A --- B');
    expect(result.edges[0].arrowHead).toBe(false);
    expect(result.edges[0].style).toBe('solid');
  });

  it('handles multiple edges', () => {
    const input = `graph TB
A[Start] --> B[Process]
B --> C{Decision}
C -->|yes| D[End]
C -->|no| B`;
    const result = parseFlowchart(input);
    expect(result.nodes).toHaveLength(4);
    expect(result.edges).toHaveLength(4);
  });

  it('skips comments', () => {
    const input = `%% this is a comment
A --> B`;
    const result = parseFlowchart(input);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
  });

  it('returns empty chart for empty input', () => {
    const result = parseFlowchart('');
    expect(result.nodes).toHaveLength(0);
    expect(result.edges).toHaveLength(0);
  });
});

describe('generateSvg', () => {
  it('generates valid SVG for simple chart', () => {
    const chart = parseFlowchart('A[Start] --> B[End]');
    const svg = generateSvg(chart);
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Start');
    expect(svg).toContain('End');
  });

  it('generates placeholder for empty chart', () => {
    const chart = parseFlowchart('');
    const svg = generateSvg(chart);
    expect(svg).toContain('No diagram to display');
  });

  it('contains arrowhead marker', () => {
    const chart = parseFlowchart('A --> B');
    const svg = generateSvg(chart);
    expect(svg).toContain('marker');
    expect(svg).toContain('arrowhead');
  });
});
