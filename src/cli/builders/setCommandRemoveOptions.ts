import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import type { ICommandRemoveOptions } from '#/configs/interfaces/ICommandRemoveOptions';
import type { Argv } from 'yargs';

export function setCommandRemoveOptions<T = Argv<ICommandRemoveOptions>>(
  args: Argv<ICommandRemoveOptions>,
) {
  args
    .option('remove-backup', {
      describe: 'remove with backup file',
      type: 'boolean',
      default: false,
    })
    .option('force-yes', {
      alias: 'y',
      describe: 'answer `yes` to all questions',
      type: 'boolean',
      default: false,
    })
    .option('export-filename', {
      alias: 'f',
      describe: 'Export filename, if you not pass this field that use "index.ts" or "index.d.ts"',
      type: 'string',
      default: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
    });

  return args as T;
}
