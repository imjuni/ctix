import {
  TCleanOption,
  TCreateOption,
  TInitOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function singleBuilder<
  T extends TCleanOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('useRootDir', {
      alias: 'r',
      describe: 'output file under rootDir in tsconfig.json',
      type: 'boolean',
    })
    .option('output', {
      alias: 'o',
      describe: 'output directory',
      type: 'string',
    });

  return args;
}
