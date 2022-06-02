import { increment, start, stop, update } from '@cli/progress';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import createDecendentIndex from '@modules/createDecendentIndex';
import createIndexInfo from '@modules/createIndexInfo';
import getDirPaths from '@modules/getDirPaths';
import mergeCreateIndexInfo from '@modules/mergeCreateIndexInfo';
import ICreateIndexInfos from '@tools/interface/ICreateIndexInfos';
import { settify } from '@tools/misc';
import { isNotEmpty } from 'my-easy-fp';

export default async function createIndexInfos(
  exportInfos: IExportInfo[],
  ignores: IGetIgnoredConfigContents,
  option: TOptionWithResolvedProject,
  isMessageDisplay?: boolean,
): Promise<ICreateIndexInfos[]> {
  try {
    const { depths, dirPaths } = await getDirPaths(exportInfos, option);

    const depthPairs = Object.keys(dirPaths)
      .map((dirPath) => ({ dirPath, depth: depths[dirPath], exportInfos: dirPaths[dirPath] }))
      .filter((depthPair) => isNotEmpty(depthPair.depth))
      .filter((depthPair) => isNotEmpty(depthPair.exportInfos))
      .sort((l, r) => r.depth - l.depth);

    if (isMessageDisplay) {
      start(depthPairs.length * 2, 0);
    }

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

        if (isMessageDisplay) {
          increment();
        }

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

    const decendentExportInfos = (
      await Promise.all(
        depthPairs.map(async (depthPair) => {
          const indexInfo = await createDecendentIndex(
            depthPair.dirPath,
            exportInfos,
            ignores,
            option,
          );

          if (isMessageDisplay) {
            increment();
          }

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
        const decendentExportInfo = decendentExportInfos[depthPair.dirPath];

        if (isNotEmpty(statementInfo) && isNotEmpty(decendentExportInfo)) {
          return {
            ...aggregation,
            [depthPair.dirPath]: mergeCreateIndexInfo(
              mergeCreateIndexInfo(aggregation[depthPair.dirPath], statementInfo),
              decendentExportInfo,
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

        if (isNotEmpty(decendentExportInfo)) {
          return {
            ...aggregation,
            [depthPair.dirPath]: mergeCreateIndexInfo(
              aggregation[depthPair.dirPath],
              decendentExportInfo,
            ),
          };
        }

        return { ...aggregation };
      },
      {},
    );

    if (isMessageDisplay) {
      update(depthPairs.length * 2);
    }

    return Object.values(mergedIndexInfos);
  } finally {
    if (isMessageDisplay) {
      stop();
    }
  }
}
