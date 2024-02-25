import { replaceSepToPosix } from 'my-node-fp';
import * as path from 'node:path';

export function posixRelative(originPath: string, targetPath: string): string {
  return replaceSepToPosix(path.relative(originPath, targetPath));
}
