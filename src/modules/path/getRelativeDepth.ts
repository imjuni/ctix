import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export function getRelativeDepth(basePath: string, dirPath: string) {
  if (basePath == null) {
    throw new Error('[getRelativeDepth] basePaths is empty array');
  }

  const relativePath = replaceSepToPosix(
    path.relative(replaceSepToPosix(basePath), replaceSepToPosix(dirPath)),
  );

  if (relativePath === '') {
    return 0;
  }

  const depth = relativePath.split(path.posix.sep);
  return depth.length;
}
