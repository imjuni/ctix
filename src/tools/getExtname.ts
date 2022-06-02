import extensions from '@tools/extensions';
import { isFalse } from 'my-easy-fp';
import path from 'path';

export default function getExtname(filePath: string): string {
  if (extensions.every((extension) => isFalse(filePath.endsWith(extension)))) {
    return path.extname(filePath);
  }

  if (filePath.endsWith('.d.ts')) {
    return '.d.ts';
  }

  if (filePath.endsWith('.d.cts')) {
    return '.d.cts';
  }

  if (filePath.endsWith('.d.mts')) {
    return '.d.mts';
  }

  return path.extname(filePath);
}
