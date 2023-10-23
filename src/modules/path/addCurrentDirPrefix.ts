import path from 'path';

export function addCurrentDirPrefix(filePath: string, sep?: string): string {
  const pathSep = sep ?? path.posix.sep;

  if (filePath.startsWith('.')) {
    return filePath;
  }

  if (filePath === '') {
    return `.${pathSep}`;
  }

  return `.${pathSep}${filePath}`;
}
