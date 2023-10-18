import type {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '#/configs/interfaces/IOption';
import type { Argv } from 'yargs';

export function singleBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('useRootDir', {
      alias: 'r',
      describe: 'output file under rootDir in tsconfig.json',
      type: 'boolean',
      default: false,
    })
    .option('output', {
      alias: 'o',
      describe: 'output directory',
      type: 'string',
    })
    .option('excludeOnlyOutput', {
      describe: 'index.ts file exclude only in output directory',
      type: 'boolean',
      default: false,
    })
    .demandOption(['project', 'exportFilename', 'output']);

  return args;
}
