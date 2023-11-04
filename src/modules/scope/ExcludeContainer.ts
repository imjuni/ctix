import type { IInlineExcludeInfo } from '#/comments/interfaces/IInlineExcludeInfo';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import path from 'path';

export class ExcludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  #inline: Map<string, IInlineExcludeInfo & { filePath: string }>;

  constructor(params: {
    config: Pick<ICommonGenerateOptions, 'exclude'>;
    inlineExcludeds: (IInlineExcludeInfo & { filePath: string })[];
    cwd?: string;
  }) {
    const globs = new Glob(params.config.exclude, {
      ignore: defaultExclude,
      cwd: params.cwd ?? process.cwd(),
    });

    this.#map = new Map<string, boolean>();

    for (const filePath of globs) {
      this.#map.set(path.resolve(filePath), true);
    }

    this.#globs = [globs];

    this.#inline = new Map<string, IInlineExcludeInfo & { filePath: string }>();

    params.inlineExcludeds.forEach((inlineExcluded) => {
      const filePath = path.isAbsolute(inlineExcluded.filePath)
        ? inlineExcluded.filePath
        : path.resolve(inlineExcluded.filePath);
      this.#inline.set(filePath, inlineExcluded);
    });
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  isExclude(filePath: string): boolean {
    if (this.#map.size <= 0 && this.#inline.size <= 0) {
      return false;
    }

    if (path.isAbsolute(filePath)) {
      return this.#map.get(filePath) != null || this.#inline.get(filePath) != null;
    }

    return (
      this.#map.get(path.resolve(filePath)) != null ||
      this.#inline.get(path.resolve(filePath)) != null
    );
  }
}
