import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import IDescendantExportInfo from '@tools/interface/IDescendantExportInfo';
import fastGlob from 'fast-glob';
import fs from 'fs';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { getDirname, isDescendant, isEmptyDir, replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export default async function getDescendantExportInfo(
  parentFilePath: string,
  option: TCreateOrSingleOption,
  exportInfos: IExportInfo[],
  ignores: IGetIgnoredConfigContents,
): Promise<IDescendantExportInfo[]> {
  const filePath = replaceSepToPosix(parentFilePath);
  const dirPath = await getDirname(filePath);
  const globPattern = replaceSepToPosix(path.join(dirPath, '**', '*'));

  const globIgnorePatterns = Object.entries(ignores)
    .filter(([ignoreFilePath]) => isDescendant(parentFilePath, ignoreFilePath, path.posix.sep))
    .filter(([, ignoreContent]) => ignoreContent === '*')
    .map(([ignoreFilePath]) => replaceSepToPosix(path.join(ignoreFilePath, '*')));

  const globDirPaths = await fastGlob(globPattern, {
    ignore: globIgnorePatterns,
    dot: true,
    onlyDirectories: true,
  });

  const parentExportInfo = exportInfos.filter(
    (exportInfo) => exportInfo.resolvedDirPath === filePath,
  );
  const descendants = await Promise.all(
    globDirPaths.map(async (globDirPath) => {
      const includeExportInfos = exportInfos
        .filter((exportInfo) => exportInfo.resolvedDirPath === globDirPath)
        .filter((exportInfo) => {
          const ignoreInFile = ignores[exportInfo.resolvedFilePath];
          const namedExportIdentifiers = exportInfo.namedExports.map(
            (namedExport) => namedExport.identifier,
          );

          if (typeof ignoreInFile === 'string' && ignoreInFile === '*') {
            return false;
          }

          if (
            typeof ignoreInFile === 'string' &&
            ignoreInFile === exportInfo.defaultExport?.identifier &&
            namedExportIdentifiers.length <= 0
          ) {
            return false;
          }

          if (
            isNotEmpty(exportInfo.defaultExport?.identifier) &&
            ignoreInFile !== exportInfo.defaultExport?.identifier
          ) {
            return true;
          }

          if (namedExportIdentifiers.length > 0) {
            return true;
          }

          return isEmpty(ignoreInFile);
        });

      const includeDirFilePaths = await fs.promises.readdir(globDirPath, { withFileTypes: true });

      return {
        dirPath: globDirPath,
        isTerminal: isFalse(
          includeDirFilePaths.some((includeDirFilePath) => includeDirFilePath.isDirectory()),
        ),
        depth: getRelativeDepth(option.topDirs, globDirPath),
        exportInfos: includeExportInfos,
      };
    }),
  );

  const sortedDescendents = [
    {
      dirPath: filePath,
      isTerminal: await isEmptyDir(filePath),
      depth: getRelativeDepth(option.topDirs, filePath),
      exportInfos: parentExportInfo,
    },
    ...descendants,
  ].sort((l, r) => {
    const depthDiff = l.depth - r.depth;

    if (depthDiff !== 0) {
      return depthDiff;
    }

    return l.dirPath.localeCompare(r.dirPath);
  });

  return sortedDescendents;
}
