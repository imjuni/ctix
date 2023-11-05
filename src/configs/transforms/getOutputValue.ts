import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import type { TModuleOptions } from '#/configs/interfaces/TModuleOptions';
import { getDirnameSync } from 'my-node-fp';
import type { SetRequired } from 'type-fest';

export function getOutputValue(
  argv: Pick<
    SetRequired<Partial<TCommandBuildArgvOptions>, 'project'> & {
      options?: (TCreateOptions | TBundleOptions | TModuleOptions)[];
    },
    'output' | 'project'
  >,
  option: Partial<TBundleOptions | TModuleOptions>,
) {
  if (argv.output != null) {
    return argv.output;
  }

  if (option.output != null) {
    return option.output;
  }

  return getDirnameSync(argv.project);
}
