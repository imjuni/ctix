import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import path from 'node:path';

export function getTsconfigComparer(cwd: string) {
  const comparer = (left: string, right: string): number => {
    const leftDepth = getRelativeDepth(cwd, left);
    const rightDepth = getRelativeDepth(cwd, right);

    const depthDiff = leftDepth - rightDepth;

    if (depthDiff !== 0) {
      return depthDiff;
    }

    const leftBasename = path.basename(left);
    const rightBasename = path.basename(right);

    if (leftBasename === CE_CTIX_DEFAULT_VALUE.TSCONFIG_FILENAME) {
      return -1;
    }

    if (rightBasename === CE_CTIX_DEFAULT_VALUE.TSCONFIG_FILENAME) {
      return 1;
    }

    return left.localeCompare(right);
  };

  return comparer;
}
