import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function builder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
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
      default: 'index.ts',
    })
    .option('config', {
      alias: 'c',
      describe: 'configuration file path',
      type: 'string',
    })
    .option('spinnerStream', {
      describe: 'Stream of cli spinner, you can pass stdout or stderr',
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stdout',
    })
    .option('progressStream', {
      describe: 'Stream of cli progress, you can pass stdout or stderr',
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stdout',
    })
    .option('reasonerStream', {
      describe: [
        'Stream of cli reasoner.',
        'Reasoner show name conflict error and already exist index.ts file error.',
        'You can pass stdout or stderr',
      ].join(''),
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stderr',
    });

  return args;
}
