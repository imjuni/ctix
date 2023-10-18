import type {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '#/configs/interfaces/IOption';
import type { Argv } from 'yargs';

export function removeBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('includeBackup', {
      alias: 'b',
      describe: 'remove with backup file',
      type: 'boolean',
      default: false,
    })
    .demandOption(['project', 'exportFilename']);

  return args;
}
