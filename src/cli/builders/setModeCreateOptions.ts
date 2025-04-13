import type { IModeCreateOptions } from '#/configs/interfaces/IModeCreateOptions';
import type { Argv } from 'yargs';

export function setModeCreateOptions<T = Argv<IModeCreateOptions>>(args: Argv<IModeCreateOptions>) {
  args
    .option('skip-empty-dir', {
      describe:
        'if `skipEmptyDir` is set to true, an empty directory with no files will not create an `index.ts` file',
      type: 'boolean',
    })
    .option('start-from', {
      describe: 'specify the starting directory to start creating the `index.ts` file',
      type: 'string',
    });

  return args as T;
}
