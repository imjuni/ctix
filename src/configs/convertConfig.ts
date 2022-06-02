import getTypeScriptConfig from '@compilers/getTypeScriptConfig';
import ICliOption from '@configs/interfaces/ICliOption';
import IOption, { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import getDepth from '@tools/getDepth';
import { settify } from '@tools/misc';
import { getDirnameSync, replaceSepToPosix, replaceSepToWin32 } from 'my-node-fp';
import path from 'path';

export default function convertConfig(
  cliOption: ICliOption,
  mode: 'create' | 'single',
): TOptionWithResolvedProject {
  const option: IOption = {
    mode,
    config: cliOption.config,
    addNewline: cliOption.addNewline ?? true,
    exportFilename: cliOption.exportFilename ?? 'index.ts',
    keepFileExt: cliOption.keepFileExt ?? cliOption.keepFileExt ?? false,
    output: cliOption.output ?? cliOption.project,
    project: cliOption.project,
    quote: cliOption.quote ?? "'",
    useBackupFile: cliOption.useBackupFile ?? true,
    useComment: cliOption.useComment ?? false,
    useSemicolon: cliOption.useSemicolon ?? true,
    useRootDir: cliOption.useRootDir ?? false,
    useTimestamp: cliOption.useTimestamp ?? false,
    verbose: cliOption.verbose ?? false,
    skipEmptyDir: cliOption.skipEmptyDir ?? false,
  };

  const project = replaceSepToPosix(path.resolve(cliOption.project));
  const tsconfig = getTypeScriptConfig(cliOption.project);
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

  return {
    ...option,
    topDirs: topDirDepth.filePaths,
    topDirDepth: 0,
    resolvedProjectDirPath: getDirnameSync(project),
    resolvedProjectFilePath: project,
  };
}
