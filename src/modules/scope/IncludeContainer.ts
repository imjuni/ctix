import { Debugger } from '#/cli/ux/Debugger';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import path from 'node:path';

/** Replaces all backslashes with forward slashes regardless of the current platform. */
function normalizeToPosix(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

export class IncludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  constructor(params: { config: Pick<IModeGenerateOptions, 'include'>; cwd: string }) {
    const globs = new Glob(params.config.include, {
      absolute: true,
      ignore: defaultExclude,
      cwd: params.cwd,
      windowsPathsNoEscape: true,
    });

    const files = getGlobFiles(globs).map((filePath): [string, boolean] => [filePath, true]);
    this.#map = new Map<string, boolean>(files);
    this.#globs = [globs];

    Debugger.it.log(`IncludeContainer: cwd="${params.cwd}"`);
    Debugger.it.logList('IncludeContainer: patterns', params.config.include);
    Debugger.it.logList(
      'IncludeContainer: resolved files in map',
      files.map(([key]) => key),
    );
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  get map(): Readonly<Map<string, boolean>> {
    return this.#map;
  }

  isInclude(filePath: string): boolean {
    if (this.#map.size <= 0) {
      Debugger.it.log(`isInclude("${filePath}"): map is empty => false`);
      return false;
    }

    if (path.isAbsolute(filePath)) {
      // Normalize backslashes to forward slashes so Windows paths (C:\foo\bar.ts)
      // match the posix-normalized keys stored in the map (C:/foo/bar.ts).
      const normalizedPath = normalizeToPosix(filePath);
      const isExists = this.#map.get(normalizedPath);
      const result = isExists ?? false;

      Debugger.it.log(
        `isInclude("${filePath}"): isAbsolute=true, normalized="${normalizedPath}" => ${result}`,
      );

      return result;
    }

    // Normalize backslashes before resolving so relative Windows-style paths
    // (src\cli\foo.ts) are correctly resolved and matched against the map.
    const resolved = posixResolve(normalizeToPosix(filePath));
    const result = this.#map.get(resolved) != null;

    Debugger.it.log(
      `isInclude("${filePath}"): isAbsolute=false, resolved="${resolved}" => ${result}`,
    );

    return result;
  }

  files() {
    return this.#globs.map((glob) => getGlobFiles(glob)).flat();
  }
}
