import { first } from 'my-easy-fp';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export default function getRelativeDepth(basePaths: string | string[], dirPath: string) {
  const basePath = typeof basePaths === 'string' ? basePaths : first(basePaths);

  if (basePath == null) {
    throw new Error('[getRelativeDepth] basePaths is empty array');
  }

  const relativePath = replaceSepToPosix(
    path.relative(replaceSepToPosix(basePath), replaceSepToPosix(dirPath)),
  );

  if (relativePath === '') {
    return 0;
  }

  if (relativePath === '.') {
    return 0;
  }

  const depth = relativePath.split(path.posix.sep);
  return depth.length;
}
