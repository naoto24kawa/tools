import { describe, it, expect } from 'vitest';
import {
  DECISION_TREE,
  getNode,
  getStartNode,
  generateHtmlSnippet,
  GENERAL_TIPS,
} from '../altTextGuide';

describe('DECISION_TREE', () => {
  it('should contain nodes', () => {
    expect(DECISION_TREE.length).toBeGreaterThan(5);
  });

  it('should have a start node', () => {
    expect(DECISION_TREE[0].id).toBe('start');
  });

  it('all referenced node IDs should exist', () => {
    const ids = new Set(DECISION_TREE.map((n) => n.id));
    for (const node of DECISION_TREE) {
      if (node.yesId) expect(ids.has(node.yesId)).toBe(true);
      if (node.noId) expect(ids.has(node.noId)).toBe(true);
    }
  });

  it('leaf nodes should have a result', () => {
    const leaves = DECISION_TREE.filter((n) => n.yesId === null && n.noId === null);
    for (const leaf of leaves) {
      expect(leaf.result).toBeDefined();
      expect(leaf.result!.recommendation).toBeTruthy();
      expect(leaf.result!.altAttribute).toBeTruthy();
    }
  });
});

describe('getNode', () => {
  it('should return a node by ID', () => {
    const node = getNode('start');
    expect(node).toBeDefined();
    expect(node!.id).toBe('start');
  });

  it('should return undefined for unknown ID', () => {
    expect(getNode('nonexistent')).toBeUndefined();
  });
});

describe('getStartNode', () => {
  it('should return the first node', () => {
    const start = getStartNode();
    expect(start.id).toBe('start');
    expect(start.question).toBeTruthy();
  });
});

describe('generateHtmlSnippet', () => {
  it('should generate an img tag with alt', () => {
    const snippet = generateHtmlSnippet('alt="A beautiful sunset"');
    expect(snippet).toContain('<img');
    expect(snippet).toContain('alt="A beautiful sunset"');
  });

  it('should generate an img tag with empty alt', () => {
    const snippet = generateHtmlSnippet('alt=""');
    expect(snippet).toContain('alt=""');
  });
});

describe('GENERAL_TIPS', () => {
  it('should have multiple tips', () => {
    expect(GENERAL_TIPS.length).toBeGreaterThanOrEqual(4);
  });
});
