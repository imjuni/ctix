import type { IInlineIgnoreInfo } from '#/comments/interfaces/IInlineIgnoreInfo';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import { defaultIgnore } from '#/modules/ignore/defaultIgnore';
import { Glob, type GlobOptions } from 'glob';
import path from 'path';

export class ExcludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  #inline: Map<string, IInlineIgnoreInfo & { filePath: string }>;

  constructor(params: {
    config: Pick<ICommonGenerateOptions, 'exclude'>;
    inlineIgnoreds: (IInlineIgnoreInfo & { filePath: string })[];
    cwd?: string;
  }) {
    const globs = new Glob(params.config.exclude, {
      ignore: defaultIgnore,
      cwd: params.cwd ?? process.cwd(),
    });

    this.#map = new Map<string, boolean>();

    for (const filePath of globs) {
      this.#map.set(path.resolve(filePath), true);
    }

    this.#globs = [globs];

    this.#inline = new Map<string, IInlineIgnoreInfo & { filePath: string }>();

    params.inlineIgnoreds.forEach((inlineIgnored) => {
      const filePath = path.isAbsolute(inlineIgnored.filePath)
        ? inlineIgnored.filePath
        : path.resolve(inlineIgnored.filePath);
      this.#inline.set(filePath, inlineIgnored);
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
