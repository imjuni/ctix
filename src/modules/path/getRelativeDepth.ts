import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export function getRelativeDepth(basePath: string, dirPath: string) {
  if (basePath == null) {
    throw new Error('[getRelativeDepth] basePaths is empty array');
  }

  const relativePath = path.relative(replaceSepToPosix(basePath), replaceSepToPosix(dirPath));
  const replaced = replaceSepToPosix(relativePath);

  if (replaced === '') {
    return 0;
  }

  const depth = replaced.split(path.posix.sep);
  return depth.length;
}
