import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import { getSourceFileEol } from '#/configs/modules/getSourceFileEol';
import { getDepth } from '#/modules/path/getDepth';
import { settify } from 'my-easy-fp';
import { getDirname, isDescendant, replaceSepToPosix } from 'my-node-fp';
import path from 'node:path';

export async function getExtendOptions(project: string): Promise<IExtendOptions> {
  const projectPath = replaceSepToPosix(path.resolve(project));
  const tsconfig = getTypeScriptConfig(projectPath);
  const resolvedProjectDirPath = replaceSepToPosix(await getDirname(projectPath));

  // 여러가지 테스트를 해본 결과, include에 아무것도 지정하지 않은 프로젝트는 tsconfig.json 파일보다
  // 더 상위 디렉터리에 있는 ts 파일도 모두 포함한다. 이런 식으로 필터를 걸어서, tsconfig.json 파일보다
  // 상위에 있는 것을 제외하는 작업이 필요하다
  const filePaths = tsconfig.fileNames.filter((filePath) =>
    isDescendant(resolvedProjectDirPath, filePath),
  );

  const topDirDepth = (
    await Promise.all(
      filePaths.map(async (filePath) => {
        const dirPath = replaceSepToPosix(path.resolve(await getDirname(filePath)));
        return {
          filePaths: [dirPath],
          depth: getDepth(dirPath),
        };
      }),
    )
  ).reduce(
    (minDepth, depth) => {
      if (minDepth.depth > depth.depth) {
        return { ...depth, filePaths: settify(minDepth.filePaths.concat(depth.filePaths)) };
      }

      if (minDepth.depth === depth.depth) {
        return { ...minDepth, filePaths: settify(minDepth.filePaths.concat(depth.filePaths)) };
      }

      return minDepth;
    },
    {
      filePaths: [],
      depth: Number.MAX_SAFE_INTEGER,
    },
  );

  const eol = await getSourceFileEol([...tsconfig.fileNames].slice(0, 30));

  return {
    eol,
    tsconfig,
    topDir: {
      dirs: topDirDepth.filePaths,
      depth: 0,
    },
    resolved: {
      projectDirPath: resolvedProjectDirPath,
      projectFilePath: projectPath,
    },
  };
}
