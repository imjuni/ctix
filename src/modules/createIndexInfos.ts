import * as progress from '@cli/progress';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import createDescendantIndex from '@modules/createDescendantIndex';
import createIndexInfo from '@modules/createIndexInfo';
import getDirPaths from '@modules/getDirPaths';
import mergeCreateIndexInfo from '@modules/mergeCreateIndexInfo';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import { settify } from '@tools/misc';
import { isNotEmpty } from 'my-easy-fp';

export default async function createIndexInfos(
  exportInfos: IExportInfo[],
  ignores: IGetIgnoredConfigContents,
  option: TCreateOrSingleOption,
): Promise<ICreateIndexInfos[]> {
  try {
    const { depths, dirPaths } = await getDirPaths(exportInfos, option);

    const depthPairs = Object.keys(dirPaths)
      .map((dirPath) => ({ dirPath, depth: depths[dirPath], exportInfos: dirPaths[dirPath] }))
      .filter((depthPair) => isNotEmpty(depthPair.depth))
      .filter((depthPair) => isNotEmpty(depthPair.exportInfos))
      .sort((l, r) => r.depth - l.depth);

    progress.start(depthPairs.length * 2, 0);

    const statementInfos = depthPairs
      .map((depthPair) => {
        if (depthPair.exportInfos.length <= 0) {
          return [];
        }

        const statements = depthPair.exportInfos
          .map((exportInfo) => {
            const indexInfo = createIndexInfo(exportInfo, option);
            return indexInfo;
          })
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

    const descendantExportInfos = (
      await Promise.all(
        depthPairs.map(async (depthPair) => {
          const indexInfo = await createDescendantIndex(
            depthPair.dirPath,
            exportInfos,
            ignores,
            option,
          );

          progress.increment();

          return indexInfo;
        }),
      )
    )
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
            resolvedFilePaths: isNotEmpty(indexInfo.resolvedFilePath)
              ? [indexInfo.resolvedFilePath]
              : indexInfo.resolvedFilePath,
            exportStatements: [indexInfo.exportStatement],
          },
        };
      }, {});

    const mergedIndexInfos = depthPairs.reduce<Record<string, ICreateIndexInfos>>(
      (aggregation, depthPair) => {
        const statementInfo = statementInfos[depthPair.dirPath];
        const descendantExportInfo = descendantExportInfos[depthPair.dirPath];

        if (isNotEmpty(statementInfo) && isNotEmpty(descendantExportInfo)) {
          return {
            ...aggregation,
            [depthPair.dirPath]: mergeCreateIndexInfo(
              mergeCreateIndexInfo(aggregation[depthPair.dirPath], statementInfo),
              descendantExportInfo,
            ),
          };
        }

        if (isNotEmpty(statementInfo)) {
          return {
            ...aggregation,
            [depthPair.dirPath]: mergeCreateIndexInfo(
              aggregation[depthPair.dirPath],
              statementInfo,
            ),
          };
        }

        if (isNotEmpty(descendantExportInfo)) {
          return {
            ...aggregation,
            [depthPair.dirPath]: mergeCreateIndexInfo(
              aggregation[depthPair.dirPath],
              descendantExportInfo,
            ),
          };
        }

        return { ...aggregation };
      },
      {},
    );

    progress.update(depthPairs.length * 2);

    return Object.values(mergedIndexInfos).map((mergedIndexInfo) => {
      return {
        ...mergedIndexInfo,
        exportStatements: mergedIndexInfo.exportStatements.sort((l, r) => l.localeCompare(r)),
      };
    });
  } finally {
    progress.stop();
  }
}
