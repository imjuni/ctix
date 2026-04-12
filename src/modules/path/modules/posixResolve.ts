import { getCwd } from '#/modules/path/getCwd';
import { replaceSepToPosix } from 'my-node-fp';
import * as path from 'node:path';

export function posixResolve(targetPath: string): string {
  // Use getCwd() as the base for relative paths so that USE_INIT_CWD / INIT_CWD
  // is respected throughout the codebase. Absolute paths are returned as-is
  // (after separator normalisation) because they have their own explicit root.
  if (path.isAbsolute(targetPath)) {
    return replaceSepToPosix(targetPath);
  }

  return replaceSepToPosix(path.resolve(getCwd(), targetPath));
}
