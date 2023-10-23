import { getFileScope } from '#/compilers/getFileScope';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';

export function getTsExcludeFiles(config: {
  config: Pick<ICommonGenerateOptions, 'exclude'>;
  extend: Pick<IExtendOptions, 'tsconfig'>;
}): string[] {
  if (config.config.exclude != null && config.config.exclude.length > 0) {
    return config.config.exclude;
  }

  const { exclude } = getFileScope(config.extend.tsconfig.raw);
  return exclude;
}
