import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export class ExcludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  #inline: Map<string, IInlineExcludeInfo & { filePath: string }>;

  constructor(params: {
    config: Pick<IModeGenerateOptions, 'exclude'>;
    inlineExcludeds: IInlineExcludeInfo[];
    cwd: string;
  }) {
    const globs = new Glob(params.config.exclude, {
      absolute: true,
      ignore: defaultExclude,
      cwd: params.cwd,
      windowsPathsNoEscape: true,
    });

    const files = getGlobFiles(globs).map((filePath): [string, boolean] => [
      replaceSepToPosix(filePath),
      true,
    ]);
    this.#map = new Map<string, boolean>(files);
    this.#globs = [globs];
    this.#inline = new Map<string, IInlineExcludeInfo & { filePath: string }>();

    params.inlineExcludeds.forEach((inlineExcluded) => {
      const filePath = path.isAbsolute(inlineExcluded.filePath)
        ? replaceSepToPosix(inlineExcluded.filePath)
        : replaceSepToPosix(path.resolve(inlineExcluded.filePath));
      this.#inline.set(filePath, inlineExcluded);
    });
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  get map(): Readonly<Map<string, boolean>> {
    return this.#map;
  }

  isExclude(filePath: string): boolean {
    if (this.#map.size <= 0 && this.#inline.size <= 0) {
      return false;
    }

    if (path.isAbsolute(filePath)) {
      return this.#map.get(filePath) != null || this.#inline.get(filePath) != null;
    }

    return (
      this.#map.get(replaceSepToPosix(path.resolve(filePath))) != null ||
      this.#inline.get(replaceSepToPosix(path.resolve(filePath))) != null
    );
  }
}
