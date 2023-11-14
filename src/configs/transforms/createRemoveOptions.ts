import { CE_CTIX_COMMAND } from '#/configs/const-enum/CE_CTIX_COMMAND';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCommandRemoveOptions } from '#/configs/interfaces/TCommandRemoveOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import type { ArgumentsCamelCase } from 'yargs';

export function createRemoveOptions(
  argv: ArgumentsCamelCase<TCommandRemoveOptions & TCommandBuildArgvOptions> & {
    options?: (TCreateOptions | TBundleOptions)[];
  },
): TCommandRemoveOptions {
  const options: TCommandRemoveOptions = {
    $kind: CE_CTIX_COMMAND.REMOVE_COMMAND,
    config: argv.config,
    spinnerStream: argv.spinnerStream,
    progressStream: argv.progressStream,
    reasonerStream: argv.reasonerStream,
    removeBackup: argv.removeBackup,
    exportFilename: argv.exportFilename,
    forceYes: argv.forceYes,
  };

  return options;
}
