import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import defaultIgnore from '@ignores/defaultIgnore';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import isIgnored from '@ignores/isIgnored';
import getRelativeDepth from '@tools/getRelativeDepth';
import IDescendantExportInfo from '@tools/interface/IDescendantExportInfo';
import { posixJoin } from '@tools/misc';
import fastGlob from 'fast-glob';
import fs from 'fs';
import { isEmpty, isFalse, isNotEmpty } from 'my-easy-fp';
import { getDirname, isEmptyDir, replaceSepToPosix } from 'my-node-fp';
import { AsyncReturnType } from 'type-fest';

export default async function getDescendantExportInfo(
  parentFilePath: string,
  option: TCreateOrSingleOption,
  exportInfos: IExportInfo[],
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
): Promise<IDescendantExportInfo[]> {
  const filePath = replaceSepToPosix(parentFilePath);
  const globPattern = replaceSepToPosix(posixJoin(await getDirname(filePath), '**', '*'));

  const unIgnoredDirPaths = await fastGlob(globPattern, {
    ignore: defaultIgnore,
    dot: true,
    onlyDirectories: true,
  });

  const dirPaths = unIgnoredDirPaths.filter((dirPath) => isFalse(isIgnored(ignores, dirPath)));

  const parentExportInfo = exportInfos.filter(
    (exportInfo) => exportInfo.resolvedDirPath === filePath,
  );
  const descendants = await Promise.all(
    dirPaths.map(async (globDirPath) => {
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
        depth: getRelativeDepth(option.startAt, globDirPath),
        exportInfos: includeExportInfos,
      };
    }),
  );

  const sortedDescendents = [
    {
      dirPath: filePath,
      isTerminal: await isEmptyDir(filePath),
      depth: getRelativeDepth(option.startAt, filePath),
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
