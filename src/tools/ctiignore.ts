import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TTE from 'fp-ts/TaskEither';
import fs from 'fs';
import parseGitignore from 'parse-gitignore';
import path from 'path';
import { fastGlobWrap, replaceSepToPosix } from './misc';
import { TResolvedTaskEither } from './typehelper';

const log = debug('ctix:ignore-tool');

/**
 * create-ts-index ignore interface
 */
export interface IIgnoreContent {
  /** ignore filename with file path. File path is absolute path */
  filename: string;

  /** directory in ignore filename. directory path is absolute path */
  directory: string;

  /** ignore content, vanilla string array */
  content: string[];
}

/**
 * extract create-ts-index ignore file by glob pattern in cwd(current working directory)
 *
 * @param cwd current working directory
 * @returns return value is eithered. string array or error class.
 */
export const getIgnoreFiles =
  (cwd: string): TTE.TaskEither<Error, { cwd: string; filenames: string[] }> =>
  async () => {
    try {
      const resolvedCWD = path.resolve(cwd); // absolute path
      const globPattern = path.join(resolvedCWD, '**', '.ctiignore'); // create ctiignore glob pattern
      const npmGlobPattern = path.join(resolvedCWD, '**', '.npmignore'); // create npmignore glob pattern

      // ctiignore file have dot charactor at file first so set true dot flag
      const filenames = await fastGlobWrap([globPattern, npmGlobPattern], { dot: true });

      log('resolved: ', resolvedCWD, globPattern);

      return TEI.right({ cwd, filenames });
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

/**
 * parse ignore content in filenames used by string array
 *
 * @param args eithered filename from getIgnoreFiles function
 * @returns return value is eithered. IIgnoreContent array or error class
 */
export const getIgnoreFileContents =
  (
    args: TResolvedTaskEither<ReturnType<typeof getIgnoreFiles>>,
  ): TTE.TaskEither<Error, { cwd: string; ignores: IIgnoreContent[] }> =>
  async () => {
    try {
      const buffers = await Promise.all(
        args.filenames.map((filename) =>
          (async () => ({
            filename,
            buffer: await fs.promises.readFile(filename),
          }))(),
        ),
      );

      const files = buffers.map((buffer) => ({
        filename: buffer.filename,
        buffer: buffer.buffer.toString(),
      }));

      const ignores = files.map<IIgnoreContent>((file) => ({
        filename: file.filename,
        directory: path.dirname(file.filename),
        content: parseGitignore(file.buffer),
      }));

      return TEI.right({ cwd: args.cwd, ignores });
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };

export const getIgnoredContents =
  (
    args: TResolvedTaskEither<ReturnType<typeof getIgnoreFileContents>>,
  ): TTE.TaskEither<Error, { cwd: string; ignores: string[] }> =>
  async () => {
    try {
      const contents = args.ignores
        .map((ignore) => ignore.content.map((content) => path.join(ignore.directory, content)))
        .flatMap((ignore) => ignore);

      const contentsForFastGlob = contents.map((content) => replaceSepToPosix(content));

      const ignoreContents = await fastGlobWrap(contentsForFastGlob, { dot: true });

      log('target ignore file: ', contents);
      log('glob processed ignore file: ', ignoreContents);

      return TEI.right({
        cwd: args.cwd,
        ignores: ignoreContents,
      });
    } catch (catched) {
      const err = catched instanceof Error ? catched : new Error('unknown error raised');

      return TEI.left(err);
    }
  };
