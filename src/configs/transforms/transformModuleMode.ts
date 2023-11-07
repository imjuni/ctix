import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import type { TModuleOptions } from '#/configs/interfaces/TModuleOptions';
import { getOutputValue } from '#/configs/transforms/getOutputValue';
import type { SetRequired } from 'type-fest';

export async function transformModuleMode(
  argv: SetRequired<Partial<TCommandBuildArgvOptions>, 'project'> & {
    options?: (TCreateOptions | TBundleOptions | TModuleOptions)[];
  },
  option: Partial<Omit<TModuleOptions, 'include' | 'exclude'>> & {
    include: TModuleOptions['include'];
    exclude: TModuleOptions['exclude'];
  },
): Promise<TModuleOptions> {
  const output = getOutputValue(argv, option);

  return {
    mode: CE_CTIX_BUILD_MODE.MODULE_MODE,
    project: argv.project,
    exportFilename:
      argv.exportFilename ?? option.exportFilename ?? CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
    useSemicolon: argv.useSemicolon ?? option.useSemicolon ?? true,
    useBanner: argv.useBanner ?? option.useBanner ?? false,
    useTimestamp: argv.useTimestamp ?? option.useTimestamp ?? false,
    quote: argv.quote ?? option.quote ?? "'",
    directive: argv.directive ?? option.directive ?? '',
    overwrite: argv.overwrite ?? option.overwrite ?? false,
    backup: argv.backup ?? option.backup ?? true,
    include: option.include,
    exclude: option.exclude,

    output,
  };
}
