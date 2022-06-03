import path from 'path';

export default function appendDotDirPrefix(filePath: string, sep?: string): string {
  const pathSep = sep ?? path.sep;
  const filePathWithDot = filePath.startsWith('.') ? filePath : `.${pathSep}${filePath}`;
  return filePathWithDot;
}
