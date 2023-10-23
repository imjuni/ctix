import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCommandBuildArgvOptions } from '#/configs/interfaces/TCommandBuildArgvOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getDirnameSync } from 'my-node-fp';
import type { SetRequired } from 'type-fest';

export function getOutputValue(
  argv: Pick<
    SetRequired<Partial<TCommandBuildArgvOptions>, 'project'> & {
      options?: (TCreateOptions | TBundleOptions)[];
    },
    'output' | 'project'
  >,
  option: Partial<TBundleOptions>,
) {
  if (argv.output != null) {
    return argv.output;
  }

  if (option.output != null) {
    return option.output;
  }

  return getDirnameSync(argv.project);
}
