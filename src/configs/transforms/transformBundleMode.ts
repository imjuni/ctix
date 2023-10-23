import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getOutputValue } from '#/configs/transforms/getOutputValue';
import type { SetRequired } from 'type-fest';

export function transformBundleMode(
  argv: SetRequired<Partial<TCommandBuildArgvOptions>, 'project'> & {
    options?: (TCreateOptions | TBundleOptions)[];
  },
  option: Partial<TBundleOptions> & {
    include: TBundleOptions['include'];
    exclude: TBundleOptions['exclude'];
  },
): TBundleOptions {
  const output = getOutputValue(argv, option);
  argv.output = output;

  return {
    mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
    project: argv.project,
    exportFilename:
      argv.exportFilename ?? option.exportFilename ?? CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
    useSemicolon: argv.useSemicolon ?? option.useSemicolon ?? true,
    useBanner: argv.useBanner ?? option.useBanner ?? false,
    useTimestamp: argv.useTimestamp ?? option.useTimestamp ?? false,
    quote: argv.quote ?? option.quote ?? "'",
    directive: argv.directive ?? option.directive ?? '',
    fileExt: argv.fileExt ?? option.fileExt ?? CE_EXTENSION_PROCESSING.NOT_EXTENSION,
    overwrite: argv.overwrite ?? option.overwrite ?? false,
    noBackup: argv.noBackup ?? option.noBackup ?? false,
    generationStyle: argv.generationStyle ?? option.generationStyle ?? CE_GENERATION_STYLE.AUTO,
    include: option.include,
    exclude: option.exclude,

    output,
  };
}
