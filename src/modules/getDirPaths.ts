import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import defaultIgnore from '@ignores/defaultIgnore';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import isIgnored from '@ignores/isIgnored';
import getRelativeDepth from '@tools/getRelativeDepth';
import { posixJoin } from '@tools/misc';
import fastGlob from 'fast-glob';
import { isFalse } from 'my-easy-fp';
import { getDirname, startSepRemove } from 'my-node-fp';
import path from 'path';
import { AsyncReturnType } from 'type-fest';

/**
 *
 * @param exportInfos
 * @param ignores
 * @param option
 * @returns
 */
export default async function getDirPaths(
  exportInfos: IExportInfo[],
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
  option: TCreateOrSingleOption,
): Promise<{ depths: Record<string, number>; dirPaths: Record<string, IExportInfo[]> }> {
  const dirPathsFromExportInfos = Array.from(
    new Set(
      await Promise.all(exportInfos.map((exportInfo) => getDirname(exportInfo.resolvedFilePath))),
    ),
  );

  const totalDirPaths = await fastGlob(
    dirPathsFromExportInfos.map((filePath) => posixJoin(filePath, '**', '*')),
    {
      onlyDirectories: true,
      ignore: defaultIgnore,
      cwd: option.resolvedProjectDirPath,
    },
  );

  const unIgnoredDirPaths = totalDirPaths.filter((dirPath) => isFalse(isIgnored(ignores, dirPath)));

  const filePaths = Array.from(new Set([...dirPathsFromExportInfos, ...unIgnoredDirPaths]));
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
