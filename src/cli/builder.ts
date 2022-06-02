import {
  TCleanOption,
  TCreateOption,
  TInitOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function builder<
  T extends TCleanOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('project', {
      alias: 'p',
      describe: 'tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"',
      type: 'string',
    })
    .option('exportFilename', {
      alias: 'f',
      describe: 'Export filename, if you not pass this field that use "index.ts" or "index.d.ts"',
      type: 'string',
    })
    .option('verbose', {
      alias: 'v',
      describe: 'display more detailed log',
      type: 'boolean',
    })
    .option('config', {
      alias: 'c',
      describe: 'configuration file path',
      type: 'string',
    });

  return args;
}
