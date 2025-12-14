import type fs from 'fs';

/**
 * node.js v24부터 path > parentPath로 이름이 변경됨
 */
export function getPathFromReaddir(
  dirent: Pick<fs.Dirent, 'path'> & { parentPath?: string },
): string {
  if ('parentPath' in dirent) {
    return dirent.parentPath as string;
  }

  if ('path' in dirent) {
    return dirent.path;
  }

  return '';
}
