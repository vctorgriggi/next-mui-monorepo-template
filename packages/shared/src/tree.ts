// Path Tree

export interface PathTreeNode<T = unknown> {
  id: string;
  label: string;
  isLeaf: boolean;
  data: T | null;
  children: PathTreeNode<T>[];
}

/**
 * Builds a hierarchical tree from items with slash-separated paths.
 * Intermediate nodes (folders) are created automatically.
 *
 * @param items - Source list
 * @param getPath - Extracts the path string from each item
 * @param skipLevels - Initial segments to ignore (default `1`; pass `0` to keep all)
 * @param getTitle - Optional. When provided, the item's title is treated
 *   as the last segment as-is — so titles containing `/` (e.g.
 *   `"Banking/Operations"`) don't accidentally split the hierarchy.
 */
export function buildTreeFromPaths<T>(
  items: T[],
  getPath: (item: T) => string,
  skipLevels = 1,
  getTitle?: (item: T) => string,
): PathTreeNode<T>[] {
  const map = new Map<string, PathTreeNode<T>>();
  const roots: PathTreeNode<T>[] = [];

  for (const item of items) {
    const parts = splitPathWithTitle(getPath(item), getTitle?.(item));

    for (let i = skipLevels; i < parts.length; i++) {
      const currentPath = parts.slice(skipLevels, i + 1).join('/');
      if (map.has(currentPath)) continue;

      const isLeaf = i === parts.length - 1;
      const node: PathTreeNode<T> = {
        id: currentPath,
        label: parts[i],
        isLeaf,
        data: isLeaf ? item : null,
        children: [],
      };
      map.set(currentPath, node);

      if (i === skipLevels) {
        roots.push(node);
      } else {
        const parentPath = parts.slice(skipLevels, i).join('/');
        map.get(parentPath)?.children.push(node);
      }
    }
  }

  return roots;
}

/**
 * Splits a path into segments. If a title is provided and the path ends
 * with it, the title is preserved intact as the last segment — so a `/`
 * inside a title doesn't break the hierarchy. Otherwise, naive split.
 */
function splitPathWithTitle(path: string, title?: string): string[] {
  if (title && path.endsWith(`/${title}`)) {
    const parentPart = path.slice(0, -(title.length + 1));
    return parentPart === '' ? [title] : [...parentPart.split('/'), title];
  }
  return path.split('/');
}

// Parent Path Tree

export interface ParentPathNode<T> {
  data: T;
  children: ParentPathNode<T>[];
}

/**
 * Builds a hierarchical tree from items that already carry a
 * `parent_path` pointer. Unlike `buildTreeFromPaths`, no intermediate
 * nodes are synthesized — the relationships are taken as-is.
 */
export function buildTreeFromParentPath<
  T extends { path: string; parent_path: string | null },
>(items: T[]): ParentPathNode<T>[] {
  const map = new Map<string, ParentPathNode<T>>();

  for (const item of items) {
    map.set(item.path, { data: item, children: [] });
  }

  const roots: ParentPathNode<T>[] = [];
  for (const item of items) {
    const node = map.get(item.path)!;
    if (item.parent_path && map.has(item.parent_path)) {
      map.get(item.parent_path)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

// Filter

/**
 * Filters a flat list of nodes, keeping the ones the predicate matches
 * plus all their ancestors (so the hierarchy stays consistent).
 *
 * Walks the `parent_path` chain (not a path split) so it works even
 * when titles contain `/`.
 */
export function filterRelevantNodes<
  T extends { path: string; parent_path: string | null },
>(nodes: T[], isRelevant: (node: T) => boolean): T[] {
  const pathMap = new Map<string, T>();
  for (const n of nodes) pathMap.set(n.path, n);

  const relevantPaths = new Set<string>();

  for (const node of nodes) {
    if (!isRelevant(node)) continue;
    relevantPaths.add(node.path);

    let current = node.parent_path;
    while (current && pathMap.has(current)) {
      if (relevantPaths.has(current)) break;
      relevantPaths.add(current);
      current = pathMap.get(current)!.parent_path;
    }
  }

  return nodes.filter((n) => relevantPaths.has(n.path));
}
