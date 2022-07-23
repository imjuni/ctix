import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getRelativeDepth from '@tools/getRelativeDepth';
import { posixJoin } from '@tools/misc';
import globby from 'globby';
import minimatch from 'minimatch';
import { isFalse } from 'my-easy-fp';
import { getDirname, startSepRemove } from 'my-node-fp';
import path from 'path';

export default async function getDirPaths(
  exportInfos: IExportInfo[],
  ignores: { origin: IGetIgnoredConfigContents; evaluated: IGetIgnoredConfigContents },
  option: TCreateOrSingleOption,
): Promise<{ depths: Record<string, number>; dirPaths: Record<string, IExportInfo[]> }> {
  const filePathsFromExportInfos = Array.from(
    new Set(
      await Promise.all(exportInfos.map((exportInfo) => getDirname(exportInfo.resolvedFilePath))),
    ),
  );

  const totalGlobFilePaths = await globby(
    filePathsFromExportInfos.map((filePath) => `${filePath}${path.posix.sep}**${path.posix.sep}*`),
    { onlyDirectories: true, gitignore: true },
  );

  const ignoreGlobPatterns = Object.keys(ignores.origin);
  const globFilePaths = totalGlobFilePaths.filter((totalGlobFilePath) => {
    return isFalse(
      ignoreGlobPatterns.some((ignoreGlobPattern) =>
        minimatch(totalGlobFilePath, posixJoin(option.resolvedProjectDirPath, ignoreGlobPattern)),
      ),
    );
  });

  const filePaths = Array.from(new Set([...filePathsFromExportInfos, ...globFilePaths]));
  const depths = filePaths.reduce<Record<string, number>>((aggregation, filePath) => {
    return { ...aggregation, [filePath]: getRelativeDepth(option.topDirs, filePath) };
  }, {});

  const dirPaths = filePaths.reduce<Record<string, IExportInfo[]>>((aggregation, filePath) => {
    const files = exportInfos.filter((exportInfo) => {
      return (
        exportInfo.resolvedFilePath.indexOf(filePath) >= 0 &&
        startSepRemove(exportInfo.resolvedFilePath.replace(filePath, ''), path.posix.sep).split(
          path.posix.sep,
        ).length <= 1
      );
    });

    return { ...aggregation, [filePath]: files };
  }, {});

  return { depths, dirPaths };
}
