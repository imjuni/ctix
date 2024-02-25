import { posixRelative } from '#/modules/path/modules/posixRelative';
import path from 'node:path';

export function getRelativeDepth(basePath: string, dirPath: string) {
  if (basePath == null) {
    throw new Error('[getRelativeDepth] basePaths is empty array');
  }

  const relativePath = posixRelative(basePath, dirPath);

  if (relativePath === '') {
    return 0;
  }

  const depth = relativePath.split(path.posix.sep);
  return depth.length;
}
