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
    });

  return args as T;
}
