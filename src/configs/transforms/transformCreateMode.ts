import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getDirname } from 'my-node-fp';
import path from 'node:path';
import type { SetRequired } from 'type-fest';

export async function transformCreateMode(
  argv: SetRequired<Partial<TCommandBuildArgvOptions>, 'project'> & {
    options?: (TCreateOptions | TBundleOptions)[];
  },
  option: Partial<Omit<TCreateOptions, 'include' | 'exclude'>> & {
    include: TCreateOptions['include'];
    exclude: TCreateOptions['exclude'];
  },
): Promise<TCreateOptions> {
  const startFrom =
    argv.startFrom ?? option.startFrom ?? path.resolve(await getDirname(argv.project));
  const resolvedStartFrom = path.isAbsolute(startFrom) ? startFrom : path.resolve(startFrom);

  return {
    mode: CE_CTIX_BUILD_MODE.CREATE_MODE,
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
    backup: argv.backup ?? option.backup ?? true,
    generationStyle: argv.generationStyle ?? option.generationStyle ?? CE_GENERATION_STYLE.AUTO,
    include: option.include,
    exclude: option.exclude,

    skipEmptyDir: argv.skipEmptyDir ?? option.skipEmptyDir ?? true,
    startFrom: resolvedStartFrom,
  };
}
