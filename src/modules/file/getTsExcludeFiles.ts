import { getInheritedFileScope } from '#/compilers/getInheritedFileScope';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';

export function getTsExcludeFiles(config: {
  config: Pick<IModeGenerateOptions, 'exclude'>;
  extend: Pick<IExtendOptions, 'tsconfig'> & {
    resolved: Pick<IExtendOptions['resolved'], 'projectDirPath' | 'projectFilePath'>;
  };
}): string[] {
  if (config.config.exclude != null && config.config.exclude.length > 0) {
    return config.config.exclude;
  }

  const { exclude } = getInheritedFileScope(config.extend.resolved.projectFilePath);
  return exclude;
}
