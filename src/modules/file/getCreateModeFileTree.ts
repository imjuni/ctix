import type { IModuleChild } from '#/modules/file/interfaces/IModuleChild';
import type { IModuleRoot } from '#/modules/file/interfaces/IModuleRoot';
import { getParentDir } from '#/modules/path/getParentDir';
import fs from 'fs';
import { orThrow } from 'my-easy-fp';
import pathe from 'pathe';

export async function getCreateModeFileTree(startFrom: string) {
  const resolved = pathe.resolve(startFrom);
  const fileOrDirs = await fs.promises.readdir(resolved, { withFileTypes: true, recursive: true });
  const dirs = fileOrDirs.filter((fileOrDir) => fileOrDir.isDirectory());

  // root 노드를 만든다
  const root: IModuleRoot = {
    kind: 'root',
    name: pathe.basename(resolved),
    path: resolved,
    children: [],
  };

  const children = dirs
    .map((dir) => {
      const path = pathe.resolve(pathe.join(dir.path, dir.name));
      const parent = orThrow(getParentDir(path));

      const child: IModuleChild = {
        kind: 'child',
        name: dir.name,
        path,
        parent,
        children: [],
        statements: [],
        isSkip: false,
      };

      return child;
    })
    .filter((child) => child.path !== resolved);

  const map = new Map(children.map((child) => [child.path, child]));

  children.forEach((child) => {
    const parent = map.get(child.parent);

    if (parent != null) {
      // root 아닌 부모 노드를 가지고 있는 경우
      parent.children.push(child);
    } else if (parent == null && child.parent === root.path) {
      // root 노드 자식인 경우
      root.children.push(child);
    }
  });

  return { root, children };
}
