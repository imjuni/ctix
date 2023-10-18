import type { TRemoveOptionWithDirInfo } from '#/configs/interfaces/IOption';
import { posixJoin } from '#/tools/misc';
import fastGlob from 'fast-glob';
import { settify } from 'my-easy-fp';
import { getDirname, isDescendant, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type * as tsm from 'ts-morph';

export async function getRemoveFiles(project: tsm.Project, option: TRemoveOptionWithDirInfo) {
  const filePaths = project
    .getSourceFiles()
    .filter((sourceFile) =>
      isDescendant(option.startAt, sourceFile.getFilePath().toString(), path.posix.sep),
    )
    .map((sourceFile) => replaceSepToPosix(sourceFile.getFilePath()));

  const dirPaths = (await Promise.all(filePaths.map((filePath) => getDirname(filePath)))).map(
    (dirPath) => replaceSepToPosix(dirPath),
  );

  const globPatterns = option.includeBackup
    ? settify([
        posixJoin(option.startAt, option.exportFilename),
        posixJoin(option.startAt, `${option.exportFilename}.bak`),
        ...dirPaths.map((dirPath) => posixJoin(dirPath, '**', option.exportFilename)),
        ...dirPaths.map((dirPath) => posixJoin(dirPath, '**', `${option.exportFilename}.bak`)),
      ])
    : settify([
        posixJoin(option.startAt, option.exportFilename),
        ...dirPaths.map((dirPath) => posixJoin(dirPath, '**', option.exportFilename)),
      ]);

  const files = await fastGlob(globPatterns, { dot: true, cwd: option.startAt });

  return files;
}
