import type {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '#/configs/interfaces/IOption';
import type { Argv } from 'yargs';

export function createBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('skipEmptyDir', {
      alias: 'e',
      describe: 'If set true this option, skip empty directory',
      type: 'boolean',
      default: true,
    })
    .demandOption(['project', 'exportFilename']);

  return args;
}
