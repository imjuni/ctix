import { posixJoin } from '#/modules/path/modules/posixJoin';
import { populate } from 'my-easy-fp';
import { startSepAppend, startSepRemove } from 'my-node-fp';
import path from 'node:path';

export function getAllParentDir(parentDir: string, childDir: string): string[] {
  const parent = startSepAppend(parentDir, path.posix.sep);
  const child = startSepAppend(childDir, path.posix.sep);
  const elements = startSepRemove(child.replace(parent, ''), path.posix.sep)
    .split(path.posix.sep)
    .slice(0, -1);

  return [
    parentDir,
    ...populate(elements.length, true).map((index) => {
      return posixJoin(parent, ...elements.slice(0, index));
    }),
  ];
}
