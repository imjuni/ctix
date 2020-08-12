import * as TE from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import * as fs from 'fs';
import { isEmpty } from 'my-easy-fp';
import * as path from 'path';

/**
 * check file existing, if file exists return true, don't exists return false
 * @param filepath filename with path
 */
export async function exists(filepath: string): Promise<boolean> {
  try {
    const accessed = await fs.promises.access(filepath);
    return isEmpty(accessed);
  } catch (err) {
    return false;
  }
}

/** create set, dedupe duplicated element after return array type */
export function settify<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export const fpRemoveExtWithTSX = (filenameFrom: string) =>
  pipe(
    filenameFrom,
    (filename) => filename.replace(/\.d\.ts$/, ''),
    (filename) => filename.replace(/\.tsx$/, ''),
    (filename) => filename.replace(/\.ts$/, ''),
  );

export const fpRemoveExt = (filenameFrom: string) =>
  pipe(
    filenameFrom,
    (filename) => filename.replace(/\.d\.ts$/, ''),
    (filename) =>
      filename !== '/index.tsx' && filename !== 'index.tsx'
        ? filename.replace(/\.tsx$/, '')
        : filename,
    (filename) => filename.replace(/\.ts$/, ''),
  );

export const fpRefinePathSep = (exportPathFrom: string) =>
  pipe(
    exportPathFrom,
    (exportPath) => (path.sep !== '/' ? TE.left(exportPath) : TE.right(exportPath)),
    TE.fold(
      (exportPath) => exportPath.replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/'),
      (exportPath) => exportPath,
    ),
  );

export const fpRefineStartSlash = (exportPathFrom: string) =>
  pipe(
    exportPathFrom,
    (exportPath) => (exportPath.startsWith('/') ? TE.left(exportPath) : TE.right(exportPath)),
    TE.fold(
      (exportPath) => exportPath.substring(1, exportPath.length),
      (exportPath) => exportPath,
    ),
  );

export const fpTimes = (sizeFrom: number, zeroBased: boolean = true) =>
  pipe(
    sizeFrom,
    (size) => new Array(size).fill(0),
    (arr) => arr.map((_, index) => index + (zeroBased ? 0 : 1)),
  );

export const fpRemoveLastPathSep = (cwdFrom: string) =>
  pipe(
    cwdFrom,
    (cwd) => (cwd.endsWith(path.sep) ? TE.left(cwd) : TE.right(cwd)),
    TE.fold(
      (cwd) => cwd.substr(cwd.length - 1 > 0 ? cwd.length - 1 : 0, cwd.length),
      (cwd) => cwd,
    ),
  );

export const fpReplaceCwd = (cwdFrom: string, dir: string) =>
  pipe(
    cwdFrom,
    (cwd) => fpRemoveLastPathSep(cwd),
    (cwd) => (cwd === fpRemoveLastPathSep(dir) ? TE.left(cwd) : TE.right(cwd)),
    TE.fold(
      () => '',
      flow(
        (cwd) => (cwd.endsWith(path.sep) ? TE.left(cwd) : TE.right(cwd)),
        TE.fold(
          (cwd) => cwd,
          (cwd) => `${cwd}${path.sep}`,
        ),
        (cwd) => dir.replace(cwd, ''),
      ),
    ),
  );

export const fpGetDirDepth = (cwdFrom: string, dir: string) =>
  pipe(
    cwdFrom,
    (cwd) => fpReplaceCwd(cwd, dir),
    (replaced) => replaced.split(path.sep),
    (splitted) => splitted.filter((splittedDir) => splittedDir !== ''),
    (splitted) => splitted.length,
  );

export const getParentPath = (cwdFrom: string) =>
  pipe(
    cwdFrom,
    (cwd) => cwd.split(path.sep),
    (splitted) => splitted.slice(0, splitted.length - 1),
    (splitted) => splitted.join(path.sep),
    (parentDir) => path.resolve(parentDir),
  );
