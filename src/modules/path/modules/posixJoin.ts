import { replaceSepToPosix } from 'my-node-fp';
import * as path from 'node:path';

export function posixJoin(...args: string[]): string {
  return replaceSepToPosix(args.join(path.sep));
}
