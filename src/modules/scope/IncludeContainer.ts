import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import path from 'node:path';

export class IncludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  constructor(params: { config: Pick<IModeGenerateOptions, 'include'>; cwd: string }) {
    const globs = new Glob(params.config.include, {
      absolute: true,
      ignore: defaultExclude,
      cwd: params.cwd,
    });

    this.#map = new Map<string, boolean>(getGlobFiles(globs).map((filePath) => [filePath, true]));
    this.#globs = [globs];
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  get map(): Readonly<Map<string, boolean>> {
    return this.#map;
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
