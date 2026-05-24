import { describe, expect, it } from 'vitest';

import {
  buildTreeFromParentPath,
  buildTreeFromPaths,
  filterRelevantNodes,
} from './tree';

describe('buildTreeFromPaths', () => {
  it('builds a single-level tree (skipLevels=1 drops the top segment)', () => {
    const items = [{ path: 'Files/Reports' }, { path: 'Files/Invoices' }];

    const tree = buildTreeFromPaths(items, (i) => i.path);

    // skipLevels=1 drops "Files", so Reports and Invoices become roots.
    expect(tree).toHaveLength(2);
    expect(tree[0].label).toBe('Reports');
    expect(tree[0].isLeaf).toBe(true);
    expect(tree[1].label).toBe('Invoices');
  });

  it('builds a multi-level tree with intermediate nodes', () => {
    const items = [
      { path: 'Files/Reports/Monthly' },
      { path: 'Files/Reports/Quarterly' },
    ];

    const tree = buildTreeFromPaths(items, (i) => i.path);

    expect(tree).toHaveLength(1);
    expect(tree[0].label).toBe('Reports');
    expect(tree[0].isLeaf).toBe(false);
    expect(tree[0].data).toBeNull();
    expect(tree[0].children).toHaveLength(2);
    expect(tree[0].children[0].label).toBe('Monthly');
    expect(tree[0].children[0].isLeaf).toBe(true);
    expect(tree[0].children[0].data).toEqual(items[0]);
  });

  it('returns an empty array when given an empty list', () => {
    expect(buildTreeFromPaths([], (i: { path: string }) => i.path)).toEqual([]);
  });

  it('honors skipLevels', () => {
    const items = [{ path: 'A/B/C' }];

    const skip0 = buildTreeFromPaths(items, (i) => i.path, 0);
    expect(skip0).toHaveLength(1);
    expect(skip0[0].label).toBe('A');

    const skip2 = buildTreeFromPaths(items, (i) => i.path, 2);
    expect(skip2).toHaveLength(1);
    expect(skip2[0].label).toBe('C');
  });
});

describe('buildTreeFromParentPath', () => {
  it('builds a tree from explicit parent_path links', () => {
    const items = [
      { path: 'Files', parent_path: null },
      { path: 'Files/Reports', parent_path: 'Files' },
      { path: 'Files/Reports/Monthly', parent_path: 'Files/Reports' },
    ];

    const tree = buildTreeFromParentPath(items);

    expect(tree).toHaveLength(1);
    expect(tree[0].data.path).toBe('Files');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].data.path).toBe('Files/Reports');
    expect(tree[0].children[0].children).toHaveLength(1);
    expect(tree[0].children[0].children[0].data.path).toBe(
      'Files/Reports/Monthly',
    );
  });

  it('treats a node with a dangling parent_path as a root', () => {
    const items = [
      { path: 'Orphans/Item', parent_path: 'Orphans' },
      // 'Orphans' is not in the list.
    ];

    const tree = buildTreeFromParentPath(items);
    expect(tree).toHaveLength(1);
    expect(tree[0].data.path).toBe('Orphans/Item');
  });

  it('returns an empty array when given an empty list', () => {
    expect(buildTreeFromParentPath([])).toEqual([]);
  });
});

describe('filterRelevantNodes', () => {
  const nodes = [
    { path: 'Files', parent_path: null },
    { path: 'Files/Reports', parent_path: 'Files' },
    { path: 'Files/Reports/Monthly', parent_path: 'Files/Reports' },
    { path: 'Files/Invoices', parent_path: 'Files' },
    { path: 'Archive', parent_path: null },
    { path: 'Archive/Old', parent_path: 'Archive' },
  ];

  it('keeps the relevant node and all of its ancestors', () => {
    const filtered = filterRelevantNodes(
      nodes,
      (n) => n.path === 'Files/Reports/Monthly',
    );

    const paths = filtered.map((n) => n.path);
    expect(paths).toContain('Files');
    expect(paths).toContain('Files/Reports');
    expect(paths).toContain('Files/Reports/Monthly');
    expect(paths).not.toContain('Files/Invoices');
    expect(paths).not.toContain('Archive');
  });

  it('returns an empty array when nothing matches', () => {
    const filtered = filterRelevantNodes(nodes, () => false);
    expect(filtered).toEqual([]);
  });

  it('returns the full list when everything matches', () => {
    const filtered = filterRelevantNodes(nodes, () => true);
    expect(filtered).toHaveLength(nodes.length);
  });

  it('preserves ancestors when a title contains "/"', () => {
    const nodesWithSlash = [
      { path: 'Banking', parent_path: null },
      { path: 'Banking/Operations', parent_path: 'Banking' },
      {
        path: 'Banking/Operations/Cash (in/out)',
        parent_path: 'Banking/Operations',
      },
    ];

    const filtered = filterRelevantNodes(
      nodesWithSlash,
      (n) => n.path === 'Banking/Operations/Cash (in/out)',
    );

    // A naive `split('/')` version would invent a non-existent ancestor
    // "Banking/Operations/Cash (in" and miss the real chain.
    expect(filtered).toHaveLength(3);
    expect(filtered.map((n) => n.path)).toEqual([
      'Banking',
      'Banking/Operations',
      'Banking/Operations/Cash (in/out)',
    ]);
  });
});
