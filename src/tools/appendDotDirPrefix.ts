import path from 'path';

export default function appendDotDirPrefix(filePath: string, sep?: string): string {
  const pathSep = sep ?? path.sep;

  if (filePath.startsWith('.')) {
    return filePath;
  }

  if (filePath === '') {
    return `.${pathSep}`;
  }

  return `.${pathSep}${filePath}`;
}
