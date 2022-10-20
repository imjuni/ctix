import progress from '@cli/progress';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getDirPaths from '@modules/getDirPaths';
import mergeCreateIndexInfo from '@modules/mergeCreateIndexInfo';
import singleIndexInfo from '@modules/singleIndexInfo';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import { settify } from 'my-easy-fp';
import * as tsm from 'ts-morph';
import { AsyncReturnType } from 'type-fest';

export default async function singleIndexInfos(
  exportInfos: IExportInfo[],
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
  option: TSingleOptionWithDirInfo,
  project: tsm.Project,
): Promise<ICreateIndexInfos[]> {
  try {
    const { depths, dirPaths } = await getDirPaths(exportInfos, ignores, option);

    const depthPairs = Object.keys(dirPaths)
      .map((dirPath) => ({ dirPath, depth: depths[dirPath], exportInfos: dirPaths[dirPath] }))
      .filter((depthPair) => depthPair.depth != null)
      .filter((depthPair) => depthPair.exportInfos != null)
      .sort((l, r) => r.depth - l.depth);

    progress.start(depthPairs.length, 0);

    const statementInfos = depthPairs
      .map((depthPair) => {
        if (depthPair.exportInfos.length <= 0) {
          return [];
        }

        const statements = depthPair.exportInfos
          .map((exportInfo) => singleIndexInfo(exportInfo, option, project))
          .flatMap((nonFlatted) => nonFlatted);

        progress.increment();

        return statements;
      })
      .flatMap((nonFlatted) => nonFlatted)
      .reduce<Record<string, ICreateIndexInfos>>((aggregation, indexInfo) => {
        if (aggregation[indexInfo.resolvedDirPath] != null) {
          return {
            ...aggregation,
            [indexInfo.resolvedDirPath]: mergeCreateIndexInfo(
              aggregation[indexInfo.resolvedDirPath],
              indexInfo,
            ),
          };
        }

        return {
          ...aggregation,
          [indexInfo.resolvedDirPath]: {
            depth: indexInfo.depth,
            resolvedDirPath: indexInfo.resolvedDirPath,
            resolvedFilePaths: settify(
              [indexInfo.resolvedFilePath].filter(
                (resolvedFilePath): resolvedFilePath is string => resolvedFilePath != null,
              ),
            ),
            exportStatements: [indexInfo.exportStatement],
          },
        };
      }, {});

    progress.update(depthPairs.length);

    return Object.values(statementInfos);
  } finally {
    progress.stop();
  }
}
