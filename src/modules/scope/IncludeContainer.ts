import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import path from 'node:path';

export class IncludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  constructor(args: { config: Pick<ICommonGenerateOptions, 'include'>; cwd?: string }) {
    const globs = new Glob(args.config.include, {
      ignore: defaultExclude,
      cwd: args.cwd ?? process.cwd(),
    });

    this.#map = new Map<string, boolean>();

    for (const filePath of globs) {
      this.#map.set(path.resolve(filePath), true);
    }

    this.#globs = [globs];
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  isInclude(filePath: string): boolean {
    if (this.#map.size <= 0) {
      return false;
    }

    if (path.isAbsolute(filePath)) {
      return this.#map.get(filePath) != null;
    }

    return this.#map.get(path.resolve(filePath)) != null;
  }

  files() {
    return this.#globs.map((glob) => getGlobFiles(glob)).flat();
  }
}
