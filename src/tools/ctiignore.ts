import debug from 'debug';
import fastGlob from 'fast-glob';
import * as TE from 'fp-ts/lib/Either';
import * as TTE from 'fp-ts/lib/TaskEither';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { TResolvedPromise, TResolvedEither } from './typehelper';
import parseGitignore from 'parse-gitignore';

const log = debug('ctit:ignore-tool');
const readfile = util.promisify(fs.readFile);

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
export async function getIgnoreFiles(
  cwd: string,
): Promise<TE.Either<Error, { cwd: string; filenames: string[] }>> {
  try {
    const resolvedCWD = path.resolve(cwd); // absolute path
    const globPattern = path.join(resolvedCWD, '**', '.ctiignore'); // create ctiignore glob pattern

    // ctiignore file have dot charactor at file first so set true dot flag
    const filenames = await fastGlob(globPattern, { dot: true });

    log('resolved: ', resolvedCWD, globPattern);

    return TE.right({ cwd, filenames });
  } catch (err) {
    return TE.left(err);
  }
}

/**
 * parse ignore content in filenames used by string array
 *
 * @param args eithered filename from getIgnoreFiles function
 * @returns return value is eithered. IIgnoreContent array or error class
 */
export async function getIgnoreFileContents(
  args: TResolvedEither<TResolvedPromise<ReturnType<typeof getIgnoreFiles>>>,
): Promise<TE.Either<Error, { cwd: string; ignores: IIgnoreContent[] }>> {
  try {
    const buffers = await Promise.all(
      args.filenames.map((filename) =>
        (async () => ({
          filename,
          buffer: await readfile(filename),
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

    return TE.right({ cwd: args.cwd, ignores });
  } catch (err) {
    return TE.left(err);
  }
}

export async function getIgnoredContents(
  args: TResolvedEither<TResolvedPromise<ReturnType<typeof getIgnoreFileContents>>>,
): Promise<TE.Either<Error, { cwd: string; ignores: string[] }>> {
  try {
    const contents = args.ignores
      .map((ignore) => ignore.content.map((content) => path.join(ignore.directory, content)))
      .flatMap((ignore) => ignore);

    const ignoreContents = await fastGlob(contents, { dot: true });

    log('target ignore file: ', contents);
    log('glob processed ignore file: ', ignoreContents);

    return TE.right({
      cwd: args.cwd,
      ignores: ignoreContents,
    });
  } catch (err) {
    return TE.left(err);
  }
}
