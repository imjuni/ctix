import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import gitignore from '@ignores/gitignore';
import IGetIgnoredConfigContents from '@ignores/interfaces/IGetIgnoredConfigContents';
import getDepth from '@tools/getDepth';
import { fastGlobWrap, posixJoin } from '@tools/misc';
import fs from 'fs';
import { isEmpty, isFalse } from 'my-easy-fp';
import path from 'path';

export default async function getEmptyDescendantTree({
  cwd,
  ignoreFilePath,
  ignores,
}: {
  cwd: string;
  ignoreFilePath: string;
  ignores: IGetIgnoredConfigContents;
}) {
  const filePaths = await fastGlobWrap(path.join(cwd, '**'), {
    ignore: [...gitignore.globPatterns],
    cwd,
    onlyDirectories: true,
  });

  const emptyTerminalDirectories = (
    await Promise.all(
      filePaths.map(async (filePath) => {
        const dirPaths = await fs.promises.readdir(filePath, { withFileTypes: true });
        const includes = dirPaths
          .filter((dirPath) => dirPath.isFile())
          .filter((dirPath) => {
            const resolvedDirPath = posixJoin(filePath, dirPath.name);
            return isEmpty(ignores[resolvedDirPath]);
          });

        const isTerminal = dirPaths.filter((dirPath) => dirPath.isDirectory()).length <= 0;

        return { filePath, isTerminal, includes };
      }),
    )
  )
    .filter((filePathWithIncludes) => filePathWithIncludes.includes.length <= 0)
    .filter((filePathWithIncludes) => filePathWithIncludes.isTerminal);

  // isTerminal 이면서 비어 있는 것
  // 전체 계보가 다 비어 있는 것을 찾는다

  const ignoreFileBaseName = path.basename(ignoreFilePath);
  const emptyDescendantDirPaths = (
    await Promise.all(
      Array.from(
        new Set(
          emptyTerminalDirectories
            .map((emptyTerminalDirectory) => {
              const emptyFilePaths = emptyTerminalDirectory.filePath
                .split(path.posix.sep)
                .map((_filePathElement, index, filePathelements) => {
                  return filePathelements.slice(0, index + 1).join(path.posix.sep);
                })
                .filter((element) => element !== '')
                .filter((element) => isFalse(/^([A-Za-z]:)$/.test(element)))
                .filter((element) => getDepth(cwd) <= getDepth(element))
                .sort((l, r) => getDepth(r) - getDepth(l));
              return emptyFilePaths;
            })
            .flatMap((nonFlatten) => nonFlatten),
        ),
      ).map(async (filePath) => {
        const dirs = (await fs.promises.readdir(filePath, { withFileTypes: true }))
          .filter(
            (dirent) =>
              dirent.name !== '.ctirc' &&
              dirent.name !== ignoreFileBaseName &&
              dirent.name !== defaultIgnoreFileName,
          )
          .filter((dirent) => dirent.isFile())
          .map((dirent) => posixJoin(filePath, dirent.name))
          .filter((dirent) => isEmpty(ignores[dirent]));

        return {
          filePath,
          depth: getDepth(filePath),
          dirs,
        };
      }),
    )
  ).reduce<Array<{ filePath: string; depth: number; dirs: string[] }>>(
    (agg, dirPath) => (dirPath.dirs.length <= 0 ? [...agg, dirPath] : agg),
    [],
  );

  const emptyDescendantDirRecord = emptyDescendantDirPaths
    .sort((l, r) => l.depth - r.depth)
    .reduce<Record<string, string>>((aggregation, emptyDescendantDirPath) => {
      return {
        ...aggregation,
        [emptyDescendantDirPath.filePath]: '*',
      };
    }, {});

  return emptyDescendantDirRecord;
}
