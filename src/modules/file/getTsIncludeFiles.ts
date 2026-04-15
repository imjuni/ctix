import { getInheritedFileScope } from '#/compilers/getInheritedFileScope';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';
import { isDescendant } from 'my-node-fp';

export function getTsIncludeFiles(config: {
  config: Pick<IModeGenerateOptions, 'include'>;
  extend: Pick<IExtendOptions, 'tsconfig'> & {
    resolved: Pick<IExtendOptions['resolved'], 'projectDirPath' | 'projectFilePath'>;
  };
}): string[] {
  if (config.config.include != null && config.config.include.length > 0) {
    return config.config.include;
  }

  const { include } = getInheritedFileScope(config.extend.resolved.projectFilePath);

  if (include.length > 0) {
    return include;
  }

  // Fallback: use the TypeScript compiler's resolved file list filtered to files
  // that are descendants of the project directory. This matches 2.7.2 behaviour
  // and works reliably on both Windows and macOS because tsconfig.fileNames
  // contains the actual absolute paths the compiler already resolved.
  const filePaths = config.extend.tsconfig.fileNames.filter((filePath) =>
    isDescendant(config.extend.resolved.projectDirPath, filePath),
  );

  return filePaths;
}
