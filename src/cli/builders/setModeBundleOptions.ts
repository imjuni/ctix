import type { IModeBundleOptions } from '#/configs/interfaces/IModeBundleOptions';
import type { Argv } from 'yargs';

export function setModeBundleOptions<T = Argv<IModeBundleOptions>>(args: Argv<IModeBundleOptions>) {
  args.option('output', {
    alias: 'o',
    describe: 'output directory',
    type: 'string',
  });

  return args as T;
}
