import type { IExportInfo } from '#/compilers/interfaces/IExportInfo';
import type { TCreateOrSingleOption } from '#/configs/interfaces/IOption';
import type { getIgnoreConfigContents } from '#/ignores/getIgnoreConfigContents';
import { getDescendantExportInfo } from '#/modules/getDescendantExportInfo';
import { getFilePathOnIndex } from '#/modules/getFilePathOnIndex';
import { getRelativeDepth } from '#/tools/getRelativeDepth';
import type { ICreateIndexInfo } from '#/tools/interface/ICreateIndexInfo';
import type { IDescendantExportInfo } from '#/tools/interface/IDescendantExportInfo';
import { isDescendant, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type { AsyncReturnType } from 'type-fest';

/*

b, c는 비어 있다. 그래서 a에 index.ts를 만들 때는 d, e를 바로 링크해야 한다
b, c는 만들면 안됨

a/
>> a/index.ts

a/b/
a/b/c/

a/b/c/case01.ts
>> a/b/c/index.ts

a/b/c/d/e/case02.ts
a/b/c/d/e/case03.ts
>> a/b/c/index.ts 에 들어간다

a/b/c/f/g/case04.ts
>> a/b/c/index.ts 에 들어간다
 */

/**
 *
 * @param dirPath base directory for extract descendant directory
 * @param exportInfos every exportInfos
 * @param option ctix option
 * @returns descendant directory index info
 */
export async function createDescendantIndex(
  dirPath: string,
  exportInfos: IExportInfo[],
  ignores: AsyncReturnType<typeof getIgnoreConfigContents>,
  option: TCreateOrSingleOption,
): Promise<ICreateIndexInfo[]> {
  const currentDepth = getRelativeDepth(option.startAt, dirPath);
  const everyDescendants = await getDescendantExportInfo(dirPath, option, exportInfos, ignores);
  const sortedEveryDescendants = everyDescendants.sort((l, r) => {
    const depthDiff = l.depth - r.depth;
    return depthDiff !== 0 ? depthDiff : r.dirPath.localeCompare(l.dirPath);
  });

  if (option.mode === 'create' && option.skipEmptyDir) {
    const currentDirExportInfos = exportInfos.filter(
      (exportInfo) => exportInfo.resolvedDirPath === dirPath,
    );

    // 내가 비어있으면 스킵
    // top level 이라면, 비어 있더라도 index를 빌드해야 한다
    // self directory is empty that will be skip
    // If currentDepth is top level of depth that have to build index
    if (currentDirExportInfos.length <= 0 && currentDepth !== 0) {
      return [];
    }

    const indexNeedExportInfos = sortedEveryDescendants
      .filter((descendent) => descendent.dirPath !== dirPath)
      .reduce<Record<string, IDescendantExportInfo>>((aggregation, sortedEveryDescendant) => {
        const alreadyRegisteredDirPaths = Object.keys(aggregation);

        if (
          alreadyRegisteredDirPaths.some((alreadyRegisteredDirPath) =>
            isDescendant(alreadyRegisteredDirPath, sortedEveryDescendant.dirPath, path.posix.sep),
          )
        ) {
          return aggregation;
        }

        if (sortedEveryDescendant.exportInfos.length <= 0) {
          return aggregation;
        }

        return { ...aggregation, [sortedEveryDescendant.dirPath]: sortedEveryDescendant };
      }, {});

    const descendantIndexInfos = Object.values(indexNeedExportInfos).map((indexNeedExportInfo) => {
      const filePath = getFilePathOnIndex(indexNeedExportInfo.dirPath, option, dirPath);

      return {
        depth: currentDepth,
        resolvedDirPath: dirPath,
        resolvedFilePath: undefined,
        exportStatement: `export * from ${filePath}`,
      };
    }, {});

    return descendantIndexInfos;
  }

  const descendantIndexInfos = everyDescendants
    .filter((everyDescendant) => everyDescendant.depth === currentDepth + 1)
    .map((exportedDescendant) => {
      const filePath = getFilePathOnIndex(exportedDescendant.dirPath, option, dirPath);

      return {
        depth: currentDepth,
        resolvedDirPath: replaceSepToPosix(dirPath),
        resolvedFilePath: undefined,
        exportStatement: `export * from ${filePath}`,
      };
    });

  return descendantIndexInfos;
}
