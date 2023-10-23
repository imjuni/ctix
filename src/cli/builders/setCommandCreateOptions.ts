import type { ICommandCreateOptions } from '#/configs/interfaces/ICommandCreateOptions';
import type { Argv } from 'yargs';

export function setCommandCreateOptions<T = Argv<ICommandCreateOptions>>(
  args: Argv<ICommandCreateOptions>,
) {
  args
    .option('skip-empty-dir', {
      describe:
        'if `skipEmptyDir` is set to true, an empty directory with no files will not create an `index.ts` file',
      type: 'boolean',
      default: true,
    })
    .option('start-from', {
      describe: 'specify the starting directory to start creating the `index.ts` file',
      type: 'string',
    });

  return args as T;
}
