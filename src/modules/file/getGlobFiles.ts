import type { Glob, GlobOptions } from 'glob';
import path from 'node:path';

export function getGlobFiles<T extends GlobOptions>(glob: Glob<T>): string[] {
  const filePathSet = new Set<string>();

  for (const filePath of glob) {
    filePathSet.add(
      typeof filePath === 'string' ? filePath : path.join(filePath.path, filePath.name),
    );
  }

  return Array.from(filePathSet);
}
