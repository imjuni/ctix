import { getFileScope } from '#/compilers/getFileScope';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import { isDescendant } from 'my-node-fp';

export function getTsIncludeFiles(config: {
  config: Pick<ICommonGenerateOptions, 'include'>;
  extend: Pick<IExtendOptions, 'tsconfig'> & {
    resolved: Pick<IExtendOptions['resolved'], 'projectDirPath'>;
  };
}): string[] {
  if (config.config.include != null && config.config.include.length > 0) {
    return config.config.include;
  }

  const { include } = getFileScope(config.extend.tsconfig.raw);

  if (include.length > 0) {
    return include;
  }

  const filePaths = config.extend.tsconfig.fileNames.filter((filePath) =>
    isDescendant(config.extend.resolved.projectDirPath, filePath),
  );

  return filePaths;
}
