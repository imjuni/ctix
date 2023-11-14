import type { ICommandInitOptions } from '#/configs/interfaces/ICommandInitOptions';
import type { Argv } from 'yargs';

export function setCommandInitOptions<T = Argv<ICommandInitOptions>>(
  args: Argv<ICommandInitOptions>,
) {
  args.option('force-yes', {
    alias: 'y',
    describe: 'answer `yes` to all questions',
    type: 'boolean',
    default: false,
  });

  return args as T;
}
