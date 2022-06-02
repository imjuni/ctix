import * as progress from '@cli/progress';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import getDirPaths from '@modules/getDirPaths';
import mergeCreateIndexInfo from '@modules/mergeCreateIndexInfo';
import singleIndexInfo from '@modules/singleIndexInfo';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import { settify } from '@tools/misc';
import { isNotEmpty } from 'my-easy-fp';
import * as tsm from 'ts-morph';

export default async function singleIndexInfos(
  exportInfos: IExportInfo[],
  option: TOptionWithResolvedProject,
  project: tsm.Project,
): Promise<ICreateIndexInfos[]> {
  try {
    const { depths, dirPaths } = await getDirPaths(exportInfos, option);

    const depthPairs = Object.keys(dirPaths)
      .map((dirPath) => ({ dirPath, depth: depths[dirPath], exportInfos: dirPaths[dirPath] }))
      .filter((depthPair) => isNotEmpty(depthPair.depth))
      .filter((depthPair) => isNotEmpty(depthPair.exportInfos))
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
        if (isNotEmpty(aggregation[indexInfo.resolvedDirPath])) {
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
              [indexInfo.resolvedFilePath].filter((resolvedFilePath): resolvedFilePath is string =>
                isNotEmpty(resolvedFilePath),
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
