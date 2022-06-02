import getTypeScriptConfig from '@compilers/getTypeScriptConfig';
import IDirectoryInfo from '@configs/interfaces/IDirectoryInfo';
import {
  TCleanOption,
  TCreateOption,
  TInitOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import getDepth from '@tools/getDepth';
import { settify } from '@tools/misc';
import { getDirnameSync, replaceSepToPosix, replaceSepToWin32 } from 'my-node-fp';
import path from 'path';
import getSourceFileEol from './getSourceFileEol';

export default async function attachDiretoryInfo<
  T extends TCreateOption | TSingleOption | TCleanOption | TInitOption,
>(option: T): Promise<T & IDirectoryInfo> {
  const project = replaceSepToPosix(path.resolve(option.project));
  const tsconfig = getTypeScriptConfig(option.project);

  const topDirDepth = tsconfig.fileNames
    .map((filePath) => {
      const dirPath = replaceSepToWin32(path.resolve(getDirnameSync(filePath)));
      return {
        filePaths: [dirPath],
        depth: getDepth(dirPath),
      };
    })
    .reduce(
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
    ...option,
    eol,
    topDirs: topDirDepth.filePaths,
    topDirDepth: 0,
    resolvedProjectDirPath: getDirnameSync(project),
    resolvedProjectFilePath: project,
  };
}
