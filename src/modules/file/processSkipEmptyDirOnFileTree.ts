/* eslint-disable no-param-reassign */

import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import type { getCreateModeFileTree } from '#/modules/file/getCreateModeFileTree';
import { getExportStatementFromMap } from '#/modules/file/getExportStatementFromMap';
import { isFalse, orThrow } from 'my-easy-fp';
import type { AsyncReturnType } from 'type-fest';

export function processSkipEmptyDirOnFileTree(params: {
  tree: AsyncReturnType<typeof getCreateModeFileTree>;
  dirPathMap: Map<string, IExportStatement[]>;
  skipEmptyDir: boolean;
}): { path: string; children: string[] }[] {
  if (isFalse(params.skipEmptyDir)) {
    const dirPaths = params.tree.children.map((child) => {
      return { path: child.path, children: child.children.map((grandchild) => grandchild.path) };
    });

    return dirPaths;
  }

  const map = new Map(params.tree.children.map((child) => [child.path, child]));

  params.tree.children.forEach((child) => {
    const statements = getExportStatementFromMap(child.path, params.dirPathMap);

    child.statements.push(...statements);
    child.isSkip = statements.length <= 0;

    if (child.isSkip) {
      const parent =
        child.parent === params.tree.root.path ? params.tree.root : orThrow(map.get(child.parent));

      child.children = child.children.map((grandchild) => {
        grandchild.parent = parent.path;
        return grandchild;
      });

      parent.children = [
        ...parent.children.filter((parentchild) => parentchild.path !== child.path),
        ...child.children,
      ];
    }
  });

  const dirPaths = params.tree.children
    .filter((child) => !child.isSkip)
    .map((child) => {
      return {
        path: child.path,
        children: child.children.map((grandchild) => grandchild.path),
      };
    });

  return dirPaths;
}
