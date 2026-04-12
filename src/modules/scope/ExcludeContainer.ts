import { Debugger } from '#/cli/ux/Debugger';
import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixResolve } from '#/modules/path/modules/posixResolve';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob, type GlobOptions } from 'glob';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

/** Replaces all backslashes with forward slashes regardless of the current platform. */
function normalizeToPosix(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

export class ExcludeContainer {
  #globs: Glob<GlobOptions>[];

  #map: Map<string, boolean>;

  #inline: Map<string, IInlineCommentInfo & { filePath: string }>;

  constructor(params: {
    config: Pick<IModeGenerateOptions, 'exclude'>;
    inlineExcludeds: IInlineCommentInfo[];
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
    this.#inline = new Map<string, IInlineCommentInfo & { filePath: string }>();

    params.inlineExcludeds.forEach((inlineExcluded) => {
      const filePath = path.isAbsolute(inlineExcluded.filePath)
        ? replaceSepToPosix(inlineExcluded.filePath)
        : posixResolve(inlineExcluded.filePath);
      this.#inline.set(filePath, inlineExcluded);
    });

    Debugger.it.log(`ExcludeContainer: cwd="${params.cwd}"`);
    Debugger.it.logList('ExcludeContainer: patterns', params.config.exclude);
    Debugger.it.logList(
      'ExcludeContainer: resolved files in map',
      files.map(([key]) => key),
    );
    Debugger.it.logList('ExcludeContainer: inline excludeds', Array.from(this.#inline.keys()));
  }

  get globs(): Readonly<Glob<GlobOptions>[]> {
    return this.#globs;
  }

  get map(): Readonly<Map<string, boolean>> {
    return this.#map;
  }

  isExclude(filePath: string): boolean {
    if (this.#map.size <= 0 && this.#inline.size <= 0) {
      Debugger.it.log(`isExclude("${filePath}"): map and inline are empty => false`);
      return false;
    }

    if (path.isAbsolute(filePath)) {
      // Normalize backslashes to forward slashes so Windows paths (C:\foo\bar.ts)
      // match the posix-normalized keys stored in the map (C:/foo/bar.ts).
      const normalizedPath = normalizeToPosix(filePath);
      const result =
        this.#map.get(normalizedPath) != null || this.#inline.get(normalizedPath) != null;

      Debugger.it.log(
        `isExclude("${filePath}"): isAbsolute=true, normalized="${normalizedPath}" => ${result}`,
      );

      return result;
    }

    // Normalize backslashes before resolving so relative Windows-style paths
    // (src\cli\foo.ts) are correctly resolved and matched against the map.
    const resolved = posixResolve(normalizeToPosix(filePath));
    const result = this.#map.get(resolved) != null || this.#inline.get(resolved) != null;

    Debugger.it.log(
      `isExclude("${filePath}"): isAbsolute=false, resolved="${resolved}" => ${result}`,
    );

    return result;
  }
}
