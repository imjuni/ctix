import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TCreateOrSingleOption } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getDescendantExportInfo from '@modules/getDescendantExportInfo';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import getRelativeDepth from '@tools/getRelativeDepth';
import ICreateIndexInfo from '@tools/interface/ICreateIndexInfo';
import IDescendantExportInfo from '@tools/interface/IDescendantExportInfo';
import { isFalse, populate } from 'my-easy-fp';
import { isDescendant, replaceSepToPosix } from 'my-node-fp';
import path from 'path';

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
export default async function createDescendantIndex(
  dirPath: string,
  exportInfos: IExportInfo[],
  ignores: IGetIgnoredConfigContents,
  option: TCreateOrSingleOption,
): Promise<ICreateIndexInfo[]> {
  const depth = getRelativeDepth(option.topDirs, dirPath);
  const everyDescendants = await getDescendantExportInfo(dirPath, option, exportInfos, ignores);
  const sortedEveryDescendants = everyDescendants.sort((l, r) => {
    const depthDiff = r.depth - l.depth;
    return depthDiff !== 0 ? depthDiff : r.dirPath.localeCompare(l.dirPath);
  });
  const maxDepth = everyDescendants.reduce((max, descendant) => {
    if (max < descendant.depth) {
      return descendant.depth;
    }

    return max;
  }, Number.MIN_SAFE_INTEGER);

  if (option.mode === 'create' && option.skipEmptyDir) {
    // 내가 비어있으면 스킵
    // top level 이라면, 비어 있더라도 index를 빌드해야 한다
    if (exportInfos.length <= 0 && depth !== option.topDirDepth) {
      return [];
    }

    const indexNeedExportInfos = populate(maxDepth + 1, true).reduce<
      Record<string, IDescendantExportInfo>
    >((aggregate, currentDepth) => {
      const alreadyRegisteredKeys = Object.keys(aggregate);

      const currentDepthDescendantExportInfos = sortedEveryDescendants
        .filter((sortedEveryDescendant) => sortedEveryDescendant.depth === currentDepth)
        .filter((sortedEveryDescendant) =>
          isFalse(alreadyRegisteredKeys.includes(sortedEveryDescendant.dirPath)),
        )
        .filter((sortedEveryDescendant) =>
          isFalse(
            alreadyRegisteredKeys.some((alreadyRegisteredKey) =>
              isDescendant(alreadyRegisteredKey, sortedEveryDescendant.dirPath, path.posix.sep),
            ),
          ),
        )
        .filter((sortedEveryDescendant) => sortedEveryDescendant.exportInfos.length > 0);

      const next = { ...aggregate };

      currentDepthDescendantExportInfos.forEach((currentDepthDescendantExportInfo) => {
        next[currentDepthDescendantExportInfo.dirPath] = currentDepthDescendantExportInfo;
      });

      return next;
    }, {});

    const descendantIndexInfos = Object.values(indexNeedExportInfos)
      .map((indexNeedExportInfo) => {
        const jumpedDescendents = everyDescendants
          .filter((descendant) => descendant.dirPath !== indexNeedExportInfo.dirPath)
          .filter((descendant) =>
            isDescendant(indexNeedExportInfo.dirPath, descendant.dirPath, path.posix.sep),
          )
          .filter((descendant) => descendant.exportInfos.length > 0);

        const jumpedIndexInfos = jumpedDescendents.map((jumpedDescendent) => {
          const filePath = getFilePathOnIndex(
            jumpedDescendent.dirPath,
            option,
            indexNeedExportInfo.dirPath,
          );

          return {
            depth: indexNeedExportInfo.depth,
            resolvedDirPath: indexNeedExportInfo.dirPath,
            resolvedFilePath: undefined,
            exportStatement: `export * from ${filePath}`,
          };
        });

        return jumpedIndexInfos;
      })
      .flatMap((nonFlatten) => nonFlatten);

    return descendantIndexInfos;
  }

  const descendantIndexInfos = everyDescendants
    .filter((descendant) => descendant.depth === depth + 1)
    .map((exportedDescendant) => {
      const filePath = getFilePathOnIndex(exportedDescendant.dirPath, option, dirPath);

      return {
        depth,
        resolvedDirPath: replaceSepToPosix(dirPath),
        resolvedFilePath: undefined,
        exportStatement: `export * from ${filePath}`,
      };
    });

  return descendantIndexInfos;
}
