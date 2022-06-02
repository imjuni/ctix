import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export default function getRelativeDepth(basePaths: string | string[], dirPath: string) {
  if (Array.isArray(basePaths) && basePaths.length <= 0) {
    throw new Error('[getRelativeDepth] basePaths is empty array');
  }

  const basePath = typeof basePaths === 'string' ? basePaths : basePaths[0];

  const relativePath = replaceSepToPosix(
    path.relative(replaceSepToPosix(basePath), replaceSepToPosix(dirPath)),
  );

  if (relativePath === '.') {
    return 0;
  }

  const depth = relativePath.split(path.posix.sep);
  return depth.length;
}
