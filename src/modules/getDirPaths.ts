import type { IExportInfo } from '#/compilers/interfaces/IExportInfo';
import type { TCreateOrSingleOption } from '#/configs/interfaces/IOption';
import { defaultIgnore } from '#/ignores/defaultIgnore';
import type { getIgnoreConfigContents } from '#/ignores/getIgnoreConfigContents';
import { isIgnored } from '#/ignores/isIgnored';
import { getRelativeDepth } from '#/tools/getRelativeDepth';
import { posixJoin } from '#/tools/misc';
import fastGlob from 'fast-glob';
import { startSepRemove } from 'my-node-fp';
import path from 'path';
import type { AsyncReturnType } from 'type-fest';

/**
 *
 * @param exportInfos
 * @param ignores
 * @param option
 * @returns
 */
export async function getDirPaths(
  exportInfos: IExportInfo[],
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
  option: TCreateOrSingleOption,
): Promise<{ depths: Record<string, number>; dirPaths: Record<string, IExportInfo[]> }> {
  const dirPathsFromExportInfos = await fastGlob(posixJoin(option.startAt, '**', '*'), {
    onlyDirectories: true,
    ignore: defaultIgnore,
    cwd: option.startAt,
  });

  const filePaths = [option.startAt, ...dirPathsFromExportInfos].filter(
    (dirPath) => isIgnored(ignores, dirPath) === false,
  );

  const depths = filePaths.reduce<Record<string, number>>((aggregation, filePath) => {
    return { ...aggregation, [filePath]: getRelativeDepth(option.startAt, filePath) };
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
