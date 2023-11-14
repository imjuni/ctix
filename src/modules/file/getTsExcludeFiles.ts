import { getFileScope } from '#/compilers/getFileScope';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { IModeGenerateOptions } from '#/configs/interfaces/IModeGenerateOptions';

export function getTsExcludeFiles(config: {
  config: Pick<IModeGenerateOptions, 'exclude'>;
  extend: Pick<IExtendOptions, 'tsconfig'>;
}): string[] {
  if (config.config.exclude != null && config.config.exclude.length > 0) {
    return config.config.exclude;
  }

  const { exclude } = getFileScope(config.extend.tsconfig.raw);
  return exclude;
}
