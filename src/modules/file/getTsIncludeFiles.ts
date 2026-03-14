import { getInheritedFileScope } from '#/compilers/getInheritedFileScope';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';

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

  return include;
}
