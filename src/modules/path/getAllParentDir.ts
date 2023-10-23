import { populate } from 'my-easy-fp';
import { startSepAppend, startSepRemove } from 'my-node-fp';
import path from 'node:path';

export function getAllParentDir(parentDir: string, childDir: string): string[] {
  const parent = startSepAppend(parentDir);
  const child = startSepAppend(childDir);
  const elements = startSepRemove(child.replace(parent, '')).split(path.posix.sep).slice(0, -1);

  return [
    parentDir,
    ...populate(elements.length, true).map((index) => {
      return path.join(parent, ...elements.slice(0, index));
    }),
  ];
}
