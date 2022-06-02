import IExportInfo from '@compilers/interfaces/IExportInfo';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getDecendentExportInfo from '@modules/getDecendentExportInfo';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import getRelativeDepth from '@tools/getRelativeDepth';
import ICreateIndexInfo from '@tools/interface/ICreateIndexInfo';
import IDecendentExportInfo from '@tools/interface/IDecendentExportInfo';
import { isFalse } from 'my-easy-fp';
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
 * @param dirPath base directory for extract decendent directory
 * @param exportInfos every exportInfos
 * @param option ctix option
 * @returns decendent directory index info
 */
export default async function createDecendentIndex(
  dirPath: string,
  exportInfos: IExportInfo[],
  ignores: IGetIgnoredConfigContents,
  option: TOptionWithResolvedProject,
): Promise<ICreateIndexInfo[]> {
  const depth = getRelativeDepth(option.topDirs, dirPath);
  const everyDecendents = await getDecendentExportInfo(dirPath, option, exportInfos, ignores);
  const decendents = everyDecendents
    .filter((decendent) => isFalse(decendent.isTerminal))
    .sort((l, r) => {
      const depthDiff = r.depth - l.depth;
      return depthDiff !== 0 ? depthDiff : r.dirPath.localeCompare(l.dirPath);
    });

  if (option.skipEmptyDir) {
    // 내가 비어있으면 스킵
    // top level 이라면, 비어 있더라도 index를 빌드해야 한다
    if (exportInfos.length <= 0 && depth !== option.topDirDepth) {
      return [];
    }

    // decendents는 depth가 제일 큰 것이 0번에 저장된, 정렬된 배열이다
    const exportedDecententRecord = decendents.reduce<Record<string, IDecendentExportInfo>>(
      (aggregation, decendent) => {
        // 어찌되든 자식이 export 할 아이템이 없으면 일단 skip 한다, skipEmptyDir true 모드니까
        if (decendent.exportInfos.length === 0) {
          return aggregation;
        }

        const next = { ...aggregation, [decendent.dirPath]: decendent };

        // 현재 디렉터리에 export 요소가 있으면 처리를 해줘야 하니까, aggregation 의 키중에 내 자식를 찾는다
        // 아쉽지만 여러개가 될 수 있다
        const decendentDirPaths = Object.keys(aggregation).filter((decendentDirPath) =>
          isDescendant(decendent.dirPath, decendentDirPath, path.posix.sep),
        );

        // reduce로 생성하는 방법도 있는데, 그냥 next를 만들고 undefined를 forEach로 넣는게
        // 코드상으로는 더 간단해 보인다.
        decendentDirPaths.forEach((decendentDirPath) => {
          delete next[decendentDirPath];
        });

        return next;
      },
      {},
    );

    const decendentIndexInfos = Object.values(exportedDecententRecord)
      .filter((exportedDecendent) => isFalse(exportedDecendent.isTerminal))
      .map((exportedDecendent) => {
        const needExportDecendents = everyDecendents
          .filter((decendent) => exportedDecendent.dirPath !== decendent.dirPath)
          .filter((decendent) =>
            isDescendant(exportedDecendent.dirPath, decendent.dirPath, path.posix.sep),
          )
          .filter((decendent) => decendent.exportInfos.length > 0)
          .filter((decendent, _, tempDecendents) => {
            const result = tempDecendents
              .map((tempDecendent) => tempDecendent.dirPath)
              .filter((decendentDirPath) => decendent.dirPath !== decendentDirPath)
              .sort((l, r) => l.localeCompare(r))
              .every((tempDecendentDirPath) =>
                isFalse(isDescendant(tempDecendentDirPath, decendent.dirPath, path.posix.sep)),
              );

            return result;
          });

        return needExportDecendents.map((decendent) => {
          const filePath = getFilePathOnIndex(decendent.dirPath, option, exportedDecendent.dirPath);

          return {
            depth: exportedDecendent.depth,
            resolvedDirPath: exportedDecendent.dirPath,
            resolvedFilePath: undefined,
            exportStatement: `export * from ${filePath}`,
          };
        });
      })
      .flatMap((nonFlatted) => nonFlatted);

    return decendentIndexInfos;
  }

  const decendentIndexInfos = everyDecendents
    .filter((decendent) => decendent.depth === depth + 1)
    .map((exportedDecendent) => {
      const filePath = getFilePathOnIndex(exportedDecendent.dirPath, option, dirPath);

      return {
        depth,
        resolvedDirPath: replaceSepToPosix(dirPath),
        resolvedFilePath: undefined,
        exportStatement: `export * from ${filePath}`,
      };
    });

  return decendentIndexInfos;
}
