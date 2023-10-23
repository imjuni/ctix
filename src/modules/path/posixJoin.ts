import * as path from 'node:path';

export function posixJoin(...args: string[]): string {
  return args.join(path.posix.sep);
}
