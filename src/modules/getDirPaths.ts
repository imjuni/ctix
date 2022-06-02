import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import getRelativeDepth from '@tools/getRelativeDepth';
import fastGlob from 'fast-glob';
import { getDirname, startSepRemove } from 'my-node-fp';
import path from 'path';

export default async function getDirPaths(
  exportInfos: IExportInfo[],
  option: TCreateOrSingleOption,
): Promise<{ depths: Record<string, number>; dirPaths: Record<string, IExportInfo[]> }> {
  const filePathsFromExportInfos = Array.from(
    new Set(
      await Promise.all(exportInfos.map((exportInfo) => getDirname(exportInfo.resolvedFilePath))),
    ),
  );

  const globFilePaths = await fastGlob(
    filePathsFromExportInfos.map((filePath) => `${filePath}${path.posix.sep}**${path.posix.sep}*`),
    { onlyDirectories: true },
  );

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
