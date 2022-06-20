import { TRemoveOptionWithDirInfo } from '@configs/interfaces/IOption';
import fastGlob from 'fast-glob';
import { getDirname, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

export default async function getRemoveFiles(
  project: tsm.Project,
  option: TRemoveOptionWithDirInfo,
) {
  const filePaths = project
    .getSourceFiles()
    .map((sourceFile) => replaceSepToPosix(sourceFile.getFilePath()));

  const dirPaths = (await Promise.all(filePaths.map((filePath) => getDirname(filePath)))).map(
    (dirPath) => replaceSepToPosix(dirPath),
  );

  const cwd = await getDirname(option.project);

  const globPatterns = option.includeBackup
    ? [
        ...dirPaths.map((dirPath) =>
          replaceSepToPosix(path.join(dirPath, '**', option.exportFilename)),
        ),
        ...dirPaths.map((dirPath) =>
          replaceSepToPosix(path.join(dirPath, '**', `${option.exportFilename}.bak`)),
        ),
      ]
    : dirPaths.map((dirPath) => replaceSepToPosix(path.join(dirPath, '**', option.exportFilename)));

  const files = await fastGlob(globPatterns, { dot: true, cwd });

  return files;
}
