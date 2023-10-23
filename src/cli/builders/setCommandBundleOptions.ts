import type { ICommandBundleOptions } from '#/configs/interfaces/ICommandBundleOptions';
import type { Argv } from 'yargs';

export function setCommandBundleOptions<T = Argv<ICommandBundleOptions>>(
  args: Argv<ICommandBundleOptions>,
) {
  args.option('output', {
    alias: 'o',
    describe: 'output directory',
    type: 'string',
  });

  return args as T;
}
