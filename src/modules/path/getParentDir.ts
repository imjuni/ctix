import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export function getParentDir(rawDirPath: string): string | undefined {
  const dirPath = replaceSepToPosix(rawDirPath);
  const elements = dirPath.split(path.sep);
  const parentElements = elements.slice(0, -1);

  if (parentElements.length === 1 && parentElements.at(0) === '') {
    return '/';
  }

  if (parentElements.length <= 0) {
    return undefined;
  }

  return parentElements.join(path.sep);
}
