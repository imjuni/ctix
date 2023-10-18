import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export function getDepth(dirPath: string) {
  const sepReplaced = replaceSepToPosix(dirPath);
  const depth = sepReplaced.split(path.posix.sep);
  return depth.length;
}
