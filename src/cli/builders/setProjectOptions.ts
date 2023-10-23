import type { IProjectOptions } from '#/configs/interfaces/IProjectOptions';
import type { Argv } from 'yargs';

export function setProjectOptions<T = Argv<IProjectOptions>>(args: Argv<IProjectOptions>) {
  args
    .option('config', {
      alias: 'c',
      describe: 'configuration file path',
      type: 'string',
      default: undefined,
    })
    .option('spinner-stream', {
      describe: 'Stream of cli spinner, you can pass stdout or stderr',
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stdout',
    })
    .option('progress-stream', {
      describe: 'Stream of cli progress, you can pass stdout or stderr',
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stdout',
    })
    .option('reasoner-stream', {
      describe: [
        'Stream of cli reasoner.',
        'Reasoner show name conflict error and already exist index.ts file error.',
        'You can pass stdout or stderr',
      ].join(''),
      type: 'string',
      choices: ['stdout', 'stderr'],
      default: 'stderr',
    });

  return args as T;
}
