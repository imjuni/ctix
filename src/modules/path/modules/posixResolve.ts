import { replaceSepToPosix } from 'my-node-fp';
import * as path from 'node:path';

export function posixResolve(targetPath: string): string {
  return replaceSepToPosix(path.resolve(targetPath));
}
