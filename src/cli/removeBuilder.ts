import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function removeBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('includeBackup', {
      alias: 'b',
      describe: 'clean with backup file',
      type: 'boolean',
      default: false,
    })
    .demandOption(['project', 'exportFilename']);

  return args;
}
