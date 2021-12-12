import * as TEI from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as fs from 'fs';
import { isEmpty } from 'my-easy-fp';
import * as path from 'path';
import fastGlob from 'fast-glob';

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

export function replaceSepToPosix(targetPath: string): string {
  return path.posix.join(...targetPath.split(path.sep));
}

export function winify(filePath: string): string {
  return filePath.replace(/\//g, path.sep);
}

export async function fastGlobWrap(
  pattern: string | string[],
  options: Parameters<typeof fastGlob>[1],
) {
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const unixifyPatterns = patterns.map((nonUnixifyPattern) => replaceSepToPosix(nonUnixifyPattern));
  const unixifyFiles = await fastGlob(unixifyPatterns, options);
  const files = unixifyFiles.map((file) => file.replace(/\//g, path.sep));
  return files;
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
    (exportPath) => (path.sep !== '/' ? TEI.left(exportPath) : TEI.right(exportPath)),
    TEI.fold(
      (exportPath) => exportPath.replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/'),
      (exportPath) => exportPath,
    ),
  );

export const fpRefineStartSlash = (exportPathFrom: string) =>
  pipe(
    exportPathFrom,
    (exportPath) => (exportPath.startsWith('/') ? TEI.left(exportPath) : TEI.right(exportPath)),
    TEI.fold(
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
    (cwd) => (cwd.endsWith(path.sep) ? TEI.left(cwd) : TEI.right(cwd)),
    TEI.fold(
      (cwd) => cwd.substring(0, cwd.length - 1 > 0 ? cwd.length - 1 : cwd.length),
      (cwd) => cwd,
    ),
  );

export const fpRemoveDrivePath = (cwdFrom: string) =>
  pipe(cwdFrom, (cwd) => cwd.replace(/^([A-Za-z]:)(.+)/, '$2'));

export const fpRemoveFirstPathSep = (cwdFrom: string) =>
  pipe(
    cwdFrom,
    (cwd) => (cwd.startsWith(path.sep) ? TEI.left(cwd) : TEI.right(cwd)),
    TEI.fold(
      (cwd) => cwd.substring(cwd.length - 1 > 0 ? 1 : 0, cwd.length),
      (cwd) => cwd,
    ),
  );

export const fpReplaceCwd = (cwdFrom: string, dir: string) =>
  pipe(
    cwdFrom,
    (cwd) => fpRemoveLastPathSep(cwd),
    (cwd) => (cwd === fpRemoveLastPathSep(dir) ? TEI.left(cwd) : TEI.right(cwd)),
    TEI.fold(
      () => '',
      flow(
        (cwd) => (cwd.endsWith(path.sep) ? TEI.left(cwd) : TEI.right(cwd)),
        TEI.fold(
          (cwd) => cwd,
          (cwd) => `${cwd}${path.sep}`,
        ),
        (cwd) => dir.replace(cwd, ''),
        (cwd) => fpRemoveDrivePath(cwd),
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
