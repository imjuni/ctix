import { getFileScope } from '#/compilers/getFileScope';
import path from 'node:path';
import * as tsm from 'ts-morph';

interface IFileScope {
  include: string[];
  exclude: string[];
}

/**
 * Traverse the tsconfig extends chain and collect include/exclude patterns.
 *
 * TypeScript's extends is an overwrite (not merge): the most-derived config wins.
 * include and exclude are resolved independently — each comes from the first file
 * in the chain that explicitly declares it.
 *
 * @param tsconfigPath - absolute path to the tsconfig file
 */
export function getInheritedFileScope(tsconfigPath: string): IFileScope {
  const visited = new Set<string>();
  let currentPath = path.resolve(tsconfigPath);
  let foundInclude: string[] | null = null;
  let foundExclude: string[] | null = null;

  while (!visited.has(currentPath)) {
    visited.add(currentPath);

    const configFile = tsm.ts.readConfigFile(currentPath, tsm.ts.sys.readFile.bind(tsm.ts));
    if (configFile.error != null) break;

    const { include, exclude } = getFileScope(configFile.config);

    if (foundInclude == null && include.length > 0) {
      foundInclude = include;
    }

    if (foundExclude == null && exclude.length > 0) {
      foundExclude = exclude;
    }

    if (foundInclude != null && foundExclude != null) break;

    const raw = configFile.config as { extends?: unknown };
    const extendsValue: unknown = raw.extends;
    if (extendsValue == null) break;

    // TypeScript 5.0+ supports array extends; earlier versions use a string
    const extendsEntries: unknown[] = Array.isArray(extendsValue) ? extendsValue : [extendsValue];
    const firstExtends: unknown = extendsEntries[0];
    if (typeof firstExtends !== 'string') break;

    const resolved = path.resolve(path.dirname(currentPath), firstExtends);
    currentPath = resolved.endsWith('.json') ? resolved : `${resolved}.json`;
  }

  return {
    include: foundInclude ?? [],
    exclude: foundExclude ?? [],
  };
}
