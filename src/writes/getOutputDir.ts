import { TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import { isFalse } from 'my-easy-fp';
import { getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

function getTsconfigRootDir(compilerOptions: tsm.CompilerOptions): string | undefined {
  // If set rootDir, use it
  if (compilerOptions.rootDir !== undefined && compilerOptions.rootDir !== null) {
    const rootDir = path.resolve(compilerOptions.rootDir);
    return replaceSepToPosix(rootDir);
  }

  // If set rootDirs, use first element of array
  if (compilerOptions.rootDirs !== undefined && compilerOptions.rootDirs !== null) {
    const [head] = compilerOptions.rootDirs;
    const rootDir = path.resolve(head);
    return replaceSepToPosix(rootDir);
  }

  return undefined;
}

export default function getOutputDir(
  project: tsm.Project,
  option: TSingleOptionWithDirInfo,
): string {
  if (isFalse(option.useRootDir ?? false)) {
    return replaceSepToPosix(path.resolve(getDirnameSync(option.output)));
  }

  const compilerOptions = project.getCompilerOptions();
  const rootDir = getTsconfigRootDir(compilerOptions);

  if (rootDir !== undefined && rootDir !== null) {
    const outputDirConfig = replaceSepToPosix(getDirnameSync(option.output));

    if (path.relative(rootDir, outputDirConfig).startsWith('..')) {
      return rootDir;
    }

    return replaceSepToPosix(path.resolve(outputDirConfig));
  }

  return replaceSepToPosix(path.resolve(getDirnameSync(option.output)));
}
