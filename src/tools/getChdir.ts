import path from 'path';
import fs from 'fs';

export default async function getChdir(filePath: string): Promise<string> {
  const resolvedFilePath = path.resolve(filePath);
  const stated = await fs.promises.stat(resolvedFilePath);

  if (stated.isDirectory()) {
    return resolvedFilePath;
  }

  return path.dirname(resolvedFilePath);
}
